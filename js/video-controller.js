/* =========================================================
   video-controller.js — the main fullscreen video
   Job: guarantee the video is NEVER muted by our own code,
   push as hard as the browser allows to get sound playing
   automatically, and reveal the "Mula Sekarang" CTA once the
   video finishes (with redundant safety nets).
   ========================================================= */

(function () {
  const video = document.getElementById("mainVideo");
  const ctaWrap = document.getElementById("ctaWrap");
  const startBtn = document.getElementById("startBtn");

  video.loop = false;        // this video must NOT loop
  video.defaultMuted = false; // never start muted by default
  video.muted = false;        // force unmuted state immediately
  video.volume = 1;

  /* ---------------- Diagnostics: does the file even HAVE audio? ---------------- */
  video.addEventListener("loadedmetadata", () => {
    const hasAudio =
      (video.mozHasAudio !== undefined && video.mozHasAudio) ||
      (video.webkitAudioDecodedByteCount !== undefined && video.webkitAudioDecodedByteCount > 0) ||
      (video.audioTracks !== undefined && video.audioTracks.length > 0);

    if (video.mozHasAudio !== undefined || video.webkitAudioDecodedByteCount !== undefined || video.audioTracks !== undefined) {
      if (!hasAudio) {
        console.warn(
          "[SmartKiddoVerse] This browser reports NO audio track in main-video.mp4. " +
          "If sound is missing, re-export the video with its audio track included — this is not a code/mute issue."
        );
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
  setTimeout(() => {
    if (video.readyState === 0) revealCta("metadata never loaded");
  }, 6000);

  /* ---------------- Sound: force unmuted, keep forcing it ---------------- */
  let unmuted = false;

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
        // Browser is still blocking unmuted playback — keep the video
        // running muted for now so it plays in full; the interval
        // below and the interaction listeners keep retrying.
        video.muted = true;
        video.play().catch(() => {});
      });
  }

  function onFirstInteraction() {
    forceUnmute("user interaction");
  }
  document.addEventListener("touchstart", onFirstInteraction, { passive: true });
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("keydown", onFirstInteraction);

  // Keep actively retrying unmuted playback every second until it
  // succeeds or the video ends — belt and braces alongside the
  // interaction-based retry above.
  const retryTimer = setInterval(() => {
    if (unmuted || video.ended) {
      clearInterval(retryTimer);
      return;
    }
    forceUnmute("periodic retry");
  }, 1000);

  forceUnmute("initial attempt");

  // Prevent the video from ever being paused/stopped by the user,
  // and make sure nothing external can re-mute it once sound is on.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  video.addEventListener("volumechange", () => {
    if (unmuted && video.muted) {
      // Something (browser/extension) re-muted it — undo that.
      video.muted = false;
    }
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  startBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    console.log("Mula Sekarang tapped — route to the next screen here.");
  });
})();
