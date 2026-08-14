/* =========================================================
   js/music-player-3years.js
   Dedicated Music Player for 3Years Dashboard
   Includes Auto-Hide Timer + Reveal Button + JSON Playlist
   ========================================================= */

window.SmartKiddoMusic3Years = (() => {
  const bar = document.getElementById("musicPlayerBar");
  const playPauseBtn = document.getElementById("musicPlayPause");
  const toggleBtn = document.getElementById("musicToggle");
  const trackNameEl = document.getElementById("musicTrackName");
  const revealBtn = document.getElementById("musicRevealBtn");

  // Default fallback track
  let tracks = ["bgm.mp3"]; 
  let currentIndex = 0;
  const audio = new Audio();
  audio.volume = 0.55;
  audio.crossOrigin = "anonymous";

  let isHidden = false;
  let autoHideTimer = null;
  const AUTO_HIDE_DELAY_MS = 4000; // Auto-hides after 4 seconds of inactivity

  function getSound() {
    if (typeof window !== 'undefined' && window.SmartKiddoSound) return window.SmartKiddoSound;
    if (typeof SmartKiddoSound !== 'undefined') return SmartKiddoSound;
    return null;
  }

  function updateUIState() {
    if (!bar) return;
    bar.hidden = false;
    bar.style.display = "flex";

    if (isHidden) {
      bar.classList.add("music-player--hidden-state");
      if (revealBtn) revealBtn.hidden = false;
    } else {
      bar.classList.remove("music-player--hidden-state");
      if (revealBtn) revealBtn.hidden = true;
    }
  }

  function startAutoHideTimer() {
    clearTimeout(autoHideTimer);
    autoHideTimer = setTimeout(() => {
      isHidden = true;
      updateUIState();
    }, AUTO_HIDE_DELAY_MS);
  }

  function resetAutoHideTimer() {
    clearTimeout(autoHideTimer);
    if (!isHidden) {
      startAutoHideTimer();
    }
  }

  function showPlayer() {
    isHidden = false;
    updateUIState();
    startAutoHideTimer();
  }

  function hidePlayer() {
    clearTimeout(autoHideTimer);
    isHidden = true;
    updateUIState();
  }

  function updateButtonIcon() {
    if (!playPauseBtn) return;
    playPauseBtn.textContent = audio.paused ? "▶" : "⏸";
  }

  async function loadTrack(index) {
    if (!tracks.length) {
      if (trackNameEl) trackNameEl.textContent = "No Track";
      return false;
    }

    currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const currentTrack = tracks[currentIndex];
    
    if (trackNameEl) {
      trackNameEl.textContent = currentTrack.replace(/\.(mp3|wav|ogg)$/i, "");
    }

    // Try dedicated 3years folder first, then fallback to standard audio folder
    const primaryPath = `assets/3tahun/dashboard/music/${currentTrack}`;
    const secondaryPath = `assets/audio/music/${currentTrack}`;

    audio.src = primaryPath;
    audio.onerror = () => {
      if (audio.src.includes(primaryPath)) {
        audio.src = secondaryPath;
      }
    };

    return true;
  }

  function play() {
    if (!audio.src) return;
    audio.play().catch((err) => {
      console.log("3Years Music autoplay note:", err.message);
    });
  }

  function pause() {
    audio.pause();
  }

  audio.addEventListener("play", updateButtonIcon);
  audio.addEventListener("pause", updateButtonIcon);

  audio.addEventListener("ended", () => {
    loadTrack(currentIndex + 1).then(() => play());
  });

  // Hovering or touching player cancels auto-hide timer while user interacts
  if (bar) {
    bar.addEventListener("mouseenter", () => clearTimeout(autoHideTimer));
    bar.addEventListener("mouseleave", () => {
      if (!isHidden) startAutoHideTimer();
    });
    bar.addEventListener("touchstart", () => clearTimeout(autoHideTimer), { passive: true });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      if (audio.paused) {
        play();
      } else {
        pause();
      }
      updateButtonIcon();
      resetAutoHideTimer();
    });
  }

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      hidePlayer();
    });
  }

  if (revealBtn) {
    revealBtn.addEventListener("click", () => {
      getSound()?.playClick?.();
      showPlayer();
    });
  }

  async function init() {
    showPlayer();

    // Check potential JSON playlist paths
    const playlistPaths = [
      "assets/3tahun/dashboard/music/playlist.json",
      "assets/audio/music/playlist.json"
    ];

    for (const path of playlistPaths) {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const data = await res.json();
          const fetchedTracks = (data && data.tracks) || (Array.isArray(data) ? data : []);
          if (fetchedTracks.length > 0) {
            tracks = fetchedTracks;
            break;
          }
        }
      } catch (e) {
        // Continue fallback
      }
    }

    const loaded = await loadTrack(0);
    if (loaded) {
      play();
    }

    // Auto-hide player 4 seconds after page load
    startAutoHideTimer();
  }

  return { init, show: showPlayer, hide: hidePlayer };
})();
