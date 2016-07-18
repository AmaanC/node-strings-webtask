'use latest';

const stringsUtil = require('./lib/app.js');

module.exports = function (ctx, done) {
    const ctxOpts = {
	minChars: ctx.data.minChars
    };
    if (!ctx.data.url) {
	done('A URL is required!');
    }
    stringsUtil.printFromUrl(ctx.data.url, ctxOpts)
	.then(function(printableStrings) {
	    done(null, printableStrings);
	})
	.catch(function(err) {
	    done(err);
	});
};
