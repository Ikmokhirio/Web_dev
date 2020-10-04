const mainUrl = '/api/DryavichevIvan/lab1/';
const functions = require("./functions");
const colorInputPage = "colorInput";
const functionInputPage = "functionInput";
const domainInputPage = "domainInput";
const loginPage = "login";
const registerPage = "register";
const title = 'WEB DEV'
const logRequestToConsole = require("./logger").logRequestToConsole
const logErrorsToFile = require("./logger").logErrorsToFile
const {
    HttpError,
    FORBIDDEN,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
    INTERNAL_SERVER_ERROR
} = require("./httpError");

router = require("express").Router()
const passport = require('./pass').passport;

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

router.get(mainUrl + "execute", passport.authenticate("cookie",
    {
        failureRedirect: '/login',
        failureFlash: true
    }), function (req, res) {
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

router.get(mainUrl + "domain", passport.authenticate("cookie",
    {
        failureRedirect: '/login',
        failureFlash: true
    }), function (req, res) {
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

router.get('/' + loginPage, function (req, res) {
    res.render('login.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        loginPath: '/' + loginPage,
        buttonName: 'LOG IN'
    });
});

router.get('/' + registerPage, function (req, res) {
    res.render('login.hbs', {
        title: title,
        task1: mainUrl + colorInputPage,
        task2: mainUrl + functionInputPage,
        task3: mainUrl + domainInputPage,
        loginPath: '/' + registerPage,
        buttonName: 'REGISTER'
    });
});

router.post('/' + loginPage, passport.authenticate('login', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

router.post('/' + registerPage, passport.authenticate('register', {
    successRedirect: '/login',
    failureRedirect: '/',
    failureFlash: true
}));

router.use(function (req, res, next) {
    throw new HttpError(NOT_FOUND, 'Not Found');
});

router.use(function (err, req, res, next) {

    if (!err.statusCode) {
        err.statusCode = INTERNAL_SERVER_ERROR;
        err.name = INTERNAL_SERVER_ERROR + " ERROR";
    }

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