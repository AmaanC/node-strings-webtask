# node-strings-webtask
A recreation of GNU Binutils' [`strings`](https://en.wikipedia.org/wiki/Strings_(Unix)) in a Node.js WebTask.
It's mostly a project I worked on for fun, but it _could_ have potential use in something like an online
binary analysis toolkit.

# Usage

After cloning (`git clone`) and installing dependencies (`npm install`), it can be used like this:

      const stringsUtil = require('./pathToLib/app.js');
      const zipUrl = 'http://raw.githubusercontent.com/AmaanC/node-strings-webtask/master/test/example-files/test.zip';
      
      stringsUtil.loadFromUrl(zipUrl).then(function(arr) {
            console.log(arr.join('\n'));
      });



# Example

[Here's the webtask in actual use.](https://webtask.it.auth0.com/api/run/wt-amaan_cheval-gmail_com-0/webtask?webtask_no_cache=1&url=https://raw.githubusercontent.com/AmaanC/node-strings-webtask/master/test/example-files/helloWorld) It may fail sometimes when tried repeatedly due to Github's rate-limiting.

It can be modified easily by updating the `webtask.js` file in the root folder
and then running `npm run build` followed by `wt create build/webtask.js`.
Refer to `wt-cli`'s docs for more info.
