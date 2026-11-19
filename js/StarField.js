/* Twinkling stars in the contact section. Positions come from a fixed seed so they stay the same on every visit. */

class StarField {
  constructor(elementId, count = 46) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;
    this.seed = 7;
    this.element.innerHTML = Array.from({ length: count }, () => this.star()).join('');
  }

  random() {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  star() {
    const big = this.random() < 0.22;
    const left = (2 + this.random() * 95).toFixed(1);
    const top = (5 + this.random() * 89).toFixed(1);
    const delay = (-this.random() * 3).toFixed(2);
    const duration = (2.6 + this.random() * 1.2).toFixed(1);
    return `<i class="${big ? 'big' : ''}" style="left:${left}%;top:${top}%;animation-delay:${delay}s;animation-duration:${duration}s"></i>`;
  }
}
