/* Local time in Mpumalanga, shown in the contact section and updated every 20 seconds. */

class Clock {
  constructor(elementId) {
    this.element = document.getElementById(elementId);
    if (!this.element) return;
    this.format = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Africa/Johannesburg',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
    this.update();
    setInterval(() => this.update(), 20000);
  }

  update() {
    const [hours, minutes] = this.format.format(new Date()).split(':');
    this.element.innerHTML = `${hours}<i>:</i>${minutes}`;
  }
}
