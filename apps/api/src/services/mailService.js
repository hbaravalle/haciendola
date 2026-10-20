import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

async function sendLoginCode(email, code, minutesValid) {
  // No Resend key: print the code instead (local dev).
  if (!resend) {
    console.log(`[Mail] Login code for ${email}: ${code}`);
    return;
  }

  const { error } = await resend.emails.send({
    from: process.env.MAIL_FROM,
    to: email,
    subject: `${code} is your Haciéndola login code`,
    text:
      `Your Haciéndola login code is ${code}.\n` +
      `It expires in ${minutesValid} minutes and works once.\n\n` +
      "If you didn't try to log in, you can ignore this email.\n\n" +
      "Haciéndola is a demo project. Your email is only used to sign you in: " +
      "no newsletters, no ads, and it's never shared.",
  });
  if (error) {
    throw new Error(`Resend could not send the email: ${error.message}`);
  }
}

export { sendLoginCode };
