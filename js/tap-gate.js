/* =========================================================
   tap-gate.js — captures ONE real, trusted user gesture right
   at the start of the experience. That's its ONLY job — it does
   NOT touch the main video file at all (doing so would make it
   start downloading/decoding at the same time as the loading
   video, competing for bandwidth and slowing things down).
   The domain-level gesture this captures is enough on its own
   for the main video to autoplay with sound later.
   ========================================================= */

(function () {
  const gate = document.getElementById("tapToStart");

  function dismissGate() {
    SmartKiddoSound.playClick();

    // Works on Android Chrome (hides the address bar). iOS Safari does
    // not support the Fullscreen API for regular web pages at all — this
    // is a real platform limitation, not something any code can change.
    // It's still safe to try: it silently does nothing where unsupported.
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    gate.classList.add("tap-gate--hidden");
    window.smartKiddoUserGestureReceived = true;
    document.dispatchEvent(new CustomEvent("smartkiddo:userGestureReceived"));
    setTimeout(() => gate.remove(), 300);
  }

  gate.addEventListener("click", dismissGate, { once: true });
  gate.addEventListener("touchend", dismissGate, { once: true });
})();
