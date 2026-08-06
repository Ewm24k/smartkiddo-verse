# Prompt: Turn a UI Screenshot into a Clickable HTML/CSS/JS Webapp

You are given a screenshot image of a webpage UI. Your task is to turn it into a
clickable HTML/CSS/JS webapp using REAL cropped pieces of the original image —
not redrawn/replicated graphics. It must also resize correctly to fill the
browser window on any PC or mobile screen size, with **zero visual drift**
between the background art and the interactive elements layered on top of it,
and with **no element's own artwork cut off** at its edges.

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

**Do not eyeball edges — measure them, especially the bottom edge.** A guessed
box will often slice through a button's rounded corner, drop-shadow, or 3D
"shadow lip" along one side (bottom edges are the most common casualty,
since shadows/depth effects usually sit below the main face of a button).
For each element:
- Sample a color/edge scan (e.g. compare each row/column's pixel color
  against the known background color, using a distance threshold) along the
  side you're unsure about, to find the *true* pixel row/column where the
  element's artwork actually ends and the background begins — don't assume
  the boundary matches your first guessed coordinate.
- Extend the crop box out to that true edge, plus a small buffer (a few px),
  so the full outline/border/shadow is captured with nothing sliced off.
- Before finalizing, also measure where the *next* element in that direction
  actually starts (same edge-scan method). Your extended box must stop
  clearly short of that neighbor's true starting edge — leave a visible gap
  between them. Never let one element's extended crop touch or overlap
  another's.
- Re-crop and re-view any element whose test crop shows a flat/cut edge
  where a rounded corner, shadow, or outline should visibly continue —
  that flat cut is the signal the box was too tight, not the true boundary.
- Record each element's final box in the source image's own pixel
  coordinates (x0, y0, x1, y1) — you'll convert these to percentages later.

### 3. CLEAN the background
- Paint over/fill the area where each button was cut from the background
  (use each element's *final*, edge-corrected box from Step 2, not the
  original guess — if a box grew during Step 2, the cleaned hole must grow
  with it).
  Sample a nearby matching color (median of pixels just outside each box works
  well), then fill a slightly padded rectangle.
- **Feather the fill edges** (e.g. Gaussian-blur a mask and composite the solid
  fill over the original with that mask) rather than using a hard-edged
  rectangle. A hard edge can peek out as a faint seam/line if the overlay
  image is off by even 1px at some viewport size — feathering makes any tiny
  misalignment invisible instead of showing a visible slice between cards.

### 4. OPTIMIZE file size and output structure
- Save the background as JPEG (quality ~85-92) since it doesn't need transparency
- Keep buttons/mascot as PNG if they need transparency, otherwise JPEG too
- **Do NOT base64-encode images directly inline in the HTML.** Long inline
  `background-image: url('data:image/...;base64,AAAA...')` strings bloat the
  HTML file to megabytes and make the markup unreadable/undiffable. Instead,
  use one of these two structures:
  - **Preferred — real image files:** write every cropped image out as a
    file into an `assets/` folder next to the HTML (e.g. `assets/bg.jpg`,
    `assets/colors.png`) and reference them with normal relative paths:
    `background-image: url('assets/colors.png')`.
  - **Alternative — base64 in a separate JS file:** if the person wants the
    base64 approach (e.g. to avoid a folder of binary files), still keep it
    out of `index.html` itself. Put all data URIs in their own `assets.js`
    as a single object (`const ASSETS = { bg: "data:image/jpeg;base64,...",
    colors: "data:image/png;base64,...", ... };`), load it with
    `<script src="assets.js"></script>`, and set each element's
    `background-image` from `ASSETS.<key>` in a small script at the bottom
    of the HTML. This keeps `index.html` small and readable while still
    shipping as self-contained data URIs — deliver `index.html` +
    `assets.js` together (zipped).
  - Either way, the deliverable is never a single HTML file with base64
    strings written directly into the markup/CSS — only build that if the
    person explicitly insists on one physical file and accepts the bloat.

### 5. BUILD the HTML file for FULL-WINDOW RESPONSIVE SCALING

**Layout / alignment (critical — this is the #1 source of bugs):**
- `html, body { margin:0; padding:0; width:100%; height:100%; overflow:hidden; }`

There are two valid ways to make the stage fill the window. Pick based on
what the person asked for (default to FIT if they didn't say):

**Option A — FIT (letterbox/pillarbox, shows the entire image, may show bars):**
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
    background-image: url('assets/bg.jpg');   /* real file path, not base64 */
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

**Option B — FILL (true fullscreen, edge-to-edge on any device, crops
overflow instead of showing bars):** Use this when the person explicitly
wants the page to fill the whole screen on any device with no bars/letterbox
visible at all (e.g. phones, tablets, ultrawide monitors).
- `#stage-wrapper` is `position: fixed; inset: 0; width: 100vw; height: 100vh;
  overflow: hidden;` — the background image itself uses
  `background-size: cover; background-position: center;` on a full-bleed
  layer inside it, so it always fills the screen completely, cropping
  whatever overflows on one axis.
- Because `background-size: cover` no longer keeps the box's aspect ratio
  equal to the image's, percentage-of-stage positioning would drift here —
  so buttons/mascot must instead be positioned with a small JS layout
  function that replicates the exact same cover math the browser is using,
  then places every element in **pixels**, not percent:
  - `scale = Math.max(viewportW / sourceW, viewportH / sourceH)`
  - `displayedW = sourceW * scale`, `displayedH = sourceH * scale`
  - `offsetX = (viewportW - displayedW) / 2`, `offsetY = (viewportH - displayedH) / 2`
    (these come out negative/zero when the image is being cropped, which is expected)
  - for each element's known percentage box (left/top/width/height as %
    of the source image, same numbers Option A would use): 
    `pxLeft = offsetX + (pctLeft/100) * displayedW`, and so on for top/width/height.
- Re-run this layout function on `resize`, `orientationchange`, and (if
  available) `window.visualViewport`'s `resize` event, so rotating a phone
  or resizing a window keeps everything pixel-locked with zero drift at any
  aspect ratio, including extreme portrait/ultrawide.
- Tell the person plainly that Option B will crop some of the scene's edges
  on aspect ratios very different from the source image (e.g. a wide scene
  viewed on a tall phone will lose its left/right edges) — that's the
  expected tradeoff for true edge-to-edge fill, not a bug.

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
- Keep all image references as relative paths into `assets/` (see Step 4) —
  the HTML file itself should stay small and readable, not carry the image
  bytes inline.

### 6. VERIFY
- Confirm there is no visible seam/line at any button's border against the
  background, and no stray white/gray box behind any button or the mascot.
- **Confirm no element's own artwork is cut off.** For every button, check
  each edge (not just the ones that looked suspicious during cropping) for a
  flat cut through a rounded corner, drop-shadow, outline, or "shadow lip" —
  compare against a neighboring button of similar style as a reference for
  what a complete, uncut edge should look like.
- **Confirm neighboring elements never touch or overlap**, especially after
  any box was extended in Step 2 to fix a cutoff — there should be a visible
  gap between every pair of adjacent buttons at every tested viewport size.
- Describe (or check) behavior at common breakpoints — small laptop
  (1366×768), standard desktop (1920×1080), ultrawide (2560×1080), and if
  Option B (FILL) was used, also mobile portrait (e.g. 390×844) and a tall
  phone (e.g. 1080×2400) — and confirm the chosen layout mode (FIT or FILL)
  keeps every button aligned to the background art with zero drift at each,
  including non-16:9 windows and live resize/orientation changes.
- Confirm the final deliverable is either `index.html` + `assets/` (real
  image files) or `index.html` + `assets.js` (base64 in its own file) —
  zipped together — never a single HTML file with base64 strings written
  directly into its own markup/CSS.

---

## Layout mode
Fullscreen fill behavior: **[SPECIFY: "FIT" to show the entire image with
letterbox/pillarbox bars on mismatched aspect ratios, or "FILL" to cover the
whole screen edge-to-edge on any device, cropping overflow — default to FIT
if not specified]**

## Button behavior
Specify what each button should do when clicked: **[DESCRIBE DESIRED BEHAVIOR]**

The user will now upload a screenshot image. Once it's uploaded, begin the
process above immediately — inspect the image, crop the assets (measuring
true edges per Step 2, not guessing), clean the background, and build the
final HTML file — without asking for further clarification unless the button
click behavior wasn't specified above.
