/* =========================================================
   music-player.js — background music bar
   IMPORTANT LIMITATION (read this): a static site (GitHub Pages/
   Netlify) cannot ask the browser "list every file in this
   folder" — that's not something plain HTML/CSS/JS can do without
   a backend. The closest thing to "just drop files in and it
   plays them" on a static host is this: list the filenames once
   in assets/audio/music/playlist.json, and this script plays
   whatever's in that list — you're editing a plain text list of
   filenames, not touching any app code.
   ========================================================= */

const SmartKiddoMusicPlayer = (() => {
  const bar = document.getElementById("musicPlayerBar");
  const playPauseBtn = document.getElementById("musicPlayPause");
  const stopBtn = document.getElementById("musicStop");
  const toggleBtn = document.getElementById("musicToggle");
  const trackNameEl = document.getElementById("musicTrackName");

  let tracks = [];
  let currentIndex = 0;
  const audio = new Audio();
  audio.volume = 0.55;
  let isPlaying = false;

  function loadTrack(index) {
    if (!tracks.length) return;
    currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    audio.src = `assets/audio/music/${tracks[currentIndex]}`;
    trackNameEl.textContent = tracks[currentIndex].replace(/\.(mp3|wav)$/i, "");
  }

  function play() {
    audio
      .play()
      .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = "⏸";
      })
      .catch(() => {
        // Blocked by autoplay policy — same rule as everywhere else in
        // this app. Retried automatically on the first real interaction.
      });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶";
  }

  function stop() {
    audio.pause();
    audio.currentTime = 0;
    isPlaying = false;
    playPauseBtn.textContent = "▶";
  }

  audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1);
    play();
  });

  playPauseBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  playPauseBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    if (isPlaying) pause();
    else play();
  });

  stopBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  stopBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    stop();
  });

  let collapsed = false;
  toggleBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  toggleBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    collapsed = !collapsed;
    bar.classList.toggle("music-player--collapsed", collapsed);
    toggleBtn.textContent = collapsed ? "⌃" : "⌄";
  });

  function retryAutoplayOnInteraction() {
    if (isPlaying || !tracks.length) return;
    play();
  }
  document.addEventListener("click", retryAutoplayOnInteraction);
  document.addEventListener("touchstart", retryAutoplayOnInteraction, { passive: true });

  function init() {
    fetch("assets/audio/music/playlist.json")
      .then((res) => res.json())
      .then((data) => {
        tracks = (data && data.tracks) || [];
        if (!tracks.length) {
          bar.hidden = true;
          return;
        }
        bar.hidden = false;
        loadTrack(0);
        play();
      })
      .catch(() => {
        bar.hidden = true;
      });
  }

  return { init };
})();
