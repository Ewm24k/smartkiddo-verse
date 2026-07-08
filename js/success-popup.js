/* =========================================================
   success-popup.css — fullscreen "verified" video popup
   Shown after a successful signup. Covers the entire screen,
   including under device rotation. Video is non-interactive
   and cannot be paused. A "Teruskan" button appears once the
   video ends (or an error-styled variant if it fails to load).
   ========================================================= */

.success-popup {
  position: fixed;
  inset: 0;
  z-index: 2000; /* above absolutely everything else on the page */
  width: 100vw;
  height: 100dvh;
  background: #000000;
  overflow: hidden;
}

.success-popup__video {
  width: 100%;
  height: 100%;
  object-fit: cover; /* fills the entire screen edge-to-edge, any orientation */
  object-position: center;
  pointer-events: none; /* cannot be tapped/clicked/paused by the user */
}

.success-popup__cta {
  position: absolute;
  left: 50%;
  bottom: 14%;
  transform: translateX(-50%);
  z-index: 10;
  animation: successCtaEnter 0.5s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes successCtaEnter {
  from { opacity: 0; transform: translate(-50%, 20px); }
  to   { opacity: 1; transform: translate(-50%, 0); }
}

.success-popup__button {
  position: relative;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(18px, 4vw, 26px);
  color: #06331c;
  background: var(--color-neon-green);
  padding: 16px 40px;
  border-radius: 999px;
  box-shadow: 0 6px 18px rgba(57, 255, 136, 0.35);
  transition: transform 0.12s ease;
}

.success-popup__button:active {
  transform: scale(0.94);
}

/* Success state: same neon glow loop as the main "Mula Sekarang" button */
.success-popup__button::before {
  content: "";
  position: absolute;
  inset: -6px;
  border-radius: inherit;
  border: 3px solid var(--color-neon-green);
  animation: successNeonPulse 1.4s ease-in-out infinite;
}

@keyframes successNeonPulse {
  0%, 100% { box-shadow: 0 0 8px 2px var(--color-neon-green); opacity: 0.9; }
  50%      { box-shadow: 0 0 22px 8px var(--color-neon-green); opacity: 0.55; }
}

/* Error state: shown instead if the video fails to load/play — same
   button, but an amber/red warning tone + a gentle shake instead of
   the calm success glow, so it's clear something didn't play right */
.success-popup__button--error {
  background: #ffcf57;
  color: #5c3d00;
  animation: successErrorShake 0.4s ease-in-out 2;
}

.success-popup__button--error::before {
  border-color: #ff6b6b;
  animation: successErrorPulse 1s ease-in-out infinite;
}

@keyframes successErrorPulse {
  0%, 100% { box-shadow: 0 0 8px 2px #ff6b6b; opacity: 0.9; }
  50%      { box-shadow: 0 0 20px 7px #ff6b6b; opacity: 0.5; }
}

@keyframes successErrorShake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-4px); }
  75%      { transform: translateX(4px); }
}
