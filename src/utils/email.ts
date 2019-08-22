const sgMail = require('@sendgrid/mail');

import { config } from '../config';

sgMail.setApiKey(config.emailerApiKey);

export const sendEmail = async function send(receiver: string | string[], subject: string, html: string) {
  const msg = {
    to: receiver,
    from: config.emailFrom,
    subject,
    html,
  };

  await sgMail.sendMultiple(msg);
}
