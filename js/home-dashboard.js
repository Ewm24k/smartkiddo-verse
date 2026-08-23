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

  function buildItemSrc(category, index) {
    return `${category.filePrefix}${index}${category.fileSuffix}`;
  }

  function buildPosterSrc(category, index) {
    if (!category.posterSuffix) return null;
    const prefix = category.posterPrefix || category.filePrefix;
    return `${prefix}${index}${category.posterSuffix}`;
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

    if (category.itemType === "video") {
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
      // Playback is controlled by cardVideoObserver below (only plays
      // near the viewport) rather than the autoplay attribute, which
      // would try to start all cards at once regardless of visibility.
      // If the file doesn't exist yet, fail quietly instead of showing
      // a broken-video icon — just leaves the placeholder background.
      video.addEventListener("error", () => {
        if (video.poster) {
          // If the video file is missing but a poster exists, convert
          // the card to an img element so the preview image remains visible.
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

    // Center overlay shown on hover — "Masuk Kelas" for launched
    // categories (Selected Ages, for now), "Very Soon Launching" for everything
    // still in progress. Flip a category's "launched" flag in
    // home-dashboard-data.js once its real content is ready.
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
      overlay.innerHTML = `
        <span class="dash-card__overlay-label">${category.title.split(" / ")[0]} ${ageLabel}</span>
        <button type="button" class="dash-card__overlay-btn">Masuk Kelas</button>
      `;
      overlay.querySelector(".dash-card__overlay-btn").addEventListener("click", (e) => {
        e.stopPropagation(); // Prevents touch parent overlay toggle off
        SmartKiddoSound.playClick();
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

    card.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    
    // Touch Interaction (Android/iOS): Click reveals hover overlay controls instead of triggering navigation
    card.addEventListener("click", (e) => {
      SmartKiddoSound.playClick();
      
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

  function createRowsToggle() {
    const wrap = document.createElement("div");
    wrap.className = "dash-rows-toggle-wrap";

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "dash-rows-toggle";
    btn.setAttribute("aria-label", "Tunjuk/sembunyi lebih banyak kategori");
    btn.innerHTML = `<span class="dash-rows-toggle__icon">⌄</span>`;

    let isExpanded = false;

    btn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    btn.addEventListener("click", () => {
      SmartKiddoSound.playClick();
      const extraWrap = document.getElementById("dashRowsExtra");
      if (!extraWrap) return;

      isExpanded = !isExpanded;
      extraWrap.hidden = !isExpanded;
      btn.classList.toggle("is-expanded", isExpanded);

      // Collapsing: the content directly above the current scroll
      // position just shrank away, so reset to the top to avoid
      // leaving a blank leftover gap where the hidden rows used to be.
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
      SmartKiddoSound.playClick();
      track.scrollBy({ left: -track.clientWidth * 0.8, behavior: "smooth" });
    });
    rightArrow.addEventListener("click", () => {
      SmartKiddoSound.playClick();
      track.scrollBy({ left: track.clientWidth * 0.8, behavior: "smooth" });
    });

    // Throttled scroll sound while dragging/swiping the row itself
    let scrollSoundReady = true;
    track.addEventListener(
      "scroll",
      () => {
        if (!scrollSoundReady) return;
        scrollSoundReady = false;
        SmartKiddoSound.playScroll();
        setTimeout(() => (scrollSoundReady = true), 250);
      },
      { passive: true }
    );

    wrap.appendChild(leftArrow);
    wrap.appendChild(track);
    wrap.appendChild(rightArrow);
    row.appendChild(wrap);

    header.querySelector(".dash-row__seeall").addEventListener("click", () => {
      SmartKiddoSound.playClick();
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
      btn.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      btn.addEventListener("click", () => {
        SmartKiddoSound.playClick();
        activeTab = tab.id;
        container.querySelectorAll(".dash-tab").forEach((el) => {
          el.classList.toggle("is-active", el === btn);
        });
        document.querySelectorAll(".dash-row").forEach(applyTabVisibility);

        // If the selected tab needs to show a row that's currently
        // collapsed away, expand the section so it's actually visible.
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

  popupClose.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  popupClose.addEventListener("click", () => {
    SmartKiddoSound.playClick();
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

    data.categories.forEach((category, idx) => {
      const row = createRow(category);
      if (!category.collapsible) {
        // Visible categories: Selected Ages, Bedtime Story
        rowsContainer.appendChild(row);
      } else {
        // Collapsible categories: Bonus, Shop
        if (idx === 2) {
          // After first 2 categories, add toggle and wrapper
          rowsContainer.appendChild(createRowsToggle());
          const extraWrap = document.createElement("div");
          extraWrap.id = "dashRowsExtra";
          extraWrap.className = "dash-rows-extra";
          extraWrap.hidden = true;
          rowsContainer.appendChild(extraWrap);
        }
        document.getElementById("dashRowsExtra").appendChild(row);
      }
    });

    runHero2TextLoop(container);

    // AI button is a placeholder for now — future feature, not wired
    // to anything yet beyond feedback that it was tapped.
    const aiFab = document.getElementById("aiFab");
    if (aiFab) {
      aiFab.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      aiFab.addEventListener("click", () => {
        SmartKiddoSound.playClick();
        console.log("AI assistant: coming soon.");
      });
    }

    // Close overlays if clicking outside active cards
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
