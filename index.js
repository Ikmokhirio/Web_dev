const functions = require("./lab1Functions");
const mainUrl = '/api/DryavichevIvan/lab1/';
const port = 3000;

const express = require("express");
const app = express();

app.get('/', function (req, res) {
    res.send("<h1>" +mainUrl + "functionName?key=value</h1><br>" +
        "<h4>№3 " + mainUrl + "color?type=rgba</h4>" +
        "<p>Get random color in hex. Type can be RGBA or RGB</p><br><br>" +
        "<h4>№6 " + mainUrl + "execute?function=f</h4>" +
        "<p>Executes \'f\' as function on server</p><br><br>" +
        "<h4>№16 " + mainUrl + "domain?address=a</h4>" +
        "<p>Checks if \'a\' is correct domain name</p><br><br>");
});

app.get(mainUrl + "execute", function (req, res) {
    let functionString = req.query.function;

    if (functionString === undefined) {
        res.status(400).send("Incorrect data was passed");
        return;
    }

    try {
        functions.executeFunction(new Function(functionString));
        res.send("Function was called successfully");
    } catch (e) {
        res.send("An error occurred\n" + e.message);
    }

});

app.get(mainUrl + "color", function (req, res) {
    let colorType = req.query.type;

    if (colorType === undefined || (colorType.toLowerCase() !== 'rgba' && colorType.toLowerCase() !== 'rgb')) {
        res.status(400).send("Incorrect data was passed");
        return;
    }

    res.send("Your color is : " + functions.getRandomColorHexCode(colorType.toLowerCase() === 'rgba'));

});

app.get(mainUrl + "domain", function (req,res) {
    let domainName = req.query.address;

    if (domainName === undefined) {
        res.status(400).send("Incorrect data was passed");
        return;
    }

    functions.isDomainCorrect(domainName) ? res.send("Domain is correct") : res.send("Domain in incorrect");

});

app.listen(port, () => {
    console.log("SERVER STARTED AT %d", port);
});