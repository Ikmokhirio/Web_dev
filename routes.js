const mainUrl = '/api/DryavichevIvan/lab1/';
const functions = require("./functions");
const colorInputPage = "colorInput";
const functionInputPage = "functionInput";
const domainInputPage = "domainInput";
const title = 'WEB DEV'
const authenticationCheck = require("./authentication").authenticationCheck
const logRequestToConsole = require("./logger").logRequestToConsole
const logErrorsToFile = require("./logger").logErrorsToFile
const {
    HttpError,
    FORBIDDEN,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED
} = require("./httpError");

router = require("express").Router()

router.use(logRequestToConsole);

router.get('/', function (req, res) {
    res.render('index.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage
    });
});

router.get(mainUrl + functionInputPage, function (req, res) {
    res.render('functionInput.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        executePath: mainUrl + 'execute'
    });
});

router.get(mainUrl + "execute", authenticationCheck, function (req, res) {
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

    res.render('result.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        answer: answer
    });
});

router.get(mainUrl + colorInputPage, function (req, res) {
    res.render('colorInput.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        executePath: mainUrl + 'color'
    });
});

router.get(mainUrl + "color", function (req, res) {
    let colorType = req.query.type;

    if (colorType === undefined || (colorType.toLowerCase() !== 'rgba' && colorType.toLowerCase() !== 'rgb')) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    let color = functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba');
    res.render('result.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        answer: "Your color is : " + color
    });
});

router.get(mainUrl + domainInputPage, function (req, res) {
    res.render('domainInput.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        executePath: mainUrl + 'domain'
    });
});

router.get(mainUrl + "domain", authenticationCheck, function (req, res) {
    let domainName = req.query.address;

    if (domainName === undefined) {
        res.status(BAD_REQUEST).send("Incorrect data was passed");
        return;
    }

    let answer = functions.isDomainCorrect(domainName) ? "Domain is correct" : "Domain in incorrect";

    res.render('result.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        answer: answer
    });
});

router.use(function (req, res, next) {
    throw new HttpError(NOT_FOUND, 'Not Found');
});

router.use(function (err, req, res, next) {
    res.status(err.statusCode).render("error.hbs", {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        message: err.name + " " + err.message
    });
    next(err);
});

router.use(logErrorsToFile);

module.exports = router;