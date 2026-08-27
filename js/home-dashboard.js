/* =========================================================
   home-dashboard.js — renders the dashboard from
   home-dashboard-data.js, and wires up tabs, carousels,
   hover/click/scroll sounds, and the "Lihat Semua" popup.
   
   Tabs: Selected Ages, Bedtime Story, Shop, Bonus
   Visible carousels: Selected Ages, Bedtime Story
   Collapsible: Shop, Bonus (with icon-only toggle)
   ========================================================= */

const SmartKiddoDashboard = (() => {
  const data = SmartKiddoDashboardData;
  let activeTab = "all";
  let initialized = false;

  function buildContainerMarkup() {
    return `
      <div class="dash-content">
        <!-- Layout, 16:9 4-card aspect ratio, and Badge overrides -->
        <style>
          .dash-row__track {
            display: flex !important;
            gap: 16px !important;
            overflow-x: auto !important;
            scroll-behavior: smooth !important;
            padding: 10px 4px !important;
          }
          .dash-card {
            flex: 0 0 calc((100% - 48px) / 4) !important; /* Shows exactly 4 cards by default */
            aspect-ratio: 16 / 9 !important;               /* Enforces widescreen landscape format */
            height: auto !important;                       /* Prevents height overrides from breaking layout */
            position: relative !important;
            overflow: hidden !important;
            border-radius: 12px !important;
          }
          .dash-card__media {
            width: 100% !important;
            height: 100% !important;
            object-fit: cover !important;                 /* Ensures images & videos fit cleanly without stretching */
          }
          
          /* Overlay reveals on hover or when tap active (Android/iOS) */
          .dash-card:hover .dash-card__overlay,
          .dash-card.is-hovered .dash-card__overlay {
            opacity: 1 !important;
            visibility: visible !important;
            pointer-events: auto !important;
          }
          
          /* Circular "Free" Badge (Top-Left) */
          .dash-card__badge-free {
            position: absolute !important;
            top: 10px !important;
            left: 10px !important;
            background-color: #2ec4b6 !important; /* Clean mint green circle */
            color: #ffffff !important;
            font-family: 'Fredoka', sans-serif !important;
            font-weight: 700 !important;
            font-size: 10px !important;
            width: 32px !important;
            height: 32px !important;
            border-radius: 50% !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
            z-index: 3 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          /* premium "Paid Version" Badge (Top-Left) */
          .dash-card__badge-paid {
            position: absolute !important;
            top: 10px !important;
            left: 10px !important;
            background: linear-gradient(135deg, #fff2cc 0%, #f1c40f 40%, #d4af37 70%, #996515 100%) !important;
            color: #0a0714 !important;
            font-family: 'Fredoka', sans-serif !important;
            font-weight: 800 !important;
            font-size: 9px !important;
            padding: 5px 10px !important;
            border-radius: 50px !important;
            display: inline-flex !important;
            align-items: center !important;
            justify-content: center !important;
            box-shadow: 0 4px 15px rgba(212, 175, 55, 0.5) !important;
            border: 1px solid #ffffffa0 !important;
            z-index: 3 !important;
            text-transform: uppercase !important;
            letter-spacing: 0.5px !important;
          }
          
          /* "EN" Tag (Top-Right) */
          .dash-card__badge-en {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            background-color: rgba(10, 7, 20, 0.8) !important; /* Dark theme matching cosmos color palette */
            border: 1.5px solid #3c2a6b !important;
            color: #ff914d !important; /* Vibrant orange accent */
            font-family: 'Fredoka', sans-serif !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            padding: 3px 8px !important;
            border-radius: 6px !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
            z-index: 3 !important;
          }
          
          /* "MY" Tag (Top-Right) */
          .dash-card__badge-my {
            position: absolute !important;
            top: 10px !important;
            right: 10px !important;
            background-color: rgba(10, 7, 20, 0.8) !important;
            border: 1.5px solid #4a90e2 !important; /* Royal blue border matching premium styling */
            color: #ffffff !important;
            font-family: 'Fredoka', sans-serif !important;
            font-weight: 700 !important;
            font-size: 11px !important;
            padding: 3px 8px !important;
            border-radius: 6px !important;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.4) !important;
            z-index: 3 !important;
          }

          /* --- UPGRADED MODERN RECTANGLE DROPDOWN STYLING --- */
          .dash-rows-toggle-wrap {
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            margin: 36px 0 20px 0 !important;
            width: 100% !important;
          }
          .dash-rows-toggle {
            background: linear-gradient(135deg, #1d143a 0%, #0f0a25 100%) !important;
            border: 2px solid #3c2a6b !important;
            color: #ffffff !important;
            font-family: 'Fredoka', sans-serif !important;
            font-weight: 600 !important;
            font-size: 15px !important;
            padding: 12px 36px !important;
            border-radius: 6px !important; /* Sharp, modern rectangle style */
            cursor: pointer !important;
            display: inline-flex !important;
            align-items: center !important;
            gap: 12px !important;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4) !important;
            transition: all 0.25s ease-in-out !important;
            outline: none !important;
          }
          
          /* Hover Animation with high contrast neon accent styling */
          .dash-rows-toggle:hover {
            border-color: #ff914d !important;
            background: #ff914d !important; /* Elegant orange solid-state trigger */
            color: #0a0714 !important;      /* Sharp contrast dark text */
            box-shadow: 0 6px 24px rgba(255, 145, 77, 0.4) !important;
            transform: translateY(-2px) !important;
          }
          .dash-rows-toggle:hover .dash-rows-toggle__icon {
            color: #0a0714 !important;
          }
          
          .dash-rows-toggle__text {
            letter-spacing: 0.5px !important;
          }
          .dash-rows-toggle__icon {
            display: inline-block !important;
            font-size: 16px !important;
            transition: transform 0.25s ease-in-out !important;
          }
          .dash-rows-toggle.is-expanded .dash-rows-toggle__icon {
            transform: rotate(180deg) !important; /* Flips arrow up */
          }
          .dash-rows-toggle.is-expanded {
            border-color: #ff914d !important;
          }
          
          /* Responsive adjustments for tablets and mobile devices */
          @media (max-width: 1024px) {
            .dash-card {
              flex: 0 0 calc((100% - 32px) / 3) !important; /* Shows 3 cards on tablet viewports */
            }
          }
          @media (max-width: 768px) {
            .dash-card {
              flex: 0 0 calc((100% - 16px) / 2) !important; /* Shows 2 cards on mobile viewports */
            }
            .dash-rows-toggle {
              font-size: 13px !important;
              padding: 10px 24px !important;
            }
          }
        </style>

        <section class="hero2">
          <div class="hero2__text">
            <video class="hero2__text-bg" src="assets/videos/main-video.mp4" autoplay muted loop playsinline></video>
            <div class="hero2__text-dark" aria-hidden="true"></div>
            <h2 class="hero2__heading" id="hero2Heading"><span class="hero2__heading-typed"></span><span class="hero2__heading-cursor"></span></h2>
          </div>
          <div class="hero2__video">
            <video class="hero2__video-el" src="assets/videos/header-home.mp4" autoplay muted loop playsinline></video>
            <div class="hero2__blend" aria-hidden="true"></div>
          </div>
        </section>
        <nav id="dashTabs" class="dash-tabs" role="tablist"></nav>
        <div id="dashRows" class="dash-rows"></div>
      </div>
    `;
  }

  const HERO2_PHRASES = [
    "SmartKiddo Verse: Your Child's Learning Journey",
    "Where Learning Feels Like Play",
    "Fun, Safe & Smart Learning for Every Child",
  ];

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function runHero2TextLoop(container) {
    const heading = container.querySelector("#hero2Heading");
    const typedEl = heading.querySelector(".hero2__heading-typed");
    let phraseIndex = 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const text = HERO2_PHRASES[phraseIndex];
      heading.classList.remove("is-looping", "is-fading-out");

      for (let i = 0; i <= text.length; i++) {
        typedEl.textContent = text.slice(0, i);
        await wait(35);
      }

      heading.classList.add("is-looping"); // gentle idle float while it holds
      await wait(2600);

      heading.classList.add("is-fading-out");
      await wait(450);

      typedEl.textContent = "";
      heading.classList.remove("is-fading-out", "is-looping");
      phraseIndex = (phraseIndex + 1) % HERO2_PHRASES.length;
      await wait(150);
    }
  }

  // Resolves the file source path dynamically per item or falls back to category defaults
  function buildItemSrc(category, index) {
    const itemConfig = (category.items && category.items[index - 1]) || {};
    const suffix = itemConfig.suffix || category.fileSuffix;
    return `${category.filePrefix}${index}${suffix}`;
  }

  // Resolves poster source dynamically for video cards
  function buildPosterSrc(category, index) {
    const itemConfig = (category.items && category.items[index - 1]) || {};
    const posterSuffix = itemConfig.posterSuffix || category.posterSuffix;
    if (!posterSuffix) return null;
    const prefix = category.posterPrefix || category.filePrefix;
    return `${prefix}${index}${posterSuffix}`;
  }

  // Shared observer: only actually play a card's video while it's near
  // the viewport, and pause it once it scrolls away. With 50+ video
  // cards on the page, having them all try to decode/play at once is
  // exactly what was making scrolling feel heavy — this fixes that.
  const cardVideoObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const video = entry.target.querySelector("video.dash-card__media");
        if (!video) return;
        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    { root: null, rootMargin: "200px", threshold: 0.2 }
  );

  function createCard(category, index) {
    const card = document.createElement("div");
    card.className = "dash-card";

    // Append visual badges to bedtime story cards dynamically
    if (category.id === "bedtime") {
      if (index === 1 || index === 2 || index === 3) {
        // Free Cards (1, 2, 3)
        const freeBadge = document.createElement("div");
        freeBadge.className = "dash-card__badge-free";
        freeBadge.textContent = "Free";
        card.appendChild(freeBadge);

        const enBadge = document.createElement("div");
        enBadge.className = "dash-card__badge-en";
        enBadge.textContent = "EN";
        card.appendChild(enBadge);
      } else if (index === 4) {
        // Paid Premium Card (4)
        const paidBadge = document.createElement("div");
        paidBadge.className = "dash-card__badge-paid";
        paidBadge.textContent = "Paid Version";
        card.appendChild(paidBadge);

        const myBadge = document.createElement("div");
        myBadge.className = "dash-card__badge-my";
        myBadge.textContent = "MY";
        card.appendChild(myBadge);
      }
    }

    // Determine item media type dynamically (individually or fall back to category level)
    const itemConfig = (category.items && category.items[index - 1]) || {};
    const currentItemType = itemConfig.type || category.itemType;

    if (currentItemType === "video") {
      const video = document.createElement("video");
      video.className = "dash-card__media";
      video.src = buildItemSrc(category, index);

      // Apply the poster image before the video playback loads
      const posterSrc = buildPosterSrc(category, index);
      if (posterSrc) {
        video.poster = posterSrc;
      }

      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      // Playback is controlled by cardVideoObserver below
      video.addEventListener("error", () => {
        if (video.poster) {
          const fallbackImg = document.createElement("img");
          fallbackImg.className = "dash-card__media";
          fallbackImg.src = video.poster;
          fallbackImg.alt = `${category.title} ${index}`;
          fallbackImg.loading = "lazy";
          if (video.parentNode) {
            video.parentNode.replaceChild(fallbackImg, video);
          }
        } else {
          video.remove();
        }
      });
      card.appendChild(video);
      cardVideoObserver.observe(card);
    } else {
      const img = document.createElement("img");
      img.className = "dash-card__media";
      img.src = buildItemSrc(category, index);
      img.alt = `${category.title} ${index}`;
      img.loading = "lazy";
      img.addEventListener("error", () => img.remove());
      card.appendChild(img);
    }

    // Center overlay shown on hover
    const overlay = document.createElement("div");
    overlay.className = "dash-card__overlay";

    // Retrieve the target link if specified in the data structure
    const targetLink = (category.links && category.links[index - 1]) || null;

    // Evaluates item launch state safely by handling array or boolean inputs
    const isItemLaunched = Array.isArray(category.launched)
      ? !!category.launched[index - 1]
      : !!category.launched;

    if (isItemLaunched) {
      const ageLabel = (category.ageLabels && category.ageLabels[index - 1]) || "";
      const overlayBtnText = category.id === "shop" ? "Lihat Produk" : "Masuk Kelas";
      overlay.innerHTML = `
        <span class="dash-card__overlay-label">${category.title.split(" / ")[0]} ${ageLabel}</span>
        <button type="button" class="dash-card__overlay-btn">${overlayBtnText}</button>
      `;
      overlay.querySelector(".dash-card__overlay-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents touch parent overlay toggle off
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        if (targetLink) {
          window.location.href = targetLink;
        } else {
          console.log(`Masuk Kelas: ${category.title} — item ${index} (${ageLabel})`);
        }
      });
    } else {
      overlay.innerHTML = `<span class="dash-card__overlay-badge">Very Soon Launching</span>`;
    }
    card.appendChild(overlay);

    card.addEventListener("mouseenter", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playHover();
    });
    
    // Touch Interaction (Android/iOS): Click reveals hover overlay controls instead of triggering navigation
    card.addEventListener("click", (e) => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      
      const isHovered = card.classList.contains("is-hovered");
      
      // Close other card overlays
      document.querySelectorAll(".dash-card.is-hovered").forEach(c => {
        if (c !== card) c.classList.remove("is-hovered");
      });

      if (!isHovered) {
        card.classList.add("is-hovered");
      } else {
        card.classList.remove("is-hovered");
      }
    });

    return card;
  }

  // --- UPGRADED RECTANGLE DROPDOWN COMPONENT ---
  function createRowsToggle() {
    const wrap = document.createElement("div");
    wrap.className = "dash-rows-toggle-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dash-rows-toggle";
    btn.setAttribute("aria-label", "Terokai bahagian kedai");
    
    btn.innerHTML = `
      <span class="dash-rows-toggle__text">Go Shop</span>
      <span class="dash-rows-toggle__icon">⌄</span>
    `;

    let isExpanded = false;

    btn.addEventListener("mouseenter", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playHover();
    });
    btn.addEventListener("click", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      const extraWrap = document.getElementById("dashRowsExtra");
      if (!extraWrap) return;

      isExpanded = !isExpanded;
      extraWrap.hidden = !isExpanded;
      btn.classList.toggle("is-expanded", isExpanded);

      // Dynamic text update based on open/close states
      const textEl = btn.querySelector(".dash-rows-toggle__text");
      if (isExpanded) {
        textEl.textContent = "Close Shop";
      } else {
        textEl.textContent = "Go Shop";
      }

      // Collapsing: scroll gracefully
      if (!isExpanded) {
        const scrollEl = document.querySelector(".dash-content");
        if (scrollEl) scrollEl.scrollTo({ top: 0, behavior: "smooth" });
      }
    });

    wrap.appendChild(btn);
    return wrap;
  }

  function createRow(category) {
    const row = document.createElement("section");
    row.className = "dash-row";
    row.dataset.category = category.id;

    const header = document.createElement("div");
    header.className = "dash-row__header";
    header.innerHTML = `
      <h3 class="dash-row__title">${category.title}</h3>
      <button class="dash-row__seeall" type="button">Lihat Semua / See All</button>
    `;
    row.appendChild(header);

    const wrap = document.createElement("div");
    wrap.className = "dash-row__carousel-wrap";

    const leftArrow = document.createElement("button");
    leftArrow.className = "dash-row__arrow dash-row__arrow--left";
    leftArrow.setAttribute("aria-label", "Sebelum");
    leftArrow.textContent = "‹";

    const rightArrow = document.createElement("button");
    rightArrow.className = "dash-row__arrow dash-row__arrow--right";
    rightArrow.setAttribute("aria-label", "Seterusnya");
    rightArrow.textContent = "›";

    const track = document.createElement("div");
    track.className = "dash-row__track";

    for (let i = 1; i <= category.itemCount; i++) {
      track.appendChild(createCard(category, i));
    }

    leftArrow.addEventListener("click", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" });
    });
    rightArrow.addEventListener("click", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
    });

    // Throttled scroll sound while dragging/swiping the row itself
    let scrollSoundReady = true;
    track.addEventListener(
      "scroll",
      () => {
        if (!scrollSoundReady) return;
        scrollSoundReady = false;
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playScroll();
        setTimeout(() => (scrollSoundReady = true), 250);
      },
      { passive: true }
    );

    wrap.appendChild(leftArrow);
    wrap.appendChild(track);
    wrap.appendChild(rightArrow);
    row.appendChild(wrap);

    header.querySelector(".dash-row__seeall").addEventListener("click", () => {
      if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
      openSeeAll(category);
    });

    applyTabVisibility(row);
    return row;
  }

  function applyTabVisibility(row) {
    row.hidden = activeTab !== "all" && row.dataset.category !== activeTab;
  }

  function renderTabs(container) {
    const tabList = [{ id: "all", label: "All" }, ...data.categories.map((c) => ({ id: c.id, label: c.tabLabel }))];

    tabList.forEach((tab) => {
      const btn = document.createElement("button");
      btn.className = "dash-tab" + (tab.id === "all" ? " is-active" : "");
      btn.textContent = tab.label;
      btn.dataset.tab = tab.id;
      btn.addEventListener("mouseenter", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playHover();
      });
      btn.addEventListener("click", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        activeTab = tab.id;
        container.querySelectorAll(".dash-tab").forEach((el) => {
          el.classList.toggle("is-active", el === btn);
        });
        document.querySelectorAll(".dash-row").forEach(applyTabVisibility);

        const extraWrap = document.getElementById("dashRowsExtra");
        if (extraWrap) {
          const hasVisibleInsideExtra = Array.from(extraWrap.querySelectorAll(".dash-row")).some(
            (r) => !r.hidden
          );
          if (hasVisibleInsideExtra && extraWrap.hidden) {
            extraWrap.hidden = false;
            const toggleBtn = document.querySelector(".dash-rows-toggle");
            if (toggleBtn) toggleBtn.classList.add("is-expanded");
          }
        }
      });
      container.appendChild(btn);
    });
  }

  /* ---------------- "Lihat Semua / See All" popup ---------------- */
  const popup = document.getElementById("rowPopup");
  const popupTitle = document.getElementById("rowPopupTitle");
  const popupGrid = document.getElementById("rowPopupGrid");
  const popupClose = document.getElementById("rowPopupClose");

  function openSeeAll(category) {
    popupTitle.textContent = category.title;
    popupGrid.innerHTML = "";
    for (let i = 1; i <= category.itemCount; i++) {
      popupGrid.appendChild(createCard(category, i));
    }
    popup.hidden = false;
  }

  popupClose.addEventListener("mouseenter", () => {
    if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playHover();
  });
  popupClose.addEventListener("click", () => {
    if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
    popup.hidden = true;
  });

  function init(containerId) {
    if (initialized) return;
    initialized = true;

    const container = document.getElementById(containerId || "homeMain");
    if (!container) return;
    container.innerHTML = buildContainerMarkup();

    const tabsContainer = container.querySelector("#dashTabs");
    const rowsContainer = container.querySelector("#dashRows");
    renderTabs(tabsContainer);

    data.categories.forEach((category) => {
      const row = createRow(category);
      if (!category.collapsible) {
        rowsContainer.appendChild(row);
      } else {
        let extraWrap = document.getElementById("dashRowsExtra");
        if (!extraWrap) {
          rowsContainer.appendChild(createRowsToggle());
          extraWrap = document.createElement("div");
          extraWrap.id = "dashRowsExtra";
          extraWrap.className = "dash-rows-extra";
          extraWrap.hidden = true;
          rowsContainer.appendChild(extraWrap);
        }
        extraWrap.appendChild(row);
      }
    });

    runHero2TextLoop(container);

    const aiFab = document.getElementById("aiFab");
    if (aiFab) {
      aiFab.addEventListener("mouseenter", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playHover();
      });
      aiFab.addEventListener("click", () => {
        if (typeof SmartKiddoSound !== 'undefined') SmartKiddoSound.playClick();
        console.log("AI assistant: coming soon.");
      });
    }

    document.addEventListener("click", (e) => {
      if (!e.target.closest(".dash-card")) {
        document.querySelectorAll(".dash-card.is-hovered").forEach(c => {
          c.classList.remove("is-hovered");
        });
      }
    });
  }

  return { init };
})();
