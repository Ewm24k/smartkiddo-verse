/* =========================================================
   home-video.js — home page welcome video
   Video starts playing immediately (no separate phase before
   it) with the "SMART KIDDO / VERSE / Page Loading" text
   layered directly on top of it via CSS — fading the video
   container out also fades that text out with it, since it's
   a child of the same element.

   Video autoplay uses the same aggressive retry pattern as the
   main page's video (periodic retries + interaction fallback),
   proven reliable on Android/iOS.

   Fullscreen: the Fullscreen API can only ever activate from a
   real tap/click — no page can start "already fullscreen" with
   zero interaction, on any browser. This attempts it the moment
   the first real tap happens anywhere on the page (matching the
   main page's tap-gate behavior), which works on Android Chrome.
   iOS Safari does not support the Fullscreen API for regular web
   pages at all — that's a platform restriction with no code
   workaround; Add to Home Screen is the only universal fix there.
   ========================================================= */

(function () {
  const videoStage = document.getElementById("homeVideoStage");
  const video = document.getElementById("homeWelcomeVideo");
  const homeMain = document.getElementById("homeMain");

  video.loop = false;
  video.defaultMuted = false;
  video.muted = false;
  video.volume = 1;

  SmartKiddoSound.playWelcomeSound();

  /* ---------------- Fullscreen: try immediately, keep retrying ---------------- */
  let fullscreenAttempted = false;
  function attemptFullscreen() {
    if (fullscreenAttempted || document.fullscreenElement) return;
    if (document.documentElement.requestFullscreen) {
      document.documentElement
        .requestFullscreen()
        .then(() => {
          fullscreenAttempted = true;
        })
        .catch(() => {
          // Blocked (no gesture yet) — keep trying on the interval below
          // and on the first real interaction, instead of giving up.
        });
    }
  }
  attemptFullscreen();
  const fullscreenRetry = setInterval(() => {
    if (document.fullscreenElement) {
      clearInterval(fullscreenRetry);
      return;
    }
    attemptFullscreen();
  }, 700);


  /* ---------------- Robust video playback (same pattern as main page) ---------------- */
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
    attemptFullscreen();
    forceUnmute("user interaction");
  }
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

  /* ---------------- Reveal home content once the video finishes ---------------- */
  let revealed = false;
  function revealHomeContent() {
    if (revealed) return;
    revealed = true;
    videoStage.classList.add("home-video-stage--hidden");
    homeMain.classList.add("is-visible");
    SmartKiddoMusicPlayer.init();
    setTimeout(() => {
      if (videoStage.parentNode) videoStage.remove();
    }, 850);
  }

  video.addEventListener("ended", revealHomeContent, { once: true });
  video.addEventListener("error", revealHomeContent, { once: true });
  video.addEventListener(
    "loadedmetadata",
    () => {
      if (isFinite(video.duration) && video.duration > 0) {
        setTimeout(revealHomeContent, video.duration * 1000 + 800);
      }
    },
    { once: true }
  );
  setTimeout(() => {
    if (video.readyState === 0) revealHomeContent();
  }, 8000);
})();
