/* =========================================================
   sound.js — central sound-effect helper
   One place to preload + play every short UI sound in the app.
   Each key maps to its own file, so you can swap any individual
   sound later (e.g. via GitHub) without touching any other file.
   ========================================================= */

const SmartKiddoSound = (() => {
  const files = {
    click: "assets/audio/click.mp3",       // general buttons (login, etc.)
    menu: "assets/audio/menu-click.mp3",   // hamburger menu open/close
    scroll: "assets/audio/scroll.mp3",     // scrolling inside the side menu
    start: "assets/audio/start-button.mp3",// "Mula Sekarang" button
    loading: "assets/audio/loading.mp3",   // loading screen chime
    hover: "assets/audio/hover.mp3",       // mouse hover on buttons/menu items
  };

  const cache = {};
  Object.keys(files).forEach((key) => {
    const audio = new Audio(files[key]);
    audio.preload = "auto";
    audio.volume = 0.9;
    cache[key] = audio;
  });

  function play(key, volume) {
    const base = cache[key];
    if (!base) return;
    // Cloning lets the same sound retrigger even if tapped rapidly
    const instance = base.cloneNode();
    instance.volume = volume !== undefined ? volume : base.volume;
    instance.play().catch(() => {
      /* Autoplay/gesture policies may briefly block this — harmless,
         the next real tap will work fine. */
    });
  }

  return {
    playClick: () => play("click"),
    playMenu: () => play("menu"),
    playScroll: () => play("scroll", 0.5),
    playStart: () => play("start"),
    playLoading: () => play("loading"),
    playHover: () => play("hover", 0.4),
  };
})();
