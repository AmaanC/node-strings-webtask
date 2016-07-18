const assert = require('chai').assert;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const stringsUtil = require('../');

describe('stringsUtil', function() {
    describe('.printFromBuffer', function() {
	it('should print all printable strings in a buffer', function() {
	    const stringBuffer = Buffer.from('hurray!', 'ascii');
	    const allStrings =  stringsUtil.printFromBuffer(stringBuffer);
	    assert.isAbove(allStrings.length, 0);
	    assert.equal('hurray!', allStrings[0]);
	});
    });
    
    describe('.printFromFile', function() {
	it('should print all strings in a file', function() {

	    const getTextFileContents = fs.readFileAsync('./example-files/stringsOutput.txt', 'ascii');
	    const getStringsFromFile = stringsUtil.printFromFile('./example-files/helloWorld').then(function(stringsArray) {
		return stringsArray.join('\n');
	    });
	    
	    Promise.all([
		getTextFileContents,
		getStringsFromFile
	    ])
	    .then(function([fileText, stringsFromFile]) {
		// The output file ends with a newline, whereas
		// our arr.join won't.
		// Apart from that, they should be identical
		assert.equal(fileText, stringsFromFile + '\n');
	    });
	});
    });

});
