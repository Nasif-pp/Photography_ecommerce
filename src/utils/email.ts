import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

interface SendEmailProps {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: SendEmailProps) => {
  const msg = {
    to,
    from: process.env.EMAIL_FROM as string,
    subject,
    html,
  };

  await sgMail.send(msg);
};
