/* =========================================================
   home-dashboard.js — renders the dashboard from
   home-dashboard-data.js, and wires up tabs, carousels,
   hover/click/scroll sounds, and the "Lihat Semua" popup.
   ========================================================= */

const SmartKiddoDashboard = (() => {
  const data = SmartKiddoDashboardData;
  let activeTab = "all";

  function buildItemSrc(category, index) {
    return `${category.filePrefix}${index}${category.fileSuffix}`;
  }

  function createCard(category, index) {
    const card = document.createElement("div");
    card.className = "dash-card";

    if (category.itemType === "video") {
      const video = document.createElement("video");
      video.className = "dash-card__media";
      video.src = buildItemSrc(category, index);
      video.muted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "none";
      video.autoplay = true;
      // If the file doesn't exist yet, fail quietly instead of showing
      // a broken-video icon — just leaves the placeholder background.
      video.addEventListener("error", () => video.remove());
      card.appendChild(video);
      card.addEventListener("mouseenter", () => {
        video.play().catch(() => {});
      });
    } else {
      const img = document.createElement("img");
      img.className = "dash-card__media";
      img.src = buildItemSrc(category, index);
      img.alt = `${category.title} ${index}`;
      img.loading = "lazy";
      img.addEventListener("error", () => img.remove());
      card.appendChild(img);
    }

    card.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
    card.addEventListener("click", () => SmartKiddoSound.playClick());

    return card;
  }

  function createRow(category) {
    const row = document.createElement("section");
    row.className = "dash-row";
    row.dataset.category = category.id;
    row.dataset.tabs = category.tabs.join(",");

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
    const tabs = row.dataset.tabs.split(",");
    row.hidden = activeTab !== "all" && !tabs.includes(activeTab);
  }

  function renderTabs(container) {
    data.tabs.forEach((tab) => {
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

  function init() {
    const tabsContainer = document.getElementById("dashTabs");
    const rowsContainer = document.getElementById("dashRows");
    renderTabs(tabsContainer);
    data.categories.forEach((category) => {
      rowsContainer.appendChild(createRow(category));
    });
  }

  return { init };
})();
