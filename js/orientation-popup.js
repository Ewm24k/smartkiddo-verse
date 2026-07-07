/* =========================================================
   orientation-popup.js — the "please rotate your device" prompt
   Job: close on the "Selesai" button, with a click sound, then
   let the user continue on to the "Ketuk Skrin" tap gate
   underneath (which is unaffected by this popup).
   ========================================================= */

(function () {
  const popup = document.getElementById("orientationPopup");

  // Only mobile phones benefit from a "rotate to landscape" prompt —
  // desktop/PC browsers should never see this popup at all.
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOSPhone = /iPhone|iPod/i.test(navigator.userAgent);

  if (!isAndroid && !isIOSPhone) {
    popup.remove();
    return;
  }

  const doneBtn = document.getElementById("orientationDoneBtn");

  doneBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    popup.classList.add("orientation-popup--hidden");
    setTimeout(() => popup.remove(), 400);
  });
})();
