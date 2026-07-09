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
  const logoutNotification = document.getElementById("logoutNotification");

  // Placeholder "backend" signout call — returns a Promise so this is
  // ready to be swapped for a real Firebase Auth signOut() or your own
  // API call later without changing anything else in this file.
  function performSignOut() {
    return new Promise((resolve) => {
      localStorage.removeItem("smartkiddo_logged_in_email");
      setTimeout(resolve, 400); // small delay so it reads as a real request completing
    });
  }

  logoutBtn.addEventListener("click", () => {
    logoutBtn.disabled = true;

    performSignOut().then(() => {
      logoutNotification.hidden = false;
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1800);
    });
  });
})();
