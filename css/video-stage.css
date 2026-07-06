/* =========================================================
   video-stage.css — the fullscreen, non-interactive video
   ========================================================= */

.video-stage {
  position: relative;
  width: 100vw;
  height: 100dvh;
  background: #000;
  overflow: hidden;
}

.video-stage__video {
  width: 100%;
  height: 100%;
  object-fit: cover;      /* fills every screen size: phone, tablet, desktop */
  object-position: center;
  pointer-events: none;   /* video cannot be tapped/clicked/paused by the user */
}

/* Small "tap for sound" chip — only appears if the browser blocked
   autoplay-with-audio and we had to fall back to a muted start */
.unmute-prompt {
  position: absolute;
  bottom: calc(24px + var(--safe-bottom));
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.55);
  color: var(--color-white);
  font-weight: 700;
  font-size: 14px;
  padding: 10px 18px;
  border-radius: 999px;
  backdrop-filter: blur(4px);
  z-index: 20;
  animation: pulseFade 1.6s ease-in-out infinite;
}

@keyframes pulseFade {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

@media (min-width: 768px) {
  .unmute-prompt {
    font-size: 16px;
    padding: 12px 22px;
  }
}
