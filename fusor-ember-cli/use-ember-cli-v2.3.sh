 #!/bin/bash

npm uninstall -g ember-cli
npm install -g ember-cli@2.3.0

npm cache clean
bower cache clean

rm node_modules
ln -s node_modules_2_3 node_modules

rm bower_components
ln -s bower_components_2_3 bower_components

npm install
bower install