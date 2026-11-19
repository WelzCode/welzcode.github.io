/* Project tiles above the book: one button per project that opens that project in the book or the mobile cards. */

class ProjectTiles {
  constructor(projects, book, mobileBook) {
    this.container = document.getElementById('tiles');
    this.book = book;
    this.mobileBook = mobileBook;
    this.container.innerHTML = projects
      .map(
        (p, i) =>
          `<button class="tile" type="button" data-i="${i}"><span class="k">${p.kind}</span><b>${p.title}</b><span class="s">${p.stack.slice(0, 3).join(', ')}</span></button>`
      )
      .join('');
    this.container.addEventListener('click', (e) => this.open(e));
  }

  open(e) {
    const tile = e.target.closest('.tile');
    if (!tile) return;
    const index = +tile.dataset.i;
    if (this.book.isVisible()) {
      this.book.goTo(index + 1);
      this.book.stage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      this.mobileBook.goTo(index + 2);
      this.mobileBook.track.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
}
