 #!/bin/bash

npm uninstall -g ember-cli
npm install -g ember-cli@1.13.12

npm cache clean
bower cache clean

rm node_modules
ln -s node_modules_1_13 node_modules

rm bower_components
ln -s bower_components_1_13 bower_components

npm install
bower install