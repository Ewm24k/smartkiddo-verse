/* =========================================================
   profile.js — profile page behavior with Modern Custom Dropdown
   Reads and writes the signup record keyed by the logged-in
   email (see the note in signup.js / auth-check.js about why
   this is keyed by email rather than a real per-user auth UID).
   ========================================================= */

(function () {
  const loggedInEmail = (localStorage.getItem("smartkiddo_logged_in_email") || "").toLowerCase();
  const docRef = db.collection("signups").doc(loggedInEmail);

  const photoPreview = document.getElementById("profilePhotoPreview");
  const photoBtn = document.getElementById("profilePhotoBtn");
  const photoInput = document.getElementById("profilePhotoInput");
  const emailInput = document.getElementById("profileEmail");
  const genderSelect = document.getElementById("profileGender");
  const bioInput = document.getElementById("profileBio");
  const kidsList = document.getElementById("profileKidsList");
  const saveBtn = document.getElementById("profileSaveBtn");
  const saveMessage = document.getElementById("profileSaveMessage");
  const generateAffiliateBtn = document.getElementById("generateAffiliateBtn");
  const affiliateLinkWrap = document.getElementById("affiliateLinkWrap");
  const affiliateLinkInput = document.getElementById("affiliateLinkInput");
  const copyAffiliateBtn = document.getElementById("copyAffiliateBtn");

  // Custom Dropdown Selectors
  const langSelector = document.getElementById("langSelector");
  const langTrigger = document.getElementById("langTrigger");
  const langActiveLabel = document.getElementById("langActiveLabel");
  const langMenu = document.getElementById("langMenu");
  const langOptions = document.querySelectorAll(".lang-selector__option");

  let kidsData = [];
  let pendingPhotoBase64 = null; // set only if the user picks a new photo
  let existingAffiliateCode = null;

  /* ---------------- Localization / Translations Dictionary ---------------- */
  const translations = {
    ms: {
      "menu-toggle-label": "Buka menu",
      "menu-close-label": "Tutup menu",
      "menu-home": "Rumah",
      "menu-profile": "Profil",
      "menu-games": "Permainan",
      "menu-achievements": "Pencapaian Saya",
      "menu-pricing": "Pricing",
      "menu-about": "Tentang Kami",
      "menu-logout": "Log Keluar 👋",
      
      "profile-title": "Profil Keluarga",
      "photo-btn-label": "Tukar gambar profil",
      "label-email": "Emel",
      "label-gender": "Jantina",
      "gender-placeholder": "Pilih jantina",
      "gender-male": "Lelaki",
      "gender-female": "Perempuan",
      "label-bio": "Bio",
      "bio-placeholder": "Ceritakan sedikit tentang keluarga anda...",
      "kids-section-title": "Nama Panggilan Anak-Anak",
      "save-btn": "Simpan Perubahan",
      "save-btn-saving": "Menyimpan...",
      
      "err-load-profile": "Gagal memuatkan profil. Sila semak sambungan internet.",
      "err-no-profile": "Tidak dapat mencari profil anda.",
      "success-save": "Perubahan berjaya disimpan!",
      "err-save": "Gagal menyimpan. Sila cuba lagi.",
      
      "kid-label-prefix": "Anak",
      "kid-placeholder": "Nama panggilan",
      
      "affiliate-title": "Jana Pautan Affiliate",
      "affiliate-hint": "Kongsi pautan ini dengan rakan — apabila mereka mendaftar, ia akan dikaitkan dengan akaun anda.",
      "affiliate-btn": "Jana Pautan",
      "copy-btn": "Salin",
      "err-affiliate": "Gagal menjana pautan. Sila cuba lagi."
    },
    en: {
      "menu-toggle-label": "Open menu",
      "menu-close-label": "Close menu",
      "menu-home": "Home",
      "menu-profile": "Profile",
      "menu-games": "Games",
      "menu-achievements": "My Achievements",
      "menu-pricing": "Pricing",
      "menu-about": "About Us",
      "menu-logout": "Log Out 👋",
      
      "profile-title": "Family Profile",
      "photo-btn-label": "Change profile photo",
      "label-email": "Email",
      "label-gender": "Gender",
      "gender-placeholder": "Select gender",
      "gender-male": "Male",
      "gender-female": "Female",
      "label-bio": "Bio",
      "bio-placeholder": "Tell us a bit about your family...",
      "kids-section-title": "Kids' Nicknames",
      "save-btn": "Save Changes",
      "save-btn-saving": "Saving...",
      
      "err-load-profile": "Failed to load profile. Please check your internet connection.",
      "err-no-profile": "Could not find your profile.",
      "success-save": "Changes saved successfully!",
      "err-save": "Failed to save. Please try again.",
      
      "kid-label-prefix": "Kid",
      "kid-placeholder": "Nickname",
      
      "affiliate-title": "Generate Affiliate Link",
      "affiliate-hint": "Share this link with friends — when they sign up, it will be linked to your account.",
      "affiliate-btn": "Generate Link",
      "copy-btn": "Copy",
      "err-affiliate": "Failed to generate link. Please try again."
    }
  };

  function getCurrentLang() {
    return localStorage.getItem("smartkiddo_language") || "ms";
  }

  function updateLanguage(lang) {
    localStorage.setItem("smartkiddo_language", lang);
    const t = translations[lang] || translations["ms"];
    
    // Sync current active selection UI state inside custom elements
    langOptions.forEach((opt) => {
      const active = opt.getAttribute("data-value") === lang;
      opt.setAttribute("aria-selected", active ? "true" : "false");
      if (active) {
        langActiveLabel.textContent = opt.textContent.trim();
      }
    });

    // Update standard static localized texts
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (t[key]) el.textContent = t[key];
    });
    
    // Update inputs and placeholders
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (t[key]) el.placeholder = t[key];
    });

    // Update attributes like aria-labels
    document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
      const parts = el.getAttribute("data-i18n-aria").split(":");
      if (parts.length === 2) {
        const attr = parts[0];
        const key = parts[1];
        if (t[key]) el.setAttribute(attr, t[key]);
      }
    });

    // Re-render child rows to switch translations
    renderKids(kidsData);
  }

  /* ---------------- Sound wiring (same pattern as every other page) ---------------- */
  function applySoundListeners() {
    document.querySelectorAll("input, select, textarea, button, a, .lang-selector__trigger, .lang-selector__option").forEach((el) => {
      if (!el.dataset.soundBound) {
        el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
        el.dataset.soundBound = "true";
      }
    });
  }

  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("click", () => SmartKiddoSound.playClick());
  });

  let scrollSoundReady = true;
  document.getElementById("profileMain").addEventListener(
    "scroll",
    () => {
      if (!scrollSoundReady) return;
      scrollSoundReady = false;
      SmartKiddoSound.playScroll();
      setTimeout(() => (scrollSoundReady = true), 250);
    },
    { passive: true }
  );

  /* ---------------- Custom Language Selector Logic ---------------- */
  function openDropdown() {
    langSelector.classList.add("lang-selector--active");
    langTrigger.setAttribute("aria-expanded", "true");
    langMenu.removeAttribute("hidden");
  }

  function closeDropdown() {
    langSelector.classList.remove("lang-selector--active");
    langTrigger.setAttribute("aria-expanded", "false");
    langMenu.setAttribute("hidden", "true");
  }

  langTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    SmartKiddoSound.playClick();
    const isExpanded = langTrigger.getAttribute("aria-expanded") === "true";
    if (isExpanded) {
      closeDropdown();
    } else {
      openDropdown();
    }
  });

  langOptions.forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      SmartKiddoSound.playClick();
      const val = option.getAttribute("data-value");
      updateLanguage(val);
      closeDropdown();
    });
  });

  // Close dropdown if clicking outside the container
  document.addEventListener("click", (e) => {
    if (!langSelector.contains(e.target)) {
      closeDropdown();
    }
  });

  /* ---------------- Load existing profile data ---------------- */
  function renderKids(kids) {
    kidsData = kids || [];
    kidsList.innerHTML = "";
    
    const lang = getCurrentLang();
    const t = translations[lang] || translations["ms"];
    const labelPrefix = t["kid-label-prefix"];
    const placeholderText = t["kid-placeholder"];

    kidsData.forEach((kid, i) => {
      const row = document.createElement("div");
      row.className = "profile-kid-row";
      row.innerHTML = `
        <label for="kidNick${i}">${labelPrefix} ${i + 1}</label>
        <input type="text" id="kidNick${i}" data-kid-index="${i}" value="${kid.name || ""}" placeholder="${placeholderText}" />
      `;
      kidsList.appendChild(row);
      row.querySelector("input").addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      row.querySelector("input").addEventListener("input", (e) => {
        kidsData[i].name = e.target.value;
      });
    });
    applySoundListeners();
  }

  docRef
    .get()
    .then((doc) => {
      const lang = getCurrentLang();
      const t = translations[lang] || translations["ms"];

      if (!doc.exists) {
        showSaveMessage(t["err-no-profile"], "error");
        return;
      }
      const data = doc.data();
      emailInput.value = data.parentEmail || loggedInEmail;
      genderSelect.value = data.gender || "";
      bioInput.value = data.bio || "";
      if (data.profilePhoto) photoPreview.src = data.profilePhoto;
      renderKids(data.kids || []);
      if (data.affiliateCode) {
        existingAffiliateCode = data.affiliateCode;
        showAffiliateLink(existingAffiliateCode);
      }
    })
    .catch((err) => {
      console.error("Profile load error:", err);
      const lang = getCurrentLang();
      const t = translations[lang] || translations["ms"];
      showSaveMessage(t["err-load-profile"], "error");
    });

  /* ---------------- Photo upload: resize + compress client-side ---------------- */
  photoBtn.addEventListener("click", () => photoInput.click());

  photoInput.addEventListener("change", () => {
    const file = photoInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const size = 240; // resize to a small square so it stays well
        // under Firestore's 1MB document limit once base64-encoded
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext("2d");

        // Cover-crop to a square
        const scale = Math.max(size / img.width, size / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h);

        pendingPhotoBase64 = canvas.toDataURL("image/jpeg", 0.7);
        photoPreview.src = pendingPhotoBase64;
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });

  /* ---------------- Save changes ---------------- */
  function showSaveMessage(text, type) {
    saveMessage.hidden = false;
    saveMessage.textContent = text;
    saveMessage.className = `profile-save-message profile-save-message--${type}`;
  }

  saveBtn.addEventListener("click", () => {
    const lang = getCurrentLang();
    const t = translations[lang] || translations["ms"];

    const originalText = t["save-btn"];
    saveBtn.disabled = true;
    saveBtn.textContent = t["save-btn-saving"];

    const updates = {
      parentEmail: emailInput.value.trim().toLowerCase(),
      gender: genderSelect.value,
      bio: bioInput.value.trim(),
      kids: kidsData,
    };
    if (pendingPhotoBase64) {
      updates.profilePhoto = pendingPhotoBase64;
    }

    docRef
      .update(updates)
      .then(() => {
        showSaveMessage(t["success-save"], "success");
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
      })
      .catch((err) => {
        console.error("Profile save error:", err);
        showSaveMessage(t["err-save"], "error");
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
      });
  });

  /* ---------------- Affiliate link ---------------- */
  function showAffiliateLink(code) {
    const link = `${window.location.origin}${window.location.pathname.replace("profile.html", "signup.html")}?ref=${code}`;
    affiliateLinkInput.value = link;
    affiliateLinkWrap.hidden = false;
  }

  function generateCode() {
    return Math.random().toString(36).slice(2, 8).toUpperCase();
  }

  generateAffiliateBtn.addEventListener("click", () => {
    if (existingAffiliateCode) {
      showAffiliateLink(existingAffiliateCode);
      return;
    }
    const code = generateCode();
    docRef
      .update({ affiliateCode: code })
      .then(() => {
        existingAffiliateCode = code;
        showAffiliateLink(code);
      })
      .catch((err) => {
        console.error("Affiliate code save error:", err);
        const lang = getCurrentLang();
        const t = translations[lang] || translations["ms"];
        showSaveMessage(t["err-affiliate"], "error");
      });
  });

  copyAffiliateBtn.addEventListener("click", () => {
    affiliateLinkInput.select();
    navigator.clipboard.writeText(affiliateLinkInput.value).catch(() => {
      document.execCommand("copy");
    });
  });

  // Apply sounds and language settings on startup
  applySoundListeners();
  updateLanguage(getCurrentLang());
})();
