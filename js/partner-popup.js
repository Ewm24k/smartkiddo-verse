/* =========================================================
   partner-popup.js — Multi-Tier Affiliate tracking module
   Self-contained plug-and-play dialog system for SmartKiddo
   ========================================================= */

(function () {
  // Localization dictionary matching your active profile language
  const translations = {
    ms: {
      "title": "Rangkaian Rakan Kongsi",
      "tab-network": "Rangkaian",
      "tab-banner": "Banner Pemasaran",
      "crumb-you": "Anda",
      "loading": "Memuatkan rangkaian...",
      "no-members": "Tiada ahli didaftarkan di bawah pautan ini.",
      "col-name": "Nama Bapa & Ibu",
      "col-email": "Emel",
      "col-joined": "Tarikh Daftar",
      "col-plan": "Status Plan",
      "col-action": "Tindakan",
      "badge-free": "Free Trial",
      "badge-ruby": "Ruby",
      "badge-sapphire": "Sapphire",
      "badge-diamond": "Diamond",
      "view-sub": "Lihat Rangkaian ➔",
      "err-fetch": "Gagal mendapatkan data. Sila semak sambungan internet.",
      "banner-empty": "Kandungan banner pemasaran akan ditambah tidak lama lagi."
    },
    en: {
      "title": "Partner Network",
      "tab-network": "Network",
      "tab-banner": "Marketing Banner",
      "crumb-you": "You",
      "loading": "Loading network...",
      "no-members": "No registered members under this link.",
      "col-name": "Parent Names",
      "col-email": "Email",
      "col-joined": "Joined Date",
      "col-plan": "Plan Status",
      "col-action": "Action",
      "badge-free": "Free Trial",
      "badge-ruby": "Ruby",
      "badge-sapphire": "Sapphire",
      "badge-diamond": "Diamond",
      "view-sub": "View Network ➔",
      "err-fetch": "Failed to retrieve data. Please check internet connection.",
      "banner-empty": "Marketing banner content will be added soon."
    }
  };

  let navStack = []; // Navigation trail stack: { email, code, name }

  // Dynamic CSS injection for modern popups & tabbed controls
  const styles = `
    .partner-modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(6, 4, 12, 0.85);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .partner-modal-backdrop--active {
      opacity: 1;
    }
    .partner-modal-dialog {
      background: rgba(13, 9, 24, 0.98);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 20px;
      width: 90%;
      max-width: 680px;
      max-height: 80vh;
      display: flex;
      flex-direction: column;
      box-shadow: 0 15px 45px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2);
      transform: translateY(20px) scale(0.97);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      overflow: hidden;
    }
    .partner-modal-backdrop--active .partner-modal-dialog {
      transform: translateY(0) scale(1);
    }
    .partner-modal-header {
      padding: 18px 24px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .partner-modal-title {
      font-family: var(--font-display, "Fredoka"), sans-serif;
      font-weight: 700;
      font-size: 20px;
      color: var(--color-white, #fff);
      margin: 0;
    }
    .partner-modal-close {
      background: transparent;
      border: none;
      color: rgba(255, 255, 255, 0.5);
      font-size: 28px;
      line-height: 1;
      cursor: pointer;
      transition: color 0.15s ease;
    }
    .partner-modal-close:hover {
      color: var(--color-neon-green, #39ff88);
    }
    
    /* ---- Modal Tabs Bar ---- */
    .partner-modal-tabs {
      display: flex;
      background: rgba(255, 255, 255, 0.02);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    }
    .partner-tab-btn {
      flex: 1;
      background: transparent;
      border: none;
      border-bottom: 3px solid transparent;
      color: rgba(255, 255, 255, 0.6);
      font-family: var(--font-display, "Fredoka"), sans-serif;
      font-weight: 600;
      font-size: 14px;
      padding: 14px 0;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: center;
      outline: none;
    }
    .partner-tab-btn:hover {
      color: var(--color-white, #fff);
      background: rgba(255, 255, 255, 0.01);
    }
    .partner-tab-btn--active {
      color: var(--color-neon-green, #39ff88);
      border-bottom-color: var(--color-neon-green, #39ff88);
      font-weight: 700;
    }

    .partner-modal-crumbs {
      padding: 12px 24px;
      background: rgba(255, 255, 255, 0.01);
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      align-items: center;
      font-family: var(--font-body, "Nunito"), sans-serif;
      font-size: 13px;
      color: rgba(255, 255, 255, 0.6);
    }
    .partner-crumb-link {
      color: var(--color-neon-green, #39ff88);
      font-weight: 700;
      cursor: pointer;
      text-decoration: none;
    }
    .partner-crumb-link:hover {
      text-decoration: underline;
    }
    .partner-modal-body {
      padding: 24px;
      overflow-y: auto;
      flex: 1;
    }
    .partner-loading-spinner {
      text-align: center;
      padding: 40px 0;
      color: rgba(255, 255, 255, 0.6);
      font-family: var(--font-body, "Nunito"), sans-serif;
      font-size: 14px;
    }
    .partner-no-members {
      text-align: center;
      padding: 40px 0;
      color: rgba(255, 255, 255, 0.5);
      font-family: var(--font-body, "Nunito"), sans-serif;
      font-size: 14px;
    }
    .partner-table-container {
      width: 100%;
      overflow-x: auto;
    }
    .partner-table {
      width: 100%;
      border-collapse: collapse;
      font-family: var(--font-body, "Nunito"), sans-serif;
      text-align: left;
    }
    .partner-table th {
      font-weight: 700;
      font-size: 12px;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.5);
      padding: 10px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    .partner-table td {
      font-size: 13.5px;
      color: rgba(255, 255, 255, 0.85);
      padding: 14px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      vertical-align: middle;
    }
    .partner-row-interactive {
      cursor: pointer;
      transition: background 0.15s ease;
    }
    .partner-row-interactive:hover {
      background: rgba(57, 255, 136, 0.04);
    }
    .partner-plan-badge {
      display: inline-block;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
    }
    .badge-free { background: rgba(142, 142, 147, 0.15); color: #8e8e93; }
    .badge-ruby { background: rgba(255, 69, 58, 0.15); color: #ff453a; }
    .badge-sapphire { background: rgba(10, 132, 255, 0.15); color: #0a84ff; }
    .badge-diamond { background: rgba(191, 90, 242, 0.15); color: #bf5af2; }
    
    .partner-action-text {
      color: var(--color-neon-green, #39ff88);
      font-size: 12px;
      font-weight: 700;
    }

    /* ---- Marketing Banner Styles ---- */
    .partner-banner-placeholder {
      text-align: center;
      padding: 60px 20px;
      color: rgba(255, 255, 255, 0.45);
      font-family: var(--font-body, "Nunito"), sans-serif;
      font-size: 14px;
      line-height: 1.6;
    }
  `;

  // Dynamic style elements construction
  const styleEl = document.createElement("style");
  styleEl.textContent = styles;
  document.head.appendChild(styleEl);

  function getLocalizedText(key) {
    const activeLang = localStorage.getItem("smartkiddo_language") || "ms";
    const dict = translations[activeLang] || translations["ms"];
    return dict[key] || key;
  }

  function getDisplayName(data) {
    if (data.fatherName && data.motherName) {
      return `${data.fatherName} & ${data.motherName}`;
    }
    return data.fatherName || data.motherName || data.parentEmail.split("@")[0];
  }

  function getFormattedDate(timestamp) {
    if (!timestamp) return "-";
    const date = timestamp.toDate();
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  }

  function getPlanBadgeHTML(planVal) {
    const rawVal = (planVal || "free_trial").toLowerCase();
    let badgeClass = "badge-free";
    let textKey = "badge-free";

    if (rawVal === "ruby") {
      badgeClass = "badge-ruby";
      textKey = "badge-ruby";
    } else if (rawVal === "sapphire") {
      badgeClass = "badge-sapphire";
      textKey = "badge-sapphire";
    } else if (rawVal === "diamond") {
      badgeClass = "badge-diamond";
      textKey = "badge-diamond";
    }

    return `<span class="partner-plan-badge ${badgeClass}">${getLocalizedText(textKey)}</span>`;
  }

  function renderDialog(backdrop) {
    // Render breadcrumbs
    const crumbsContainer = backdrop.querySelector("#partnerCrumbs");
    crumbsContainer.innerHTML = "";
    navStack.forEach((node, index) => {
      if (index > 0) {
        const separator = document.createElement("span");
        separator.textContent = " > ";
        crumbsContainer.appendChild(separator);
      }

      if (index === navStack.length - 1) {
        const currentLabel = document.createElement("span");
        currentLabel.textContent = node.name;
        crumbsContainer.appendChild(currentLabel);
      } else {
        const link = document.createElement("span");
        link.className = "partner-crumb-link";
        link.textContent = node.name;
        link.addEventListener("click", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playClick();
          // Backtrack stack
          navStack = navStack.slice(0, index + 1);
          loadLevel(backdrop, node.code);
        });
        crumbsContainer.appendChild(link);
      }
    });

    const body = backdrop.querySelector("#partnerBody");
    body.innerHTML = `<div class="partner-loading-spinner">${getLocalizedText("loading")}</div>`;

    const currentActiveCode = navStack[navStack.length - 1].code;

    db.collection("signups")
      .where("referredBy", "==", currentActiveCode)
      .get()
      .then((querySnapshot) => {
        body.innerHTML = "";

        if (querySnapshot.empty) {
          body.innerHTML = `<div class="partner-no-members">${getLocalizedText("no-members")}</div>`;
          return;
        }

        const tableContainer = document.createElement("div");
        tableContainer.className = "partner-table-container";

        const table = document.createElement("table");
        table.className = "partner-table";
        table.innerHTML = `
          <thead>
            <tr>
              <th>${getLocalizedText("col-name")}</th>
              <th>${getLocalizedText("col-email")}</th>
              <th>${getLocalizedText("col-joined")}</th>
              <th>${getLocalizedText("col-plan")}</th>
              <th>${getLocalizedText("col-action")}</th>
            </tr>
          </thead>
          <tbody id="partnerTableBody"></tbody>
        `;

        tableContainer.appendChild(table);
        body.appendChild(tableContainer);

        const tbody = table.querySelector("#partnerTableBody");

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const displayName = getDisplayName(data);
          const hasAffiliate = !!data.affiliateCode;

          const tr = document.createElement("tr");
          if (hasAffiliate) {
            tr.className = "partner-row-interactive";
            // Drill down into their personal network on click
            tr.addEventListener("click", () => {
              if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playClick();
              navStack.push({
                email: data.parentEmail,
                code: data.affiliateCode,
                name: displayName
              });
              loadLevel(backdrop, data.affiliateCode);
            });
            tr.addEventListener("mouseenter", () => {
              if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playHover();
            });
          }

          tr.innerHTML = `
            <td>${displayName}</td>
            <td style="font-family: monospace; opacity: 0.8;">${data.parentEmail}</td>
            <td>${getFormattedDate(data.createdAt)}</td>
            <td>${getPlanBadgeHTML(data.plan)}</td>
            <td>${hasAffiliate ? `<span class="partner-action-text">${getLocalizedText("col-action") === "Tindakan" ? "Lihat Ahli ➔" : "View Members ➔"}</span>` : "-"}</td>
          `;

          tbody.appendChild(tr);
        });
      })
      .catch((err) => {
        console.error("Firestore loading error:", err);
        body.innerHTML = `<div class="partner-no-members" style="color: #ff453a;">${getLocalizedText("err-fetch")}</div>`;
      });
  }

  function loadLevel(backdrop, code) {
    renderDialog(backdrop);
  }

  // Exposed module endpoints
  window.PartnerPopup = {
    open: function (userEmail, affiliateCode) {
      // Build visual DOM nodes if not present on current page
      let backdrop = document.getElementById("partnerModalBackdrop");
      if (!backdrop) {
        backdrop = document.createElement("div");
        backdrop.id = "partnerModalBackdrop";
        backdrop.className = "partner-modal-backdrop";
        backdrop.innerHTML = `
          <div class="partner-modal-dialog">
            <div class="partner-modal-header">
              <h2 class="partner-modal-title" id="partnerTitle"></h2>
              <button class="partner-modal-close" id="partnerCloseBtn">&times;</button>
            </div>
            
            <!-- Dynamic Tab Bar Header -->
            <div class="partner-modal-tabs">
              <button class="partner-tab-btn partner-tab-btn--active" id="partnerTabNetwork"></button>
              <button class="partner-tab-btn" id="partnerTabBanner"></button>
            </div>

            <!-- Tab Panel 1: Network Trace (Default) -->
            <div id="partnerNetworkPanel">
              <div class="partner-modal-crumbs" id="partnerCrumbs"></div>
              <div class="partner-modal-body" id="partnerBody"></div>
            </div>

            <!-- Tab Panel 2: Marketing Banner (Initially Hidden) -->
            <div id="partnerBannerPanel" class="partner-modal-body" hidden>
              <div class="partner-banner-placeholder" id="partnerBannerPlaceholder"></div>
            </div>
          </div>
        `;
        document.body.appendChild(backdrop);

        const tabNetwork = backdrop.querySelector("#partnerTabNetwork");
        const tabBanner = backdrop.querySelector("#partnerTabBanner");
        const networkPanel = backdrop.querySelector("#partnerNetworkPanel");
        const bannerPanel = backdrop.querySelector("#partnerBannerPanel");

        // Tab Switching Event Listeners with Click/Hover sounds
        tabNetwork.addEventListener("click", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playClick();
          tabNetwork.classList.add("partner-tab-btn--active");
          tabBanner.classList.remove("partner-tab-btn--active");
          networkPanel.hidden = false;
          bannerPanel.hidden = true;
        });
        tabNetwork.addEventListener("mouseenter", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playHover();
        });

        tabBanner.addEventListener("click", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playClick();
          tabBanner.classList.add("partner-tab-btn--active");
          tabNetwork.classList.remove("partner-tab-btn--active");
          networkPanel.hidden = true;
          bannerPanel.hidden = false;
        });
        tabBanner.addEventListener("mouseenter", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playHover();
        });

        backdrop.querySelector("#partnerCloseBtn").addEventListener("click", () => {
          if (typeof SmartKiddoSound !== "undefined") SmartKiddoSound.playClick();
          backdrop.classList.remove("partner-modal-backdrop--active");
          setTimeout(() => (backdrop.style.display = "none"), 250);
        });

        // Close on escape key
        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && backdrop.style.display !== "none") {
            backdrop.classList.remove("partner-modal-backdrop--active");
            setTimeout(() => (backdrop.style.display = "none"), 250);
          }
        });
      }

      // Sync active language titles and tab labels
      const tabNetwork = backdrop.querySelector("#partnerTabNetwork");
      const tabBanner = backdrop.querySelector("#partnerTabBanner");
      const networkPanel = backdrop.querySelector("#partnerNetworkPanel");
      const bannerPanel = backdrop.querySelector("#partnerBannerPanel");

      backdrop.querySelector("#partnerTitle").textContent = getLocalizedText("title");
      tabNetwork.textContent = getLocalizedText("tab-network");
      tabBanner.textContent = getLocalizedText("tab-banner");
      backdrop.querySelector("#partnerBannerPlaceholder").textContent = getLocalizedText("banner-empty");

      // Reset Tab Status to default (Network panel active)
      tabNetwork.classList.add("partner-tab-btn--active");
      tabBanner.classList.remove("partner-tab-btn--active");
      networkPanel.hidden = false;
      bannerPanel.hidden = true;

      // Reset Stack Trace on startup
      navStack = [
        { email: userEmail, code: affiliateCode, name: getLocalizedText("crumb-you") }
      ];

      // Reset element display styles before playing animations
      backdrop.style.display = "flex";
      
      // Request repaint to trigger transitions
      requestAnimationFrame(() => {
        backdrop.classList.add("partner-modal-backdrop--active");
      });

      loadLevel(backdrop, affiliateCode);
    }
  };
})();
