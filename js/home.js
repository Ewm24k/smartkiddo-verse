/* =========================================================
   home.js — Initialize music player
   ========================================================= */

(function () {
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    el.addEventListener("click", () => SmartKiddoSound.playClick());
  });
})();

// Initialize music player
const welcomeVideo = document.getElementById("homeWelcomeVideo");
if (welcomeVideo) {
  welcomeVideo.addEventListener("ended", () => {
    SmartKiddoMusicPlayer.init();
  });
} else {
  setTimeout(() => SmartKiddoMusicPlayer.init(), 500);
}
