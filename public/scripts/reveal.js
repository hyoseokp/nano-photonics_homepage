// Subtle scroll reveal (Task: SaaS glass refresh)
// - non-invasive: only adds classes
// - respects reduced motion

(function () {
  const prefersReduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) return;

  const targets = Array.from(document.querySelectorAll('[data-reveal], .card'));
  if (!targets.length) return;

  targets.forEach((el) => el.classList.add('reveal'));

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    },
    { root: null, threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
  );

  targets.forEach((el) => io.observe(el));
})();
