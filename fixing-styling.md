You are a Senior Front-End Developer working on a static HTML/CSS/JS web application for kids. 

I will provide a raw HTML dashboard file. Your task is to upgrade this file so that it strictly adheres to the exact visual, structural, and interaction standards established in `2years.html` and `3years.html`.

Return ONLY the complete, fully updated, production-ready HTML file (no partial snippets, no placeholder comments).

---

### CORE REQUIREMENTS & SPECIFICATIONS:

#### 1. Full-Screen & Full-Width Responsiveness
- Set stage container (`#stage-wrapper` and `#stage`) and video background (`#bg-video`) to 100% viewport width and height (`100vw`, `100vh`, `100dvh`).
- Use `object-fit: cover` on `#bg-video` and `background-size: cover` on `#stage`.
- Guarantee ZERO black bars, letterboxing, or empty spaces on the left and right across ALL devices (PC, Android phones, iOS iPhones, and Tablets).

#### 2. Preloader Layer & "CONTINUE ▶" Fullscreen Trigger
- Include the `#loader-layer` preloader overlay with a colorful spinner and "Loading Fun..." text.
- Asset Preloading Engine: Preload the background image (`bg.jpg`), all card PNGs (`card_1.png` through `card_12.png`), and video buffer readiness before revealing the stage.
- "CONTINUE ▶" Button Flow:
  - When asset preloading finishes, hide the spinner and text, and display a glossy, pulsing `CONTINUE ▶` button (`#continue-btn`).
  - When tapped, trigger the native Fullscreen API (`document.documentElement.requestFullscreen()`) to hide the browser address bar on Android/iOS, unmute/start the background music, fade out `#loader-layer`, and reveal the stage (`#stage`).

#### 3. Modern Top-Left Back Button
- Include a sleek glassmorphism circular Back Button (`#back-btn`) positioned in the top-left corner (`top: 20px; left: 20px; z-index: 100`).
- Clicking plays the UI click sound (`getSound()?.playClick?.()`) and navigates back using `window.history.back()` (with fallback to `index.html`).

#### 4. Background Video Rules
- Strict Mute Enforcement: Video must be completely silent (`autoplay muted playsinline webkit-playsinline`, `volume = 0` locked via JavaScript and `volumechange` listener).
- Non-Interactive: Set `pointer-events: none` so users cannot tap, pause, or stop the background video.
- Custom Early Loop: Implement a `timeupdate` listener to loop the video back to `0.0s` exactly 1.0 second before the video duration ends.

#### 5. Sound System Integration (`js/sound.js`)
- Ensure `<script src="js/sound.js"></script>` is included before the page inline script execution.
- Include the `getSound()` safe fallback helper to access `window.SmartKiddoSound`.
- Hover Sound: Attach `mouseenter` to card buttons to play `getSound()?.playHover?.()`.
- Click Sound & Toast: Attach `click` to card buttons to play `getSound()?.playClick?.()` and display the toast notification ("coming soon!").
- Do NOT play any loading chime sound effect when the preloader finishes.

#### 6. Integrated Autoplay Music Player Widget
- Include the built-in floating music widget (`#music-widget`, `#mw-reopen-btn`, `<audio id="bg-music-audio">`).
- Playlist Engine:
  - Attempt to fetch `playlist.json` from the current dashboard's subfolder (e.g., `assets/<folder_name>/dashboard/music/playlist.json`), falling back to `assets/audio/music/playlist.json`, and finally using embedded track fallbacks.
- Instant Autoplay & Seamless Auto-Next Track:
  - Start audio muted on load and unmute on the first user interaction / Continue button click.
  - Listen for the `ended` event on the `<audio>` element to call `playTrackAtIndex(trackIndex + 1)`, using `audio.load()` and `canplay` fallback listeners to GUARANTEE the next track plays automatically without stopping or requiring a manual button click.
  - Clicking the Next Track (`⏭`) button must immediately load and auto-play the next song.
- Show / Hide Interaction:
  - Widget starts minimized (`.is-minimized`).
  - Reveal triggers: Hovering mouse near the bottom of the screen (within 90px), clicking any empty background space, or clicking the floating music icon button (`🎵`).
  - Auto-hides after 5 seconds of inactivity.

#### 7. Android & iOS Mobile Phone Card Scaling (Android & iOS Only)
- Target phone screens specifically via media queries without affecting PC or Tablet views:
  - `@media screen and (max-width: 600px)` (Portrait phones)
  - `@media screen and (max-height: 500px) and (max-width: 930px)` (Landscape phones)
- Card Sizing & Position Rules:
  - Dynamically assign column and row classes (`card-col-1`..`card-col-4` and `card-row-1`..`card-row-3`) during card button creation, storing `--base-left` and `--base-top` inline variables.
  - Scale card buttons horizontally (`scaleX(1.30)`) and vertically (`scaleY(1.15)`).
  - Apply row vertical offsets (`.card-row-1 { top: calc(var(--base-top) - 2.5%) }`, `.card-row-3 { top: calc(var(--base-top) + 2.5%) }`) so rows NEVER overlap top-to-bottom.
  - Apply horizontal column offsets (`.card-col-4`, `.card-col-3`, `.card-col-2`) to pull rightmost cards leftward, bringing option cards closer together horizontally without vertical stacking.
- PC (desktop) and Tablet (iPad / Android tabs) views must remain 100% untouched.

---

### FILE PATH CONVENTIONS:
Update all image and video asset paths to reflect the specific dashboard folder (e.g. `assets/<folder_name>/dashboard/`):
- Background Image: `assets/<folder_name>/dashboard/bg.jpg`
- Background Video: `assets/<folder_name>/dashboard/bg.mp4` / `bg.webm`
- Card Images: `assets/<folder_name>/dashboard/card_1.png` through `card_12.png`
- Music Playlist: `assets/<folder_name>/dashboard/music/playlist.json`

Here is the raw HTML file to upgrade:
[PASTE YOUR RAW HTML CODE HERE]
