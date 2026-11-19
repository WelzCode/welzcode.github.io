/* Desktop project book: builds the spreads, turns pages, draws the page stacks and stitching, and shows the page-turn cue. */

class ProjectBook {
  static TURN_TIME = 950;
  static TURN_STAGGER = 120;
  static CUE_REPEAT = 15000;

  /* Curves of the top and bottom page edges. x runs from 0 at the spine to 100 at the outer edge, y is in 1000ths of the page height. */
  static TOP_EDGE = [
    [
      [0, 30],
      [5, 8],
      [18, 0],
      [42, 1]
    ],
    [
      [42, 1],
      [68, 2],
      [88, 7],
      [100, 14]
    ]
  ];
  static BOTTOM_EDGE = [
    [
      [0, 976],
      [5, 994],
      [18, 1000],
      [42, 999]
    ],
    [
      [42, 999],
      [68, 998],
      [88, 993],
      [100, 988]
    ]
  ];

  constructor(projects) {
    this.projects = projects;
    this.book = document.getElementById('book');
    this.stage = document.getElementById('bookStage');
    this.prevButton = document.getElementById('prev');
    this.nextButton = document.getElementById('next');
    this.counter = document.getElementById('count');
    this.current = 0;
    this.leaves = [];
    this.layerTimer = null;
    this.playTimer = null;
    this.stopTimer = null;

    this.cueTimer = null;
    this.cueDirection = 1;
    this.bookSeen = false;
    this.bookVisible = false;

    this.build();
    this.bindEvents();
    this.render();
    this.watchVisibility();
    this.drawStitching();
  }

  get last() {
    return this.leaves.length;
  }

  isVisible() {
    return getComputedStyle(this.stage).display !== 'none';
  }

  /* Each spread is [left page, right page]. The first is the title and contents, the last links to GitHub. */
  spreads() {
    const title = PageTemplates.titlePage(
      'Each spread is one project: a sketch on the left, what it does and what I built on the right.'
    );
    return [
      [title, PageTemplates.contentsPage(this.projects)],
      ...this.projects.map((p) => [PageTemplates.visual(p), PageTemplates.textPage(p)]),
      [PageTemplates.endLeft(), PageTemplates.endRight()]
    ];
  }

  build() {
    const spreads = this.spreads();
    const face = (html, side, n) =>
      `<div class="face ${side}">${html}<span class="pn">${n}</span></div>`;

    this.book.innerHTML =
      `<div class="bshadow"></div><div class="cover"><svg class="stitch" viewBox="0 0 200 1000" preserveAspectRatio="none" aria-hidden="true"><path d=""/></svg></div>` +
      `<div class="page-base left">${face(spreads[0][0], 'l', 1)}</div>` +
      `<div class="page-base right">${face(spreads[spreads.length - 1][1], 'r', spreads.length * 2)}</div>`;

    for (let j = 0; j < spreads.length - 1; j++) {
      const leaf = document.createElement('div');
      leaf.className = 'leaf';
      leaf.innerHTML = `<div class="face front r">${spreads[j][1]}<span class="pn">${j * 2 + 2}</span></div><div class="face back l">${spreads[j + 1][0]}<span class="pn">${j * 2 + 3}</span></div>`;
      this.book.appendChild(leaf);
      this.leaves.push(leaf);
    }

    this.book.insertAdjacentHTML(
      'beforeend',
      '<button class="edge prev" aria-label="Previous page" type="button"></button>' +
        '<button class="edge next" aria-label="Next page" type="button"></button>' +
        '<div class="cue" id="cue" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M9 5l7 7-7 7"/></svg></div>'
    );
    this.cue = this.book.querySelector('.cue');
  }

  bindEvents() {
    this.prevButton.addEventListener('click', () => this.goTo(this.current - 1));
    this.nextButton.addEventListener('click', () => this.goTo(this.current + 1));
    this.book
      .querySelector('.edge.prev')
      .addEventListener('click', () => this.goTo(this.current - 1));
    this.book
      .querySelector('.edge.next')
      .addEventListener('click', () => this.goTo(this.current + 1));
    this.book.addEventListener('click', (e) => {
      const target = e.target.closest('[data-go]');
      if (target) this.goTo(+target.dataset.go);
    });
    this.book.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') this.goTo(this.current + 1);
      if (e.key === 'ArrowLeft') this.goTo(this.current - 1);
    });
    addEventListener('resize', () => this.drawStitching());
    setTimeout(() => this.drawStitching(), 300);
  }

  goTo(page) {
    const previous = this.current;
    this.current = Math.max(0, Math.min(this.last, page));
    this.render();
    this.updateCueDirection(previous);
    this.cue.classList.remove('play');
    this.scheduleCue();
  }

  /* Resting stack order: turned leaves pile up on the left, unturned leaves on the right. */
  restingLayer(j) {
    return j < this.current ? j + 1 : this.last - j + 1;
  }

  render() {
    let turning = 0;
    this.leaves.forEach((leaf, j) => {
      const flipped = j < this.current;
      const changed = leaf.classList.contains('flipped') !== flipped;
      leaf.classList.toggle('flipped', flipped);
      if (changed) {
        leaf.style.zIndex = 200 + (flipped ? j : this.last - j);
        leaf.classList.remove('turning');
        void leaf.offsetWidth;
        leaf.classList.add('turning');
        leaf.style.transitionDelay = (turning++ * ProjectBook.TURN_STAGGER) / 1000 + 's';
      } else {
        leaf.style.zIndex = this.restingLayer(j);
        leaf.style.transitionDelay = '0s';
      }
      leaf.querySelectorAll('a,button').forEach((el) => (el.tabIndex = -1));
    });

    const settleTime = ProjectBook.TURN_TIME + turning * ProjectBook.TURN_STAGGER;
    clearTimeout(this.layerTimer);
    this.layerTimer = setTimeout(
      () =>
        this.leaves.forEach((leaf, j) => {
          leaf.style.zIndex = this.restingLayer(j);
          leaf.classList.remove('turning');
          leaf.style.transitionDelay = '0s';
        }),
      settleTime
    );

    this.updateStacks();
    this.updateFocus();
    this.updateAnimations(turning, settleTime);
    this.updateControls();
  }

  /* Page stacks are drop shadows that follow the curved page shape. */
  updateStacks() {
    const leftCount = Math.min(this.current * 2 + 1, 10);
    const rightCount = Math.min((this.last - this.current) * 2 + 1, 10);
    const colours = ['#d6ddd3', '#a9b8ad'];
    const stack = (n, dir) =>
      Array.from(
        { length: Math.max(2, Math.ceil(n / 2)) },
        (_, i) => `drop-shadow(${dir * 2.5}px .8px 0 ${colours[i % 2]})`
      ).join(' ');
    const left = this.book.querySelector('.page-base.left');
    const right = this.book.querySelector('.page-base.right');
    left.style.boxShadow = 'none';
    right.style.boxShadow = 'none';
    left.style.filter = stack(leftCount, -1);
    right.style.filter = stack(rightCount, 1);
  }

  /* Only links and buttons on the two open pages can receive keyboard focus. */
  updateFocus() {
    const leftFace =
      this.current > 0
        ? this.leaves[this.current - 1].querySelector('.back')
        : this.book.querySelector('.page-base.left .face');
    const rightFace =
      this.current < this.last
        ? this.leaves[this.current].querySelector('.front')
        : this.book.querySelector('.page-base.right .face');
    [leftFace, rightFace].forEach(
      (face) => face && face.querySelectorAll('a,button').forEach((el) => (el.tabIndex = 0))
    );
  }

  /* Freezes the old page's animation until the turn lands, then plays the new page's animation. */
  updateAnimations(turning, settleTime) {
    const newVisual =
      this.current > 0 ? this.leaves[this.current - 1].querySelector('.back .visual') : null;
    const others = [...this.book.querySelectorAll('.visual')].filter((v) => v !== newVisual);
    clearTimeout(this.playTimer);
    clearTimeout(this.stopTimer);
    others.forEach((v) => {
      if (v.classList.contains('play')) v.classList.add('hold');
    });
    this.stopTimer = setTimeout(
      () => others.forEach((v) => v.classList.remove('play', 'hold')),
      settleTime
    );

    if (newVisual && !newVisual.classList.contains('play')) {
      this.playTimer = setTimeout(
        () => {
          newVisual.classList.remove('hold');
          void newVisual.offsetWidth;
          newVisual.classList.add('play');
        },
        380 + turning * ProjectBook.TURN_STAGGER
      );
    } else if (newVisual) {
      newVisual.classList.remove('hold');
    }
  }

  updateControls() {
    this.prevButton.disabled = this.current === 0;
    this.nextButton.disabled = this.current === this.last;
    this.counter.textContent =
      this.current === 0
        ? 'Contents'
        : this.current === this.last
          ? 'The end'
          : `Project ${this.current} of ${this.projects.length}`;
  }

  /* The cue points forward on the first page, backward on the last page, otherwise in the direction of the last turn. */
  updateCueDirection(previous) {
    if (this.current === 0) this.cueDirection = 1;
    else if (this.current === this.last) this.cueDirection = -1;
    else if (this.current !== previous) this.cueDirection = this.current > previous ? 1 : -1;
  }

  playCue() {
    this.cue.classList.remove('play');
    this.cue.classList.toggle('back', this.cueDirection < 0);
    void this.cue.offsetWidth;
    this.cue.classList.add('play');
  }

  scheduleCue() {
    clearTimeout(this.cueTimer);
    if (!this.bookSeen) return;
    this.cueTimer = setTimeout(() => {
      if (this.bookVisible) this.playCue();
      this.scheduleCue();
    }, ProjectBook.CUE_REPEAT);
  }

  /* Shows the cue shortly after the book first comes into view, then every 15 seconds while it stays in view. */
  watchVisibility() {
    new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          this.bookVisible = entry.isIntersecting;
          if (this.bookVisible && !this.bookSeen) {
            this.bookSeen = true;
            setTimeout(() => this.playCue(), 250);
            this.scheduleCue();
          }
        }),
      { threshold: 0.5 }
    ).observe(this.book);
  }

  /* Draws the cover stitching so it follows the curved page edges, mirrored on both sides of the spine. */
  drawStitching() {
    const cover = this.book.querySelector('.cover');
    const svg = cover && cover.querySelector('.stitch');
    if (!svg) return;

    const bezier = (p, t) => {
      const u = 1 - t;
      return [
        u * u * u * p[0][0] +
          3 * u * u * t * p[1][0] +
          3 * u * t * t * p[2][0] +
          t * t * t * p[3][0],
        u * u * u * p[0][1] +
          3 * u * u * t * p[1][1] +
          3 * u * t * t * p[2][1] +
          t * t * t * p[3][1]
      ];
    };
    const sample = (segments) => {
      const points = [];
      segments.forEach((seg, i) => {
        for (let k = i ? 1 : 0; k <= 16; k++) points.push(bezier(seg, k / 16));
      });
      return points;
    };
    const top = sample(ProjectBook.TOP_EDGE),
      bottom = sample(ProjectBook.BOTTOM_EDGE);

    const W = cover.offsetWidth,
      H = cover.offsetHeight;
    const pageWidth = this.book.offsetWidth / 2,
      pageHeight = this.book.offsetHeight;
    const offsetY = 20,
      gap = 10,
      side = 14,
      mid = W / 2;
    const topY = (y) => offsetY - gap + (pageHeight * y) / 1000;
    const bottomY = (y) => offsetY + pageHeight + gap - (pageHeight * (1000 - y)) / 1000;

    const rightTop = top.map(([x, y]) => [mid + (pageWidth * x) / 100, topY(y)]);
    const leftTop = top.map(([x, y]) => [mid - (pageWidth * x) / 100, topY(y)]).reverse();
    const rightBottom = bottom.map(([x, y]) => [mid + (pageWidth * x) / 100, bottomY(y)]).reverse();
    const leftBottom = bottom.map(([x, y]) => [mid - (pageWidth * x) / 100, bottomY(y)]);

    const points = [
      [side, leftTop[0][1]],
      ...leftTop,
      ...rightTop,
      [W - side, rightTop[rightTop.length - 1][1]],
      [W - side, rightBottom[0][1]],
      ...rightBottom,
      ...leftBottom,
      [side, leftBottom[leftBottom.length - 1][1]]
    ];
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    svg
      .querySelector('path')
      .setAttribute(
        'd',
        'M' + points.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + ' Z'
      );
  }
}
