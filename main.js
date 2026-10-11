(function () {
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();

  if (reduce) return; // no smooth scroll or animations

  // Lenis smooth scroll
  var lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ duration: 1.1, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, smoothWheel: true });
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var id = a.getAttribute('href');
        var el = id === '#top' ? 0 : document.querySelector(id);
        if (el === null) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -64 });
      });
    });
  }

  if (!window.gsap || !window.ScrollTrigger) {
    if (lenis) { (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })(0); }
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  if (lenis) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  // Hero intro
  gsap.from('.hero .reveal', { y: 28, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 });

  // Section headings
  gsap.utils.toArray('.section .reveal').forEach(function (el) {
    gsap.from(el, { y: 24, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  // Staggered groups
  [['.problems', '.problem'], ['.cards', '.card'], ['.steps', '.step'], ['.feats', '.feat'], ['.faq', 'details']].forEach(function (g) {
    var wrap = document.querySelector(g[0]);
    if (!wrap) return;
    gsap.from(wrap.querySelectorAll(g[1]), { y: 32, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.08,
      clearProps: 'transform,opacity',
      scrollTrigger: { trigger: wrap, start: 'top 85%', once: true } });
  });
})();
