/* =========================================================
   video-controller.js — the main fullscreen video
   Job: autoplay with sound (with a safe fallback), block any
   pause/click interaction, and reveal the CTA once it ends.
   ========================================================= */

(function () {
  const video = document.getElementById("mainVideo");
  const unmutePrompt = document.getElementById("unmutePrompt");
  const ctaWrap = document.getElementById("ctaWrap");
  const startBtn = document.getElementById("startBtn");

  video.loop = false; // explicitly: this video must NOT loop

  function tryPlayWithSound() {
    video.muted = false;
    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Most mobile browsers (iOS Safari, Chrome Android) block
        // autoplay with sound. Fall back to muted autoplay, then
        // unmute on the very first tap anywhere on the screen.
        video.muted = true;
        video.play();
        unmutePrompt.hidden = false;

        const unmuteOnce = () => {
          video.muted = false;
          unmutePrompt.hidden = true;
          document.removeEventListener("touchend", unmuteOnce);
          document.removeEventListener("click", unmuteOnce);
        };
        document.addEventListener("touchend", unmuteOnce, { once: true });
        document.addEventListener("click", unmuteOnce, { once: true });
      });
    }
  }

  tryPlayWithSound();

  // Prevent the video from ever being paused/stopped by the user.
  // (pointer-events:none in CSS already blocks taps; this covers
  // keyboard shortcuts like spacebar as a second layer of defense.)
  video.addEventListener("pause", () => {
    if (!video.ended) video.play();
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  // Reveal the CTA only once the video has genuinely finished.
  video.addEventListener("ended", () => {
    ctaWrap.hidden = false;
  });

  startBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    // TODO: navigate to the next screen/lesson/game of SmartKiddo Verse.
    console.log("Mula Sekarang tapped — route to the next screen here.");
  });
})();
