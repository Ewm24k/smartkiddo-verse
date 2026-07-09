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
  const successRedirect = sessionStorage.getItem("smartkiddo_auth_success_redirect") || "home.html";
  const failRedirect = sessionStorage.getItem("smartkiddo_auth_fail_redirect") || "signup.html";

  // Clear the credentials from sessionStorage immediately — they've
  // already been read into memory above and don't need to linger.
  sessionStorage.removeItem("smartkiddo_pending_password");
  sessionStorage.removeItem("smartkiddo_pending_email");
  sessionStorage.removeItem("smartkiddo_auth_action");
  sessionStorage.removeItem("smartkiddo_auth_success_redirect");
  sessionStorage.removeItem("smartkiddo_auth_fail_redirect");

  function goSuccess() {
    if (pendingEmail) {
      localStorage.setItem("smartkiddo_logged_in_email", pendingEmail);
    }
    window.location.href = successRedirect;
  }

  function goFail() {
    window.location.href = failRedirect;
  }

  let passed = false; // true = successRedirect, false = failRedirect

  function runCheck() {
    if (action === "login" && pendingEmail) {
      return db
        .collection("email-lookup")
        .doc(pendingEmail)
        .get()
        .then((doc) => {
          passed = !!(doc.exists && doc.data().password === pendingPassword);
        })
        .catch((err) => {
          console.error("Auth check error:", err);
          passed = false;
        });
    }

    if (action === "session-check") {
      passed = !!localStorage.getItem("smartkiddo_logged_in_email");
    }

    return Promise.resolve();
  }

  const MIN_DISPLAY_MS = 3500; // ensures the video/text is genuinely seen
  const startedAt = Date.now();

  runCheck().then(() => {
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(MIN_DISPLAY_MS - elapsed, 0);
    setTimeout(() => {
      if (passed) goSuccess();
      else goFail();
    }, remaining);
  });
})();
