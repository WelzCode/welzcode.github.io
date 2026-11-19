# Samkelo Welcome Chirwa – Portfolio

Personal portfolio site: about, skills, project book, work experience, certifications and contact.

Live site: https://welzcode.github.io

## Tech stack

- HTML, CSS and JavaScript (no framework, no build step)
- JavaScript organised as classes, one job per file
- GitHub Actions for CI/CD, deployed to GitHub Pages

## Project structure

```
welzcode.github.io/
├── index.html              Page structure
├── css/
│   ├── base.css            Colours, reset, typography, buttons
│   ├── sections.css        Hero, about, skills, work, certifications, contact
│   ├── book.css            Project book, project visuals, tiles, mobile cards
│   ├── nav.css             Dock menu and scroll cue
│   └── mobile.css          Tablet and phone styles (loaded last)
├── js/
│   ├── data/projects.js    Project content and project sketches
│   ├── PageTemplates.js    HTML templates for the project pages
│   ├── ProjectBook.js      Desktop book: page turning, page stacks, stitching, page-turn cue
│   ├── MobileBook.js       Mobile swipe cards, page dots and swipe hint
│   ├── ProjectTiles.js     Project tiles that open a project in the book
│   ├── Dock.js             Dock menu and active section tracking
│   ├── ScrollEffects.js    Hero parallax, contour drift, contact sunset, scrolled state
│   ├── StarField.js        Stars in the contact section
│   ├── Clock.js            Local time in Mpumalanga
│   ├── ContactActions.js   Copy email and certificate verify buttons
│   └── main.js             Creates each part of the page
├── img/                    Images and icons
├── Samkelo_Chirwa_CV.pdf   CV
└── .github/workflows/
    └── deploy.yml          CI/CD workflow
```

## Run locally

Open `index.html` in a browser, or use the Live Server extension in VS Code.

## Adding a project

Add an entry to `PROJECTS` in `js/data/projects.js`. The book, the mobile cards and the tiles all update from that list.

## Deployment

Every push and pull request to `main` runs a link and file check. When the check passes on `main`, the site is deployed to GitHub Pages.

## Image credits

Hero photo: Kurt Cotoaga on Unsplash.
