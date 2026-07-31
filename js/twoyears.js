/**
 * js/twoyears.js
 * 
 * Page-specific sound bindings for twoyears.html.
 * Uses the shared SmartKiddoSound utility.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Gracefully exit if the shared sound utility is missing
  if (typeof SmartKiddoSound === 'undefined') {
    return;
  }

  // Select interactive elements on the page (buttons, mascot, and modal close button)
  const interactiveElements = document.querySelectorAll('.game-btn, .mascot, #modal-close');

  interactiveElements.forEach((element) => {
    if (!element) return;

    // Bind hover sound
    element.addEventListener('mouseenter', () => {
      SmartKiddoSound.playHover();
    });

    // Bind click sound
    element.addEventListener('click', () => {
      SmartKiddoSound.playClick();
    });
  });

  // Note: No scrollable region exists on twoyears.html (viewport is fixed),
  // so scroll sound handling is omitted per task specifications.
});
