/* =========================================================
   music-player.js — background music bar (IMPROVED VERSION)
   Handles "no supported sources" error and provides better logging
   ========================================================= */

const SmartKiddoMusicPlayer = (() => {
  const bar = document.getElementById("musicPlayerBar");
  const playPauseBtn = document.getElementById("musicPlayPause");
  const toggleBtn = document.getElementById("musicToggle");
  const trackNameEl = document.getElementById("musicTrackName");
  const revealBtn = document.getElementById("musicRevealBtn");

  let tracks = [];
  let currentIndex = 0;
  const audio = new Audio();
  audio.volume = 0.55;
  audio.preload = "auto";
  audio.crossOrigin = "anonymous";
  let isPlaying = false;
  let autoplayUnlocked = false;

  let manuallyHidden = false;
  let scrollHidden = false;

  function updateBarVisibility() {
    bar.classList.toggle("music-player--hidden-state", manuallyHidden || scrollHidden);
    revealBtn.hidden = !manuallyHidden;
  }

  function loadTrack(index) {
    if (!tracks.length) {
      console.error("❌ No tracks available to load");
      return;
    }
    currentIndex = ((index % tracks.length) + tracks.length) % tracks.length;
    const trackPath = `assets/audio/music/${tracks[currentIndex]}`;
    console.log(`🎵 Loading track ${currentIndex + 1}/${tracks.length}: ${tracks[currentIndex]}`);
    console.log(`   Full path: ${trackPath}`);
    
    audio.src = trackPath;
    trackNameEl.textContent = tracks[currentIndex].replace(/\.(mp3|wav|ogg)$/i, "");
  }

  function play() {
    if (!audio.src) {
      console.error("❌ No audio source loaded");
      return;
    }
    
    console.log(`🎵 Attempting to play: ${audio.src}`);
    audio
      .play()
      .then(() => {
        isPlaying = true;
        autoplayUnlocked = true;
        playPauseBtn.textContent = "⏸";
        console.log("✅ Music playing!");
      })
      .catch((err) => {
        console.warn(`⚠️ Playback failed (${err.name}):`, err.message);
        if (err.name === "NotSupportedError") {
          console.error("❌ Audio format not supported or file not found!");
          console.error("   Check: assets/audio/music/" + audio.src.split("/").pop());
        }
      });
  }

  function pause() {
    audio.pause();
    isPlaying = false;
    playPauseBtn.textContent = "▶";
    console.log("⏸ Music paused");
  }

  // Audio element event listeners
  audio.addEventListener("loadstart", () => {
    console.log("🎵 Loading audio...");
  });

  audio.addEventListener("canplay", () => {
    console.log("✅ Audio ready to play");
  });

  audio.addEventListener("ended", () => {
    console.log("🎵 Track ended, loading next...");
    loadTrack(currentIndex + 1);
    play();
  });

  audio.addEventListener("error", (e) => {
    const errorMessages = {
      1: "MEDIA_ERR_ABORTED - Loading was aborted",
      2: "MEDIA_ERR_NETWORK - Network error",
      3: "MEDIA_ERR_DECODE - Decoding error (corrupted file?)",
      4: "MEDIA_ERR_SRC_NOT_SUPPORTED - Format not supported or file not found"
    };
    const msg = errorMessages[audio.error?.code] || "Unknown error";
    console.error(`❌ Audio Error (Code ${audio.error?.code}):`, msg);
    console.error(`   Tried to load: ${audio.src}`);
  });

  // Button event listeners
  playPauseBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  playPauseBtn.addEventListener("click", () => {
    console.log("🎵 Play/pause button clicked");
    SmartKiddoSound.playClick();
    if (isPlaying) pause();
    else play();
  });

  toggleBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  toggleBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    manuallyHidden = true;
    updateBarVisibility();
    console.log("🎵 Music bar hidden");
  });

  revealBtn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  revealBtn.addEventListener("click", () => {
    SmartKiddoSound.playClick();
    manuallyHidden = false;
    updateBarVisibility();
    console.log("🎵 Music bar revealed");
  });

  // Scroll auto-hide
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

  // Retry autoplay on user interaction
  function retryAutoplayOnInteraction() {
    console.log("🎵 User interaction detected");
    if (autoplayUnlocked || !tracks.length) return;
    console.log("   Retrying autoplay...");
    play();
  }

  function init() {
    console.log("🎵 SmartKiddoMusicPlayer.init() called");
    attachScrollAutoHide();

    fetch("assets/audio/music/playlist.json")
      .then((res) => {
        console.log(`🎵 Fetching playlist.json... HTTP ${res.status}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        tracks = (data && data.tracks) || [];
        console.log(`🎵 Playlist loaded with ${tracks.length} track(s):`);
        tracks.forEach((t, i) => console.log(`   ${i + 1}. ${t}`));
        
        if (!tracks.length) {
          console.warn("⚠️ No tracks in playlist.json");
          bar.hidden = true;
          revealBtn.hidden = true;
          return;
        }
        
        bar.hidden = false;
        updateBarVisibility();
        loadTrack(0);
        
        // Attach retry listeners AFTER tracks loaded
        document.addEventListener("click", retryAutoplayOnInteraction, { once: true });
        document.addEventListener("touchstart", retryAutoplayOnInteraction, { once: true, passive: true });
        
        // Try autoplay
        console.log("🎵 Attempting autoplay...");
        play();
      })
      .catch((err) => {
        console.error("❌ Failed to load playlist.json:", err.message);
        console.error("   Make sure assets/audio/music/playlist.json exists");
        bar.hidden = true;
        revealBtn.hidden = true;
      });
  }

  return { init };
})();
