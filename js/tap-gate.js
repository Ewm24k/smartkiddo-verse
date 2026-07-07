/* =========================================================
   tap-gate.js — captures ONE real, trusted user gesture right
   at the start of the experience, then "primes" the main video
   element with it so that later, when the loader finishes, the
   main video can play WITH sound automatically — no further
   clicks needed anywhere else in the app.

   NOTE: the loading screen behind this gate keeps loading and
   playing (muted) the whole time regardless — this gate does
   not add waiting time, it only needs a quick tap to dismiss.
   ========================================================= */

(function () {
  const gate = document.getElementById("tapToStart");

  function dismissGate() {
    gate.classList.add("tap-gate--hidden");
    window.smartKiddoUserGestureReceived = true;
    document.dispatchEvent(new CustomEvent("smartkiddo:userGestureReceived"));

    // Prime the main video element with this trusted gesture: briefly
    // play() then immediately pause()/reset it. Several mobile browsers
    // (notably iOS Safari) remember that THIS SPECIFIC element received
    // a user-gesture-triggered play() call, and will allow it to play
    // unmuted later in the same page — even without another tap.
    const video = document.getElementById("mainVideo");
    if (video) {
      video.muted = false;
      video
        .play()
        .then(() => {
          video.pause();
          video.currentTime = 0;
        })
        .catch(() => {
          // If priming itself fails, no harm done — the normal
          // retry logic in video-controller.js still applies.
        });
    }

    setTimeout(() => gate.remove(), 450);
  }

  gate.addEventListener("click", dismissGate, { once: true });
  gate.addEventListener("touchend", dismissGate, { once: true });
})();
