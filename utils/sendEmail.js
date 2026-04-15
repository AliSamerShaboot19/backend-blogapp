const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmltemplate) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.APP_EMAIL_ADDRESS,
    to: userEmail,
    subject: subject,
    html: htmltemplate,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Nodemailer error:", error);
    throw new Error(
      "Failed to send email. Please check your email configuration."
    );
  }
};
