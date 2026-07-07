/* =========================================================
   video-controller.js — the main fullscreen video
   Job: only start the main video once the loading screen has
   FULLY finished (waits for the "smartkiddo:appReady" event
   dispatched by loader.js) — it must never play underneath the
   loading screen. Then autoplay WITH sound as aggressively as
   the browser allows, and reveal the "Mula Sekarang" CTA once
   the video finishes (with redundant safety nets).
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

  function forceUnmute(label) {
    if (unmuted) return;
    video.muted = false;
    video.volume = 1;
    video.play()
      .then(() => {
        unmuted = true;
        console.log("[SmartKiddoVerse] Playing WITH sound:", label);
        clearInterval(retryTimer);
        document.removeEventListener("touchstart", onFirstInteraction);
        document.removeEventListener("click", onFirstInteraction);
        document.removeEventListener("keydown", onFirstInteraction);
      })
      .catch(() => {
        video.muted = true;
        video.play().catch(() => {});
      });
  }

  function onFirstInteraction() {
    forceUnmute("user interaction");
  }

  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  video.addEventListener("volumechange", () => {
    if (unmuted && video.muted) video.muted = false;
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  /* ---------------- Wait for the loading screen to be 100% done ---------------- */
  function startMainVideo() {
    document.addEventListener("touchstart", onFirstInteraction, { passive: true });
    document.addEventListener("click", onFirstInteraction);
    document.addEventListener("keydown", onFirstInteraction);

    retryTimer = setInterval(() => {
      if (unmuted || video.ended) {
        clearInterval(retryTimer);
        return;
      }
      forceUnmute("periodic retry");
    }, 1000);

    forceUnmute("initial attempt after loader finished");

    // Metadata-timeout safety net for the CTA, started from the same
    // moment the video actually begins — not from page load.
    setTimeout(() => {
      if (video.readyState === 0) revealCta("metadata never loaded");
    }, 6000);
  }

  document.addEventListener("smartkiddo:appReady", startMainVideo, { once: true });

  startBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    console.log("Mula Sekarang tapped — route to the next screen here.");
  });
})();
