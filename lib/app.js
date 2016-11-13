const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const url = require('url');
const http = require('follow-redirects').http;
const https = require('follow-redirects').https;
const stringsUtil = {};

/*
 * Simple utility function that checks if a charCode is printable or not.
 * 
 */
const isPrintableCharCode = function(charCode) {
    const asciiChar = String.fromCharCode(charCode);
    // We accept all alphanumeric characters + space + tab
    return (
	asciiChar === '\t' ||
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
stringsUtil.getArrFromBuffer = function(fileBuffer, { minChars = 4, isPrintableFn = isPrintableCharCode } = stringsUtil.DEFAULT_OPTS) {
    let curStreak = 0;
    let stringList = [];
    let startPos = 0;

    if (minChars < 0) {
	throw new Error('minChars must be >= 0');
    }

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
 * Returns a promise which will contain an array of strings
 */
stringsUtil.loadFromFile = function(filePath, opts = stringsUtil.DEFAULT_OPTS) {
    return Promise.try(function() {
	return fs.readFileAsync(filePath);
    })
    .then(function(fileBuffer) {
	return stringsUtil.getArrFromBuffer(fileBuffer, opts);
    });
};

/*
 * Returns a Promise which will return an array of all printable
 * in the file loaded from the URL
 */
stringsUtil.loadFromUrl = function(inputUrl, opts = stringsUtil.DEFAULT_OPTS) {
    let bufferChunks = [];
    let client;
    return new Promise(function(resolve, reject) {
	const protocol = url.parse(inputUrl).protocol;
	if (protocol === 'http:') {
	    client = http;
	}
	else if (protocol === 'https:') {
	    client = https;
	}
	else {
	    throw new Error('URL needs a protocol (like "http:")');
	}

	client.get(inputUrl, function(res) {
	    res.on('data', function(chunk) {
		// We're saving all chunks as they come in so we can
		// analyze the buffer at the end for strings.
		// To save on memory, we could analyze chunks as they come
		// in and discard all the non-printable bytes.

		// I've chosen not to do that, but it may be worth considering.
		bufferChunks.push(chunk);
	    });
	    res.on('end', function() {
		let urlBuffer = Buffer.concat(bufferChunks);
		resolve(urlBuffer);
	    });
	}).on('error', reject);
    })
    .then(function(urlBuffer) {
	return stringsUtil.getArrFromBuffer(urlBuffer, opts);
    });
};

module.exports = stringsUtil;
