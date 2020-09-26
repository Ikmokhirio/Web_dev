const port = 3000;

const express = require("express");
const hbs = require("hbs")
const app = express();

app.set('view engine', 'hbs');

hbs.registerPartials("./views/partials/")

app.use(express.static("public"));

const routes = require('./routes')(app);

app.listen(port, () => {
    console.log("SERVER STARTED AT %d PORT", port);
});