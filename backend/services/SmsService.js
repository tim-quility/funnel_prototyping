const twilio = require('twilio');

class SmsService {
  constructor() {
    this.client = null;
    if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
      this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    } else {
      console.warn('Twilio credentials not found. SMS Service initialized in mock mode.');
    }
  }

  /**
   * Sends an SMS to a recipient.
   * @param {string} to - The recipient's phone number.
   * @param {string} body - The message content.
   * @returns {Promise<object>} - The Twilio message object.
   */
  async sendSms(to, body) {
    if (!this.client) {
      console.log(`[MOCK SMS] To: ${to}, Body: ${body}`);
      return { sid: 'mock_sid', status: 'sent' };
    }

    try {
      const message = await this.client.messages.create({
        body: body,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: to
      });
      return message;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error;
    }
  }

  /**
   * Replaces placeholders in a template with actual values.
   * @param {string} template - The message template.
   * @param {object} variables - Key-value pairs for substitution.
   * @returns {string} - The interpolated string.
   */
  processTemplate(template, variables) {
    return template.replace(/\{\{(\w+)\}\}/g, (_, key) => variables[key] || '');
  }
}

module.exports = new SmsService();
