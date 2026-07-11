/* =========================================================
   home-video.js — the welcome-home.mp4 fullscreen intro
   Plays once (no loop), cannot be paused/skipped by the user,
   then fades out to reveal the actual home page content.
   ========================================================= */

(function () {
  const stage = document.getElementById("homeVideoStage");
  const video = document.getElementById("homeWelcomeVideo");
  const homeMain = document.getElementById("homeMain");

  video.loop = false;

  function attemptPlay() {
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }
  attemptPlay();

  // Prevent the video from ever being paused/stopped by the user.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  document.addEventListener("contextmenu", (e) => {
    if (e.target === video) e.preventDefault();
  });

  let revealed = false;
  function revealHomeContent() {
    if (revealed) return;
    revealed = true;
    stage.classList.add("home-video-stage--hidden");
    homeMain.classList.add("is-visible");
    setTimeout(() => {
      if (stage.parentNode) stage.remove();
    }, 850);
  }

  video.addEventListener("ended", revealHomeContent);
  video.addEventListener("error", revealHomeContent);

  // Backup timer keyed to the real video duration, in case "ended"
  // is ever missed by the browser.
  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration) && video.duration > 0) {
      setTimeout(revealHomeContent, video.duration * 1000 + 800);
    }
  });

  // If the video never even starts loading, don't leave the home
  // content hidden forever.
  setTimeout(() => {
    if (video.readyState === 0) revealHomeContent();
  }, 8000);
})();
