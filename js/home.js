/* =========================================================
   home.js — placeholder home page behavior
   Sound wiring follows the same pattern as every other page:
   hover + click sound on any interactive element. Nothing else
   here yet — this page gets properly designed in a later step.
   ========================================================= */

(function () {
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    el.addEventListener("click", () => SmartKiddoSound.playClick());
  });

  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", () => {
    logoutBtn.disabled = true;
    SmartKiddoLogout.perform("index.html");
  });
})();
