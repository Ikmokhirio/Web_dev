
function getRandomColorHexCode() { // Get RGBA hex color
    let rgbaColor = "#";

    for(var i = 0; i < 4; i++) {
        rgbaColor += Math.floor(Math.random() * 255).toString(16);
    }

    return rgbaColor;
}

function executeFunction(functionToExecute) { // Execute passed function

    if(typeof(functionToExecute) != "function") {
        let error = new Error("Invalid parameter passed");
        throw(error);
    }

    functionToExecute();
}

function isDomainCorrect(url) {
    if(typeof(url) != "string") {
        let error = new Error("Invalid parameter passed");
        throw(error);
    }

    if(url.length < 1 && url.length > 253) return false;

    let parts = url.split(".");

    for(let i = 0; i < parts.length; i++) {

        let part = parts[i].toLowerCase();

        if (part.length > 63) return false;

        if (!part.match(/^[a-z\d](-*[a-z\d])*$/)) {
            return false;
        }

    }

    return true;
}
