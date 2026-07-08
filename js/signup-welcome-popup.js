/* =========================================================
   signup-welcome-popup.js — welcome popup with crayon-style
   word-by-word text reveal. Shows on page load alongside the
   welcome voice, blurs the form gently behind it, and closes
   on the "OK" button.
   ========================================================= */

(function () {
  const popup = document.getElementById("welcomePopup");
  const textEl = document.getElementById("welcomePopupText");
  const okBtn = document.getElementById("welcomePopupOk");
  const body = document.body;

  const message = "Hai parents semua! Tolong daftarkan dulu untuk anak-anak tersayang ni!";

  // Build the text as individual word spans, each staggered so they
  // pop in one after another (the "crayon" bounce-in effect).
  function renderAnimatedText() {
    const words = message.split(" ");
    textEl.innerHTML = words
      .map((word, i) => {
        const delay = (i * 0.14).toFixed(2);
        return `<span class="welcome-popup__word" style="animation-delay:${delay}s">${word}</span>`;
      })
      .join(" ");
  }

  function openPopup() {
    renderAnimatedText();
    body.classList.add("welcome-popup-active");
  }

  function closePopup() {
    SmartKiddoSound.playClick();

    // Works on Android Chrome (hides the address bar). iOS Safari does
    // not support the Fullscreen API for regular web pages at all — a
    // real platform limitation, not something any code can change.
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    popup.classList.add("welcome-popup--hidden");
    body.classList.remove("welcome-popup-active");
    setTimeout(() => popup.remove(), 400);
  }

  okBtn.addEventListener("click", closePopup);

  openPopup();
})();
