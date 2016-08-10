#!/bin/bash

COMMIT_ASSETS=0

if [ "$#" -ge "1" ]
then
    if [ "$1" == "commit" ]
    then
        COMMIT_ASSETS=1
    fi
fi

if [ -f ./dist/assets/fusor-ember-cli.css ]
then
    cp ./dist/assets/fusor-ember-cli.css     ../ui/app/assets/stylesheets/fusor_ui/;
fi

if [ -f ./dist/assets/fusor-ember-cli.css.map ]
then
    cp ./dist/assets/fusor-ember-cli.css.map ../ui/app/assets/stylesheets/fusor_ui/;
fi

if [ -f ./dist/assets/vendor.js ]
then
    cp ./dist/assets/vendor.js               ../ui/app/assets/javascripts/fusor_ui/;
fi

if [ -f ./dist/assets/vendor.map ]
then
    cp ./dist/assets/vendor.map              ../ui/app/assets/javascripts/fusor_ui/;
fi

if [ -f ./dist/assets/fusor-ember-cli.js ]
then
    cp ./dist/assets/fusor-ember-cli.js      ../ui/app/assets/javascripts/fusor_ui/;
fi

if [ -f ./dist/assets/fusor-ember-cli.map ]
then
    cp ./dist/assets/fusor-ember-cli.map     ../ui/app/assets/javascripts/fusor_ui/;
fi

if [ "${COMMIT_ASSETS}" -eq "1" ]
then
    cd ..
    git add .;
    git commit -m "copy minified assets from fusor-ember-cli/dist to FusorUI gem at fusor/ui/app/assets";
else
    echo "UI Assets have been copied"
    echo "If you want to commit, re-run with: $0 commit"
fi
