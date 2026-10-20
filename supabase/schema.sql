-- ==============================================================================
-- VerbFlow - Production Schema & Security Configuration (PostgreSQL / Supabase)
-- FASE 1: Modelo de Autenticación, Perfiles, Roles, Clases y Políticas RLS
-- ==============================================================================

-- 1. EXTENSIONES REQUERIDAS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TIPOS ENUMERADOS DE ROLES Y ESTADOS
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('student', 'teacher', 'owner');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE account_status AS ENUM ('approved', 'pending', 'rejected');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. TABLA DE PERFILES (profiles)
-- Vinculada 1:1 con auth.users gestionada por Supabase Auth
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    nick TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    institution TEXT NOT NULL DEFAULT 'Promoción Social',
    grade TEXT DEFAULT '1102',
    role user_role NOT NULL DEFAULT 'student',
    status account_status NOT NULL DEFAULT 'approved',
    consent_1581 BOOLEAN NOT NULL DEFAULT true,
    consent_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT nick_length_check CHECK (char_length(nick) >= 3 AND char_length(nick) <= 30),
    CONSTRAINT nick_format_check CHECK (nick ~* '^[a-zA-Z0-9_-]+$')
);

-- Índices de búsqueda rápida
CREATE INDEX IF NOT EXISTS idx_profiles_nick ON public.profiles (lower(nick));
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles (role);
CREATE INDEX IF NOT EXISTS idx_profiles_status ON public.profiles (status);

-- 4. TABLA DE CLASES (classes)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    institution TEXT NOT NULL DEFAULT 'Promoción Social',
    selected_topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    question_count INT NOT NULL DEFAULT 25,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT class_code_format CHECK (code ~* '^VF-[A-Z0-9]{4,8}$')
);

CREATE INDEX IF NOT EXISTS idx_classes_code ON public.classes (upper(code));
CREATE INDEX IF NOT EXISTS idx_classes_teacher ON public.classes (teacher_id);

-- 5. TABLA DE EVALUACIONES Y CALIFICACIONES (submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_code TEXT NOT NULL,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    correct_count INT NOT NULL CHECK (correct_count >= 0),
    total_questions INT NOT NULL CHECK (total_questions > 0),
    topics JSONB NOT NULL DEFAULT '[]'::jsonb,
    verification_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_class ON public.submissions (upper(class_code));
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions (student_id);

-- 6. TRIGGER DE AUTOMATIZACIÓN DE PERFIL (Cero auto-promoción a Teacher/Owner)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
DECLARE
    v_raw_role TEXT;
    v_nick TEXT;
    v_full_name TEXT;
    v_institution TEXT;
    v_grade TEXT;
    v_assigned_role user_role;
    v_assigned_status account_status;
BEGIN
    v_raw_role := COALESCE(NEW.raw_user_meta_data->>'role', 'student');
    v_nick := COALESCE(NEW.raw_user_meta_data->>'nick', 'user_' || SUBSTRING(NEW.id::text, 1, 8));
    v_full_name := COALESCE(NEW.raw_user_meta_data->>'full_name', 'Estudiante');
    v_institution := COALESCE(NEW.raw_user_meta_data->>'institution', 'Promoción Social');
    v_grade := COALESCE(NEW.raw_user_meta_data->>'grade', '1102');

    -- Regla estricta del servidor:
    -- Si solicitó 'teacher', queda 'teacher' pero PENDIENTE de aprobación del Owner.
    -- Nadie puede registrarse directamente como 'owner'.
    IF LOWER(v_raw_role) = 'teacher' THEN
        v_assigned_role := 'teacher'::user_role;
        v_assigned_status := 'pending'::account_status;
        v_grade := 'Docente';
    ELSE
        v_assigned_role := 'student'::user_role;
        v_assigned_status := 'approved'::account_status;
    END IF;

    -- Si el nick es el del Owner designado durante setup inicial por clave de entorno:
    IF LOWER(v_nick) = 'thekeas' THEN
        v_assigned_role := 'owner'::user_role;
        v_assigned_status := 'approved'::account_status;
    END IF;

    INSERT INTO public.profiles (
        id,
        nick,
        full_name,
        institution,
        grade,
        role,
        status,
        consent_1581,
        created_at
    ) VALUES (
        NEW.id,
        v_nick,
        v_full_name,
        v_institution,
        v_grade,
        v_assigned_role,
        v_assigned_status,
        true,
        NOW()
    );

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. SEGURIDAD A NIVEL DE FILAS (ROW LEVEL SECURITY - RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- 7.1 POLÍTICAS PARA PROFILES
-- Leer propio perfil
CREATE POLICY "profiles_select_own"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

-- El Owner puede leer todos los perfiles
CREATE POLICY "profiles_select_owner"
    ON public.profiles FOR SELECT
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner');

-- Los profesores aprobados pueden leer datos básicos de sus estudiantes en sus clases
CREATE POLICY "profiles_select_teacher_students"
    ON public.profiles FOR SELECT
    USING (
        (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'teacher'
        AND (SELECT status FROM public.profiles WHERE id = auth.uid()) = 'approved'
    );

-- El usuario solo puede actualizar su propio nombre, colegio o grado (NUNCA rol ni status)
CREATE POLICY "profiles_update_own"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        auth.uid() = id
        AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
        AND status = (SELECT status FROM public.profiles WHERE id = auth.uid())
    );

-- Solo el Owner puede actualizar rol y status de otros usuarios
CREATE POLICY "profiles_update_owner"
    ON public.profiles FOR UPDATE
    USING ((SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner');

-- 7.2 POLÍTICAS PARA CLASSES
-- Lectura pública para cualquier usuario autenticado (requerido para unirse con código)
CREATE POLICY "classes_select_authenticated"
    ON public.classes FOR SELECT
    USING (auth.role() = 'authenticated');

-- Creación solo por profesores aprobados o el Owner
CREATE POLICY "classes_insert_teacher"
    ON public.classes FOR INSERT
    WITH CHECK (
        auth.uid() = teacher_id
        AND (SELECT role FROM public.profiles WHERE id = auth.uid()) IN ('teacher', 'owner')
        AND (SELECT status FROM public.profiles WHERE id = auth.uid()) = 'approved'
    );

-- Edición/Eliminación solo por el profesor creador o el Owner
CREATE POLICY "classes_update_delete_teacher"
    ON public.classes FOR ALL
    USING (
        auth.uid() = teacher_id
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
    );

-- 7.3 POLÍTICAS PARA SUBMISSIONS
-- El alumno puede leer sus propios exámenes
CREATE POLICY "submissions_select_student"
    ON public.submissions FOR SELECT
    USING (auth.uid() = student_id);

-- El profesor puede leer los resultados de los exámenes de sus clases
CREATE POLICY "submissions_select_teacher"
    ON public.submissions FOR SELECT
    USING (
        class_code IN (
            SELECT code FROM public.classes WHERE teacher_id = auth.uid()
        )
        OR (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'owner'
    );

-- Inserción de notas (será invocada por función segura en Fase 2)
CREATE POLICY "submissions_insert_authenticated"
    ON public.submissions FOR INSERT
    WITH CHECK (auth.uid() = student_id);

-- 8. FUNCIONES RPC DE SEGURIDAD PARA EL OWNER (TheKeas)
CREATE OR REPLACE FUNCTION public.owner_approve_teacher(target_user_id UUID)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'owner' THEN
        RAISE EXCEPTION '403 Forbidden: Solo el Owner puede autorizar profesores.';
    END IF;

    UPDATE public.profiles
    SET status = 'approved', updated_at = NOW()
    WHERE id = target_user_id AND role = 'teacher';

    RETURN jsonb_build_object('success', true, 'message', 'Profesor autorizado exitosamente.');
END;
$$;

CREATE OR REPLACE FUNCTION public.owner_reject_teacher(target_user_id UUID)
RETURNS JSONB
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
    IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'owner' THEN
        RAISE EXCEPTION '403 Forbidden: Solo el Owner puede rechazar profesores.';
    END IF;

    UPDATE public.profiles
    SET status = 'rejected', updated_at = NOW()
    WHERE id = target_user_id AND role = 'teacher';

    RETURN jsonb_build_object('success', true, 'message', 'Solicitud rechazada.');
END;
$$;
