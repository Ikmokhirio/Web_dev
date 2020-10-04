const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
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
                return done(null, false, {message: "INCORRECT USERNAME"});
            }

            user.validatePassword(password).then((result) => {
                console.log(typeof result);
                if (result) {
                    return done(null, user);
                }

                return done(null, false, {message: 'Incorrect password.'});
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
                return done(null, false, {message: "USER ALREADY EXIST"});
            }

            uploadUserToDatabase(username, password).then((newUser) => {
                if (newUser) {
                    return done(null, newUser);
                }

                return done(null, false);

            });


        });
    }
);

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


exports.passport = passport;