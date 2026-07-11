/* =========================================================
   home.js — home page behavior
   Sound wiring follows the same pattern as every other page:
   hover + click sound on any interactive element. Logout is
   now handled via the shared side menu (js/sidemenu.js), same
   as the main page — nothing page-specific needed here for it.
   ========================================================= */

(function () {
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    el.addEventListener("click", () => SmartKiddoSound.playClick());
  });
})();
