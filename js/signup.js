/* =========================================================
   signup.js — dynamic kid fields, password rule validation,
   and the same SmartKiddoSound effects used across the app.
   ========================================================= */

(function () {
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

  /* ---------------- Dynamic kid name/age fields ---------------- */
  let savedKids = []; // keeps entered values if the count changes

  function renderKidFields() {
    const count = Math.min(Math.max(parseInt(kidsCountInput.value, 10) || 0, 0), 6);
    kidsContainer.innerHTML = "";

    for (let i = 0; i < count; i++) {
      const existing = savedKids[i] || { name: "", age: "" };

      const card = document.createElement("div");
      card.className = "signup-kid-card";
      card.innerHTML = `
        <span class="signup-kid-card__label">Anak ${i + 1}</span>
        <div class="signup-field">
          <label for="kidName${i}">Nama Penuh</label>
          <input type="text" id="kidName${i}" data-kid-index="${i}" data-kid-field="name"
                 placeholder="Nama penuh anak" value="${existing.name}" required />
        </div>
        <div class="signup-field">
          <label for="kidAge${i}">Umur</label>
          <input type="number" id="kidAge${i}" data-kid-index="${i}" data-kid-field="age"
                 min="0" max="18" placeholder="Umur" value="${existing.age}" required />
        </div>
      `;
      kidsContainer.appendChild(card);
    }

    // Wire sounds + change tracking on the freshly created inputs
    kidsContainer.querySelectorAll("input").forEach((input) => {
      input.addEventListener("mouseenter", () => SmartKiddoSound.playHover());
      input.addEventListener("input", () => {
        const idx = parseInt(input.dataset.kidIndex, 10);
        const field = input.dataset.kidField;
        savedKids[idx] = savedKids[idx] || { name: "", age: "" };
        savedKids[idx][field] = input.value;
      });
    });
  }

  kidsCountInput.addEventListener("input", renderKidFields);

  /* ---------------- Password rule validation (live checklist) ---------------- */
  // Rule: password must be EXACTLY 5 characters, containing exactly
  // 1 uppercase letter, 1 digit, and 1 symbol (the rest lowercase).
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
    const kidsCount = parseInt(kidsCountInput.value, 10) || 0;
    const password = passwordInput.value;
    const passwordConfirm = passwordConfirmInput.value;

    if (!fatherName || !motherName) {
      showError("Sila isi nama bapa dan ibu.");
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

    // TODO: replace with a real signup request (fetch/AJAX) to your backend.
    const payload = {
      fatherName,
      motherName,
      kids: savedKids.slice(0, kidsCount),
      password, // NOTE: hash this server-side — never store plain text.
    };
    console.log("Signup payload ready:", payload);
    alert("Pendaftaran berjaya! (Ciri ini akan disambungkan ke pelayan tidak lama lagi.)");
  });
})();
