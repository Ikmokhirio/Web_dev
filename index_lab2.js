const functions = require("./lab1Functions");
const {
    HttpError,
    FORBIDDEN,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED
} = require("./HTTP_Error");

const mainUrl = '/api/DryavichevIvan/lab1/';
const port = 3000;

const authorizedUsername = 'admin';

const express = require("express");
const app = express();

const fs = require('fs');
const logFile = './test.log';

app.use(function (req, res, next) {
    let date = new Date();
    let logData = `${date} ${req.method} request at ${req.url}`;
    console.log(logData);

    next();
});

function authenticationCheck(req, res, next) { // Authentication
    let username = req.query.username;

    if (username === undefined) {
        throw new HttpError(FORBIDDEN, 'You don\'t have access to this page');
    }
    if (username.toLowerCase() !== authorizedUsername) {
        throw new HttpError(UNAUTHORIZED, 'You should authorize to access this page');
    }

    next();
}

app.get('/', function (req, res) {
    res.send("<h1>" + mainUrl + "functionName?key=value</h1><br>" +
        "<h4>№3 " + mainUrl + "color?type=rgba</h4>" +
        "<p>Get random color in hex. Type can be RGBA or RGB</p><br><br>" +
        "<h4>№6 " + mainUrl + "execute?function=f</h4>" +
        "<p>Executes \'f\' as function on server</p><br><br>" +
        "<h4>№16 " + mainUrl + "domain?address=a</h4>" +
        "<p>Checks if \'a\' is correct domain name</p><br><br>");
});

app.get(mainUrl + "execute", authenticationCheck, function (req, res) {
    let functionString = req.query.function;

    if (functionString === undefined) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    try {
        functions.executeFunction(new Function(functionString));
        res.send("Function was called successfully");
    } catch (e) {
        res.send("An error occurred\n" + e.message);
    }
});

app.get(mainUrl + "color", function (req, res) {
    let colorType = req.query.type;

    if (colorType === undefined || (colorType.toLowerCase() !== 'rgba' && colorType.toLowerCase() !== 'rgb')) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    res.send("Your color is : " + functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba'));

});

app.get(mainUrl + "domain", authenticationCheck, function (req, res) {
    let domainName = req.query.address;

    if (domainName === undefined) {
        res.status(BAD_REQUEST).send("Incorrect data was passed");
        return;
    }
    functions.isDomainCorrect(domainName) ? res.send("Domain is correct") : res.send("Domain in incorrect");

});

app.use(function (req, res, next) { // 404 error
    throw new HttpError(NOT_FOUND, 'Not Found');
});

app.use(function (err, req, res, next) {
    //console.log(err.name);
    res.status(err.statusCode).send(err.name + "<br>" + err.message);
    next(err);
});

app.use(function (err, req, res, next) {

    let date = new Date();
    let logData = `${date} ${err.name} at ${req.url}\n`;

    fs.appendFile(logFile,logData,function(err) {
        if(err) throw (err);
        console.log("Error was writed to the log");
    })
});

app.listen(port, () => {
    console.log("SERVER STARTED AT %d PORT", port);
});