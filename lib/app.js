const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const http = require('follow-redirects').http;
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

/* Declaring some defaults options for all utility functions to use
 */
stringsUtil.DEFAULT_OPTS = {
    minChars: 4,
    isPrintableFn: isPrintableCharCode
};

/*
 * Give it a buffer and it'll find all printable strings within it longer
 * than minChars.
 * A custom isPrintableFn can be passed too to change the testing mechanism
 */
stringsUtil.printFromBuffer = function(fileBuffer, { minChars = 4, isPrintableFn = isPrintableCharCode } = stringsUtil.DEFAULT_OPTS) {
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
stringsUtil.printFromFile = function(filePath, opts = stringsUtil.DEFAULT_OPTS) {
    return Promise.try(function() {
	return fs.readFileAsync(filePath);
    })
    .then(function(fileBuffer) {
	return stringsUtil.printFromBuffer(fileBuffer, opts);
    });
};

/*
 * Returns a Promise which will return an array of all printable
 * in the file loaded from the URL
 */
stringsUtil.printFromUrl = function(url, opts = stringsUtil.DEFAULT_OPTS) {
    let bufferChunks = [];
    return new Promise(function(resolve, reject) {
	http.get(url, function(res) {
	    res.on('data', function(chunk) {
		bufferChunks.push(chunk);
	    });
	    res.on('end', function() {
		let urlBuffer = Buffer.concat(bufferChunks);
		resolve(urlBuffer);
	    });
	}).on('error', reject);
    })
    .then(function(urlBuffer) {
	return stringsUtil.printFromBuffer(urlBuffer, opts);
    });
};

module.exports = stringsUtil;
