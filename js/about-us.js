(function () {
  "use strict";

  /* =========================================================
     i18n — Bahasa Melayu (default) + English
     ========================================================= */
  var I18N = {
    page_title: { ms: "Tentang Kami — SmartKiddo Verse", en: "About Us — SmartKiddo Verse" },
    page_desc: {
      ms: "Kenali kisah, misi dan visi di sebalik SmartKiddo Verse — alam semesta pembelajaran yang selamat dan menyeronokkan untuk si comel anda.",
      en: "Discover the story, mission and vision behind SmartKiddo Verse — a safe, joyful learning universe for your little one."
    },
    nav_home: { ms: "Rumah", en: "Home" },
    nav_onboarding: { ms: "Onboarding", en: "Onboarding" },
    nav_about: { ms: "Tentang Kami", en: "About Us" },
    nav_family: { ms: "Keluarga Saya", en: "My Family" },
    nav_logout: { ms: "Log Keluar", en: "Log Out" },
    toast_logout: { ms: "Berjaya log keluar. Sampai jumpa lagi! 👋", en: "Logged out successfully. See you soon! 👋" },

    hero_eyebrow: { ms: "Kisah di sebalik alam semesta kecil ini", en: "The story behind this little universe" },
    hero_title: { ms: "Tentang Kami", en: "About Us" },
    hero_subtitle: {
      ms: "SmartKiddo Verse ialah alam semesta pembelajaran digital tempat si comel usia 2–6 tahun meneroka huruf, nombor, warna dan bentuk — sambil bergembira setiap langkah.",
      en: "SmartKiddo Verse is a digital learning universe where little ones aged 2–6 explore letters, numbers, colors and shapes — having fun every step of the way."
    },
    hero_intro: {
      ms: "Kami percaya belajar tidak perlu membosankan. Setiap worksheet, setiap animasi dan setiap pujian kecil direka dengan satu matlamat: membuatkan mata anak anda bersinar apabila mereka berjaya.",
      en: "We believe learning doesn't have to be boring. Every worksheet, every animation and every little cheer is designed with one goal: making your child's eyes light up when they succeed."
    },
    hero_cta: { ms: "Mulakan Pengembaraan ↓", en: "Start the Adventure ↓" },

    story_eyebrow: { ms: "Asal Usul", en: "Our Origin" },
    story_title: { ms: "Bermula daripada satu soalan mudah", en: "It started with one simple question" },
    story_p1: {
      ms: "Semuanya bermula apabila seorang ibu bapa bertanya, \u201cKenapa bahan pembelajaran anak-anak selalu kaku dan membosankan?\u201d Anak-anak kecil belajar melalui rasa ingin tahu, warna, sentuhan dan permainan — bukan helaian kerja yang kelabu dan tegar.",
      en: "It all began when a parent asked, \u201cWhy do kids' learning materials always feel so stiff and boring?\u201d Little children learn through curiosity, color, touch and play — not gray, rigid worksheets."
    },
    story_p2: {
      ms: "Daripada persoalan itu, lahirlah SmartKiddo Verse — sebuah ruang di mana setiap huruf ada watak, setiap nombor ada cerita, dan setiap sesi belajar terasa seperti pengembaraan kecil merentasi galaksi ilmu.",
      en: "From that question, SmartKiddo Verse was born — a space where every letter has a character, every number has a story, and every learning session feels like a little adventure across a galaxy of knowledge."
    },
    story_p3: {
      ms: "Kami membina SmartKiddo Verse untuk keluarga yang sibuk tetapi tetap mahu memberi yang terbaik — worksheet yang boleh diakses terus dari telefon, dicetak bila perlu, dan direka oleh mereka yang faham dunia kanak-kanak.",
      en: "We built SmartKiddo Verse for busy families who still want to give their best — worksheets accessible right from the phone, printable when needed, and designed by people who understand a child's world."
    },

    pillars_eyebrow: { ms: "Teras Kami", en: "Our Core" },
    pillars_title: { ms: "Tiga bintang penunjuk arah", en: "Three guiding stars" },
    misi_title: { ms: "Misi", en: "Mission" },
    misi_desc: {
      ms: "Membantu setiap ibu bapa menyediakan pengalaman pembelajaran awal yang berkualiti, mudah diakses dan menyeronokkan buat si comel mereka.",
      en: "Helping every parent provide a quality, accessible and enjoyable early learning experience for their little one."
    },
    visi_title: { ms: "Visi", en: "Vision" },
    visi_desc: {
      ms: "Menjadi alam semesta pembelajaran pilihan keluarga Malaysia — tempat setiap anak menemui keyakinan untuk belajar dan berkembang.",
      en: "To become Malaysian families' learning universe of choice — where every child finds the confidence to learn and grow."
    },
    nilai_title: { ms: "Nilai", en: "Values" },
    nilai_desc: {
      ms: "Keselamatan anak, kejujuran kandungan, dan kegembiraan dalam pembelajaran — tiga perkara yang tidak pernah kami kompromi.",
      en: "Child safety, honest content, and joy in learning — three things we never compromise on."
    },

    why_eyebrow: { ms: "Kenapa SmartKiddo Verse", en: "Why SmartKiddo Verse" },
    why_title: { ms: "Direka berbeza, sengaja", en: "Deliberately, differently designed" },
    why1_title: { ms: "Selamat untuk keluarga", en: "Family safe" },
    why1_desc: {
      ms: "Tiada iklan pihak ketiga yang mengganggu, tiada kandungan luar jangkaan — hanya ruang selamat untuk anak meneroka.",
      en: "No intrusive third-party ads, no unexpected content — just a safe space for your child to explore."
    },
    why2_title: { ms: "Interaktif & ceria", en: "Interactive & joyful" },
    why2_desc: {
      ms: "Setiap worksheet direka dengan warna dan watak yang menarik minat kanak-kanak untuk terus belajar.",
      en: "Every worksheet is designed with colors and characters that keep kids excited to keep learning."
    },
    why3_title: { ms: "Pengalaman moden", en: "Modern experience" },
    why3_desc: {
      ms: "Akses terus dari telefon atau tablet dengan antara muka yang lancar seperti aplikasi kegemaran anda.",
      en: "Access it straight from your phone or tablet with an interface as smooth as your favorite app."
    },
    why4_title: { ms: "Pembelajaran peribadi", en: "Personalized learning" },
    why4_desc: {
      ms: "Pilihan worksheet mengikut tahap dan minat anak, supaya setiap sesi terasa sesuai dengan mereka.",
      en: "Worksheet choices matched to your child's level and interests, so every session feels made for them."
    },
    why5_title: { ms: "Fleksibel — skrin atau kertas", en: "Flexible — screen or paper" },
    why5_desc: {
      ms: "Belajar di atas tablet atau cetak untuk sesi tulisan tangan — pilihan di tangan anda.",
      en: "Learn on a tablet or print it out for handwriting practice — the choice is yours."
    },

    team_eyebrow: { ms: "Di Sebalik Tabir", en: "Behind the Scenes" },
    team_title: { ms: "Dibina oleh mereka yang sayangkan anak-anak", en: "Built by people who love kids" },
    team_lead: {
      ms: "Kami sekumpulan kecil pereka, pendidik dan ibu bapa yang berkongsi satu impian yang sama — membuatkan pembelajaran awal terasa ajaib.",
      en: "We're a small team of designers, educators and parents who share one dream — making early learning feel magical."
    },
    team1_title: { ms: "Pasukan Reka Bentuk", en: "Design Team" },
    team1_desc: {
      ms: "Mencipta watak dan visual yang buat anak jatuh cinta pada setiap helaian.",
      en: "Crafting characters and visuals that make kids fall in love with every page."
    },
    team2_title: { ms: "Pasukan Kurikulum", en: "Curriculum Team" },
    team2_desc: {
      ms: "Memastikan setiap aktiviti selari dengan cara kanak-kanak sebenarnya belajar.",
      en: "Making sure every activity matches how children actually learn."
    },
    team3_title: { ms: "Pasukan Keluarga", en: "Family Team" },
    team3_desc: {
      ms: "Ibu bapa dalam pasukan kami turut menguji setiap bahan bersama anak sendiri.",
      en: "The parents on our team test every worksheet with their own kids first."
    },

    journey_eyebrow: { ms: "Perjalanan Kami", en: "Our Journey" },
    journey_title: { ms: "Peta bintang perkembangan kami", en: "Our star map of progress" },
    tl1_title: { ms: "Idea", en: "The Idea" },
    tl1_desc: {
      ms: "Bermula daripada perbualan tentang pembelajaran kanak-kanak yang lebih menyeronokkan.",
      en: "It began with a conversation about making children's learning more fun."
    },
    tl2_title: { ms: "Pembinaan Awal", en: "Early Build" },
    tl2_desc: {
      ms: "Sketsa pertama worksheet dan watak SmartKiddo mula dilukis dan diuji.",
      en: "The first sketches of SmartKiddo worksheets and characters were drawn and tested."
    },
    tl3_title: { ms: "Versi Pertama", en: "First Version" },
    tl3_desc: {
      ms: "Koleksi worksheet interaktif pertama dilancarkan untuk keluarga terpilih.",
      en: "The first collection of interactive worksheets launched to select families."
    },
    tl4_title: { ms: "Ciri Semasa", en: "Current Features" },
    tl4_desc: {
      ms: "SmartKiddo Verse kini menawarkan pelbagai worksheet merentasi huruf, nombor, warna dan bentuk.",
      en: "SmartKiddo Verse now offers a wide range of worksheets covering letters, numbers, colors and shapes."
    },
    tl5_title: { ms: "Hala Tuju Akan Datang", en: "What's Next" },
    tl5_desc: {
      ms: "Lebih banyak dunia pembelajaran, watak baharu dan pengalaman yang lebih peribadi sedang dirancang.",
      en: "More learning worlds, new characters and more personalized experiences are on the way."
    },

    safety_eyebrow: { ms: "Keselamatan & Kepercayaan", en: "Safety & Trust" },
    safety_title: { ms: "Ruang yang tenang untuk ibu bapa", en: "A calm space for parents" },
    safety1_title: { ms: "Privasi terjaga", en: "Privacy protected" },
    safety1_desc: {
      ms: "Maklumat keluarga anda disimpan dengan teliti dan tidak dikongsi tanpa kebenaran.",
      en: "Your family's information is stored carefully and never shared without consent."
    },
    safety2_title: { ms: "Selamat untuk anak", en: "Child safe" },
    safety2_desc: {
      ms: "Semua kandungan disemak supaya sesuai dan selamat untuk kanak-kanak kecil.",
      en: "All content is reviewed to be appropriate and safe for young children."
    },
    safety3_title: { ms: "Kawalan ibu bapa", en: "Parental control" },
    safety3_desc: {
      ms: "Anda sentiasa mempunyai kawalan penuh ke atas akaun dan aktiviti anak di platform.",
      en: "You always have full control over your account and your child's activity on the platform."
    },
    safety4_title: { ms: "Pengalaman selamat", en: "Secure experience" },
    safety4_desc: {
      ms: "Dibina dengan amalan keselamatan digital yang sesuai untuk pengguna keluarga.",
      en: "Built with digital safety practices suited for family users."
    },

    finalcta_title: { ms: "Sedia untuk teroka SmartKiddo Verse?", en: "Ready to explore SmartKiddo Verse?" },
    finalcta_text: {
      ms: "Jom mulakan pengembaraan pembelajaran si comel anda hari ini.",
      en: "Let's start your little one's learning adventure today."
    },
    finalcta_btn1: { ms: "Terokai SmartKiddo Verse", en: "Explore SmartKiddo Verse" },
    finalcta_btn2: { ms: "Kembali ke Rumah", en: "Back to Home" }
  };

  var STORAGE_KEY = "smartkiddo_lang";

  function getSavedLang() {
    try {
      var saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === "ms" || saved === "en") return saved;
    } catch (e) { /* storage unavailable */ }
    return "ms";
  }
  function saveLang(lang) {
    try { window.localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* ignore */ }
  }

  function applyLanguage(lang) {
    document.documentElement.setAttribute("lang", lang === "en" ? "en" : "ms");
    document.documentElement.setAttribute("data-lang", lang);

    var nodes = document.querySelectorAll("[data-i18n]");
    nodes.forEach(function (node) {
      var key = node.getAttribute("data-i18n");
      var entry = I18N[key];
      if (!entry) return;
      var text = entry[lang] || entry.ms;

      if (node.tagName === "TITLE") {
        document.title = text;
      } else if (node.hasAttribute("content")) {
        node.setAttribute("content", text);
      } else {
        node.textContent = text;
      }
    });

    var langCode = document.getElementById("langCode");
    if (langCode) langCode.textContent = lang === "en" ? "EN" : "BM";

    var options = document.querySelectorAll(".lang-option");
    options.forEach(function (opt) {
      opt.classList.toggle("is-active", opt.getAttribute("data-lang") === lang);
    });

    saveLang(lang);
  }

  /* ---------- language dropdown ---------- */
  var langSwitch = document.getElementById("langSwitch");
  var langBtn = document.getElementById("langBtn");
  var langMenu = document.getElementById("langMenu");

  function openLangMenu() {
    langSwitch.classList.add("is-open");
    langBtn.setAttribute("aria-expanded", "true");
  }
  function closeLangMenu() {
    langSwitch.classList.remove("is-open");
    langBtn.setAttribute("aria-expanded", "false");
  }
  if (langBtn) {
    langBtn.addEventListener("click", function () {
      var isOpen = langSwitch.classList.contains("is-open");
      isOpen ? closeLangMenu() : openLangMenu();
    });
  }
  if (langMenu) {
    langMenu.querySelectorAll(".lang-option").forEach(function (opt) {
      opt.addEventListener("click", function () {
        applyLanguage(opt.getAttribute("data-lang"));
        closeLangMenu();
      });
    });
  }
  document.addEventListener("click", function (e) {
    if (langSwitch && !langSwitch.contains(e.target)) closeLangMenu();
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeLangMenu();
  });

  applyLanguage(getSavedLang());

  /* ---------- side menu ---------- */
  var hamburger = document.getElementById("hamburgerBtn");
  var sideMenu = document.getElementById("sideMenu");
  var backdrop = document.getElementById("sideMenuBackdrop");

  function openMenu() {
    sideMenu.classList.add("is-open");
    backdrop.classList.add("is-open");
    hamburger.classList.add("is-open");
    hamburger.setAttribute("aria-expanded", "true");
    sideMenu.setAttribute("aria-hidden", "false");
  }
  function closeMenu() {
    sideMenu.classList.remove("is-open");
    backdrop.classList.remove("is-open");
    hamburger.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
    sideMenu.setAttribute("aria-hidden", "true");
  }
  if (hamburger) {
    hamburger.addEventListener("click", function () {
      var isOpen = sideMenu.classList.contains("is-open");
      isOpen ? closeMenu() : openMenu();
    });
  }
  if (backdrop) backdrop.addEventListener("click", closeMenu);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") closeMenu();
  });

  /* ---------- logout (matches pattern used on home.html / profile.html) ---------- */
  var logoutBtn = document.getElementById("logoutBtn");
  var toast = document.getElementById("logoutToast");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      closeMenu();
      if (toast) {
        toast.classList.add("is-visible");
        setTimeout(function () {
          toast.classList.remove("is-visible");
          window.location.href = "index.html";
        }, 1400);
      } else {
        window.location.href = "index.html";
      }
    });
  }

  /* ---------- scroll reveal ---------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- real viewport height for full-screen mobile browsers ---------- */
  function setViewportUnit() {
    document.documentElement.style.setProperty("--vh", window.innerHeight * 0.01 + "px");
  }
  setViewportUnit();
  window.addEventListener("resize", setViewportUnit);
  window.addEventListener("orientationchange", setViewportUnit);
})();
