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
        console.log("START");

        User.findOne({username: username}, function (err, user) {
            if (err) console.log("ERROR");
            if (!user) {
                console.log("USER DOES NOT EXIST");
                return done(null, false, {message: "INCORRECT USERNAME"});
            }
            console.log("VALIDATING PASSWORD...");

            user.validatePassword(password).then((result) => {
                console.log(typeof result);
                if (result) {
                    console.log("SUCCESS");
                    return done(null, user);
                }
                console.log("INCORRECT PASSWORD");
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
        console.log("START");

        User.findOne({username: username}, function (err, user) {
            if (err) console.log("ERROR");
            if (user) {
                console.log("USER ALREADY EXIST");
                return done(null, false, {message: "USER ALREADY EXIST"});
            }

            uploadUserToDatabase(username, password).then((newUser) => {
                if (newUser) {
                    console.log("USER WAS ADDED");
                    return done(null, newUser);
                }
                console.log("AN ERROR OCCURRED");
                return done(null, false);

            });


        });
    }
);

passport.serializeUser(function (user, done) {
        done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    console.log("TEST");
    User.findById(id).then((user) => {
        console.log("CALLED");
        done(null, user);
    });
});

passport.use('login', loginStrategy);
passport.use('register', registerStrategy);


exports.passport = passport;