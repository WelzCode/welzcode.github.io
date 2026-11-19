/* Contact and certificate buttons: copies the email address and marks certificate links as verified once opened. */

class ContactActions {
  static EMAIL = 'wellzchirwa22@gmail.com';

  constructor() {
    this.copyButton = document.getElementById('copyEmail');
    this.copyButton.addEventListener('click', () => this.copyEmail());
    document
      .querySelectorAll('.verify')
      .forEach((link) => link.addEventListener('click', () => this.markVerified(link)));
  }

  async copyEmail() {
    const label = this.copyButton.querySelector('.copied');
    try {
      await navigator.clipboard.writeText(ContactActions.EMAIL);
      label.textContent = 'Copied';
    } catch (_) {
      label.textContent = ContactActions.EMAIL;
    }
    this.copyButton.classList.add('done');
    setTimeout(() => this.copyButton.classList.remove('done'), 2500);
  }

  markVerified(link) {
    link.classList.add('visited');
    link.querySelector('span').textContent = 'Verified';
  }
}
