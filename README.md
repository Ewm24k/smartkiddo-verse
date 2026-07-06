# smartkiddo-verse
kids webapp

# SmartKiddo Verse

A fullscreen, kid-friendly video landing page. No visible header/footer chrome —
just a black loading screen, then a fullscreen autoplay video with a side menu
and login, followed by an animated "Mula Sekarang" call-to-action.

## Folder structure

```
smartkiddo-verse/
├── index.html                  ← entry point (must stay at repo root for GitHub/Netlify)
├── css/
│   ├── base.css                ← resets, color/font tokens, responsive base
│   ├── loader.css              ← black pre-loading screen
│   ├── sidemenu.css            ← hamburger, brand, sliding menu + login form
│   ├── video-stage.css         ← fullscreen video sizing
│   └── cta-button.css          ← neon "Mula Sekarang" button + arrows
├── js/
│   ├── sound.js                ← click sound helper
│   ├── loader.js                ← intro video → reveal app
│   ├── sidemenu.js             ← menu open/close + login form
│   └── video-controller.js     ← autoplay/sound handling, CTA reveal
└── assets/
    ├── videos/
    │   ├── loading.mp4         ← ⚠️ ADD YOUR PREPARED LOADING VIDEO HERE
    │   └── main-video.mp4      ← ⚠️ ADD YOUR MAIN CARTOON VIDEO HERE
    ├── audio/
    │   └── click.mp3           ← ⚠️ ADD A CLICK SOUND HERE (see below)
    └── icons/
        └── favicon.svg
```

## 1. Add your media files

Drop your two prepared videos in:
- `assets/videos/loading.mp4`
- `assets/videos/main-video.mp4`

## 2. Add a kid-friendly click sound (free, no attribution needed)

Pick one short "pop"/"click" sound (under 1 second is ideal) from any of these
free libraries and save it as `assets/audio/click.mp3`:

- **Pixabay Sound Effects** — https://pixabay.com/sound-effects/search/button%20click/ (royalty-free, no attribution)
- **Mixkit** — https://mixkit.co/free-sound-effects/click/ (royalty-free, free license)
- **Zapsplat** — https://www.zapsplat.com/sound-effect-category/button-clicks/ (free with a free account)
- **Freesound.org** — https://freesound.org/ (Creative Commons — check each sound's specific license)

Search terms like "kids pop", "cartoon click", "bubble tap" tend to give the
bounciest, most game-like results.

## 3. Important note on autoplay + sound

Mobile browsers (iOS Safari, Chrome on Android) block videos from
autoplaying **with sound** unless the user has already interacted with the
page. This project handles it gracefully:
- It first tries to autoplay the main video with sound.
- If the browser blocks that, it falls back to autoplay **muted** and shows
  a small "🔊 Sentuh untuk bunyi" chip — the very first tap anywhere unmutes
  the video without restarting or pausing it.

This is a browser/OS-level rule, not something any code can fully bypass —
this fallback is the standard approach used by production kids' apps.

## 4. Deploying

**GitHub → Netlify:**
1. Push this whole folder as a repository (`index.html` must be at the repo root).
2. In Netlify: "Add new site" → "Import an existing project" → connect the repo.
3. Build command: none needed (leave blank). Publish directory: `/` (root).
4. Deploy — Netlify will serve `index.html` automatically.

## 5. Device support

- Uses `100dvh` + `env(safe-area-inset-*)` so it fills the screen correctly on
  iOS notches/home indicators, Android nav bars, and desktop browsers alike.
- `object-fit: cover` on both videos keeps them filling the screen without
  distortion on any aspect ratio (phone, tablet, landscape, desktop).
- Layout tested down to small phone widths using `clamp()` for font sizes and
  a responsive side-menu width (`min(85vw, 320px)`).

## 6. Wiring up real login

The login form currently only logs to the console and shows a placeholder
alert (see `js/sidemenu.js`). Replace the `TODO` there with a real `fetch()`
call to your authentication backend when it's ready.
