const assert = require('chai').assert;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const stringsUtil = require('../');

// A helper that converts our arrays into strings of the format
// that strings outputs
// The output file ends with a newline, whereas
// our arr.join'd string won't.
// Apart from that, they should be identical
const arrToString = (stringsArray) =>
	  (stringsArray.join('\n') + '\n');
const filesPath = './test/example-files/';

describe('stringsUtil', function() {
    describe('.printFromBuffer', function() {
	it('should find the string \'hurray\'', function() {
	    const stringBuffer = Buffer.from('hurray!', 'ascii');
	    const stringsArray = stringsUtil.printFromBuffer(stringBuffer);
	    // There should be only one string: 'hurray!'
	    assert.equal(stringsArray.length, 1);
	    assert.equal('hurray!', stringsArray[0]);
	});
    });
    
    describe('.printFromBuffer: minChars=10', function() {
	it('should find no strings in buffer', function() {
	    const stringBuffer = Buffer.from('hurray!', 'ascii');
	    const stringsArray = stringsUtil.printFromBuffer(stringBuffer, minChars = 10);
	    assert.equal(stringsArray.length, 0);
	});
    });
    
    describe('.printFromBuffer: isPrintableFn', function() {
	it('should print only a\'s', function() {
	    const stringBuffer = Buffer.from('laaaaaaame', 'ascii');
	    const stringsArray = stringsUtil.printFromBuffer(
		stringBuffer,
		4,
		(charCode) => (String.fromCharCode(charCode) === 'a')
	    );
	    
	    // 
	    assert.equal(stringsArray.length, 1);
	    assert.equal('aaaaaaa', stringsArray[0]);
	});
    });
    
    describe('.printFromFile', function() {
	
	const binaryFilePath = filesPath + 'helloWorld';

	describe('defaultOpt', function() {
	    it('should print all strings in a file', function() {
		const getTextFileContents = fs.readFileAsync(filesPath + 'defaultOutput.txt', 'ascii');
		
		const getDefaultStrings = stringsUtil.printFromFile(binaryFilePath).then(arrToString);
		
		return Promise.all([getTextFileContents, getDefaultStrings]).then(
		    function([fileText, stringsFromFile]) {
			assert.equal(fileText, stringsFromFile);
		    }
		);
	    });
	});

	describe('tenChar', function() {
	    it('should print strings > 10 chars', function() {
		const getTextFileContents = fs.readFileAsync(filesPath + 'tenChars.txt', 'ascii');
		
		const getTenCharStrings = stringsUtil.printFromFile(binaryFilePath, 10).then(arrToString);
		
		return Promise.all([getTextFileContents, getTenCharStrings]).then(
		    function([fileText, stringsFromFile]) {
			assert.equal(fileText, stringsFromFile);
		    }
		);
	    });
	});

    });

    describe('.printFromUrl', function() {
	it('should print all strings from a URL', function() {
	    // We're printing all the strings in a zip file, which is
	    // actually very interesting to see after compression!
	    const zipUrl = 'https://github.com/AmaanC/node-strings-webtask/blob/master/test/example-files/test.zip?raw=true';

	    const getTextFileContents = fs.readFileAsync(filesPath + 'zipOutput.txt', 'ascii');

	    const getStringsFromUrl = stringsUtil.printFromUrl(zipUrl).then(arrToString);
	    return Promise.all([getTextFileContents, getStringsFromUrl]).then(
		function([fileText, stringsFromUrl]) {
		    console.log(stringsFromUrl);
		    assert.equal(fileText, stringsFromUrl);
		}
	    );
	});
    });

});
