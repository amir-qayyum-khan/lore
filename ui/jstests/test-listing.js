var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

Object.keys(window.__karma__.files).forEach(function(file) {
  'use strict';
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(file);
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base/',

  // dynamically load all test files
  deps: allTestFiles,

  // paths for required libraries
  paths: {
    'QUnit': 'node_modules/qunitjs/qunit/qunit',
    'react': 'ui/static/bower/react/react',
    'listing': 'ui/static/ui/js/listing.js'
  },

  // we have to kickoff karma, as it is asynchronous
  callback: window.__karma__.start
});

require(['QUnit', 'listing' ], function(QUnit, listing) {
  'use strict';
  QUnit.test('test formatGroupName', function(assert) {
    //assert.equal(listing.formatGroupName('hello'), 'hello');
    assert.ok(listing.formatGroupName('hello'));
    console.log('Hello');
  });
});

