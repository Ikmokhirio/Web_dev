const logFile = './test.log';
const fs = require('fs');

function logRequestToConsole(req, res, next) {
    let date = new Date();
    let logData = `${date} ${req.method} request at ${req.url}`;
    console.log(logData);

    next();
}

function logErrorsToFile(err, req, res, next) {

    let date = new Date();
    let logData = `${date} ${err.name} at ${req.url}\n`;

    if(typeof(err.statusCode) !== "number") {
        err.statusCode = 500;
        err.statusMessage = "Internal server error";
    }

    fs.appendFile(logFile, logData, function (err) {
        if (err) throw (err);
        console.log("Error was written to the log");
    })
}

exports.logErrorsToFile = logErrorsToFile;
exports.logRequestToConsole = logRequestToConsole;