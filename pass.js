const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const CookieStrategy = require('passport-cookie').Strategy
const User = require('./user').User
const uploadUserToDatabase = require('./database').uploadUserToDatabase;

const loginStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (!user) {
                return done(null, false, {message: "Incorrect username"});
            }

            user.validatePassword(password).then((result) => {
                console.log(typeof result);
                if (result) {
                    return done(null, user);
                }

                return done(null, false, {message: 'Incorrect password'});
            });


        });
    }
);

const registerStrategy = new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    },
    function (req, username, password, done) {

        User.findOne({username: username}, function (err, user) {
            if (err) throw(err);
            if (user) {
                return done(null, false, {message: "User already exist"});
            }

            uploadUserToDatabase(username, password).then((newUser) => {
                if (newUser) {
                    return done(null, newUser);
                }

                return done(null, false, {message: "User was not added. Please try gain"});

            });


        });
    }
);

const cookieStrategy = new CookieStrategy({
    cookieName: 'session',
    passReqToCallback: true
}, function (req, session, done) {
    if (!req.user) return done(null, false, {message: "You should authorize"});
    User.findOne({username: req.user.username}, function (err, user) {
        if (err) throw (err);
        if (user) {
            return done(null, user);
        }
        return done(null, false, {message: "You should authorize"});
    });

});

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use('login', loginStrategy);
passport.use('register', registerStrategy);
passport.use('cookie', cookieStrategy);


exports.passport = passport;