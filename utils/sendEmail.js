const nodemailer = require("nodemailer");

module.exports = async (userEmail, subject, htmltemplate) => {
  const transporter = nodemailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth: {
      user: process.env.APP_EMAIL_ADDRESS,
      pass: process.env.APP_EMAIL_PASSWORD,
    },
    connectionTimeout:10000
  });

  transporter.options.dns={family:4}

  const mailOptions = {
    from: process.env.APP_EMAIL_ADDRESS,
    to: userEmail,
    subject: subject,
    html: htmltemplate,
  };

  try {
    const info =  transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("Nodemailer error:", error);
    throw new Error(
      "Failed to send email. Please check your email configuration."
    );
  }
};
