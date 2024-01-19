const dotenv = require('dotenv');
dotenv.config();

const configuration = {
    dbUrl: process.env.DATABASE_URL,
    jwtCode: process.env.JWT_SECRET_CODE,
    jwtExpireTime: process.env.SESSION_TIME || "5s",
    emailConfig: {
        senderEmail: process.env.SEND_EMAIL,
        password: process.env.EMAIL_PASSWORD,
        smtpUrl: process.env.SMTP_URL,

    }
}

module.exports = { configuration };