# fuser-ember-cli

This repo is the development environment to create [FusorUi](https://github.com/fusor/fusor/ui/) which a rails engine that is added to [Foreman](https://github.com/theforeman/foreman/).

[FusorUi](https://github.com/fusor/ui/) is essentially the output from this repo which is an [ember-cli](http://www.ember-cli.com/) project that contains assets such as javascript, stylesheets, images, and fonts.

## Important Note

The fuser-ember-cli/dist directory is the [.gitignore](https://github.com/fusor/fusor/blob/master/.gitignore) so you wont find it in this repository.

The fuser-ember-cli/dist distory is generated automatically by [ember-cli](http://www.ember-cli.com/) when you run `ember server` or `ember build` locally inside the this directory.

## Workflow

1. Clone [fusor](https://github.com/fusor/fusor/) to your local workstation.
2. `cd fusor-ember-cli`
3. Run `ember server`
4. Prepare for development
  - In [controllers/application.js](https://github.com/fusor/fusor/blob/master/fusor-ember-cli/app/controllers/application.js#L8), change `deployAsPlugin` from `true` to `false`
  - In [styles/app.scss](https://github.com/fusor/fusor/tree/master/fusor-ember-cli/app/styles/app.scss#L3), change `padding-top` from `40px` to `0px`
5. HAPPY HACKING!
6. Prepare for copying compiled ember-cli output code to [FusorUi](https://github.com/fusor/fusor/ui/) plugin
  - In [controllers/application.js](https://github.com/fusor/fusor-ember-cli/blob/master/app/controllers/application.js#L8), change `deployAsPlugin` from `false` to `true`
  - In [styles/app.scss](https://github.com/fusor/fusor-ember-cli/blob/master/app/styles/app.scss#L3), change `padding-top` from `0px` to `40px`
  - Run bash script [`./prep-fusor-repo`](https://github.com/fusor/fusor-ember-cli/blob/master/prep-fusor-repo) which copies files from `fusor/fusor-ember-cli/dist` to the `fusor/ui` repo

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM) and [Bower](http://bower.io/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server`
* Visit your app at http://localhost:4200.

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

Specify what it takes to deploy your app.

## Further Reading / Useful Links

* ember: http://emberjs.com/
* ember-cli: http://www.ember-cli.com/
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

