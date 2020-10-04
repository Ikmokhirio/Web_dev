const port = 3000;

const express = require("express");
const hbs = require("hbs")
const app = express();
const routes = require('./routes');
const bodyParser = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash')
const initDatabase = require('./database').initDatabase;
const cookieSession = require('cookie-session');
const keys = require('./config/keys');

initDatabase()

app.set('view engine', 'hbs');

hbs.registerPartials("./views/partials/");

app.use(express.static("public"));

app.use(cookieSession({
    name: 'session',
    // signed: false,
    keys: [keys.session.cookieSecret],
    maxAge: (24 * 60 * 60 * 1000)
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(routes);

app.listen(port, () => {
    console.log("SERVER STARTED AT %d PORT", port);
});