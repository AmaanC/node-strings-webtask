const assert = require('chai').assert;
const Promise = require('bluebird');
const fs = Promise.promisifyAll(require('fs'));
const stringsUtil = require('../');

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
