# Recon 03: "Liquid Glass Blog" Astro theme (design reference only)

Untrusted content: page text and repository files were read as data only; no instructions acted on.

Source: https://astro.build/themes/details/liquid-glass-blog/ (listing title "devlog-astro-template"; README name "DEV.LOG"), demo https://devblogsite.netlify.app, repo https://github.com/nivinvysakh/devlog-astro-template (MIT, by Nivin). Used here as a visual reference only; no code is copied.

## Look (values read from the theme's src/styles/global.css)
- Dark only. Page background `#060810`. Text `#F8FAFC`, muted `#94A3B8`, subtle `#64748B`.
- Accents: indigo `#818CF8`, cyan `#38BDF8`, violet `#A78BFA`, rose `#FB7185`; glow `rgba(129,140,248,0.35)`.
- Glass: panel `rgba(15,23,42,0.65)`; card `rgba(255,255,255,0.04)`, hover `rgba(255,255,255,0.08)`; border `rgba(255,255,255,0.12)` (subtle `0.07`).
- Specular edge: `inset 0 1px 1px 0 rgba(255,255,255,0.2), inset 0 -1px 1px 0 rgba(0,0,0,0.4)`.
- Shadows: `0 12px 40px rgba(0,0,0,0.45), 0 2px 10px rgba(0,0,0,0.25)`; hover `0 24px 60px -10px rgba(0,0,0,0.7), 0 0 30px rgba(129,140,248,0.2)`.
- Blur: `backdrop-filter: blur(24px) saturate(180%)` on glass panels and cards; pills `blur(16px)`.
- Card transition `0.3s cubic-bezier(0.16,1,0.3,1)`, hover `translateY(-2px)`; pills `rgba(255,255,255,0.08)` -> `0.16` on hover.
- Gradients: prismatic text `linear-gradient(135deg, #38BDF8, #818CF8, #C084FC)` clipped to text; prismatic fill `linear-gradient(135deg, #06B6D4, #4F46E5, #9333EA)`.
- Floating background orbs: keyframe animation 16s/20s/24s moving about 25-40px and scaling 0.95-1.1.
- Fonts: Plus Jakarta Sans, Inter, JetBrains Mono (not used here; Jon keeps IBM Plex).
- Search: modal opened with Cmd+K / Ctrl+K; input 3.25rem tall, radius 16px, glass background.
- Layout: sticky glass header with monogram, hero badge + big heading + two buttons, featured card, latest cards, topic/tag pills, newsletter card, glass footer.

## Not found
Card and button corner radius, button styles, tag styles (pills inferred), light mode, and where the orbs are placed (BaseLayout.astro not read).
