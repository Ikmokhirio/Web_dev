
function getRandomColorHexCode(transparency) { // Get RGB or RGBA hex color
    let color = "#";

    let l = 3;
    if(transparency) l = 4;

    for(var i = 0; i < l; i++) {
        color += Math.floor(Math.random() * 255).toString(16);
    }

    return color;
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
