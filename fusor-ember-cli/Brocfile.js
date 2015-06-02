/* global require, module */

var EmberApp = require('ember-cli/lib/broccoli/ember-app');

// importBootstrapJS only for isEmberCliMode so that menu bar works
var app = new EmberApp({
  storeConfigInMeta: false
});

// Use `app.import` to add additional libraries to the generated
// output files.
//
// If you need to use different assets in different
// environments, specify an object as the first parameter. That
// object's keys should be the environment name and the values
// should be the asset to use in that environment.
//
// If the library that you are including contains AMD or ES6
// modules that you would like to import into your application
// please specify an object with the list of modules as keys
// along with the exports of each module as its value.

app.import('bower_components/jquery-csv/src/jquery.csv.js');
app.import('bower_components/patternfly/dist/css/patternfly.min.css');


app.import('bower_components/patternfly/dist/fonts/OpenSans-Bold-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-Bold-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-BoldItalic-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-BoldItalic-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-ExtraBold-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-ExtraBold-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-ExtraBoldItalic-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-ExtraBoldItalic-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-Italic-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-Italic-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-Light-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-Light-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-LightItalic-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-LightItalic-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-Regular-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-Regular-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-Semibold-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-Semibold-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/OpenSans-SemiboldItalic-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/OpenSans-SemiboldItalic-webfont.woff', {destDir: 'fonts'});

app.import('bower_components/patternfly/dist/fonts/PatternFlyIcons-webfont.ttf', {destDir: 'fonts'});
app.import('bower_components/patternfly/dist/fonts/PatternFlyIcons-webfont.woff', {destDir: 'fonts'});

module.exports = app.toTree();
