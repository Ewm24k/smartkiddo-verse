/* =========================================================
   logout.js — shared "sign the user out" logic
   Clears the session flag, shows the shared success notification
   (if present on the current page), then redirects. Ready to be
   swapped for a real backend/Firebase signOut() call later —
   everything else that depends on it stays the same.
   ========================================================= */

const SmartKiddoLogout = (() => {
  function performSignOut() {
    return new Promise((resolve) => {
      localStorage.removeItem("smartkiddo_logged_in_email");
      setTimeout(resolve, 400); // small delay so it reads as a real request completing
    });
  }

  function perform(redirectTo) {
    const notification = document.getElementById("logoutNotification");
    return performSignOut().then(() => {
      if (notification) notification.hidden = false;
      setTimeout(() => {
        window.location.href = redirectTo;
      }, 1800);
    });
  }

  return { perform };
})();
