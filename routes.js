const mainUrl = '/api/DryavichevIvan/lab1/';
const functions = require("./lab1Functions");
const colorPage = "color_page";
const executePage = "execute_page";
const domainPage = "domain_page";
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
} = require("./HTTP_Error");

module.exports = function (app) {

    app.use(logRequestToConsole);

    app.get('/', function (req, res) {
        res.render('main.hbs', {
            title: title,
            task1: mainUrl + executePage,
            task2: mainUrl + colorPage,
            task3: mainUrl + domainPage
        });
    });

    app.get(mainUrl + "execute_page", function (req, res) {
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

        res.render('answer.hbs', {
            title: title,
            task1: mainUrl + executePage,
            task2: mainUrl + colorPage,
            task3: mainUrl + domainPage,
            answer: answer
        });
    });

    app.get(mainUrl + "color_page", function (req, res) {
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

        let color = functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba');
        res.render('answer.hbs', {
            title: title,
            task1: mainUrl + executePage,
            task2: mainUrl + colorPage,
            task3: mainUrl + domainPage,
            answer: "Your color is : " + color
        });
    });

    app.get(mainUrl + "domain_page", function (req, res) {
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

        res.render('answer.hbs', {
            title: title,
            task1: mainUrl + executePage,
            task2: mainUrl + colorPage,
            task3: mainUrl + domainPage,
            answer: answer
        });
    });

    app.use(function (req, res, next) {
        throw new HttpError(NOT_FOUND, 'Not Found');
    });

    app.use(function (err, req, res, next) {
        res.status(err.statusCode).render("error.hbs", {
            title: title,
            task1: mainUrl + executePage,
            task2: mainUrl + colorPage,
            task3: mainUrl + domainPage,
            message: err.name + " " + err.message
        });
        next(err);
    });

    app.use(logErrorsToFile);


}