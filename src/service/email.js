const nodemailer = require('nodemailer')
const { configuration } = require("../config/config");
const smtpTransport = require('nodemailer-smtp-transport')

async function sendEmail(to, subject, body) {
    const transporter = nodemailer.createTransport(
        smtpTransport({
            host: configuration.emailConfig.smtpUrl,
            port: 587,
            secure: false,
            auth: {
                user: configuration.emailConfig.senderEmail,
                pass: configuration.emailConfig.password,
            },
        })
    );
    const mailOptions = {
        from: configuration.emailConfig.senderEmail,
        to: to,
        subject: subject,
        html: body,
    };
    try {
        let res = await transporter.sendMail(mailOptions);

        if (res.accepted) {
            return;
        } else {
            return "error";
        }

    } catch (error) {
        console.log("err", error);

        return "error";
    }
}

module.exports = { sendEmail }