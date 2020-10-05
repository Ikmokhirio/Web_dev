const mainUrl = '/api/DryavichevIvan/lab1/';
const functions = require("./functions");
const colorInputPage = "colorInput";
const functionInputPage = "functionInput";
const domainInputPage = "domainInput";
const loginPage = "login";
const registerPage = "register";
const logoutPage = "logout"
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

let header_data = {
    title: title,
    username: undefined,
    task1: mainUrl + colorInputPage,
    task2: mainUrl + functionInputPage,
    task3: mainUrl + domainInputPage
}

router = require("express").Router()
const passport = require('./pass').passport;

router.use(logRequestToConsole);

router.use(function (req, res, next) { // Get Logged User Username
    let user = req.user;
    if (user) {
        header_data.username = user.username;
    } else {
        header_data.username = undefined;
    }
    next();
});

router.get('/', function (req, res) {

    let options = {
        ...header_data
    }

    res.render('index.hbs', options);
});

router.get(mainUrl + functionInputPage, function (req, res) {
    let options = {
        ...header_data,
        ...{
            executePath: mainUrl + 'execute'
        }
    }
    res.render('functionInput.hbs', options);
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

    let options = {
        ...header_data,
        ...{
            answer: answer
        }
    }

    res.render('result.hbs', options);
});

router.get(mainUrl + colorInputPage, function (req, res) {

    let options = {
        ...header_data,
        ...{
            executePath: mainUrl + 'color'
        }
    }
    res.render('colorInput.hbs', options);
});

router.get(mainUrl + "color", function (req, res) {
    let colorType = req.query.type;

    if (colorType === undefined || (colorType.toLowerCase() !== 'rgba' && colorType.toLowerCase() !== 'rgb')) {
        throw new HttpError(BAD_REQUEST, "Incorrect data was passed");
    }

    let color = functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba');

    let options = {
        ...header_data,
        ...{
            answer: "Your color is : " + color
        }
    }

    res.render('result.hbs', options);
});

router.get(mainUrl + domainInputPage, function (req, res) {

    let options = {
        ...header_data,
        ...{
            executePath: mainUrl + 'domain'
        }
    }

    res.render('domainInput.hbs', options);
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

    let options = {
        ...header_data,
        ...{
            answer: answer
        }
    }

    res.render('result.hbs', options);
});

router.get('/' + loginPage, function (req, res) {

    let options = {
        ...header_data,
        ...{
            loginPath: '/' + loginPage,
            buttonName: 'LOG IN'
        }
    }

    res.render('login.hbs', options);
});

router.get('/' + registerPage, function (req, res) {

    let options = {
        ...header_data,
        ...{
            register: '/' + registerPage,
            buttonName: 'REGISTER'
        }
    }

    res.render('register.hbs', options);
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

router.get('/' + logoutPage, function (req, res) {
    req.logout()
    res.redirect('/');
});

router.use(function (req, res, next) {
    throw new HttpError(NOT_FOUND, 'Not Found');
});

router.use(function (err, req, res, next) {

    if (!err.statusCode) {
        err.statusCode = INTERNAL_SERVER_ERROR;
        err.name = INTERNAL_SERVER_ERROR + " ERROR";
    }

    let options = {
        ...header_data,
        ...{
            message: err.name + " " + err.message
        }
    }

    res.status(err.statusCode).render("error.hbs", options);
    next(err);
});

router.use(logErrorsToFile);

module.exports = router;