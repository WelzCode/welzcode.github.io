/* Dock navigation: builds the menu links, draws the curved bar and moves the bubble to the section in view. */

class Dock {
  static ICONS = {
    home: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
    about: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/>',
    projects:
      '<path d="M4 5a2 2 0 0 1 2-2h5v18H6a2 2 0 0 1-2-2z"/><path d="M20 5a2 2 0 0 0-2-2h-5v18h5a2 2 0 0 0 2-2z"/>',
    experience:
      '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/>',
    contact: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/>'
  };

  static ITEMS = [
    ['home', 'Home'],
    ['about', 'About'],
    ['projects', 'Projects'],
    ['experience', 'Work'],
    ['contact', 'Contact']
  ];

  /* Page sections mapped to the dock item that lights up for them. */
  static SECTION_MAP = [
    ['home', 'home'],
    ['about', 'about'],
    ['skills', 'about'],
    ['projects', 'projects'],
    ['experience', 'experience'],
    ['credentials', 'experience'],
    ['contact', 'contact']
  ];

  constructor() {
    this.dock = document.querySelector('.dock');
    this.list = document.getElementById('dockList');
    this.bar = document.getElementById('bar');
    this.bubbleIcon = document.getElementById('bubbleIcon');
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.currentX = null;
    this.frame = null;
    this.lastId = null;
    this.ticking = false;

    this.buildLinks();
    this.bindEvents();
    this.setActive('home');
  }

  buildLinks() {
    Dock.ITEMS.forEach(([id, label]) => {
      const li = document.createElement('li');
      li.innerHTML = `<a href="#${id}" data-id="${id}"><svg viewBox="0 0 24 24">${Dock.ICONS[id]}</svg><span>${label}</span></a>`;
      this.list.appendChild(li);
    });
    this.links = [...this.list.querySelectorAll('a')];
  }

  bindEvents() {
    addEventListener(
      'scroll',
      () => {
        if (this.ticking) return;
        this.ticking = true;
        requestAnimationFrame(() => this.onScroll());
      },
      { passive: true }
    );

    this.links.forEach((link) =>
      link.addEventListener('click', () => {
        this.lastId = link.dataset.id;
        this.setActive(link.dataset.id);
      })
    );

    addEventListener('resize', () => {
      const active = this.links.find((l) => l.classList.contains('active'));
      if (active) this.setActive(active.dataset.id);
    });
  }

  /* Picks the section whose top has passed 35% of the screen height. */
  onScroll() {
    this.ticking = false;
    const line = innerHeight * 0.35;
    let id = 'home';
    for (const [sectionId, navId] of Dock.SECTION_MAP) {
      const el = document.getElementById(sectionId);
      if (el && el.getBoundingClientRect().top <= line) id = navId;
    }
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4) id = 'contact';
    if (id !== this.lastId) {
      this.lastId = id;
      this.setActive(id);
    }
  }

  setActive(id) {
    const link = this.links.find((l) => l.dataset.id === id);
    if (!link) return;
    this.links.forEach((l) => l.classList.toggle('active', l === link));
    const r = link.getBoundingClientRect();
    const d = this.dock.getBoundingClientRect();
    this.animateTo(r.left - d.left + r.width / 2, d.width);
    this.bubbleIcon.innerHTML = Dock.ICONS[id];
  }

  /* Draws the bar outline with a curved notch under the bubble at position x. */
  drawBar(x, width) {
    const H = 68,
      small = width < 500,
      R = small ? 16 : 22,
      size = small ? 50 : 58,
      top = small ? -24 : -30;
    const cy = top + size / 2,
      r = size / 2 + (small ? 5 : 7),
      f = small ? 7 : 10,
      n = (v) => v.toFixed(1);
    const yP = f * 0.9,
      dx = Math.sqrt(r * r - (yP - cy) * (yP - cy));
    const d = `M ${R} 0 L ${n(x - r - f)} 0 Q ${n(x - r + 1)} 0 ${n(x - dx)} ${n(yP)} A ${r} ${r} 0 0 0 ${n(x + dx)} ${n(yP)} Q ${n(x + r - 1)} 0 ${n(x + r + f)} 0 L ${width - R} 0 Q ${width} 0 ${width} ${R} L ${width} ${H - R} Q ${width} ${H} ${width - R} ${H} L ${R} ${H} Q 0 ${H} 0 ${H - R} L 0 ${R} Q 0 0 ${R} 0 Z`;
    this.bar.style.clipPath = `path('${d}')`;
  }

  place(x, width) {
    this.dock.style.setProperty('--x', x + 'px');
    this.drawBar(x, width);
  }

  /* Slides the bubble and notch to the target position with an ease-in-out curve. */
  animateTo(targetX, width) {
    if (this.currentX === null || this.reduceMotion) {
      this.currentX = targetX;
      this.place(targetX, width);
      return;
    }
    cancelAnimationFrame(this.frame);
    const startX = this.currentX,
      startTime = performance.now(),
      duration = 450;
    const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const step = (now) => {
      const t = Math.min(1, (now - startTime) / duration);
      this.currentX = startX + (targetX - startX) * ease(t);
      this.place(this.currentX, width);
      if (t < 1) this.frame = requestAnimationFrame(step);
    };
    this.frame = requestAnimationFrame(step);
  }
}
