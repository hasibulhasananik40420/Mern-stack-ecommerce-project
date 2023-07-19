const nodemailer = require("nodemailer");
const { smptUserName, smptPassword } = require("../secret");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: smptUserName,
    pass: smptPassword,
  },
});

const emailWithNodemiller = async (emailData) => {
    try {
      const mailOptions = {
        from: smptUserName, // Sender address
        to:emailData.email, // Recipient address
        subject: emailData.subject, // Subject line
        html: emailData.html, // HTML body
      };
  
      // Check if the recipient email address is defined
      if (!mailOptions.to) {
        throw new Error('No recipient email address defined');
      }
  
      const info = await transporter.sendMail(mailOptions);
      console.log(info.response);
    } catch (error) {
      console.error('Error occurred while sending email:', error);
      throw error;
    }
  };
module.exports = emailWithNodemiller;
