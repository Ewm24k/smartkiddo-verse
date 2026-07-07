/* =========================================================
   loader.js — controls the pre-loading black screen
   Job: ONLY START once the tap-to-start gate has been dismissed
   (so the loading video/text are never silently playing out
   behind that gate — they always play in full, visibly, right
   after the tap). Then play the intro video + run the animated
   text sequence, and reveal the main app once BOTH are done.

   IMPORTANT: this is written so the app can NEVER get stuck on
   the loading screen — every path (video plays fine, video file
   missing, video errors, browser blocks something) eventually
   calls revealApp(). There is also a hard absolute-timeout as a
   last-resort safety net, including a fallback in case the tap
   gate's own event is ever missed.
   ========================================================= */

(function () {
  const loader = document.getElementById("loader");
  const loaderVideo = document.getElementById("loaderVideo");
  const app = document.getElementById("app");

  let started = false;
  let revealed = false;
  let videoDone = false;
  let textDone = false;

  function revealApp() {
    if (revealed) return; // never run twice
    revealed = true;

    loader.classList.add("loader--hidden");
    app.hidden = false;

    // Tell the rest of the app (main video, etc.) that the loading
    // screen is genuinely finished — nothing should start before this.
    window.smartKiddoAppReady = true;
    document.dispatchEvent(new CustomEvent("smartkiddo:appReady"));

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

  function beginLoaderSequence(reason) {
    if (started) return;
    started = true;
    console.log("[SmartKiddoVerse] Loader sequence starting:", reason);

    /* ---- Video completion: several independent triggers ---- */
    loaderVideo.addEventListener("ended", () => markVideoDone("ended event"));
    loaderVideo.addEventListener("error", () => markVideoDone("error event"));
    loaderVideo.addEventListener("loadedmetadata", () => {
      if (isFinite(loaderVideo.duration) && loaderVideo.duration > 0) {
        const backupMs = loaderVideo.duration * 1000 + 800;
        setTimeout(() => markVideoDone("duration backup timer"), backupMs);
      }
    });
    setTimeout(() => {
      if (loaderVideo.readyState === 0) markVideoDone("metadata never loaded");
    }, 4000);
    setTimeout(() => markVideoDone("absolute safety timeout"), 10000);

    /* ---- Loading sound (plays once, right as loading begins) ---- */
    SmartKiddoSound.playLoading();

    /* ---- Text sequence ---- */
    SmartKiddoLoaderText.runSequence().then(() => {
      textDone = true;
      maybeReveal();
    });

    /* ---- Start the video now, not before ---- */
    loaderVideo.play().catch(() => {});
  }

  // Normal path: start the moment the tap-to-start gate is dismissed.
  document.addEventListener("smartkiddo:userGestureReceived", () => beginLoaderSequence("tap gate"), { once: true });

  // Safety net: if the tap gate's event is ever missed for any reason
  // (broken script, etc.), don't leave the app stuck forever. This is
  // set generously long so it never fires before a real user has had
  // time to close the rotate-device popup and tap the gate themselves.
  setTimeout(() => beginLoaderSequence("safety timeout"), 20000);
})();
