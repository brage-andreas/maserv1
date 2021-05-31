const formatColour = (colour) => `hex("${colour.replace("#","")}")`;

const colourTable = {
    yellow: "#FFC152",
    green : "#5AD658",
    red   : "#FF5733"
}

const formatted = {
    yellow: formatColour(colourTable.yellow),
    green: formatColour(colourTable.green),
    red: formatColour(colourTable.red),
}

export { colourTable as default, formatted }