const bcrypt = require('bcryptjs');
const { generate } = require('generate-password')


async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}

async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}

async function generatePassword(len) {
    return await generate({ length: len, numbers: true });
}

module.exports = { hashPassword, comparePassword, generatePassword }
