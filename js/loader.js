/* =========================================================
   loader-text.js — the 3-stage animated status text
   Stage 1: "SMART KIDDO Loading...." (pulsing dots)
   Stage 2: "Prepared Module..."      (typewriter effect)
   Stage 3: "SMART KIDDO Ready..."    (pop-in)
   Exposes runSequence() which resolves once all 3 stages finish.
   ========================================================= */

const SmartKiddoLoaderText = (() => {
  const el = document.getElementById("loaderText");

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function fadeOut() {
    el.classList.remove("is-visible");
    await wait(350); // matches the CSS opacity transition
  }

  async function showDots(label, holdMs) {
    el.className = "loader-text";
    el.innerHTML =
      `${label}` +
      `<span class="loader-text__dots"><span>.</span><span>.</span><span>.</span><span>.</span></span>`;
    // Force reflow so the transition re-triggers, then fade in
    void el.offsetWidth;
    el.classList.add("is-visible");
    await wait(holdMs);
    await fadeOut();
  }

  async function typewrite(text, speed = 55) {
    el.className = "loader-text";
    el.innerHTML = `<span class="loader-text__typed"></span><span class="loader-text__cursor">&nbsp;</span>`;
    const typedEl = el.querySelector(".loader-text__typed");
    void el.offsetWidth;
    el.classList.add("is-visible");

    for (let i = 0; i < text.length; i++) {
      typedEl.textContent += text[i];
      await wait(speed);
    }
    await wait(500); // let the finished word sit for a moment
    await fadeOut();
  }

  async function showReady(label, holdMs) {
    el.className = "loader-text loader-text--ready";
    el.textContent = label;
    void el.offsetWidth;
    el.classList.add("is-visible");
    await wait(holdMs);
    await fadeOut();
  }

  async function runSequence() {
    await showDots("SMART KIDDO Loading", 1800);
    await typewrite("Prepared Module...", 55);
    await showReady("SMART KIDDO Ready...", 1300);
  }

  return { runSequence };
})();
