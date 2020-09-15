
function getRandomColor() { // Get RGBA hex color
    let color = "#";

    for(var i = 0; i < 4; i++) {
        color += Math.floor(Math.random() * 255).toString(16);
    }
    return color;
}
