/* =========================================================
   home-inline.js — the "home" experience, merged into THIS
   document (index.html) rather than a separate page navigation.
   This is the actual fix for fullscreen breaking: browsers
   always exit fullscreen on a real page navigation, no matter
   what — the only way to keep it is to never navigate away in
   the first place. Same reason the loader → main video already
   worked: they're layers in one document, not separate pages.
   ========================================================= */

const SmartKiddoHomeScreen = (() => {
  const mainVideoStage = document.querySelector(".video-stage");
  const homeVideoStage = document.getElementById("homeScreenVideoStage");
  const homeVideo = document.getElementById("homeScreenVideo");
  const homeMain = document.getElementById("homeScreenMain");

  homeVideo.loop = false;
  homeVideo.defaultMuted = false;

  let unmuted = false;
  let retryTimer = null;

  function forceUnmute() {
    if (unmuted) return;
    homeVideo.muted = false;
    homeVideo.volume = 1;
    homeVideo
      .play()
      .then(() => {
        unmuted = true;
        if (retryTimer) clearInterval(retryTimer);
      })
      .catch(() => {
        homeVideo.muted = true;
        homeVideo.play().catch(() => {});
      });
  }

  function onInteraction() {
    forceUnmute();
  }

  homeVideo.addEventListener("pause", () => {
    if (!homeVideo.ended) homeVideo.play().catch(() => {});
  });
  homeVideo.addEventListener("volumechange", () => {
    if (unmuted && homeVideo.muted) homeVideo.muted = false;
  });

  let revealed = false;
  function revealHomeContent() {
    if (revealed) return;
    revealed = true;
    homeVideoStage.classList.add("home-video-stage--hidden");
    homeMain.classList.add("is-visible");
    setTimeout(() => {
      homeVideoStage.hidden = true;
    }, 850);
  }

  function show() {
    // Hide the main page's own hero video/CTA — we're now showing the
    // "home" screen instead, still inside the same document.
    if (mainVideoStage) mainVideoStage.hidden = true;

    homeVideoStage.hidden = false;
    homeVideoStage.classList.remove("home-video-stage--hidden");
    homeMain.hidden = false;
    homeMain.classList.remove("is-visible");

    SmartKiddoDashboard.init("homeScreenMain");
    SmartKiddoMusicPlayer.init();

    SmartKiddoSound.playWelcomeSound();

    document.addEventListener("touchstart", onInteraction, { passive: true });
    document.addEventListener("click", onInteraction);
    document.addEventListener("keydown", onInteraction);

    retryTimer = setInterval(() => {
      if (unmuted || homeVideo.ended) {
        clearInterval(retryTimer);
        return;
      }
      forceUnmute();
    }, 1000);

    homeVideo.addEventListener("ended", revealHomeContent, { once: true });
    homeVideo.addEventListener("error", revealHomeContent, { once: true });
    homeVideo.addEventListener(
      "loadedmetadata",
      () => {
        if (isFinite(homeVideo.duration) && homeVideo.duration > 0) {
          setTimeout(revealHomeContent, homeVideo.duration * 1000 + 800);
        }
      },
      { once: true }
    );
    setTimeout(() => {
      if (homeVideo.readyState === 0) revealHomeContent();
    }, 8000);

    homeVideo.load(); // preload was "none" — start fetching now, on demand
    forceUnmute();
  }

  return { show };
})();
