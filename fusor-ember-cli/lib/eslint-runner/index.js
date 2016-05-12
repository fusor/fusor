var CLIEngine = require('eslint').CLIEngine;

module.exports = {
  name: 'eslint-runner',

  preBuild: function(result) {
    var cli = new CLIEngine({
      configFile: '.eslintrc.js'
    });

    var report = cli.executeOnFiles(['app']);
    console.log('Errors occurred during linting -> ', report.errorCount);

    if(report.errorCount !== 0) {
      // Dump errors, kill the build if we're running under travis
      //
      // Default formatter is "stylish", human readable output for console.
      // See: http://eslint.org/docs/developer-guide/nodejs-api
      var formatter = cli.getFormatter();
      console.log(formatter(report.results));

      if(process.env['TRAVIS_CI']) {
        // Fail the build process if we're running inside Travis.
        throw 'Failed to pass ESLint, killing ember build';
      }
    } else {
      console.log('eslint passed! Continuing with ember build...');
    }
  }
};
