# fuser-ember-cli

This repo is the development environment to create [FusorUi](https://github.com/fusor/fusor/ui/) which a rails engine that is added to [Foreman](https://github.com/theforeman/foreman/).

[FusorUi](https://github.com/fusor/ui/) is essentially the output from this repo which is an [ember-cli](http://www.ember-cli.com/) project that contains assets such as javascript, stylesheets, images, and fonts.

## Important Note

The fuser-ember-cli/dist directory is the [.gitignore](https://github.com/fusor/fusor/blob/master/.gitignore) so you wont find it in this repository.

The fuser-ember-cli/dist distory is generated automatically by [ember-cli](http://www.ember-cli.com/) when you run `ember server` or `ember build` locally inside the this directory.

Purely static files (those that are not part of the build) should be checked
in under `../ui/public/fusor_ui`. They will be served in both the dev and iso
environments at:

`${HOSTNAME}/fusor_ui/`

i.e.

`https://sat61fusor.example.com/fusor_ui/files/QCI_Requirements.txt`

## Development Workflow

1. Ensure that your [Foreman settings.yaml](https://github.com/theforeman/foreman/) has `login: false` and `require_ssl: false`. Otherwise, API calls will not authenticate properly.
2. Clone [fusor](https://github.com/fusor/fusor/) to your local workstation.
3. `cd fusor-ember-cli`
4. In [controllers/application.js](https://github.com/fusor/fusor-ember-cli/blob/master/app/controllers/application.js#L8), change `deployAsPlugin` from `true` to `false`. If `false`, it shows a menu bar for development which is not needed when running inside Foreman/Katello.
5. [Update your ember-cli-build.js to include these lines](https://github.com/isratrade/fusor/blob/devpick/fusor-ember-cli/ember-cli-build.js#L30-#L68)
6. Run $ ember server --proxy http://sat61dev.example.com/ or whatever URL of your Foreman/Katello instance. This tells the ember server to proxy API calls to Foreman/Katello:
7. HAPPY HACKING!
8. BEFORE running next step, in [controllers/application.js](https://github.com/fusor/fusor-ember-cli/blob/master/app/controllers/application.js#L8), change `deployAsPlugin` back to `true` and remove the app.import() lines you added to the Brocfile.js in step 4
9. Run bash script [`./copy-fusor-ember-cli-to-ui-assets`](https://github.com/fusor/fusor-ember-cli/blob/master/copy-fusor-ember-cli-to-ui-assets) which copies files from `fusor/fusor-ember-cli/dist` to the `fusor/ui` repo
10. Git commit code
11. Send pull request. CAREFUL: Ensure that you're pull request does not include `deployAsPlugin: false` or the extra app.import() lines.

## API MOCKS for RHEV and OpenStack

If you want to use use API mock responses for development only using ember-cli, please apply [this commit](https://github.com/fusor/fusor/commit/367fbb466c2a7a14f1b12c1f3a4ee9f3f15bb6bc).

## Requirements for QE Automated Testing

Quality Engineering (QE) requires that a unique data attribute called `data-qci` is assigned to each <input> tag for automated testing. Developers should manually add `data-qci` or alternatively, the {{text-f}} component helper will automatically add `data-qci` if a local variable called `cssId` is passed. For example:

```
{{text-f label="Name" value=value cssId='any-unique-name'}}
```
This autmatically generates the following.

```
<input type="text" id="any-unique-name" data-qci="any-unique-name">
```

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](http://git-scm.com/)
* [Node.js](http://nodejs.org/) (with NPM)
* [Bower](http://bower.io/)
* [Ember CLI](http://www.ember-cli.com/)
* [PhantomJS](http://phantomjs.org/)

## Installation

* `git clone <repository-url>` this repository
* change into the new directory
* `npm install`
* `bower install`

## Running / Development

* `ember server --proxy http://foreman.url`
* Visit your app at [http://localhost:4200](http://localhost:4200).

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

* [ember.js](http://emberjs.com/)
* [ember-cli](http://www.ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)

