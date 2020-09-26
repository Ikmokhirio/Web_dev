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
const colorPage = "color_page";
const executePage = "execute_page";
const domainPage = "domain_page";
const title = 'WEB DEV'

const express = require("express");
const hbs = require("hbs")

const app = express();
app.set('view engine', 'hbs');

hbs.registerPartials("./views/partials/")

const fs = require('fs');
const logFile = './test.log';

app.use(express.static("public")); // Делаем файлы со стилями публично доступными

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
    res.render('main.hbs', {
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage
    });
});

app.get(mainUrl+"execute_page", function (req, res) {
    res.render('execute_page.hbs', {
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        executePath: mainUrl + 'execute'
    });
});

app.get(mainUrl + "execute", authenticationCheck, function (req, res) {
    let functionString = req.query.function;

    if (functionString === undefined) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    let answer = "Function was called successfully";

    try {
        functions.executeFunction(new Function(functionString));
    } catch (e) {
        answer = "An error occurred: " + e.message;
    }

    res.render('answer.hbs',{
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        answer: answer
    });
});

app.get(mainUrl+"color_page", function (req, res) {
    res.render('color_page.hbs', {
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        executePath: mainUrl + 'color'
    });
});

app.get(mainUrl + "color", function (req, res) {
    let colorType = req.query.type;

    if (colorType === undefined || (colorType.toLowerCase() !== 'rgba' && colorType.toLowerCase() !== 'rgb')) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    // res.send("Your color is : " + functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba'));
    let color = functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba');
    res.render('answer.hbs',{
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        answer: "You color is : " + color
    });
});

app.get(mainUrl+"domain_page", function (req, res) {
    res.render('domain_page.hbs', {
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        executePath: mainUrl + 'domain'
    });
});

app.get(mainUrl + "domain", authenticationCheck, function (req, res) {
    let domainName = req.query.address;

    if (domainName === undefined) {
        res.status(BAD_REQUEST).send("Incorrect data was passed");
        return;
    }

    let answer = functions.isDomainCorrect(domainName) ? "Domain is correct" : "Domain in incorrect";

    res.render('answer.hbs',{
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        answer: answer
    });
});

app.use(function (req, res, next) { // 404 error
    throw new HttpError(NOT_FOUND, 'Not Found');
});

app.use(function (err, req, res, next) {
    //console.log(err.name);
    // res.status(err.statusCode).send(err.name + "<br>" + err.message);
    res.status(err.statusCode).render("error.hbs", {
        title: title,
        task1: mainUrl + executePage,
        task2: mainUrl + colorPage,
        task3: mainUrl + domainPage,
        message: err.name + " " + err.message
    });
    next(err);
});

app.use(function (err, req, res, next) {

    let date = new Date();
    let logData = `${date} ${err.name} at ${req.url}\n`;

    fs.appendFile(logFile, logData, function (err) {
        if (err) throw (err);
        console.log("Error was written to the log");
    })
});

app.listen(port, () => {
    console.log("SERVER STARTED AT %d PORT", port);
});