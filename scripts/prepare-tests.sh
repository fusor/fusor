#!/bin/bash

# This is a utility script intended to batch the various hacky things that need
# to be done to prepare a new vagrant environment for running fusor tests via
# Foreman. It's used by .travis.sh for CI, but can be run manually
# by developers before testing.

SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
FUSOR_DIR=${SCRIPT_DIR}/..
FOREMAN_DIR=${FUSOR_DIR}/../foreman

echo "Preparing fusor test environment..."

if [ ! -d "$FOREMAN_DIR" ]; then
  echo "Could not find foreman dir, expected to find it at: ${FOREMAN_DIR}"
  exit
fi


# hacky, find a better way to do this...
# rails only supports loading fixtures from one directory, so link the
# katello / fusor fixtures in to forman so they all will be loaded
# Now with an even uglier workaround for katello and fusor both having a hosts.yml
pushd ${FOREMAN_DIR}/test > /dev/null
sed -i 's/relative_url_root/relative_url_root rescue nil/g' test_helper.rb
cd fixtures
mv operatingsystems.yml os.yml.foreman
ln -s ../../../fusor/server/test/fixtures/* .

# Combine operatingsystems.yml
mv operatingsystems.yml os.yml.fusor
touch operatingsystems.yml
cat os.yml.foreman >> operatingsystems.yml
cat os.yml.fusor >> operatingsystems.yml
rm -f hosts.yml os.yml.foreman os.yml.fusor
ln -s ../../../katello/test/fixtures/models/* .

# Create hosts file
echo "" >> hosts.yml
cat ../../../fusor/server/test/fixtures/hosts.yml >> hosts.yml
popd > /dev/null
