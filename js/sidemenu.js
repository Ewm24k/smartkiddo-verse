/* =========================================================
   sidemenu.js — hamburger toggle + login form
   Job: open/close the side menu and handle the login submit.
   ========================================================= */

(function () {
  const toggleBtn = document.getElementById("menuToggle");
  const closeBtn = document.getElementById("menuClose");
  const sideMenu = document.getElementById("sideMenu");
  const backdrop = document.getElementById("sideMenuBackdrop");
  const loginForm = document.getElementById("loginForm");

  function openMenu() {
    sideMenu.classList.add("is-open");
    backdrop.classList.add("is-visible");
    sideMenu.setAttribute("aria-hidden", "false");
    toggleBtn.setAttribute("aria-expanded", "true");
    SmartKiddoSound.playClick();
  }

  function closeMenu() {
    sideMenu.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    sideMenu.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = sideMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Placeholder login handling — wire this up to your real auth backend.
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    SmartKiddoSound.playClick();
    const username = document.getElementById("username").value.trim();
    // TODO: replace with a real authentication request (fetch/AJAX) to your backend.
    console.log("Login attempt for:", username);
    alert("Ciri log masuk akan disambungkan ke pelayan tidak lama lagi!");
  });
})();
