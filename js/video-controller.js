/* =========================================================
   video-controller.js — the main fullscreen video
   Job: only start the main video once the loading screen has
   FULLY finished, then autoplay WITH sound as aggressively as
   the browser allows, and reveal the "Mula Sekarang" CTA once
   the video finishes.

   ROBUSTNESS: "loader finished" is detected THREE independent
   ways, so a click/tap can never silently fail to do anything
   again:
     1. The "smartkiddo:appReady" custom event from loader.js
     2. The window.smartKiddoAppReady flag set by loader.js
     3. A short poll checking that flag every 250ms as backup
   Click/tap listeners are registered immediately at page load
   (not gated behind any single signal) — each click checks the
   flag directly before doing anything, so it's never possible
   for "no listener was ever attached" to happen again.
   ========================================================= */

(function () {
  const video = document.getElementById("mainVideo");
  const ctaWrap = document.getElementById("ctaWrap");
  const startBtn = document.getElementById("startBtn");

  video.loop = false;
  video.defaultMuted = false;
  video.muted = false;
  video.volume = 1;

  /* ---------------- Diagnostics: does the file even HAVE audio? ---------------- */
  video.addEventListener("loadedmetadata", () => {
    const hasAudio =
      (video.mozHasAudio !== undefined && video.mozHasAudio) ||
      (video.webkitAudioDecodedByteCount !== undefined && video.webkitAudioDecodedByteCount > 0) ||
      (video.audioTracks !== undefined && video.audioTracks.length > 0);

    if (video.mozHasAudio !== undefined || video.webkitAudioDecodedByteCount !== undefined || video.audioTracks !== undefined) {
      if (!hasAudio) {
        console.warn("[SmartKiddoVerse] This browser reports NO audio track in main-video.mp4.");
      } else {
        console.log("[SmartKiddoVerse] Audio track detected in main-video.mp4.");
      }
    }
  });

  /* ---------------- CTA reveal: guaranteed, never twice ---------------- */
  let ctaShown = false;

  function revealCta(reason) {
    if (ctaShown) return;
    ctaShown = true;
    ctaWrap.hidden = false;
    console.log("[SmartKiddoVerse] CTA revealed:", reason);
  }

  video.addEventListener("ended", () => revealCta("video ended"));
  video.addEventListener("error", () => revealCta("video error"));
  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration) && video.duration > 0) {
      const backupMs = video.duration * 1000 + 800;
      setTimeout(() => revealCta("duration backup timer"), backupMs);
    }
  });

  /* ---------------- Sound: force unmuted, keep forcing it ---------------- */
  let unmuted = false;
  let retryTimer = null;
  let mainVideoStarted = false;

  function forceUnmute(label) {
    if (unmuted) return;
    video.muted = false;
    video.volume = 1;
    video.play()
      .then(() => {
        unmuted = true;
        console.log("[SmartKiddoVerse] Playing WITH sound:", label);
        if (retryTimer) clearInterval(retryTimer);
      })
      .catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
  }

  /* ---------------- Wait for the loading screen to be 100% done ---------------- */
  function isLoaderFinished() {
    return window.smartKiddoAppReady === true;
  }

  function startMainVideo(reason) {
    if (mainVideoStarted) return;
    mainVideoStarted = true;
    console.log("[SmartKiddoVerse] Starting main video:", reason);

    retryTimer = setInterval(() => {
      if (unmuted || video.ended) {
        clearInterval(retryTimer);
        return;
      }
      forceUnmute("periodic retry");
    }, 1000);

    forceUnmute("initial attempt after loader finished");

    setTimeout(() => {
      if (video.readyState === 0) revealCta("metadata never loaded");
    }, 6000);
  }

  // Signal 1: the custom event from loader.js
  document.addEventListener("smartkiddo:appReady", () => startMainVideo("appReady event"), { once: true });

  // Signal 2/3: poll the flag every 250ms as an independent backup,
  // in case the event above is ever missed for any reason.
  const readyPoll = setInterval(() => {
    if (isLoaderFinished()) {
      clearInterval(readyPoll);
      startMainVideo("ready flag poll");
    }
  }, 250);

  // Any click/tap/key press anywhere on the page: always registered
  // immediately (never gated), always safe. If the loader has
  // genuinely finished, this both starts the video (if it somehow
  // hasn't yet) AND unmutes it. If the loader hasn't finished yet,
  // this does nothing — so it can never make the video play early.
  function onInteraction() {
    if (!isLoaderFinished()) return;
    startMainVideo("user interaction");
    forceUnmute("user interaction");
  }
  document.addEventListener("touchstart", onInteraction, { passive: true });
  document.addEventListener("click", onInteraction);
  document.addEventListener("keydown", onInteraction);

  // Prevent the video from ever being paused/stopped by the user,
  // and make sure nothing external can re-mute it once sound is on.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  video.addEventListener("volumechange", () => {
    if (unmuted && video.muted) video.muted = false;
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  startBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    console.log("Mula Sekarang tapped — route to the next screen here.");
  });
})();
