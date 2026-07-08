/* =========================================================
   success-popup.js — fullscreen "verified" video popup
   Call SmartKiddoSuccessPopup.show() after a successful signup.
   Plays verified-video.mp4 fully (no pause, no skip, no loop),
   then reveals a "Teruskan" button — a calm success-styled
   button if the video played fine, or an error-styled variant
   if the video failed to load/play, before redirecting home.
   ========================================================= */

const SmartKiddoSuccessPopup = (() => {
  const popup = document.getElementById("successPopup");
  const video = document.getElementById("successVideo");
  const ctaWrap = document.getElementById("successCtaWrap");
  const continueBtn = document.getElementById("successContinueBtn");

  let ctaShown = false;

  function revealCta(state) {
    if (ctaShown) return;
    ctaShown = true;
    if (state === "error") {
      continueBtn.classList.add("success-popup__button--error");
    }
    ctaWrap.hidden = false;
  }

  video.loop = false;
  video.addEventListener("ended", () => revealCta("success"));
  video.addEventListener("error", () => revealCta("error"));
  video.addEventListener("loadedmetadata", () => {
    if (isFinite(video.duration) && video.duration > 0) {
      setTimeout(() => revealCta("success"), video.duration * 1000 + 800);
    }
  });
  // If the video never even starts loading, don't leave the parent stuck.
  setTimeout(() => {
    if (video.readyState === 0) revealCta("error");
  }, 6000);

  // Prevent the video from ever being paused/stopped by the user.
  video.addEventListener("pause", () => {
    if (!video.ended) video.play().catch(() => {});
  });
  video.addEventListener("contextmenu", (e) => e.preventDefault());

  continueBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  continueBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    window.location.href = "home.html";
  });

  function show() {
    popup.hidden = false;
    video.muted = false;
    video.play().catch(() => {
      // If unmuted autoplay is blocked, fall back to muted so the
      // video still plays in full visually.
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  return { show };
})();
