// Note: Ensure @sendgrid/mail is installed: npm install @sendgrid/mail
const sgMail = require('@sendgrid/mail');

class EmailService {
  constructor() {
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      this.active = true;
    } else {
      console.warn('SendGrid API Key not found. Email Service initialized in mock mode.');
      this.active = false;
    }
  }

  /**
   * Sends an email.
   * @param {string} to - Recipient email.
   * @param {string} subject - Email subject.
   * @param {string} htmlContent - HTML content of the email.
   * @returns {Promise<void>}
   */
  async sendEmail(to, subject, htmlContent) {
    const msg = {
      to: to,
      from: process.env.SENDGRID_FROM_EMAIL || 'noreply@example.com', // Change to your verified sender
      subject: subject,
      html: htmlContent,
    };

    if (!this.active) {
      console.log('[MOCK EMAIL]', JSON.stringify(msg, null, 2));
      return;
    }

    try {
      await sgMail.send(msg);
      console.log('Email sent successfully to', to);
    } catch (error) {
      console.error('Error sending email:', error);
      if (error.response) {
        console.error(error.response.body);
      }
      throw error;
    }
  }

  /**
   * Sends a Resource Packet email.
   * @param {string} to - Recipient email.
   * @param {string} packetName - Name of the packet.
   * @param {Array} resources - Array of resource objects { title, content_url, type }.
   */
  async sendResourcePacket(to, packetName, resources) {
    const resourceLinks = resources.map(r =>
      `<li><a href="${r.content_url}">${r.title} (${r.type})</a></li>`
    ).join('');

    const html = `
      <h2>${packetName}</h2>
      <p>Here are the resources you requested:</p>
      <ul>
        ${resourceLinks}
      </ul>
      <p>Best regards,<br/>The Team</p>
    `;

    await this.sendEmail(to, `Resource Packet: ${packetName}`, html);
  }
}

module.exports = new EmailService();
