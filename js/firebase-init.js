/* =========================================================
   firebase-init.js — initializes Firebase + Firestore
   Uses the Firebase "compat" SDK (loaded via <script> tags in
   the HTML), which works as plain global scripts — no build
   step or module bundler needed, matching the rest of this
   project's simple script-tag structure.

   Exposes a global `db` that other scripts (like signup.js)
   can use directly.
   ========================================================= */

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
