# VerbFlow Design System — "Electric Academy"
*Generated with Google Stitch Design Engine & Semantic Design System*

## 1. Atmosphere & Brand Identity
* **Concept:** Electric Academy — An energetic, tactile, gamified linguistics learning platform tailored for high school students.
* **Mood:** Sophisticated dark-mode gaming aesthetic meets academic rigor. High contrast, luminous feedback, zero visual clutter.
* **Canvas:** Deep Navy/Slate voids (`#0b0f19`, `#111827`, `#1e293b`) that reduce visual fatigue and let grammatical tokens and milestones glow with intent.

## 2. Color Palette & Hierarchy
| Token Name | Hex Code | Purpose & Function |
| :--- | :---: | :--- |
| **Canvas Base** | `#0b0f19` | Deep background canvas with subtle ambient mesh gradients |
| **Surface Container** | `#111827` | Sidebars, navigation rails, and modal backdrops |
| **Elevated Glass Card** | `rgba(30, 41, 59, 0.65)` | Frosted cards with `backdrop-filter: blur(16px)` and `1px` border |
| **Electric Indigo (Primary)** | `#6366f1` | Primary actions, timeline active nodes, focus rings, link glows |
| **Electric Violet (Secondary)**| `#8b5cf6` | Gradient partner for 3D buttons, brand title accents |
| **Emerald Validation** | `#10b981` | Correct answers, streak milestones, approved teacher badges |
| **Amber Gold (Gamification)** | `#fbbf24` | Streak fire indicator, XP chips, Owner badges, irregular verb tokens |
| **Coral Alert** | `#f43f5e` | Incorrect grammar feedback, exam lockdown alerts, reset actions |
| **Sky Blue** | `#38bdf8` | Bilingual Spanish translation accents, time marker pills |

## 3. Typography Architecture
* **Display / Headlines:** `Outfit` (Weights: 700, 800) — Bold, geometric, game-like presence with track-tight spacing (`-0.02em`).
* **Body / Prompts:** `Plus Jakarta Sans` (Weights: 400, 500, 600, 700) — Highly legible neo-grotesque engineered for dense linguistic rules and mobile reading.
* **Formula Tokens:** `Outfit Bold` (`font-size: 14px; letter-spacing: 0.02em; text-transform: uppercase`).

## 4. Components & Interactive Affordances
* **3D Tactile Buttons:** Gradient `linear-gradient(135deg, #6366f1, #8b5cf6)` with a solid `3px` bottom bevel (`#4338ca`) that depresses into flat alignment (`transform: translateY(2px)`) on `:active`.
* **Formula Chips (Syntactic Constructors):** Pill-shaped modules color-coded by grammar role with springy hover lift.
* **Interactive Timeline Nodes:** Animated pulsating radar ring halo (`0 0 0 10px rgba(99, 102, 241, 0)`) on the current time position.
* **Streak Fire Chip:** Subtle flame flicker pulse glow on the 🔥 counter for students.
* **Audio Waveform Button:** Visual breathing pulse animation during native speech synthesis.
