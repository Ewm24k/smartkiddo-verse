/* =========================================================
   loader.js — controls the pre-loading black screen
   Job: play the intro video + run the animated text sequence,
   then reveal the main app once BOTH are done.

   IMPORTANT: this is written so the app can NEVER get stuck on
   the loading screen — every path (video plays fine, video file
   missing, video errors, browser blocks something) eventually
   calls revealApp(). There is also a hard absolute-timeout as a
   last-resort safety net.
   ========================================================= */

(function () {
  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loaderVideo");
  const app = document.getElementById("app");

  let revealed = false;
  let videoDone = false;
  let textDone = false;

  function revealApp() {
    if (revealed) return; // never run twice
    revealed = true;

    loader.classList.add("loader--hidden");
    app.hidden = false;

    setTimeout(() => {
      if (loader.parentNode) loader.remove();
    }, 650);
  }

  function maybeReveal() {
    if (videoDone && textDone) revealApp();
  }

  function markVideoDone(reason) {
    if (videoDone) return;
    videoDone = true;
    console.log("[SmartKiddoVerse] loader video finished:", reason);
    maybeReveal();
  }

  /* ---- Video completion: several independent triggers ---- */

  // 1. Normal path — the video actually finishes playing.
  loaderVideo.addEventListener("ended", () => markVideoDone("ended event"));

  // 2. The video file is missing / 404s / fails to decode.
  loaderVideo.addEventListener("error", () => markVideoDone("error event"));

  // 3. Belt-and-braces: once we know the real duration, schedule a
  //    backup timer slightly longer than the video itself. If the
  //    "ended" event is ever swallowed by a browser quirk, this fires
  //    instead.
  loaderVideo.addEventListener("loadedmetadata", () => {
    if (isFinite(loaderVideo.duration) && loaderVideo.duration > 0) {
      const backupMs = loaderVideo.duration * 1000 + 800;
      setTimeout(() => markVideoDone("duration backup timer"), backupMs);
    }
  });

  // 4. If metadata never loads at all within 4s (bad path, blocked
  //    request, unsupported format), don't wait forever on the video.
  setTimeout(() => {
    if (loaderVideo.readyState === 0) markVideoDone("metadata never loaded");
  }, 4000);

  // 5. Absolute last resort — no matter what happens above, the
  //    loading screen is forced to finish after 10 seconds.
  setTimeout(() => markVideoDone("absolute safety timeout"), 10000);

  /* ---- Text sequence ---- */
  SmartKiddoLoaderText.runSequence().then(() => {
    textDone = true;
    maybeReveal();
  });

  /* ---- Try to start the video ---- */
  loaderVideo.play().catch(() => {
    // Autoplay (even muted) is very rarely blocked, but if it is,
    // the timers above will still carry the sequence forward.
  });
})();
