/* jslint node: true */

'use strict';

module.exports = {
  'githubAuth': {
    'clientID': process.env.GITHUB_KEY,
    'clientSecret': process.env.GITHUB_SECRET,
    'callbackURL': process.env.APP_URL + 'oauth/github/callback'
  }
};
