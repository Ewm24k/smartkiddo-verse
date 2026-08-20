(function () {
  "use strict";

  /* ---------- side menu ---------- */
  var hamburger = document.getElementById("hamburgerBtn");
  var sideMenu = document.getElementById("sideMenu");
  var backdrop = document.getElementById("sideMenuBackdrop");

  function openMenu() {
    sideMenu.classList.add("is-open");
    backdrop.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
  }
  function closeMenu() {
    sideMenu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var isOpen = sideMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- logout (matches pattern used on home.html / profile.html) ---------- */
  var logoutBtn = document.getElementById("logoutBtn");
  var toast = document.getElementById("logoutToast");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      closeMenu();
      if (toast) {
        toast.classList.add("is-visible");
        setTimeout(function () {
          toast.classList.remove("is-visible");
          window.location.href = "index.html";
        }, 1400);
      } else {
        window.location.href = "index.html";
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }
})();
