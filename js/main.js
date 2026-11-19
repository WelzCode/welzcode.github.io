/* Entry point: creates each part of the page once the HTML has loaded. */

const book = new ProjectBook(PROJECTS);
const mobileBook = new MobileBook(PROJECTS);

new Dock();
new ProjectTiles(PROJECTS, book, mobileBook);
new ScrollEffects();
new StarField('stars');
new Clock('clockTime');
new ContactActions();
