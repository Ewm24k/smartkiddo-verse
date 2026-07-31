# Prompt: Turn a UI Screenshot into a Clickable HTML/CSS/JS Webapp

You are given a screenshot image of a webpage UI. Your task is to turn it into a
clickable HTML/CSS/JS webapp using REAL cropped pieces of the original image —
not redrawn/replicated graphics. It must also resize correctly to fill the
browser window on any PC screen size, with **zero visual drift** between the
background art and the interactive elements layered on top of it.

## Steps to follow

### 1. INSPECT
Identify:
- The background scene (everything except interactive buttons)
- Any character/mascot/hero graphic that should be its own layer
- Each clickable button, individually
- Note the exact pixel dimensions (W × H) of the source image — this is your
  reference coordinate space for everything downstream.

### 2. CROP each element using image processing (e.g. Python PIL)
- Crop the full background (remove any browser chrome/UI outside the actual page)
- Crop each button tightly around its edges, as a separate image file
- Crop the mascot/character tightly, as a separate image file
- Verify each crop visually before finalizing coordinates — iterate crop
  boundaries by viewing test crops until they're pixel-tight
- Record each element's box in the source image's own pixel coordinates
  (x0, y0, x1, y1) — you'll convert these to percentages later.

### 3. CLEAN the background
- Paint over/fill the area where each button was cut from the background.
  Sample a nearby matching color (median of pixels just outside each box works
  well), then fill a slightly padded rectangle.
- **Feather the fill edges** (e.g. Gaussian-blur a mask and composite the solid
  fill over the original with that mask) rather than using a hard-edged
  rectangle. A hard edge can peek out as a faint seam/line if the overlay
  image is off by even 1px at some viewport size — feathering makes any tiny
  misalignment invisible instead of showing a visible slice between cards.

### 4. OPTIMIZE file size
- Save the background as JPEG (quality ~85-92) since it doesn't need transparency
- Keep buttons/mascot as PNG if they need transparency, otherwise JPEG too
- Base64-encode all cropped images

### 5. BUILD the HTML file for FULL-WINDOW RESPONSIVE SCALING

**Layout / alignment (critical — this is the #1 source of bugs):**
- `html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }`
- Do **NOT** put the background on a `100vw x 100vh` element with
  `background-size: cover`. Cover-cropping scales/crops the image to a
  *different* aspect ratio than the source at almost every window size,
  which silently shifts where the art actually sits inside the box — but
  your buttons are positioned as percentages of the *source image's*
  coordinate space. The result: buttons drift away from the painted-over
  patches underneath them, and the mismatch shows up as visible seam
  lines / slices at button edges, worst on ultrawide or unusual aspect
  ratios.
- Instead, **lock the stage to the source image's exact aspect ratio** and
  letterbox/pillarbox it within the viewport, so the percentage grid is
  always 1:1 with the background art regardless of window shape:
  ```css
  #stage-wrapper {
    position: fixed; inset: 0;
    width: 100vw; height: 100vh;
    display: flex; align-items: center; justify-content: center;
    background: #0a0028; /* sampled from the image's own edge/corner color */
    overflow: hidden;
  }
  #stage {
    position: relative;
    aspect-ratio: <SOURCE_W> / <SOURCE_H>;
    width: 100%; height: 100%;
    max-width: calc(100vh * <SOURCE_W> / <SOURCE_H>);
    max-height: calc(100vw * <SOURCE_H> / <SOURCE_W>);
    background-image: url('<bg-base64>');
    background-size: 100% 100%;   /* stretch to fill the locked box exactly, never crop */
    background-repeat: no-repeat;
  }
  ```
- Position every button/mascot as absolutely-positioned children of `#stage`
  (not the wrapper) using PERCENTAGE left/top/width/height calculated from
  pixel coords ÷ source image dimensions. Because `#stage` always matches
  the source aspect ratio, these percentages stay pixel-accurate at every
  window size — no drift, no seams.
- Sample the letterbox/pillarbox bar color from the actual image corners
  (avoid a corner that happens to hit a decorative graphic) so idle bars
  blend with the scene instead of reading as plain black/white bands.

**Button/element chrome (critical — this is the #2 source of bugs):**
- If interactive elements are real `<button>` tags, native browser styling
  (default white/gray background, borders, padding) will show through and
  look like a stray white box behind the art unless explicitly reset:
  ```css
  button { -webkit-appearance: none; appearance: none; -webkit-tap-highlight-color: transparent; }
  .game-btn, .mascot {
    border: none; outline: none; padding: 0; margin: 0;
    background-color: transparent;   /* do not omit this */
    background-repeat: no-repeat;
    background-position: center;
    background-size: contain;
  }
  ```
- Apply this reset to *every* clickable element, including the mascot —
  don't assume `border:none` alone is enough; browsers still paint a
  default background color on bare `<button>` elements.

**Everything else:**
- Add hover/active CSS states (scale, brightness/filter, drop-shadow) for
  tactile feedback.
- Wire up onclick handlers in vanilla JS for each button (and mascot if
  interactive) to trigger real behavior (e.g. show a modal, navigate, submit
  a form).
- Embed all images as base64 data URIs so the result is a single portable
  .html file.

### 6. VERIFY
- Confirm there is no visible seam/line at any button's border against the
  background, and no stray white/gray box behind any button or the mascot.
- Describe (or check) behavior at common breakpoints — small laptop
  (1366×768), standard desktop (1920×1080), ultrawide (2560×1080) — and
  confirm the letterbox/pillarbox approach keeps every button aligned to
  the background art with zero drift at each, including non-16:9 windows.

---

## Button behavior
Specify what each button should do when clicked: **[DESCRIBE DESIRED BEHAVIOR]**

The user will now upload a screenshot image. Once it's uploaded, begin the
process above immediately — inspect the image, crop the assets, clean the
background, and build the final HTML file — without asking for further
clarification unless the button click behavior wasn't specified above.