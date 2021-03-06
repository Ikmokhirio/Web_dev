const mongoose = require('mongoose');
const uri = require('./config/keys').mongodb.uri
const User = require("./user").User
const argon = require("argon2")


async function addUserToDatabase(username, password) {

    const hashedPassword = await argon.hash(password);
    let userUpload = new User({
        username: username,
        password: hashedPassword
    });
    argon.verify(hashedPassword, password).then(() => {
        userUpload.save().then(() => {
            console.log("New uer added");
        });
    }).catch((err) => {
        console.err(err + ' Invalid password supplied!');
        userUpload = undefined;
    });
    return userUpload;
}


function initDatabase() {
    mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true}).then(() => {
        console.log("SUCCESSFUL CONNECT TO DATABASE");
    });
}

exports.initDatabase = initDatabase;
exports.uploadUserToDatabase = addUserToDatabase;

