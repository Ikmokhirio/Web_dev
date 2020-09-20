
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