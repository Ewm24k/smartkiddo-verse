/* =========================================================
   music-player.js — background music bar
   IMPORTANT LIMITATION (read this): a static site (GitHub Pages/
   Netlify) cannot ask the browser "list every file in this
   folder" — that's not something plain HTML/CSS/JS can do without
   a backend. The closest thing to "just drop files in and it
   plays them" on a static host is this: list the filenames once
   in assets/audio/music/playlist.json, and this script plays
   whatever's in that list — you're editing a plain text list of
   filenames, not touching any app code. If that list is empty,
   the bar stays hidden entirely — that's expected, not a bug.

   Visibility behavior:
   - Floats fixed at the bottom at all times (not tied to scroll
     position at all).
   - Briefly slides away WHILE the page is actively scrolling, and
     slides back the moment scrolling stops.
   - Can also be manually hidden via the toggle button — while in
     that state, it stays hidden regardless of scrolling, and a
     small floating "reveal" button appears bottom-right to bring
     it back.
   ========================================================= */

const SmartKiddoMusicPlayer = (() => {
  const bar = document.getElementById("musicPlayerBar");
  const playPauseBtn = document.getElementById("musicPlayPause");
  const stopBtn = document.getElementById("musicStop");
  const toggleBtn = document.getElementById("musicToggle");
  const trackNameEl = document.getElementById("musicTrackName");
  const revealBtn = document.getElementById("musicRevealBtn");

  let tracks = [];
  let currentIndex = 0;
  const audio = new Audio();
  audio.volume = 0.55;
  let isPlaying = false;

  let manuallyHidden = false;
  let scrollHidden = false;

  function updateBarVisibility() {
    bar.classList.toggle("music-player--hidden-state", manuallyHidden || scrollHidden);
    revealBtn.hidden = !manuallyHidden;
  }

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

  // Manual hide (toggle button) / reveal (floating button)
  toggleBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  toggleBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    manuallyHidden = true;
    updateBarVisibility();
  });

  revealBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  revealBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    manuallyHidden = false;
    updateBarVisibility();
  });

  // Auto-hide while scrolling, reappear once scrolling stops — but only
  // when it isn't manually hidden.
  let scrollHideTimer = null;
  function attachScrollAutoHide() {
    const scrollEl = document.querySelector(".dash-content");
    if (!scrollEl) return;
    scrollEl.addEventListener(
      "scroll",
      () => {
        if (manuallyHidden) return;
        scrollHidden = true;
        updateBarVisibility();
        clearTimeout(scrollHideTimer);
        scrollHideTimer = setTimeout(() => {
          scrollHidden = false;
          updateBarVisibility();
        }, 500);
      },
      { passive: true }
    );
  }

  function retryAutoplayOnInteraction() {
    if (isPlaying || !tracks.length) return;
    play();
  }
  document.addEventListener("click", retryAutoplayOnInteraction);
  document.addEventListener("touchstart", retryAutoplayOnInteraction, { passive: true });

  function init() {
    attachScrollAutoHide();

    fetch("assets/audio/music/playlist.json")
      .then((res) => res.json())
      .then((data) => {
        tracks = (data && data.tracks) || [];
        if (!tracks.length) {
          bar.hidden = true;
          revealBtn.hidden = true;
          return;
        }
        bar.hidden = false;
        updateBarVisibility();
        loadTrack(0);
        play();
      })
      .catch(() => {
        bar.hidden = true;
        revealBtn.hidden = true;
      });
  }

  return { init };
})();
