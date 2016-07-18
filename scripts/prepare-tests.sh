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
# clean up before working
FILES=`ls ../../../fusor/server/test/fixtures/ ../../../katello/test/fixtures/models/`
for f in $FILES
do
    # skip operatingsystems.yml
    if [ "$f" != "operatingsystems.yml" ]; then
        rm -f $f
    fi
done

if [ -e 'os.yml.foreman' ]; then
    mv -f os.yml.foreman operatingsystems.yml
fi

# proceed
mv -f operatingsystems.yml os.yml.foreman
ln -s ../../../fusor/server/test/fixtures/* .

# Combine operatingsystems.yml
mv operatingsystems.yml os.yml.fusor
touch operatingsystems.yml
cat os.yml.foreman >> operatingsystems.yml
cat os.yml.fusor >> operatingsystems.yml
#rm -f hosts.yml os.yml.foreman os.yml.fusor
rm -f hosts.yml os.yml.fusor

# Combine katello_subscriptions.yml
# MUST BE DONE BEFORE KATELLO FIXTURES
mv katello_subscriptions.yml ksub.yml.fusor
mv katello_subscription_products.yml ksubprods.yml.fusor
mv katello_products.yml kprods.yml.fusor
mv katello_pools.yml kpools.yml.fusor

# bring over the katello fixtures
ln -s ../../../katello/test/fixtures/models/* .

# save off the katello ones
mv katello_subscriptions.yml ksub.yml.katello
mv katello_subscription_products.yml ksubprods.yml.katello
mv katello_products.yml kprods.yml.katello
mv katello_pools.yml kpools.yml.katello

touch katello_subscriptions.yml
touch katello_subscription_products.yml
touch katello_products.yml
touch katello_pools.yml

# Create files using katello and fusor fixtures
cat ksub.yml.katello >> katello_subscriptions.yml
cat ksub.yml.fusor >> katello_subscriptions.yml
cat ksubprods.yml.katello >> katello_subscription_products.yml
cat ksubprods.yml.fusor >> katello_subscription_products.yml
cat kprods.yml.katello >> katello_products.yml
cat kprods.yml.fusor >> katello_products.yml
cat kpools.yml.katello >> katello_pools.yml
cat kpools.yml.fusor >> katello_pools.yml

rm -f ksub.yml.* ksubprods.yml.* kprods.yml.* kpools.yml.*

# Create hosts file
echo "" >> hosts.yml
cat ../../../fusor/server/test/fixtures/hosts.yml >> hosts.yml
popd > /dev/null
