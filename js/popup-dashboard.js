/* =========================================================
   popup-dashboard.js — renders an interactive "What's New"
   popup carousel after the homepage loads.
   
   Supports:
   - Images (.jpg, .png) and Videos (.mp4 with autoplay/loop)
   - Landscape (16:9) aspect ratios matching 1920x1080 format
   - Touch-swiping on Android/iOS and Click navigation on PC
   ========================================================= */

const SmartKiddoPopup = (() => {
  // Directory & files configuration
  const config = {
    folderPath: "assets/images/dashboard/popup/",
    // Declare the filenames you upload. The script supports both image and video files.
    files: ["popup1.jpg", "popup2.jpg", "popup3.jpg"] 
  };

  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  function isVideo(fileName) {
    return fileName.toLowerCase().endsWith('.mp4');
  }

  function buildPopupStyle() {
    return `
      <style>
        .sk-popup-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(10, 7, 20, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.4s ease, visibility 0.4s ease;
        }
        .sk-popup-backdrop.is-active {
          opacity: 1;
          visibility: visible;
        }
        .sk-popup-modal {
          background-color: #1a152e;
          border: 2px solid #3c2a6b;
          border-radius: 16px;
          width: 95%;        /* Increased width to utilize mobile screen boundaries fully on Android/iOS */
          max-width: 840px;  /* Significantly larger size for desktop/PC viewports */
          max-height: 85vh;  /* Mobile viewport safe-zone constraint to prevent notch cutoff */
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.6);
          position: relative;
          overflow: hidden;
          transform: scale(0.85) translateY(20px);
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
          display: flex;
          flex-direction: column;
        }
        .sk-popup-backdrop.is-active .sk-popup-modal {
          transform: scale(1) translateY(0);
        }
        
        /* Modern Header panel */
        .sk-popup-header {
          padding: 16px 20px;
          border-bottom: 1px solid #3c2a6b;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #130f24;
        }
        .sk-popup-title {
          font-family: 'Fredoka', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #ff914d;
          margin: 0;
          letter-spacing: 0.5px;
        }
        .sk-popup-close-btn {
          background: none;
          border: none;
          color: #b0a8c9;
          font-size: 32px;
          font-weight: bold;
          line-height: 1;
          cursor: pointer;
          transition: color 0.2s, transform 0.2s;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .sk-popup-close-btn:hover {
          color: #ff914d;
          transform: scale(1.1);
        }
        
        /* Media Slide area styled to match 1920x1080 (16:9) exactly */
        .sk-popup-carousel-container {
          position: relative;
          width: 100%;
          aspect-ratio: 16 / 9; /* Enforces perfect 16:9 aspect ratio */
          max-height: 50vh;     /* Limits height on small/landscape mobile devices */
          background-color: #0d0a1b;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .sk-popup-track {
          display: flex;
          width: 100%;
          height: 100%;
          transition: transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sk-popup-slide {
          min-width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-sizing: border-box;
          position: relative;
        }
        .sk-popup-media {
          width: 100% !important;
          height: 100% !important;
          object-fit: cover !important; /* Crops & fills the 16:9 boundary perfectly, removing blank top/bottom spaces */
        }
        
        /* Action Arrows (desktop only) */
        .sk-popup-arrow {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background-color: rgba(26, 21, 46, 0.85);
          border: 1.5px solid #3c2a6b;
          color: #ff914d;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Fredoka', sans-serif;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s;
          box-shadow: 0 4px 10px rgba(0,0,0,0.4);
        }
        .sk-popup-arrow:hover {
          background-color: #ff914d;
          color: #0a0714;
          border-color: #ff914d;
          transform: translateY(-50%) scale(1.05);
        }
        .sk-popup-arrow--left {
          left: 12px;
        }
        .sk-popup-arrow--right {
          right: 12px;
        }
        
        /* Indicators Dots area */
        .sk-popup-indicators {
          display: flex;
          justify-content: center;
          gap: 10px;
          padding: 16px;
          background-color: #130f24;
          border-top: 1px solid #3c2a6b;
        }
        .sk-popup-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background-color: #3c2a6b;
          cursor: pointer;
          transition: background-color 0.3s, transform 0.3s;
        }
        .sk-popup-dot.is-active {
          background-color: #ff914d;
          transform: scale(1.2);
        }

        /* --- LANDSCAPE MOBILE SAFE-ZONE OVERRIDES --- */
        @media (max-height: 600px) {
          .sk-popup-modal {
            max-height: 95vh !important;
            width: 90% !important; /* Slightly narrower in landscape mode to accommodate horizontal viewport bounds */
          }
          .sk-popup-carousel-container {
            aspect-ratio: auto !important; /* Temporarily suspends aspect-ratio locking in small landscape screens */
            height: 180px !important;
          }
          .sk-popup-header {
            padding: 8px 16px !important;
          }
          .sk-popup-title {
            font-size: 16px !important;
          }
          .sk-popup-close-btn {
            font-size: 24px !important;
          }
          .sk-popup-indicators {
            padding: 10px !important;
          }
        }
      </style>
    `;
  }

  function buildModalMarkup() {
    const hasMultiple = config.files.length > 1;
    
    // Generate slides HTML
    let slidesHtml = "";
    config.files.forEach((file) => {
      const fileSrc = `${config.folderPath}${file}`;
      slidesHtml += `<div class="sk-popup-slide">`;
      if (isVideo(file)) {
        slidesHtml += `
          <video class="sk-popup-media" src="${fileSrc}" autoplay muted loop playsinline></video>
        `;
      } else {
        slidesHtml += `
          <img class="sk-popup-media" src="${fileSrc}" alt="What's New Slide" loading="lazy" />
        `;
      }
      slidesHtml += `</div>`;
    });

    // Generate dots indicators HTML
    let dotsHtml = "";
    if (hasMultiple) {
      config.files.forEach((_, idx) => {
        dotsHtml += `<div class="sk-popup-dot ${idx === 0 ? 'is-active' : ''}" data-idx="${idx}"></div>`;
      });
    }

    return `
      <div id="skPopupBackdrop" class="sk-popup-backdrop">
        <div class="sk-popup-modal">
          <header class="sk-popup-header">
            <h2 class="sk-popup-title">Whats New ?</h2>
            <button id="skPopupClose" class="sk-popup-close-btn" aria-label="Tutup">&times;</button>
          </header>
          
          <div class="sk-popup-carousel-container" id="skPopupCarousel">
            ${hasMultiple ? `<button id="skPopupPrev" class="sk-popup-arrow sk-popup-arrow--left" aria-label="Sebelum">‹</button>` : ''}
            <div class="sk-popup-track" id="skPopupTrack">
              ${slidesHtml}
            </div>
            ${hasMultiple ? `<button id="skPopupNext" class="sk-popup-arrow sk-popup-arrow--right" aria-label="Seterusnya">›</button>` : ''}
          </div>
          
          ${hasMultiple ? `<div class="sk-popup-indicators" id="skPopupIndicators">${dotsHtml}</div>` : ''}
        </div>
      </div>
    `;
  }

  function updateCarousel() {
    const track = document.getElementById("skPopupTrack");
    if (!track) return;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;

    // Sync indicators
    const dots = document.querySelectorAll(".sk-popup-dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentIndex);
    });

    // Conserve device battery/processing by play/pausing video objects dynamically
    const slides = track.querySelectorAll(".sk-popup-slide");
    slides.forEach((slide, idx) => {
      const video = slide.querySelector("video");
      if (video) {
        if (idx === currentIndex) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      }
    });
  }

  function handleSwipeGesture() {
    const swipeThreshold = 50; // Swipe offset threshold
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe Left -> Next Page
      if (currentIndex < config.files.length - 1) {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        currentIndex++;
        updateCarousel();
      }
    }
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe Right -> Prev Page
      if (currentIndex > 0) {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        currentIndex--;
        updateCarousel();
      }
    }
  }

  function init() {
    if (!config.files || config.files.length === 0) return;

    // Inject styles and markup templates
    const hostNode = document.createElement("div");
    hostNode.innerHTML = buildPopupStyle() + buildModalMarkup();
    document.body.appendChild(hostNode);

    const backdrop = document.getElementById("skPopupBackdrop");
    const closeBtn = document.getElementById("skPopupClose");
    const carouselContainer = document.getElementById("skPopupCarousel");

    // Close actions
    const closePopup = () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      backdrop.classList.remove("is-active");
      
      // Pause any running videos inside the modal when closing
      const videos = backdrop.querySelectorAll("video");
      videos.forEach(v => v.pause());
    };

    closeBtn.addEventListener("click", closePopup);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) closePopup();
    });

    // Wire up navigation controls if multiple files are loaded
    if (config.files.length > 1) {
      const btnPrev = document.getElementById("skPopupPrev");
      const btnNext = document.getElementById("skPopupNext");
      const indicatorsPanel = document.getElementById("skPopupIndicators");

      btnPrev.addEventListener("click", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        if (currentIndex > 0) {
          currentIndex--;
          updateCarousel();
        }
      });

      btnNext.addEventListener("click", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        if (currentIndex < config.files.length - 1) {
          currentIndex++;
          updateCarousel();
        }
      });

      indicatorsPanel.addEventListener("click", (e) => {
        if (e.target.classList.contains("sk-popup-dot")) {
          if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
          currentIndex = parseInt(e.target.dataset.idx, 10);
          updateCarousel();
        }
      });

      // Android / iOS native swipe touch event observers
      carouselContainer.addEventListener("touchstart", (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener("touchend", (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipeGesture();
      }, { passive: true });
    }

    // MODAL ACTIVATOR TRIGGER:
    // Ensures popup appears only AFTER the full page loading screen ends.
    const triggerPopupSequence = () => {
      if (backdrop.classList.contains("is-active")) return;
      backdrop.classList.add("is-active");
      updateCarousel();
    };

    const welcomeVideo = document.getElementById("homeWelcomeVideo");
    if (welcomeVideo) {
      // 1. Natural transition: wait precisely until the welcome video ends playing (about 20s)
      welcomeVideo.addEventListener("ended", () => {
        setTimeout(triggerPopupSequence, 800); // 800ms fade buffer
      });
      
      // 2. Observer transition: if loading is bypassed, skipped, or video stage is hidden early
      const videoStage = document.getElementById("homeVideoStage");
      if (videoStage) {
        const stageObserver = new MutationObserver(() => {
          const isStageHidden = window.getComputedStyle(videoStage).display === 'none' || 
                                window.getComputedStyle(videoStage).opacity === '0' || 
                                !document.body.contains(videoStage);
          if (isStageHidden) {
            setTimeout(triggerPopupSequence, 500);
            stageObserver.disconnect();
          }
        });
        stageObserver.observe(document.body, { attributes: true, childList: true, subtree: true });
        
        // 3. Safety timeout: Only trigger if loading is completely stuck, set to 25 seconds to respect the 20-second load screen
        setTimeout(() => {
          triggerPopupSequence();
          stageObserver.disconnect();
        }, 25000);
      }
    } else {
      // Fallback trigger if welcome screen is not present on DOM
      setTimeout(triggerPopupSequence, 3000);
    }
  }

  return { init };
})();
