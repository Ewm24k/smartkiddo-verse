/* =========================================================
   profile.js — profile page behavior
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

  let kidsData = [];
  let pendingPhotoBase64 = null; // set only if the user picks a new photo
  let existingAffiliateCode = null;

  /* ---------------- Sound wiring (same pattern as every other page) ---------------- */
  document.querySelectorAll("input, select, textarea, button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  });
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

  /* ---------------- Load existing profile data ---------------- */
  function renderKids(kids) {
    kidsData = kids || [];
    kidsList.innerHTML = "";
    kidsData.forEach((kid, i) => {
      const row = document.createElement("div");
      row.className = "profile-kid-row";
      row.innerHTML = `
        <label for="kidNick${i}">Anak ${i + 1}</label>
        <input type="text" id="kidNick${i}" data-kid-index="${i}" value="${kid.name || ""}" placeholder="Nama panggilan" />
      `;
      kidsList.appendChild(row);
      row.querySelector("input").addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      row.querySelector("input").addEventListener("input", (e) => {
        kidsData[i].name = e.target.value;
      });
    });
  }

  docRef
    .get()
    .then((doc) => {
      if (!doc.exists) {
        showSaveMessage("Tidak dapat mencari profil anda.", "error");
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
      showSaveMessage("Gagal memuatkan profil. Sila semak sambungan internet.", "error");
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
    const originalText = saveBtn.textContent;
    saveBtn.disabled = true;
    saveBtn.textContent = "Menyimpan...";

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
        showSaveMessage("Perubahan berjaya disimpan!", "success");
        saveBtn.disabled = false;
        saveBtn.textContent = originalText;
      })
      .catch((err) => {
        console.error("Profile save error:", err);
        showSaveMessage("Gagal menyimpan. Sila cuba lagi.", "error");
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
        showSaveMessage("Gagal menjana pautan. Sila cuba lagi.", "error");
      });
  });

  copyAffiliateBtn.addEventListener("click", () => {
    affiliateLinkInput.select();
    navigator.clipboard.writeText(affiliateLinkInput.value).catch(() => {
      document.execCommand("copy");
    });
  });
})();
