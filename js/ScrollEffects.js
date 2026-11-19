/* Scroll-linked effects: hero photo parallax, contour drift in the projects section, the contact photo sunset, and the scrolled state used by the dock and scroll cue. */

class ScrollEffects {
  static HERO_PHOTO = { file: 'hero-10', position: 'center 50%' };
  static CONTACT_PHOTO = { file: 'scene-d5', position: 'center 50%' };

  constructor() {
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.heroPhoto = document.getElementById('photoBg');
    this.projects = document.getElementById('projects');
    this.contact = document.getElementById('contact');
    this.startTime = performance.now();

    this.setHeroPhoto();
    this.setContactPhoto();
    this.trackScrolledState();
    if (!this.reduceMotion) this.trackHeroParallax();
    if (!this.reduceMotion) requestAnimationFrame((t) => this.driftContours(t));
    requestAnimationFrame(() => this.updateContactScene());
  }

  /* Image paths are made absolute because CSS resolves url() inside variables relative to the stylesheet folder. */
  static imageUrl(name) {
    return `url("${new URL(`img/${name}.webp`, document.baseURI).href}")`;
  }

  setHeroPhoto() {
    const { file, position } = ScrollEffects.HERO_PHOTO;
    this.heroPhoto.style.setProperty('--img', ScrollEffects.imageUrl(file));
    this.heroPhoto.style.setProperty('--img-sm', ScrollEffects.imageUrl(`${file}-sm`));
    this.heroPhoto.style.setProperty('--pos', position);
  }

  setContactPhoto() {
    const { file, position } = ScrollEffects.CONTACT_PHOTO;
    this.contact.style.setProperty('--pimg', ScrollEffects.imageUrl(file));
    this.contact.style.setProperty('--pimg-sm', ScrollEffects.imageUrl(`${file}-sm`));
    this.contact.style.setProperty('--ppos', position);
  }

  /* Adds the "scrolled" class to the body once the page has moved 120px. */
  trackScrolledState() {
    const update = () => document.body.classList.toggle('scrolled', scrollY > 120);
    addEventListener('scroll', update, { passive: true });
    update();
  }

  /* Moves the hero photo down and zooms it slightly as the page scrolls. Phones use a gentler movement. */
  trackHeroParallax() {
    const phone = matchMedia('(max-width:860px)');
    let pending = false;
    addEventListener(
      'scroll',
      () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(() => {
          pending = false;
          const y = Math.min(scrollY, 900);
          const speed = phone.matches ? 0.22 : 0.45;
          this.heroPhoto.style.transform = `translateY(${y * speed}px) scale(${1 + y * 0.00018})`;
        });
      },
      { passive: true }
    );
  }

  /* Drifts the contour lines with time and with scroll position while the projects section is on screen. */
  driftContours(time) {
    const r = this.projects.getBoundingClientRect();
    const vh = innerHeight;
    if (r.bottom > 0 && r.top < vh) {
      const progress = (vh - r.top) / (vh + r.height);
      const seconds = (time - this.startTime) / 1000;
      const cx = Math.sin(seconds * 0.25) * 18 - progress * 40;
      const cy = -progress * 110 + Math.cos(seconds * 0.2) * 10;
      this.projects.style.setProperty('--cx', cx.toFixed(1));
      this.projects.style.setProperty('--cy', cy.toFixed(1));
    }
    requestAnimationFrame((t) => this.driftContours(t));
  }

  /* Sets --pp from 0 to 1 as the contact section scrolls in. The CSS uses it to darken the photo into night and fade in the stars. */
  updateContactScene() {
    const r = this.contact.getBoundingClientRect();
    let progress = (innerHeight - r.top) / (r.height + innerHeight * 0.2);
    progress = Math.max(0, Math.min(1, progress));
    this.contact.style.setProperty('--pp', (this.reduceMotion ? 0.5 : progress).toFixed(3));
    requestAnimationFrame(() => this.updateContactScene());
  }
}
