/* =========================================================
   auth-check.js — orchestrates the authentication-check page
   Two possible triggers, read from sessionStorage:
     - "login": verify the email/password just submitted on the
       main page's login form, then redirect to home or signup.
     - "session-check": check whether the visitor already has a
       logged-in session, then redirect to home or signup.
   Always waits for a minimum display time so the video/text is
   actually seen, not just flashed for a split second.
   ========================================================= */

(function () {
  const video = document.getElementById("authVideo");
  video.loop = false;

  function attemptPlay() {
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      video.play().catch(() => {});
    });
  }
  attemptPlay();

  SmartKiddoSound.playLoading();
  SmartKiddoAuthText.runSequence();

  const action = sessionStorage.getItem("smartkiddo_auth_action");
  const pendingEmail = (sessionStorage.getItem("smartkiddo_pending_email") || "").toLowerCase();
  const pendingPassword = sessionStorage.getItem("smartkiddo_pending_password");

  // Clear the credentials from sessionStorage immediately — they've
  // already been read into memory above and don't need to linger.
  sessionStorage.removeItem("smartkiddo_pending_password");
  sessionStorage.removeItem("smartkiddo_pending_email");
  sessionStorage.removeItem("smartkiddo_auth_action");

  function goHome() {
    if (pendingEmail) {
      localStorage.setItem("smartkiddo_logged_in_email", pendingEmail);
    }
    window.location.href = "home.html";
  }

  function goSignup() {
    window.location.href = "signup.html";
  }

  let destination = "signup"; // safe default if nothing matches

  function runCheck() {
    if (action === "login" && pendingEmail) {
      return db
        .collection("email-lookup")
        .doc(pendingEmail)
        .get()
        .then((doc) => {
          if (doc.exists && doc.data().password === pendingPassword) {
            destination = "home";
          } else {
            destination = "signup";
          }
        })
        .catch((err) => {
          console.error("Auth check error:", err);
          destination = "signup";
        });
    }

    if (action === "session-check") {
      const loggedInEmail = localStorage.getItem("smartkiddo_logged_in_email");
      destination = loggedInEmail ? "home" : "signup";
    }

    return Promise.resolve();
  }

  const MIN_DISPLAY_MS = 3500; // ensures the video/text is genuinely seen
  const startedAt = Date.now();

  runCheck().then(() => {
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
    setTimeout(() => {
      if (destination === "home") goHome();
      else goSignup();
    }, remaining);
  });
})();
