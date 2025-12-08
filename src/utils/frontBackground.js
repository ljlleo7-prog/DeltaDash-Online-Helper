/**
 * Setup the front-page faint background behavior.
 * The image fades and translates upwards as the user scrolls down.
 */
export function setupFrontBackground() {
  const front = document.getElementById('front-bg');
  if (!front) return;

  let lastY = window.scrollY || 0;
  let ticking = false;
  const maxFade = 320; // px distance where image is fully faded
  const maxTranslate = 220; // max upward translate in px

  function update() {
    const y = Math.max(0, lastY);
    const t = Math.min(y / maxFade, 1);
    const translate = Math.min(y * 0.6, maxTranslate);
    const opacity = Math.max(0, 1 - t) * 0.45;

    front.style.transform = `translateX(-50%) translateY(-${translate}px)`;
    front.style.opacity = String(opacity);
    ticking = false;
  }

  function onScroll() {
    lastY = window.scrollY || 0;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  }

  // initialize
  update();
  window.addEventListener('scroll', onScroll, { passive: true });
}