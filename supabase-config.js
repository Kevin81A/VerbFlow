// ========================================================
// VerbFlow - Supabase Client Configuration
// Manejo centralizado de credenciales y cliente Supabase
// ========================================================

const SupabaseConfig = (() => {
  // Los valores pueden inyectarse vía window.__ENV__ en despliegue
  // o definirse en variables de entorno durante el build
  const config = {
    url: (typeof window !== "undefined" && window.__ENV__ && window.__ENV__.SUPABASE_URL) 
      || "https://tu-proyecto.supabase.co",
    anonKey: (typeof window !== "undefined" && window.__ENV__ && window.__ENV__.SUPABASE_ANON_KEY)
      || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummy_anon_key"
  };

  function isConfigured() {
    return Boolean(
      config.url && 
      config.anonKey && 
      !config.url.includes("tu-proyecto.supabase.co") && 
      !config.anonKey.includes("dummy_anon_key")
    );
  }

  function getClient() {
    if (typeof window !== "undefined" && window.supabase && isConfigured()) {
      if (!window.__supabaseInstance) {
        window.__supabaseInstance = window.supabase.createClient(config.url, config.anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
      }
      return window.__supabaseInstance;
    }
    return null;
  }

  return {
    config,
    isConfigured,
    getClient
  };
})();

if (typeof window !== "undefined") {
  window.SupabaseConfig = SupabaseConfig;
}
