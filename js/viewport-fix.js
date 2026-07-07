/* =========================================================
   viewport-fix.js — reliable full-height sizing across devices
   Some mobile browsers (particularly around device rotation) are
   slow or inconsistent updating 100vh/100dvh. This computes the
   REAL visible height in JS and stores it as --vh, used as a
   fallback in CSS: height: calc(var(--vh, 1vh) * 100).
   Shared by every page in the app — load this before any layout
   that depends on full-height sizing.
   ========================================================= */

(function () {
  function setViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  setViewportHeight();
  window.addEventListener("resize", setViewportHeight);

  // On rotation, some mobile browsers briefly report the OLD size
  // for a moment right as the orientation actually changes — a short
  // delay avoids capturing that stale value.
  window.addEventListener("orientationchange", () => {
    setTimeout(setViewportHeight, 150);
  });
})();
