/* =========================================================
   mula-popup.js — triggered by the "Mula Sekarang" button
   1. Shows the small checking-popup (no manual close) while
      verifying auth state — a quick local flag check, backed by
      a real Firestore re-check so it's not just trusting a flag.
   2. If authenticated → redirect to home.html.
   3. If not → auto-close popup 1, then show the mula-video popup.
   4. "Daftar Masuk" on the video popup closes it and opens the
      side menu automatically.
   ========================================================= */

const SmartKiddoMulaPopup = (() => {
  const checkingPopup = document.getElementById("checkingPopup");
  const mulaPopup = document.getElementById("mulaVideoPopup");
  const mulaVideo = document.getElementById("mulaVideo");
  const mulaCard = document.querySelector(".mula-video-popup__card");
  const mulaBtn = document.getElementById("mulaVideoPopupBtn");

  // Once the real video dimensions are known, size the card to match
  // its actual aspect ratio instead of the 16:9 placeholder — works
  // correctly whether the video is landscape, portrait, or square.
  mulaVideo.addEventListener("loadedmetadata", () => {
    if (mulaVideo.videoWidth && mulaVideo.videoHeight) {
      mulaCard.style.aspectRatio = `${mulaVideo.videoWidth} / ${mulaVideo.videoHeight}`;
    }
  });

  mulaBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  mulaBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    mulaPopup.hidden = true;
    mulaVideo.pause();
    // Reuses the existing menu toggle button's own open logic, rather
    // than duplicating it — the menu is closed at this point, so this
    // click always opens it.
    document.getElementById("menuToggle").click();
  });

  function playMulaVideo() {
    mulaVideo.currentTime = 0;
    mulaVideo.muted = false;
    mulaVideo.play().catch(() => {
      mulaVideo.muted = true;
      mulaVideo.play().catch(() => {});
    });
  }

  function checkAuthAndShow() {
    checkingPopup.hidden = false;

    const loggedInEmail = localStorage.getItem("smartkiddo_logged_in_email");
    const MIN_DISPLAY_MS = 1200; // ensures the checking popup is genuinely seen
    const startedAt = Date.now();

    function finish(isAuthenticated) {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
      setTimeout(() => {
        checkingPopup.hidden = true;
        if (isAuthenticated) {
          window.location.href = "home.html";
        } else {
          mulaPopup.hidden = false;
          SmartKiddoSound.playSignupSound();
          playMulaVideo();
        }
      }, remaining);
    }

    if (!loggedInEmail) {
      finish(false);
      return;
    }

    // Real backend check: re-confirm this email still has a valid
    // account, rather than just trusting the local flag blindly.
    db.collection("email-lookup")
      .doc(loggedInEmail)
      .get()
      .then((doc) => finish(doc.exists))
      .catch((err) => {
        console.error("Auth re-check error:", err);
        finish(false);
      });
  }

  return { checkAuthAndShow };
})();
