# FusorUi

FusorUi is a rails engine that is added to [Foreman](https://github.com/theforeman/foreman/).

Fusor_ui is essentially the output from the /dist directory of [https://github.com/fusor/fusor-ember-cli/](https://github.com/fusor/fusor-ember-cli/) which is an [ember-cli](http://www.ember-cli.com/) project that contains assets such as javascript, stylesheets, images, and fonts.

## Important Note

Do NOT work directly on the files in [app/assets](https://github.com/fusor/fusor/tree/master/ui/app/assets). These files will be overwritten by future commits when the code in [fusor-ember-cli](https://github.com/fusor/fusor-ember-cli/) changes.

The fusor-ember-cli/dist directory is listed in the [.gitignore](https://github.com/fusor/fusor/blob/master/.gitignore) file of [fusor](https://github.com/fusor/fusor/) so you wont find it in the [fusor-ember-cli](https://github.com/fusor/fusor-ember-cli/) repository.

The /dist distory is generated automatically by [ember-cli](http://www.ember-cli.com/) if you run `ember server` or `ember build` inside the locally or inside the [fusor-ember-cli](https://github.com/fusor/fusor-ember-cli/) directory.

Follow the workflow below for more steps.

## Workflow

1. Clone [fusor](https://github.com/fusor/fusor/).
2. `cd fusor-ember-cli`
3. run `ember server`
4. `cd ../ui`
6. run script `./copy-fusor-ember-cli-to-assets` which copies files from `fusor-ember-cli/dist` to the `fusor/ui` repo
7. `cd ../` to return to local `fusor` project root directory
8. git push changes to your forked repo of fusor and create PR

## Installation

```ruby
gem 'fusor_ui', :git => 'https://github.com/fusor/ui.git'
```

## Usage

Go to your Foreman instance and you should see a new menu item on the main menu entitled **Fusor Installer**.

## Contributing

Fork and send a Pull Request. Thanks!

## Copyright

TBD this whole section

Copyright (c) *2014* *Joseph Magen, Red Hat Engineering*

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

