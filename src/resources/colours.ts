const formatColour = (colour: string): string => `hex("${colour.replace("#", "")}")`;

const colourTable = {
	yellow: "#FFC152",
	green: "#5AD658",
	red: "#FF5733"
};

const formattedColourTable = {
	fYellow: formatColour(colourTable.yellow),
	fGreen: formatColour(colourTable.green),
	fRed: formatColour(colourTable.red)
};

export { colourTable as cols, formattedColourTable as fCols };
