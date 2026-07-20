# Static Buffet 2.0 — Product Requirements Document

**"The instrument, not the buffet line."**

| | |
|---|---|
| **Status** | Draft for review |
| **Date** | July 19, 2026 |
| **Author** | Claude (architect pass), for Trash Team × Nulltone.TV |
| **Scope** | Full modernization of Static Buffet — engine, interface, and identity |

---

## 1. Executive summary

Static Buffet has a genuinely differentiated idea — **crate-digging public-domain footage as a live instrument** — wrapped in a learning-project body. The verdict "feels like 2003" is accurate, and it has three specific root causes, none of which is fixed by restyling:

1. **No rendering engine.** "Effects" are CSS filter strings on an HTML5 `<video>` element (`Player.tsx:718–952`). There is no GPU pipeline, no compositing, no temporal state. The queue's "crossfade" is a metadata field that is exported to JSON but never actually performed — no code ever mixes two videos.
2. **A desktop-windowing metaphor as the main UI.** The home screen's hero content is literally "Floating Panel Workspace — drag panels by their headers" (`home.tsx:255`). Draggable/lockable/dockable panels, docking guides, resize handles: chrome imported from 2003-era DAWs, fighting the actual job (dark venue, time pressure, hands on keys).
3. **Customization as product.** Ten novelty themes with per-theme title puns, seven text-to-speech soundboards on triple-click easter eggs, three onboarding flows, layout *demonstration* components, a 1,064-line store mixing queue state with panel x/y coordinates and "Hulkster mode."

Meanwhile, 2026 research (desktop + browser landscape, 60+ sources) shows the market converged on a clear baseline: **shader-based effects, deck/layer compositing with a real crossfader, audio-reactivity as a systemic modulation source, one opinionated dark UI, MIDI learn, and AI as workflow assistant.** Every piece of that is achievable in the browser today — WebGL2 is universal, WebGPU is ~82% baseline, ISF shaders run in JS, Web MIDI ships in Chromium. The gap is architectural choice, not platform limitation.

**The plan in one sentence:** delete roughly a third of the codebase, build a small WebGL compositor with two decks and ISF effects clocked by the beat detector we already have, put one dark performance UI on top, and double down on the Archive.org moat — the one thing no other tool owns.

---

## 2. What the 2026 landscape demands (research digest)

### Desktop reference points
- **Resolume Arena/Avenue 7.27** — the paradigm everyone is judged against: clip grid → layers → A/B crossfader with blend modes, GPU effect stack, MIDI/OSC learn, NDI/Syphon/Spout. Its 2025–26 AI move: local MCP servers so LLMs do composition setup ("AI does the tedious work, not the art").
- **VDMX6** — full Metal engine rewrite; ISF-native; *anything* (FFT band, LFO, MIDI, ML face/hand tracking) can modulate *any* parameter. "Everything is a modulation source" is the modern-feel core.
- **Synesthesia** — the UX north star for us: shader-native scenes, automatic organic audio reactivity, small surface area, one dark UI. Reviewers reward it precisely for shedding complexity.
- **GrandVJ (last release 2020) and Modul8 (compatibility-fix mode)** — the cautionary tales. Feature-complete but frozen, and every 2026 roundup calls them legacy. *That is the shelf Static Buffet is currently on.*

### Browser-native reference points
- **Hydra / Butterchurn / Radiance** — the "alive" look comes from **feedback framebuffers** (ping-pong FBOs: trails, warp, decay). Static per-frame filters read as dated precisely because they lack temporal accumulation. This is physically impossible with CSS filters on `<video>`.
- **Radiance's effect contract** — every effect has exactly **one 0–1 intensity knob**, is identity at 0, responds smoothly, and animates on the beat clock by default. The best anti-bloat discipline in the field.
- **ISF (Interactive Shader Format)** — GLSL + JSON metadata; UIs auto-generate from the metadata. Supported across VDMX/Resolume/TouchDesigner/Magic, with hundreds of free community shaders and an open JS/WebGL runtime. Adopting it buys a real effects library for free.
- **LumaDeck** — "open to projecting in 30 seconds," beat detection drives everything with zero manual mapping, adaptive quality auto-downscales to hold 60fps. The direct answer to "feels like 2003."
- **Noisedeck / Visualize** — WebGL2 + WebGPU dual-target render graph; a stripped "gig player" mode. The closest architectural sibling to what we should become.
- **Visualz** — set-driven architecture: the entire rig (clips, effects, modulator bindings, outputs) saves as one bundle that loads in seconds.
- **MixYouTube / YouTube Sampler / Radiance-ingests-YouTube** — found-footage sampling culture is alive but its tooling is fragmented and janky. **Nobody polished owns it. That's our lane.**

### The table-stakes list (2026)
GPU shader effects · deck/layer compositing with blend modes and crossfader · systemic audio-reactivity (FFT bands + onset + BPM as modulation sources) · quantized/beat-synced triggering · MIDI learn · one dark performance UI · set bundles · smooth 60fps playback. Browser-unreachable: NDI/Syphon/Spout and HAP (bridge: OBS browser source; everything else has a web equivalent).

---

## 3. Product thesis

### The soul (keep, sharpen)
- **Archive.org crate-digging.** Instant search of a giant messy public-domain archive is the moat. Every desktop tool assumes you *bring* footage; we make *finding* it the magic moment.
- **Emergency Mix.** "Give me a set NOW from these search results" is a killer feature with a great name. It becomes far better when cuts land on beats through a real engine.
- **The broadcast-hijack identity.** EBN, scanlines, test cards — as *the product's single visual identity*, not as one of ten costumes.
- **License-clean by construction.** PD/CC0/CC-BY filtering and automatic attribution is quietly one of the most professional things in the app. Keep.
- **The pop-out output window** — right instinct, wrong plumbing.

### The residue (delete without ceremony)
Ten themes, theme-specific title puns, TTS soundboards, triple-click easter eggs, ASCII mode, "Blondie geometry mode," "Hulkster mode," floating/dockable/resizable panel systems, docking guides, layout demonstrators, responsive-layout hint animators, three onboarding flows, dead auth/storage/upload deps. None of this serves a performer at 1 a.m. All of it costs speed, bundle size, and credibility.

**A cut is not a loss of personality.** The personality moves into the *output* — the visuals, the effects, the identity theme — instead of the *chrome*.

---

## 4. Goals and non-goals

### Goals
1. **Feel like an instrument**: sub-100 ms perceived response from input to visible change; every transition smooth; nothing hard-cuts unless the performer asked for a hard cut.
2. **60 fps compositor** on integrated graphics (adaptive quality on weaker GPUs).
3. **30 seconds to first visual** for a new user: open app → search → clip playing with an effect, no tour required.
4. **One opinionated interface.** Zero layout customization. Keyboard-first, MIDI-capable.
5. **Halve the client codebase.** ~15,700 lines of components today; target ≤ 8,000 with *more* capability.

### Non-goals (v2)
- **Not Resolume.** No layer stacks beyond A/B + overlay, no projection mapping, no DMX.
- **No user accounts, no cloud saves.** Sets are local JSON files/localStorage. (The dead passport/session stack gets deleted, not finished.)
- **No mobile performance mode.** Desktop Chromium is the performance target; Firefox/Safari get graceful fallback for browsing/preview. (iPad arrives later via its own shell — see §5.5.)
- **No generative-AI video in the core loop.** AI is a roadmap-tier assistant (curation, set-building), never a dependency for performing.
- **No native NDI/Syphon in the browser.** The OBS-browser-source bridge covers the tab; real Syphon/Spout/NDI output arrives with the Electron shell (§5.5, Phase 1.5).
- **No full native rewrite.** Web tech end to end; platforms are shells around one portable engine (§5.5).

---

## 5. The product

### 5.1 The engine (new)

One WebGL2 compositor canvas; WebGPU later as a fast path, never a requirement.

- **Two decks (A/B).** Each deck is a hidden `<video>` element uploaded as a GPU texture per frame via `requestVideoFrameCallback` (rAF fallback for Firefox). Each deck has its own queue, trim points, and loop state — the data model already exists in the store.
- **A real crossfader.** Mixing is a fragment-shader composite with modes: crossfade, add, multiply, difference, luma-key. The existing per-clip `crossfade` field finally *does* something: auto-advance mixes A→B over the set duration, optionally quantized to the next bar.
- **ISF effects rack.** Curated set of ~20–30 community ISF shaders (glitch, kaleidoscope, RGB shift, pixelate, posterize, bloom, feedback) via the open ISF JS runtime. Parameter UIs auto-generate from ISF metadata — this deletes all three hand-built effects panels.
- **The Radiance contract.** Every effect ships with a single 0–1 intensity macro: identity at 0, smooth response, beat-phase uniform available. Advanced params live behind a disclosure, not a panel.
- **Feedback pass.** Ping-pong framebuffers exposed as 2–3 macro effects (Trails, Warp, Echo). This single pass is the biggest perceived jump from "video player with filters" to "visual instrument."
- **Beat clock as the global timebase.** The existing Web Audio analysis is promoted from a widget to *the* clock: FFT band energies (bass/mid/high), onset pulses, and BPM phase are modulation sources routable to any effect intensity, deck opacity, or playback rate. Ship 3–4 curated default routings (bass→intensity, onset→strobe/cut, BPM→loop sync) — a routing table, not a patch-bay UI.
- **Quantized triggering.** Clip launches and scene changes land on the next beat or bar by default (NestDrop/Visualz pattern). Sloppy operation looks intentional.

### 5.2 The interface (reset)

- **One theme.** Dark, broadcast-hijack identity (charcoal, signal-green accent, restrained scanline flourish on the output frame only). Accent color is the only cosmetic setting.
- **One fixed layout, three zones.**
  - **Left — The Crate:** search, filters, results grid with hover-scrub previews, saved searches.
  - **Center — The Decks:** A and B previews with their queues, crossfader, blend mode, effect slider row, beat indicator/tap-tempo.
  - **Right/Top — The Signal:** program output preview, output-window and record controls, license/attribution readout.
- **Keyboard-first.** Existing shortcut system and command palette survive and get promoted: number keys trigger clips, space cuts, arrows nudge the crossfader, `/` focuses search. The palette (⌘K) is the power-user path to everything else.
- **MIDI learn (Chromium).** Click a control → move a knob → mapped. Ship presets for 3–4 budget controllers (APC Mini, Launchpad, nanoKONTROL). Keyboard remains the universal fallback.
- **Zero-modal onboarding.** Delete all three flows (WelcomeModal, StreamlinedWelcome, FirstRunTour). The empty state of each zone teaches it in one line. A `?` overlay lists shortcuts. That's it.
- **Micro-interactions under 150 ms**, no decorative animation during playback. Framer-motion goes away; CSS transitions cover what remains.

### 5.3 The crate (sharpen the moat)

- **Hover-scrub thumbnails** in results — feel the footage before committing.
- **Cue points**: set in-clip markers, trigger them from keyboard/MIDI. Turns a 20-minute Prelinger film into a sample bank.
- **Chop**: one click slices a long film into N beat-length segments appended as queue items (Emergency Mix's engine, exposed as a first-class verb; manual first, shot-detection later).
- **Emergency Mix stays** — now rendered through the compositor with real beat-quantized transitions.
- **Set bundles**: the entire rig — queues, trims, cue points, effect chains, routings, BPM — saves/loads as one JSON file in seconds. Replaces the export-format grab-bag as the centerpiece (JSON/M3U/EDL exports remain for interchange, one menu, no panel).
- **Roadmap-tier AI (post-v2):** text-to-set over the archive ("20 minutes of 1950s sci-fi, glitchy, 120 BPM") and vibe-tagging of results. Server-side LLM composing Archive.org queries — the Resolume-style *assistant* framing, and a differentiator no desktop tool has.

### 5.4 The signal (output done right)

- **Render once.** The compositor renders one canvas; the pop-out window receives `canvas.captureStream(60)`. `BroadcastChannel` replaces the postMessage/localStorage sync (`PopOutPlayer.tsx:327–631`). No more two players pretending to agree.
- **One-click projector fullscreen** via the Window Management API (`getScreenDetails`) on the second display.
- **Record my set**: `MediaRecorder` on the output stream → downloadable video. Every session becomes shareable content — this is how tools like this spread.
- **OBS bridge documented**: add the app as a browser source for streaming/NDI-world interop.

### 5.5 Platform strategy (browser → Electron → iPad)

**The engine is the portable core; platforms are shells around it.** The WebGL compositor, ISF effects, and beat clock are identical work in a browser tab, an Electron window, or an iPad WebView — so "go native" and "build the engine" are sequential, not competing. The one architectural requirement this imposes *now*: the engine lives in a clean module with no DOM assumptions beyond "give me a canvas."

- **Phase 1 builds web-first.** Fastest iteration loop, and the zero-install URL stays alive — research shows URL-shareable demos are how tools like this spread (Hydra, LumaDeck). The browser version remains the free front door permanently.
- **Phase 1.5 wraps in Electron — specifically Electron, not Tauri.** Tauri uses the system WebView (WKWebView on macOS = Safari engine), which kills Web MIDI and weakens WebCodecs/`captureStream` — exactly the Chromium-first bets this PRD makes. Electron ships Chromium, so everything Phase 1 builds runs unchanged. The shell earns its existence by delivering only what a browser physically cannot:
  - **Syphon/Spout/NDI output** via native Node modules — the table-stakes pro I/O feature.
  - **The offline set cache, resurrected**: the Express server runs in-process with a real filesystem, so "download my whole set before the gig, play from local disk" becomes a gig-reliability feature no tab can offer. (The disk-cache/transcode services deleted in Phase 0 return here, deliberately, on a platform that supports them.)
  - Multi-display fullscreen without permission prompts, MIDI without permission gates, app icon/dock identity.
- **A full native rewrite (Swift/Metal) is rejected.** It discards the entire codebase for 6–12 months of solo re-implementation before reaching parity — the Resolume-envy trap named in §4.
- **iPad comes through a third shell, not Electron** (Electron does not run on iPadOS): a Capacitor wrapper over the same engine core, App Store distributable, with a native CoreMIDI bridge plugin giving iPad better controller support than Safari alone. Sequenced after desktop, once the touch UI is worth designing on its own terms.

One engine, three shells: browser (free front door), Electron (the pro instrument), Capacitor (the touch surface).

### 5.6 The backend (slim to purpose)

- **Hot path only**: Archive.org search proxy + streaming proxy with rate limiting. That's the product.
- **Delete the Postgres/Drizzle layer.** Its only job is caching Archive.org responses — an in-memory LRU with TTL (or Vercel edge caching) does this without a database, a connection string, or migrations.
- **Delete unused subsystems**: sessions, passport auth scaffolding, @google-cloud/storage, uppy upload stack (all currently imported nowhere), and the disk-cache/transcode/HLS services that don't run on the Vercel deploy anyway. If pre-transcoding ever returns, it returns as a deliberate feature on a host that supports it.

---

## 6. The cut list

Deletions are Phase 0 — they precede and fund everything else. All paths relative to `client/src/` unless noted.

| Cut | Why | Est. LOC |
|---|---|---|
| 9 of 10 themes: theme CSS, `getThemeClasses` ternary chains, title puns (`home.tsx:100–199`), ThemeSwitcher/ThemeSelector/ThemeExplanations/BrandSkinToggle | One identity. Ends the 10-way ternary tax on every styled element | ~2,500+ |
| Floating-panel system: FloatingPanel, FloatingPanelsManager, DockingGuides, ResizablePanels, LayoutControls, LayoutAnimationWrapper, panel x/y/z state in store | Fixed layout replaces the windowing metaphor | ~1,200 |
| Layout theater: LayoutDemonstrator, ResponsiveLayoutHints, ResponsiveLayoutHintsSimple, ResponsiveBreakpointIndicator, ResponsiveLayoutManager | Components that *demonstrate* layouts instead of being one | ~1,300 |
| CoreSoundboards, EasterEgg, use-easter-egg, AsciiModeIndicator, ascii/Blondie/Hulkster modes in store | TTS soundboards and triple-click modes are learning artifacts | ~800 |
| Two of three onboarding flows + FirstRunTour | Zero-modal onboarding | ~950 |
| EffectsPanel + PresetEffectsPanel + VideoEffectsPanel (replaced by ISF auto-generated rack) | Three panels → one effect row | ~1,050 |
| AnimatedTransitions + framer-motion dependency | CSS transitions suffice; drop the bundle weight | ~250 + dep |
| Ticker, DonationCTA (fold a single link into footer), decorative HUD variants | Chrome | ~300 |
| Unused shadcn/ui wrappers (48 installed; app uses ~a dozen) + their orphan deps: recharts, embla-carousel, input-otp, react-day-picker | Installed-by-default bloat | ~1,500 + 4 deps |
| Server: db.ts, drizzle schema/migrations, search-cache-service (→ in-memory LRU), transcode-service, cache-service disk paths | Database-as-cache; features dead on the actual deploy | ~1,400 + 6 deps |
| package.json: passport, passport-local, connect-pg-simple, @google-cloud/storage, @uppy/* (7 pkgs), memorystore | **Imported nowhere today** | 13 deps |

**Estimated total: ~10,000+ LOC and ~25 dependencies removed** before any new code lands. The store alone should drop from 1,064 lines to ~400 (search, decks/queues, playback, effects, routing — no panel geometry, no novelty modes).

---

## 7. Performance budgets (product requirements, not aspirations)

| Metric | Budget | Notes |
|---|---|---|
| Compositor frame rate | 60 fps sustained, 2 decks + 3 active effects + feedback pass | Integrated GPU (M-series/Iris). Adaptive quality: drop render scale before dropping frames |
| Input → visible response | < 100 ms | Effect knob, crossfader, clip trigger (un-quantized) |
| Clip switch (preloaded) | < 1 frame gap | Both decks stay warm via existing preloader |
| Cold start → first visual | < 5 s on broadband | App shell < 500 KB gz after cuts |
| Search → results | < 1.5 s p50 | Archive.org latency dominates; LRU-cache repeats |
| Dropped frames | Visible dev-mode meter | `presentedFrames` delta from rVFC |

If a feature can't fit the frame budget, the feature waits — this is the codec/pipeline discipline (HAP/DXV, Metal rewrites) that separates 2026 tools from 2003 tools, translated to the web.

---

## 8. Phasing

**Phase 0 — Demolition (1–2 weeks equiv.)**
The cut list, one theme, fixed layout, slim server. App does *less*, feels dramatically faster, codebase is honest. Ship it.

**Phase 1 — The Engine (3–5 weeks equiv.)**
WebGL2 compositor; deck A as texture; ISF rack with intensity contract; feedback pass; beat clock + default routings; crossfader with deck B; quantized triggering. `captureStream` output window + set recording. *This is the moment it stops feeling like 2003.*

**Phase 1.5 — The Shell (1–2 weeks equiv.)**
Electron wrapper around the finished engine: Syphon/Spout (NDI as a follow-on) output, in-process Express with the offline set cache, one-click projector fullscreen, auto-update, signed/notarized builds. The browser version keeps shipping from the same repo — the shell adds, never replaces. Wrapping waits for the engine deliberately: a native-feeling app that still plays CSS-filtered video is lipstick on the 2003.

**Phase 2 — The Instrument (2–4 weeks equiv.)**
MIDI learn + controller presets; cue points + chop; hover-scrub; set bundles; scene morphing (lerp between saved effect states over N beats — the one-knob contract makes every state lerp-able); Emergency Mix on the new engine.

**Phase 3 — The Amplifiers (ongoing)**
Text-to-set AI curation; vibe tagging; WebCodecs frame-accurate loops for short clips; WebGPU fast path; shot-detection chop; optional cloud restyling — each only if the core still holds 60 fps.

**Phase 4 — The Touch Surface (when desktop is stable)**
Capacitor shell for iPad over the same engine core: touch-first trigger UI, CoreMIDI bridge plugin, App Store distribution.

Each phase ends shippable. No long-lived rewrite branch — the compositor lands behind the existing player, then replaces it.

---

## 9. Risks & open questions

- **Archive.org media isn't seek-friendly** (long-GOP MP4s; no DXV/HAP equivalent). Mitigations: aggressive preload of both decks, WebCodecs full-decode for short loops (Chromium), optional server pre-transcode as a *later, self-hosted* feature. Loop-point jank is the top engineering risk for "smooth."
- **Safari/Firefox gaps** (Web MIDI, captureStream nuances, rVFC in Firefox). Decision: Chromium is the *performance* target; others get browse/preview parity. State it in docs rather than engineering to the lowest denominator.
- **CORS/ToS on proxied streaming** — the proxy already handles this; confirm texture upload from the proxied origin is clean (`crossorigin` + headers already in place).
- **Identity risk**: killing nine themes will sting for whoever loved Waffle House mode. Recommendation: one "identity" theme done extremely well; archive the theme CSS in git history, not in the bundle. If a second skin ever returns, it returns as an *output* effect (a shader LUT), not an interface reskin.
- **Open question for the team**: is Static Buffet 2.0 free-forever, donation-ware, or LumaDeck-style freemium (~€5/mo for MIDI presets + AI set-building)? The research says browser VJ freemium is now viable. The PRD doesn't assume revenue; Phase 3 AI features are the natural paid tier if wanted.

---

## 10. Success metrics

- Time-to-first-visual (new user): **< 30 s** (currently: modal → tour → floating panels → ???).
- A full set performed with **keyboard/MIDI only** — mouse optional after setup.
- 60 fps held through a 30-minute set on an M1 Air with adaptive quality never below 0.75×.
- Bundle ≤ 500 KB gz; client components ≤ 8,000 LOC; zero dead dependencies (CI-enforced via knip or similar).
- Session recordings actually shared (the organic-growth signal that matters).

---

## Appendix A — Evidence index (current repo)

- CSS-filter "effects": `client/src/components/Player.tsx:718` (`generateFilterString`), applied at `:938`, `:952`; audio-reactive path sets `style.filter` at `:431`.
- Crossfade never composited: `crossfade` fields only in `ExportMenu.tsx:57`, `EmergencyMix.tsx`, `lib/emergency-mix.ts`, queue metadata — no mixing code exists.
- Floating-panel workspace as hero UI: `client/src/pages/home.tsx:247–266`; ten-way theme ternaries: `home.tsx:100–199`.
- Store mixing concerns (1,064 lines): `client/src/lib/store.ts` — queue + effects + panel x/y/zIndex + ascii/Blondie/Hulkster modes + camera streams.
- Pop-out dual-playback sync: `client/src/components/PopOutPlayer.tsx:327, 497, 618, 631` (postMessage).
- Dead deps (imported nowhere): passport, passport-local, connect-pg-simple, @google-cloud/storage, @uppy/* ×7, memorystore. Orphan-UI deps: recharts, embla-carousel-react, input-otp, react-day-picker.
- DB-as-cache: `server/db.ts`, `server/search-cache-service.ts`, `server/metadata-service.ts`, `shared/schema.ts`.
- Component census: 15,657 LOC across `client/src/components/*.tsx`; 48 shadcn/ui wrappers installed.

## Appendix B — Research sources (July 2026)

Desktop: resolume.com (7.27, MCP servers, REST API v2) · vidvox.net + discourse (VDMX6 Metal/ISF/CoreML) · derivative.ca (TouchDesigner 2025.33060, POPs) · synesthesia.live (1.23.x) · magicmusicvisuals.com (2.5 AI prompting) · smode.io · arkaos.com (GrandVJ 2.7.3/2020) · garagecube.com (Modul8 v3) · vjgalaxy.com 2026 guide · autovj.club comparison.

Browser/web: hydra.ojack.xyz · cables.gl · radiance.video + github.com/zbanks/radiance · isf.video + editor.isf.video + ISF-JS-Renderer · butterchurnviz.com (WASM-compiled presets, preset blending) · nestimmersion.ca (NestDrop BeatBar) · estuary/Punctual/P5LIVE · tixy.land · kaleidosync (structural audio) · visualzstudio.com (set bundles, modulator binding) · noisedeck.app + visualize.noisedeck.app (WebGL2+WebGPU dual-target) · lumadeck.app (adaptive quality, 30-s-to-projecting) · modV/hedron/acid-app · mixyoutube.com · daydream.live (hosted StreamDiffusion) · caniuse.com/webgpu (~82% baseline since Nov 2025) · webrtchacks.com (frame-processing pipeline comparison) · archive.org VJ-loop + Prelinger collections.
