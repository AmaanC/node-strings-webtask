# node-strings-webtask
A recreation of GNU Binutils' [`strings`](https://en.wikipedia.org/wiki/Strings_(Unix)) in a Node.js WebTask

# Usage

After cloning (`git clone`) and installing dependencies (`npm install`), it can be used like this:

      const Promise = require('bluebird');
      const stringsUtil = require('./pathToLib/app.js');

      stringsUtil.loadFromUrl('http://raw.githubusercontent.com/AmaanC/node-strings-webtask/master/test/example-files/test.zip').then(function(arr) {
            console.log(arr.join('\n'));
      });



# Example

[Here's the webtask in actual use.](https://webtask.it.auth0.com/api/run/wt-amaan_cheval-gmail_com-0/webtask?webtask_no_cache=1&url=https://raw.githubusercontent.com/AmaanC/node-strings-webtask/master/test/example-files/helloWorld) It may fail sometimes when tried repeatedly due to Github's rate-limiting.
