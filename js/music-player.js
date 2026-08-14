/* =========================================================
   music-player.js — FIXED PLAY/PAUSE ICON STATE
   ========================================================= */

window.SmartKiddoMusicPlayer = (() => {
  const bar = document.getElementById("musicPlayerBar");
  const playPauseBtn = document.getElementById("musicPlayPause");
  const toggleBtn = document.getElementById("musicToggle");
  const trackNameEl = document.getElementById("musicTrackName");
  const revealBtn = document.getElementById("musicRevealBtn");

  let tracks = [];
  let currentIndex = 0;
  const audio = new Audio();
  audio.volume = 0.55;
  audio.crossOrigin = "anonymous";
  let autoplayUnlocked = false;
  let manuallyHidden = false;
  let scrollHidden = false;

  function updateBarVisibility() {
    if (!bar) return;
    bar.classList.toggle("music-player--hidden-state", manuallyHidden || scrollHidden);
    if (revealBtn) revealBtn.hidden = !manuallyHidden;
  }

  // Update button icon to match actual audio state
  function updateButtonIcon() {
    if (!playPauseBtn) return;
    if (audio.paused) {
      playPauseBtn.textContent = "▶";
    } else {
      playPauseBtn.textContent = "⏸";
    }
  }

  async function loadTrack(index) {
    if (!tracks.length) return false;

    currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const trackPath = `assets/audio/music/${tracks[currentIndex]}`;
    if (trackNameEl) {
      trackNameEl.textContent = tracks[currentIndex].replace(/\.(mp3|wav|ogg)$/i, "");
    }

    try {
      const response = await fetch(trackPath);
      if (!response.ok) return false;

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      audio.src = blobUrl;
      return true;
    } catch (err) {
      console.error("Error loading track:", err);
      return false;
    }
  }

  function play() {
    if (!audio.src) return;
    
    audio.play().catch((err) => {
      console.log("Play error:", err.message);
    });
  }

  function pause() {
    audio.pause();
  }

  // Helper to safely call sound triggers
  function getSound() {
    if (typeof window !== 'undefined' && window.SmartKiddoSound) return window.SmartKiddoSound;
    if (typeof SmartKiddoSound !== 'undefined') return SmartKiddoSound;
    return null;
  }

  // Update icon whenever audio state changes
  audio.addEventListener("play", updateButtonIcon);
  audio.addEventListener("pause", updateButtonIcon);

  audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1).then(() => play());
  });

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      
      if (audio.paused) {
        autoplayUnlocked = true;
        play();
      } else {
        pause();
      }
      
      updateButtonIcon();
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      manuallyHidden = true;
      updateBarVisibility();
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      manuallyHidden = false;
      updateBarVisibility();
    });
  }

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

  async function init() {
    attachScrollAutoHide();

    try {
      const res = await fetch("assets/audio/music/playlist.json");
      const data = await res.json();
      
      // Accepts both { "tracks": ["song1.mp3"] } and ["song1.mp3"]
      tracks = (data && data.tracks) || (Array.isArray(data) ? data : []);

      if (!tracks.length) {
        if (bar) bar.hidden = true;
        if (revealBtn) revealBtn.hidden = true;
        return;
      }

      if (bar) bar.hidden = false;
      updateBarVisibility();

      const loaded = await loadTrack(0);
      if (loaded) {
        play();
        autoplayUnlocked = true;
      }

    } catch (err) {
      console.warn("Music player playlist initialization notice:", err);
      if (bar) bar.hidden = true;
      if (revealBtn) revealBtn.hidden = true;
    }
  }

  return { init };
})();
