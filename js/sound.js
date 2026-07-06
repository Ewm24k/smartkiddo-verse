/* =========================================================
   sound.js — tiny helper for UI click sounds
   Keep this file focused on ONE job: playing short sound effects.
   ========================================================= */

const SmartKiddoSound = (() => {
  const clickAudio = new Audio("assets/audio/click.mp3");
  clickAudio.preload = "auto";
  clickAudio.volume = 0.9;

  function playClick() {
    // Cloning lets the sound retrigger even if tapped rapidly
    const instance = clickAudio.cloneNode();
    instance.volume = clickAudio.volume;
    instance.play().catch(() => {
      /* Autoplay policies may block this until the user has interacted
         at least once — safe to ignore, next tap will work. */
    });
  }

  return { playClick };
})();
