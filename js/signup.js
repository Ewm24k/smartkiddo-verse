/* =========================================================
   signup.js — dynamic kid fields, password rule validation,
   affiliate tracking, and SmartKiddoSound effects.
   ========================================================= */

(function () {
  /* ---------------- Referral Code Capture ---------------- */
  // Parse and temporarily save the referral code from the URL on landing
  const urlParams = new URLSearchParams(window.location.search);
  const refCode = urlParams.get("ref");
  if (refCode) {
    localStorage.setItem("smartkiddo_referral_cookie", refCode.trim().toUpperCase());
  }

  /* ---------------- Welcome sound (auto-plays on page load) ---------------- */
  function createSoundWithFallback(basePath, extensions) {
    const audio = new Audio();
    let index = 0;
    function tryNextExtension() {
      if (index >= extensions.length) return;
      audio.src = `${basePath}.${extensions[index]}`;
      index++;
    }
    audio.addEventListener("error", tryNextExtension);
    tryNextExtension();
    return audio;
  }

  const welcomeAudio = createSoundWithFallback("assets/audio/welcoming-parents", ["wav", "mp3"]);
  welcomeAudio.volume = 0.9;

  function tryPlayWelcome() {
    welcomeAudio.play().catch(() => {
      const playOnFirstInteraction = () => {
        welcomeAudio.play().catch(() => {});
        document.removeEventListener("click", playOnFirstInteraction);
        document.removeEventListener("touchstart", playOnFirstInteraction);
      };
      document.addEventListener("click", playOnFirstInteraction, { once: true });
      document.addEventListener("touchstart", playOnFirstInteraction, { once: true, passive: true });
    });
  }
  tryPlayWelcome();

  const form = document.getElementById("signupForm");
  const kidsCountInput = document.getElementById("kidsCount");
  const kidsContainer = document.getElementById("kidsFieldsContainer");
  const passwordInput = document.getElementById("signupPassword");
  const passwordConfirmInput = document.getElementById("signupPasswordConfirm");
  const checklist = document.getElementById("passwordChecklist");
  const errorBox = document.getElementById("signupError");

  /* ---------------- Sounds: hover + click, reused from sound.js ---------------- */
  document.querySelectorAll("input, select, button, a").forEach((el) => {
    el.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
  });
  document.querySelectorAll("button, a").forEach((el) => {
    el.addEventListener("click", () => SmartKiddoSound.playClick());
  });

  // Throttled scroll sound
  let scrollSoundReady = true;
  document.body.addEventListener(
    "scroll",
    () => {
      if (!scrollSoundReady) return;
      scrollSoundReady = false;
      SmartKiddoSound.playScroll();
      setTimeout(() => {
        scrollSoundReady = true;
      }, 250);
    },
    { passive: true }
  );

  /* ---------------- Dynamic kid name/age fields ---------------- */
  let savedKids = []; 

  function renderKidFields() {
    const count = Math.min(Math.max(parseInt(kidsCountInput.value, 10) || 0, 0), 6);
    kidsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const existing = savedKids[i] || { name: "", age: "", gender: "" };

      const card = document.createElement("div");
      card.className = "signup-kid-card";
      card.innerHTML = `
        <span class="signup-kid-card__label">Anak ${i + 1}</span>
        <div class="signup-field">
          <label for="kidName${i}">Nama Anak</label>
          <input type="text" id="kidName${i}" data-kid-index="${i}" data-kid-field="name"
                 placeholder="Nama penuh anak" value="${existing.name}" required />
        </div>
        <div class="signup-field">
          <label for="kidAge${i}">Umur</label>
          <input type="number" id="kidAge${i}" data-kid-index="${i}" data-kid-field="age"
                 min="0" max="18" placeholder="Umur" value="${existing.age}" required />
        </div>
        <div class="signup-field">
          <label for="kidGender${i}">Jantina</label>
          <select id="kidGender${i}" data-kid-index="${i}" data-kid-field="gender" required>
            <option value="" disabled ${existing.gender ? "" : "selected"}>Pilih jantina</option>
            <option value="Lelaki" ${existing.gender === "Lelaki" ? "selected" : ""}>Lelaki</option>
            <option value="Perempuan" ${existing.gender === "Perempuan" ? "selected" : ""}>Perempuan</option>
          </select>
        </div>
      `;
      kidsContainer.appendChild(card);
    }

    // Wire sounds + change tracking on dynamic inputs
    kidsContainer.querySelectorAll("input, select").forEach((input) => {
      input.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      input.addEventListener("input", () => {
        const idx = parseInt(input.dataset.kidIndex, 10);
        const field = input.dataset.kidField;
        savedKids[idx] = savedKids[idx] || { name: "", age: "", gender: "" };
        savedKids[idx][field] = input.value;
      });
      input.addEventListener("change", () => {
        const idx = parseInt(input.dataset.kidIndex, 10);
        const field = input.dataset.kidField;
        savedKids[idx] = savedKids[idx] || { name: "", age: "", gender: "" };
        savedKids[idx][field] = input.value;
      });
    });
  }

  kidsCountInput.addEventListener("input", renderKidFields);

  /* ---------------- Password rule validation (live checklist) ---------------- */
  function checkPassword(pw) {
    const upperCount = (pw.match(/[A-Z]/g) || []).length;
    const digitCount = (pw.match(/[0-9]/g) || []).length;
    const symbolCount = (pw.match(/[^A-Za-z0-9]/g) || []).length;

    return {
      length: pw.length === 5,
      upper: upperCount === 1,
      digit: digitCount === 1,
      symbol: symbolCount === 1,
      allValid:
        pw.length === 5 && upperCount === 1 && digitCount === 1 && symbolCount === 1,
    };
  }

  function updateChecklist() {
    const result = checkPassword(passwordInput.value);
    checklist.querySelectorAll("li").forEach((li) => {
      const rule = li.dataset.rule;
      li.classList.toggle("is-met", !!result[rule]);
    });
    return result;
  }

  passwordInput.addEventListener("input", updateChecklist);

  /* ---------------- Email validation ---------------- */
  const ALLOWED_EMAIL_DOMAINS = ["gmail.com", "yahoo.com", "yahoo.com.my"];

  const parentEmailInput = document.getElementById("parentEmail");
  const parentEmailSpinner = document.getElementById("parentEmailSpinner");
  const parentEmailCheck = document.getElementById("parentEmailCheck");
  const parentEmailMessage = document.getElementById("parentEmailMessage");

  let parentEmailValid = false;
  let emailCheckToken = 0; 

  function levenshtein(a, b) {
    const m = a.length,
      n = b.length;
    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] =
          a[i - 1] === b[j - 1]
            ? dp[i - 1][j - 1]
            : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
      }
    }
    return dp[m][n];
  }

  function closestAllowedDomain(domain) {
    let best = null;
    let bestDist = Infinity;
    ALLOWED_EMAIL_DOMAINS.forEach((allowed) => {
      const dist = levenshtein(domain, allowed);
      if (dist < bestDist) {
        bestDist = dist;
        best = allowed;
      }
    });
    return { best, bestDist };
  }

  function setEmailState(state) {
    parentEmailInput.classList.remove("is-invalid", "is-valid");
    parentEmailSpinner.hidden = true;
    parentEmailCheck.hidden = true;
    if (state === "checking") parentEmailSpinner.hidden = false;
    if (state === "invalid") parentEmailInput.classList.add("is-invalid");
    if (state === "valid") {
      parentEmailInput.classList.add("is-valid");
      parentEmailCheck.hidden = false;
    }
  }

  function setEmailMessage(text, type) {
    if (!text) {
      parentEmailMessage.hidden = true;
      parentEmailMessage.innerHTML = "";
      return;
    }
    parentEmailMessage.hidden = false;
    parentEmailMessage.className = `signup-field-message signup-field-message--${type}`;
    parentEmailMessage.textContent = text;
  }

  function showEmailSuggestion(correctedEmail) {
    parentEmailMessage.hidden = false;
    parentEmailMessage.className = "signup-field-message signup-field-message--suggestion";
    parentEmailMessage.innerHTML = `Adakah anda maksudkan <strong>${correctedEmail}</strong>? <button type="button" id="emailFixBtn" class="signup-field-fixbtn">Betulkan</button>`;
    document.getElementById("emailFixBtn").addEventListener("click", () => {
      SmartKiddoSound.playClick();
      parentEmailInput.value = correctedEmail;
      validateEmailField();
    });
  }

  function validateEmailField() {
    const email = parentEmailInput.value.trim().toLowerCase();
    parentEmailValid = false;
    emailCheckToken++; 
    setEmailMessage("");
    setEmailState("idle");

    if (!email) return;

    const basicFormatOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!basicFormatOk) {
      setEmailState("invalid");
      setEmailMessage("Format emel tidak sah.", "error");
      return;
    }

    const domain = email.split("@")[1];

    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      const { best, bestDist } = closestAllowedDomain(domain);
      if (bestDist > 0 && bestDist <= 3) {
        setEmailState("invalid");
        showEmailSuggestion(email.split("@")[0] + "@" + best);
        return;
      }
      setEmailState("invalid");
      setEmailMessage("Emel mesti guna Gmail atau Yahoo sahaja. Sila tukar emel anda.", "error");
      return;
    }

    const token = emailCheckToken;
    setEmailState("checking");
    db.collection("email-lookup")
      .doc(email)
      .get()
      .then((doc) => {
        if (token !== emailCheckToken) return; 
        if (doc.exists) {
          setEmailState("invalid");
          setEmailMessage("Emel ini telah didaftarkan. Sila guna emel lain.", "error");
          parentEmailValid = false;
        } else {
          setEmailState("valid");
          setEmailMessage("");
          parentEmailValid = true;
        }
      })
      .catch((err) => {
        if (token !== emailCheckToken) return;
        console.error("Email duplicate-check error:", err);
        setEmailState("idle");
        setEmailMessage("Tidak dapat mengesahkan emel. Sila semak sambungan internet.", "error");
        parentEmailValid = false;
      });
  }

  let emailDebounceTimer = null;
  parentEmailInput.addEventListener("input", () => {
    clearTimeout(emailDebounceTimer);
    emailDebounceTimer = setTimeout(validateEmailField, 600);
  });
  parentEmailInput.addEventListener("blur", validateEmailField);

  /* ---------------- Form submit ---------------- */
  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function clearError() {
    errorBox.hidden = true;
    errorBox.textContent = "";
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();
    SmartKiddoSound.playClick();

    const fatherName = document.getElementById("fatherName").value.trim();
    const motherName = document.getElementById("motherName").value.trim();
    const parentEmail = document.getElementById("parentEmail").value.trim().toLowerCase();
    const kidsCount = parseInt(kidsCountInput.value, 10) || 0;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (!fatherName || !motherName) {
      showError("Sila isi nama bapa dan ibu.");
      return;
    }

    if (!parentEmail) {
      showError("Sila isi emel ibu bapa.");
      return;
    }

    if (!parentEmailSpinner.hidden) {
      showError("Sila tunggu sebentar — kami sedang menyemak emel anda.");
      return;
    }

    if (!parentEmailValid) {
      showError("Sila gunakan emel Gmail/Yahoo yang sah dan belum didaftarkan.");
      return;
    }

    if (kidsCount < 1) {
      showError("Sila nyatakan bilangan anak (sekurang-kurangnya 1).");
      return;
    }

    for (let i = 0; i < kidsCount; i++) {
      const kid = savedKids[i];
      if (!kid || !kid.name || !kid.name.trim() || kid.age === "" || kid.age === undefined) {
        showError(`Sila lengkapkan maklumat untuk Anak ${i + 1}.`);
        return;
      }
      if (!kid.gender) {
        showError(`Sila pilih jantina untuk Anak ${i + 1}.`);
        return;
      }
    }

    const passwordCheck = updateChecklist();
    if (!passwordCheck.allValid) {
      showError("Kata laluan mesti tepat 5 aksara: 1 huruf besar, 1 nombor, 1 simbol.");
      return;
    }

    if (password !== passwordConfirm) {
      showError("Kata laluan tidak sepadan. Sila semak semula.");
      return;
    }

    // Retrieve saved referral code from localStorage
    const referredBy = localStorage.getItem("smartkiddo_referral_cookie") || null;

    const payload = {
      fatherName,
      motherName,
      parentEmail,
      kids: savedKids.slice(0, kidsCount),
      password, 
      referredBy, // Enforce referral tracking attribution on database payload
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const submitBtn = form.querySelector(".signup-submit");
    const originalBtnText = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Menghantar...";

    const signupRef = db.collection("signups").doc(parentEmail);
    const emailLookupRef = db.collection("email-lookup").doc(parentEmail);

    db.runTransaction((transaction) => {
      return transaction.get(emailLookupRef).then((lookupDoc) => {
        if (lookupDoc.exists) {
          throw new Error("EMAIL_TAKEN");
        }
        transaction.set(emailLookupRef, {
          registeredAt: firebase.firestore.FieldValue.serverTimestamp(),
          password, 
        });
        transaction.set(signupRef, payload);
      });
    })
      .then(() => {
        localStorage.setItem("smartkiddo_logged_in_email", parentEmail);
        localStorage.removeItem("smartkiddo_referral_cookie"); // Clear the cookie upon success
        form.reset();
        savedKids = [];
        kidsContainer.innerHTML = "";
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
        SmartKiddoSuccessPopup.show();
      })
      .catch((err) => {
        if (err.message === "EMAIL_TAKEN") {
          showError("Emel ini telah didaftarkan. Sila guna emel lain.");
          setEmailState("invalid");
          setEmailMessage("Emel ini telah didaftarkan. Sila guna emel lain.", "error");
        } else {
          console.error("Firestore signup error:", err);
          showError("Pendaftaran gagal. Sila semak sambungan internet anda dan cuba lagi.");
        }
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      });
  });
})();
