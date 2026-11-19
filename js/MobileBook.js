/* Mobile project cards: builds the swipe cards and page dots, plays each card's animation, and shows the swipe hint. */

class MobileBook {
  constructor(projects) {
    this.projects = projects;
    this.track = document.getElementById('mobileProjects');
    this.dots = document.getElementById('dots');
    this.hint = document.getElementById('swipeHint');
    this.reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.hintDone = false;
    this.nudging = false;

    this.build();
    this.bindEvents();
    this.watchPages();
    this.watchFirstView();
  }

  cards() {
    const title = PageTemplates.titlePage(
      'Swipe through the pages. Each project has a sketch of how it works, what it does and what I built.'
    );
    const projectCards = this.projects.map(
      (p) => PageTemplates.heading(p) + PageTemplates.visual(p) + PageTemplates.details(p)
    );
    return [
      title,
      PageTemplates.contentsPage(this.projects),
      ...projectCards,
      PageTemplates.endRight()
    ];
  }

  build() {
    const cards = this.cards();
    this.track.innerHTML = cards
      .map(
        (html, i) =>
          `<div class="face m-page">${html}<span class="pn">${i + 1} / ${cards.length}</span></div>`
      )
      .join('');
    this.dots.innerHTML = cards
      .map((_, i) => `<button type="button" aria-label="Page ${i + 1}" data-i="${i}"></button>`)
      .join('');
    this.pages = [...this.track.children];
  }

  goTo(index) {
    const page = this.pages[index];
    if (page)
      this.track.scrollTo({ left: page.offsetLeft - this.track.offsetLeft, behavior: 'smooth' });
  }

  bindEvents() {
    this.dots.addEventListener('click', (e) => {
      const dot = e.target.closest('button');
      if (dot) this.goTo(+dot.dataset.i);
    });
    this.track.addEventListener('click', (e) => {
      const target = e.target.closest('[data-go]');
      if (target) this.goTo(+target.dataset.go + 1);
    });
    this.track.addEventListener(
      'scroll',
      () => {
        if (!this.nudging && this.track.scrollLeft > 20) {
          this.hint.classList.add('gone');
          this.hintDone = true;
        }
      },
      { passive: true }
    );
  }

  /* Marks the active dot and restarts the animation of the card in view. */
  watchPages() {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = this.pages.indexOf(entry.target);
          [...this.dots.children].forEach((dot, k) => dot.classList.toggle('on', k === index));
          const visual = entry.target.querySelector('.visual');
          if (visual) {
            visual.classList.remove('play');
            void visual.offsetWidth;
            visual.classList.add('play');
          }
        }),
      { root: this.track, threshold: 0.6 }
    );
    this.pages.forEach((page) => observer.observe(page));
  }

  /* Nudges the cards sideways once when they first come into view, to show they can be swiped. */
  watchFirstView() {
    if (getComputedStyle(this.track).display === 'none') return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          !entries[0].isIntersecting ||
          this.hintDone ||
          this.reduceMotion ||
          this.track.scrollLeft >= 5
        )
          return;
        observer.disconnect();
        setTimeout(() => this.nudge(), 500);
      },
      { threshold: 0.6 }
    );
    observer.observe(this.track);
  }

  nudge() {
    this.nudging = true;
    this.track.style.scrollSnapType = 'none';
    this.track.scrollTo({ left: 70, behavior: 'smooth' });
    setTimeout(() => {
      this.track.scrollTo({ left: 0, behavior: 'smooth' });
      setTimeout(() => {
        this.track.style.scrollSnapType = '';
        this.nudging = false;
      }, 600);
    }, 550);
  }
}
