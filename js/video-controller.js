/* =========================================================
   video-controller.js — the main fullscreen video
   Job: autoplay WITH sound automatically (no button, no click
   required), fall back gracefully only when the browser truly
   blocks it, and reveal the "Mula Sekarang" CTA only once the
   video has genuinely finished — with redundant safety nets so
   the button can never fail to appear.

   NOTE ON BROWSER AUTOPLAY POLICY:
   Chrome, Safari and Firefox all block a video from autoplaying
   WITH SOUND the very first time a visitor lands on a site — this
   is enforced by the browser/OS itself and cannot be bypassed by
   any script. This file always attempts unmuted playback first
   and keeps retrying; if the browser still blocks it, it silently
   unmutes the instant the user does anything at all on the page
   (open the menu, tap anywhere) — there is no visible "tap for
   sound" step.
   ========================================================= */

(function () {
  const video = document.getElementById("mainVideo");
  const ctaWrap = document.getElementById("ctaWrap");
  const startBtn = document.getElementById("startBtn");

  video.loop = false; // explicitly: this video must NOT loop
  video.muted = false;
  video.volume = 1;

  /* ---------------- CTA reveal: guaranteed, never twice ---------------- */
  let ctaShown = false;

  function revealCta(reason) {
    if (ctaShown) return;
    ctaShown = true;
    ctaWrap.hidden = false;
    console.log("[SmartKiddoVerse] CTA revealed:", reason);
  }

  // 1. Normal path — the video genuinely finishes playing.
  video.addEventListener("ended", () => revealCta("video ended"));

  // 2. If the video file fails to load/decode, don't leave the user
  //    staring at a black screen with no way forward.
  video.addEventListener("error", () => revealCta("video error"));

  // 3. Backup timer keyed to the real video duration, in case the
  //    "ended" event is ever swallowed by a browser quirk.
  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration) && video.duration > 0) {
      const backupMs = video.duration * 1000 + 800;
      setTimeout(() => revealCta("duration backup timer"), backupMs);
    }
  });

  // 4. If metadata never loads at all (bad path, blocked request,
  //    unsupported format), don't wait forever on the video.
  setTimeout(() => {
    if (video.readyState === 0) revealCta("metadata never loaded");
  }, 6000);

  /* ---------------- Sound handling ---------------- */
  let unmuted = false;

  function markUnmuted() {
    unmuted = true;
    video.muted = false;
    document.removeEventListener("touchstart", onFirstInteraction);
    document.removeEventListener("click", onFirstInteraction);
    document.removeEventListener("keydown", onFirstInteraction);
  }

  function onFirstInteraction() {
    if (unmuted) return;
    markUnmuted();
    video.play().catch(() => {});
  }

  // Any interaction anywhere on the page (menu, side menu links,
  // login form, etc.) silently confirms sound — no dedicated button.
  document.addEventListener("touchstart", onFirstInteraction, { passive: true });
  document.addEventListener("click", onFirstInteraction);
  document.addEventListener("keydown", onFirstInteraction);

  function attemptUnmutedPlay() {
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          markUnmuted();
        })
        .catch(() => {
          // Blocked by the browser's autoplay-with-sound policy.
          // Fall back to a muted start so the video still plays in
          // full visually, then keep retrying unmuted in the
          // background in case the browser's policy re-evaluates.
          video.muted = true;
          video.play().catch(() => {});
          retryUnmutedSoon();
        });
    }
  }

  function retryUnmutedSoon() {
    if (unmuted) return;
    setTimeout(() => {
      if (unmuted || video.ended) return;
      video.muted = false;
      video.play()
        .then(() => markUnmuted())
        .catch(() => {
          video.muted = true;
          retryUnmutedSoon();
        });
    }, 1500);
  }

  attemptUnmutedPlay();

  // Prevent the video from ever being paused/stopped by the user.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  startBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    // TODO: navigate to the next screen/lesson/game of SmartKiddo Verse.
    console.log("Mula Sekarang tapped — route to the next screen here.");
  });
})();
