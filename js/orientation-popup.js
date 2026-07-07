/* =========================================================
   orientation-popup.js — the "please rotate your device" prompt
   Job: close on the "Selesai" button, with a click sound, then
   let the user continue on to the "Ketuk Skrin" tap gate
   underneath (which is unaffected by this popup).
   ========================================================= */

(function () {
  const popup = document.getElementById("orientationPopup");
  const doneBtn = document.getElementById("orientationDoneBtn");

  doneBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    popup.classList.add("orientation-popup--hidden");
    setTimeout(() => popup.remove(), 400);
  });
})();
