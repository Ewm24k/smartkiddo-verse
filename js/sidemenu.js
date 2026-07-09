/* =========================================================
   sidemenu.js — hamburger toggle + login form + menu sounds
   Job: open/close the side menu, handle the login submit, and
   play the menu-open/close sound + a throttled scroll sound
   while scrolling inside the menu.
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
    SmartKiddoSound.playMenu();
  }

  function closeMenu() {
    const wasOpen = sideMenu.classList.contains("is-open");
    sideMenu.classList.remove("is-open");
    backdrop.classList.remove("is-visible");
    sideMenu.setAttribute("aria-hidden", "true");
    toggleBtn.setAttribute("aria-expanded", "false");
    if (wasOpen) SmartKiddoSound.playMenu();
  }

  toggleBtn.addEventListener("click", () => {
    const isOpen = sideMenu.classList.contains("is-open");
    isOpen ? closeMenu() : openMenu();
  });

  toggleBtn.addEventListener("mouseenter", () => {
    SmartKiddoSound.playHover();
  });

  closeBtn.addEventListener("mouseenter", () => {
    SmartKiddoSound.playHover();
  });

  // Hover sound on every field + button inside the login form itself
  document.querySelectorAll(".login-form__input, .login-form__submit").forEach((el) => {
    el.addEventListener("mouseenter", () => {
      SmartKiddoSound.playHover();
    });
  });

  // Hover sound + explicit click sound on each side menu link — click is
  // wired separately from hover because on a real PC, moving the mouse
  // onto a link (hover) and later clicking it are two separate moments,
  // so relying on hover alone misses the click entirely on desktop.
  document.querySelectorAll(".side-menu__links a, .login-form__signup").forEach((link) => {
    link.addEventListener("mouseenter", () => {
      SmartKiddoSound.playHover();
    });
    link.addEventListener("click", () => {
      SmartKiddoSound.playClick();
    });
  });

  closeBtn.addEventListener("click", closeMenu);
  backdrop.addEventListener("click", closeMenu);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  // Throttled scroll sound: plays at most once every 250ms while the
  // user scrolls the menu's link list, instead of firing constantly.
  let scrollSoundReady = true;
  sideMenu.addEventListener("scroll", () => {
    if (!scrollSoundReady) return;
    scrollSoundReady = false;
    SmartKiddoSound.playScroll();
    setTimeout(() => {
      scrollSoundReady = true;
    }, 250);
  });

  // Login: stores the entered credentials briefly in sessionStorage,
  // then hands off to auth-check.html, which does the actual Firestore
  // verification and redirects to home.html or signup.html accordingly.
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    SmartKiddoSound.playClick();
    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("password").value;

    sessionStorage.setItem("smartkiddo_auth_action", "login");
    sessionStorage.setItem("smartkiddo_pending_email", email);
    sessionStorage.setItem("smartkiddo_pending_password", password);
    window.location.href = "auth-check.html";
  });
})();
