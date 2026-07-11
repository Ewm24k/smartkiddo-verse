/* =========================================================
   home-video.js — home page sequence:
   1. Loading text stage (SMART KIDDO / VERSE + note + sound)
   2. Fullscreen welcome-home.mp4 (plays once, no pause/skip)
   3. Fades to reveal the actual home page content
   Video autoplay uses the SAME aggressive retry pattern as the
   main page's video (periodic retries + interaction fallback),
   since a single attempt was proven unreliable on some mobile
   browsers — this fixes that for Android/iOS specifically.
   ========================================================= */

(function () {
  const loadingStage = document.getElementById("homeLoadingStage");
  const videoStage = document.getElementById("homeVideoStage");
  const video = document.getElementById("homeWelcomeVideo");
  const homeMain = document.getElementById("homeMain");

  video.loop = false;
  video.defaultMuted = false;
  video.muted = false;
  video.volume = 1;

  /* ---------------- Phase 1: loading text stage ---------------- */
  SmartKiddoSound.playWelcomeSound();

  const LOADING_MIN_MS = 2600;
  const loadingStartedAt = Date.now();

  function startVideoPhase() {
    const elapsed = Date.now() - loadingStartedAt;
    const remaining = Math.max(LOADING_MIN_MS - elapsed, 0);
    setTimeout(() => {
      loadingStage.classList.add("home-loading-stage--hidden");
      setTimeout(() => {
        if (loadingStage.parentNode) loadingStage.remove();
      }, 650);
      beginVideoPlayback();
    }, remaining);
  }

  /* ---------------- Phase 2: welcome video, robust playback ---------------- */
  let unmuted = false;
  let retryTimer = null;

  function forceUnmute(label) {
    if (unmuted) return;
    video.muted = false;
    video.volume = 1;
    video.play()
      .then(() => {
        unmuted = true;
        if (retryTimer) clearInterval(retryTimer);
      })
      .catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
  }

  function onInteraction() {
    forceUnmute("user interaction");
  }

  function beginVideoPlayback() {
    document.addEventListener("touchstart", onInteraction, { passive: true });
    document.addEventListener("click", onInteraction);
    document.addEventListener("keydown", onInteraction);

    retryTimer = setInterval(() => {
      if (unmuted || video.ended) {
        clearInterval(retryTimer);
        return;
      }
      forceUnmute("periodic retry");
    }, 1000);

    forceUnmute("initial attempt");

    // All "did it actually finish" tracking starts HERE, at the moment
    // playback actually begins — not earlier at page-load/metadata time,
    // which could fire while the loading stage is still showing.
    video.addEventListener("ended", revealHomeContent, { once: true });
    video.addEventListener("error", revealHomeContent, { once: true });
    if (isFinite(video.duration) && video.duration > 0) {
      setTimeout(revealHomeContent, video.duration * 1000 + 800);
    } else {
      video.addEventListener(
        "loadedmetadata",
        () => {
          if (isFinite(video.duration) && video.duration > 0) {
            setTimeout(revealHomeContent, video.duration * 1000 + 800);
          }
        },
        { once: true }
      );
    }
    setTimeout(() => {
      if (video.readyState === 0) revealHomeContent();
    }, 8000);
  }


  // Prevent the video from ever being paused/stopped by the user.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  video.addEventListener("volumechange", () => {
    if (unmuted && video.muted) video.muted = false;
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  /* ---------------- Phase 3: reveal home content ---------------- */
  let revealed = false;
  function revealHomeContent() {
    if (revealed) return;
    revealed = true;
    videoStage.classList.add("home-video-stage--hidden");
    homeMain.classList.add("is-visible");
    setTimeout(() => {
      if (videoStage.parentNode) videoStage.remove();
    }, 850);
  }

  startVideoPhase();
})();
