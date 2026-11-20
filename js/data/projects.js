/* Project content and the animated sketch shown for each project. */

const PIPELINE_STEPS = [
  'Collect raw data',
  'Clean and validate',
  'Pipeline in Fabric',
  'Train ML model',
  'Power BI dashboard'
];

const CHART_BARS = [38, 58, 50, 74, 66, 86, 96];

const PHONE_TASKS = [
  { title: 'Pay residence fee', priority: 'Low', from: 0, to: 1, done: true },
  { title: 'Study for HCI test', priority: 'Med', from: 1, to: 2 },
  { title: 'Email lecturer', priority: 'Low', from: 2, to: 3 },
  { title: 'Submit project report', priority: 'High', from: 3, to: 0, urgent: true }
];

const PHONE_ROW_HEIGHT = 60;

const PROJECT_VISUALS = {
  pipeline: `
    <div class="viz">
      <div class="pipe">
        ${PIPELINE_STEPS.map((step) => `<div class="st">${step}</div>`).join('')}
        <span class="dot"></span>
      </div>
    </div>`,

  clinic: `
    <div class="viz">
      <div class="shots">
        <figure class="shot main">
          <div class="bar"><i></i><i></i><i></i></div>
          <img src="img/clinic-landing.webp" alt="UMP Clinic landing page" loading="lazy" />
        </figure>
        <figure class="shot side">
          <div class="bar"><i></i><i></i><i></i></div>
          <img src="img/clinic-login.webp" alt="UMP Clinic login page" loading="lazy" />
        </figure>
      </div>
    </div>`,

  chart: `
    <div class="viz">
      <div class="chart">
        <div class="bars">
          ${CHART_BARS.map(
            (height, i) =>
              `<div class="bar ${i === CHART_BARS.length - 1 ? 'hi' : ''}" style="--h:${height}%;animation-delay:${i * 0.12}s"></div>`
          ).join('')}
          <svg viewBox="0 0 100 100" preserveAspectRatio="none">
            <polyline points="7,70 21,52 35,58 50,34 64,40 78,22 93,12" />
          </svg>
        </div>
        <div class="cap">Exploring trends in the cleaned data</div>
      </div>
    </div>`,

  phone: `
    <div class="viz">
      <div class="phone">
        <div class="scr">
          <h4>Today</h4>
          <div class="tasks">
            ${PHONE_TASKS.map(
              (task) => `
              <div class="task ${task.done ? 'done' : ''} ${task.urgent ? 'urgent' : ''}"
                   style="--from:${task.from * PHONE_ROW_HEIGHT}px;--to:${task.to * PHONE_ROW_HEIGHT}px">
                <span class="c"></span>
                <span class="t">${task.title}</span>
                <span class="p">${task.priority}</span>
                <span class="pin"></span>
              </div>`
            ).join('')}
          </div>
        </div>
      </div>
    </div>`,

  github: `
    <div class="viz">
      <div class="gh">
        <div class="r">WelzCode<small>Profile and overview</small></div>
        <div class="r">Data platform<small>Coming soon</small></div>
        <div class="r">Coursework<small>Java, Python and Streamlit</small></div>
      </div>
    </div>`
};

const PROJECTS = [
  {
    id: 'platform',
    title: 'End-to-end data platform',
    kind: 'In progress',
    visual: 'pipeline',
    text: 'One project that covers the full data workflow: collecting raw data, cleaning it, moving it through pipelines, training a machine learning model and presenting the results in a Power BI dashboard.',
    mine: "I'm designing and building the whole system myself, using it to put my DP-700, AI-300 and PL-300 skills to work in one place.",
    stack: ['Python', 'Microsoft Fabric', 'Azure ML', 'Power BI'],
    links: []
  },
  {
    id: 'clinic',
    title: 'UMP Clinic web app',
    kind: 'Team project',
    visual: 'clinic',
    text: 'A clinic booking and management system for university students, with a student portal and an admin dashboard. Students sign up, verify their email and book clinic visits.',
    mine: 'I built the student dashboards, worked on the backend database logic and contributed to the email verification feature.',
    stack: ['Node.js', 'Express', 'EJS', 'SQLite', 'Nodemailer'],
    repo: 'https://github.com/WelzCode/ump-clinic',
    links: []
  },
  {
    id: 'analysis',
    title: 'Python data analysis',
    kind: 'CHPC and NITheCS Summer School',
    visual: 'chart',
    text: 'Exploratory analysis of structured datasets during the CHPC and NITheCS Coding Summer School.',
    mine: 'I cleaned and prepared the data with Pandas and NumPy, then explored it to find patterns and trends.',
    stack: ['Python', 'Pandas', 'NumPy'],
    links: []
  },
  {
    id: 'tasks',
    title: 'Task manager and reminder app',
    kind: 'Mobile app',
    visual: 'phone',
    text: 'A database-driven app for organising and tracking tasks, with priorities and reminders.',
    mine: 'I designed the database schema and backend logic and wrote the SQL for creating, updating, reading and deleting tasks.',
    stack: ['Kotlin', 'SQL', 'MySQL'],
    links: []
  }
];
