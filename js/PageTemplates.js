/* HTML templates for the project pages. Shared by the desktop book and the mobile cards. */

class PageTemplates {
  static GITHUB_ICON =
    '<svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.53-1.33-1.29-1.69-1.29-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.25.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.8 1.19 1.83 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>';

  static externalLink(text, url) {
    return `<a href="${url}" target="_blank" rel="noopener">${text}</a>`;
  }

  static heading(project) {
    return `<h3>${project.title}</h3><div class="kind">${project.kind}</div>`;
  }

  static details(project) {
    const repo = project.repo
      ? `<a class="gh-btn" href="${project.repo}" target="_blank" rel="noopener">${PageTemplates.GITHUB_ICON}View on GitHub</a>`
      : `<span class="gh-soon">GitHub repo coming soon</span>`;
    const links = project.links
      .map(([text, url]) => PageTemplates.externalLink(text, url))
      .join('');
    const stack = project.stack.map((s) => `<span>${s}</span>`).join('');
    return `<p>${project.text}</p><p class="mine">${project.mine}</p><div class="stack">${stack}</div><div class="links">${repo}${links}</div>`;
  }

  static textPage(project) {
    return PageTemplates.heading(project) + PageTemplates.details(project);
  }

  static visual(project) {
    return `<div class="visual">${PROJECT_VISUALS[project.visual]}</div>`;
  }

  static titlePage(description) {
    return `<div class="title-page"><h3>Projects</h3><div class="kind">by Samkelo Welcome Chirwa</div><p>${description}</p></div>`;
  }

  static contentsPage(projects) {
    const items = projects
      .map(
        (p, i) =>
          `<li><button type="button" data-go="${i + 1}">${p.title}</button><span>${i * 2 + 3}</span></li>`
      )
      .join('');
    return `<h3>Contents</h3><ul class="contents">${items}</ul>`;
  }

  static endLeft() {
    return `<div class="visual">${PROJECT_VISUALS.github}</div>`;
  }

  static endRight() {
    return `<div class="title-page"><h3>More on GitHub</h3><p>Smaller projects, coursework and new work are on my GitHub.</p><div class="links">${PageTemplates.externalLink('github.com/WelzCode', 'https://github.com/WelzCode')}</div></div>`;
  }
}
