const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const stringsUtil = {};

/*
 * Simple utility function that checks if a charCode is printable or not.
 * 
 */
const isPrintableCharCode = function(charCode) {
    const asciiChar = String.fromCharCode(charCode);
    // We accept all alphanumeric characters + space + newline + tab
    return (
	asciiChar === '\n' || asciiChar === '\t' ||
	(charCode > 31 && charCode < 127)
    );
};

/*
 * Give it a buffer and it'll find all printable strings within it longer
 * than minChars.
 * A custom isPrintableFn can be passed too to change the testing mechanism
 */
stringsUtil.printFromBuffer = function(fileBuffer, minChars = 4, isPrintableFn = isPrintableCharCode) {
    let curStreak = 0;
    let stringList = [];
    let startPos = 0;
    
    for (let [curPos, curByte] of fileBuffer.entries()) {
	if (isPrintableFn(curByte)) {
	    curStreak++;
	}
	else {
	    if (curStreak >= minChars) {
		stringList.push(fileBuffer.slice(startPos, curPos).toString());
	    }
	    startPos = curPos + 1;
	    curStreak = 0;
	}
    }

    // In case the loop ended and we still have a string
    if (curStreak >= minChars) {
	stringList.push(fileBuffer.slice(startPos).toString());
    }

    return stringList;
};

/*
 * Loads a local file as a stream and analyzes the buffer
 * for a minimum number of printable characters.
 *
 * Returns an array of printable strings longer than minChars
 */
stringsUtil.printFromFile = function(filePath, minChars = 4, isPrintableFn = isPrintableCharCode) {
    return Promise.try(function() {
	return fs.readFileAsync(filePath);
    })
    .then(function(fileBuffer) {
	return stringsUtil.printFromBuffer(fileBuffer, minChars, isPrintableFn);
    });
};

module.exports = stringsUtil;
