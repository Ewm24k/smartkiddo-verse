/* =========================================================
   auth-check-text.js — two-language typewriter status text
   Types "Checking Authentication User" (English), holds, fades
   out, then types the Bahasa Melayu translation, and leaves it
   showing until the page redirects.
   ========================================================= */

const SmartKiddoAuthText = (() => {
  const el = document.getElementById("authCheckText");

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function typewrite(text, speed = 42) {
    el.className = "auth-check-text";
    el.innerHTML = `<span class="auth-check-text__typed"></span><span class="auth-check-text__cursor">&nbsp;</span>`;
    const typedEl = el.querySelector(".auth-check-text__typed");
    void el.offsetWidth;
    el.classList.add("is-visible");

    for (let i = 0; i < text.length; i++) {
      typedEl.textContent += text[i];
      await wait(speed);
    }
  }

  async function fadeOut() {
    el.classList.remove("is-visible");
    await wait(350);
  }

  async function runSequence() {
    await typewrite("Checking Authentication User", 42);
    await wait(900);
    await fadeOut();
    await typewrite("Sedang menyemak pengesahan pengguna, sila tunggu...", 38);
    // Stays visible after this — the page redirects once the actual
    // auth check + minimum display time (in auth-check.js) are both done.
  }

  return { runSequence };
})();
