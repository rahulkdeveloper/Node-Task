const fs = require('fs');
const path = require('path');
const { request, response } = require('express')

const logFilePath = path.join(__dirname, 'user-activity.log');


function logger() {
    return async (request, response, next) => {
        console.log(request);

        const timestamp = new Date().toISOString();
        const method = request.method;
        const url = request.url;
        const userId = request.user ? request.user._id : 'Anonymous';

        let logEntry = `[${timestamp}] User ${userId} accessed ${method} ${url}`;

        fs.appendFile(logFilePath, logEntry, (err) => {
            if (err) {
                console.error('Error writing to user-activity.log:', err);
            }
        });


        next();
    }




}


module.exports = logger;