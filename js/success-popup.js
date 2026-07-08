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
    ctaShown = false;
    ctaWrap.hidden = true;
    continueBtn.classList.remove("success-popup__button--error");

    // All "did the video actually finish" tracking starts HERE, at the
    // moment the popup is actually shown — not at page load. That was
    // the bug: a fixed timer set up when the page first loaded would
    // fire while the user was still filling out the form, long before
    // the video ever got a chance to play.
    video.addEventListener("ended", () => revealCta("success"), { once: true });
    video.addEventListener("error", () => revealCta("error"), { once: true });
    video.addEventListener(
      "loadedmetadata",
      () => {
        if (isFinite(video.duration) && video.duration > 0) {
          setTimeout(() => revealCta("success"), video.duration * 1000 + 800);
        }
      },
      { once: true }
    );
    setTimeout(() => {
      if (video.readyState === 0) revealCta("error");
    }, 6000);

    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }

  return { show };
})();
