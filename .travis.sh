#!/bin/bash

if [ $1 == "install" ]; then
  cd ..
  gem install bundler
  # I don't think these are needed in Travis Ci environment, will have to test though
  #sudo su -c 'echo "local all all trust" > /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo su -c 'echo "host all all 127.0.0.1/32 trust" >> /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo su -c 'echo "host all all ::1/128 trust" >> /etc/postgresql/9.1/main/pg_hba.conf'
  #sudo service postgresql restart
  #sudo -u postgres createuser katello --superuser

  # Our db migrations don't apply to foreman 1.8-stable and katello-2.2, but we don't want our tests breaking everytime develop and master branches are unstable either. There may be a better way to do this, but for now let's get develop / master branches and then checkout out a known working state.
  git clone -b develop https://github.com/theforeman/foreman.git
  git clone -b master https://github.com/Katello/katello.git
  git clone https://github.com/fusor/foretello_api_v21.git

  cd katello
  git checkout KATELLO-3.0
  cp script/ci/katello.yml config/katello.yml
  # Hack out some qpid dependencies in katello so that it can build on ubuntu 12.04
  sed -i 's/gem.add_dependency "qpid_messaging"/#gem.add_dependency "qpid_messaging"/' katello.gemspec
  sed -i "s/require 'qpid_messaging'/#require 'qpid_messaging'/" lib/katello.rb
  sed -i "s/Qpid::Messaging::Connection/#Qpid::Messaging::Connection'/" app/lib/actions/candlepin/candlepin_listening_service.rb
  sed -i "s/Qpid::Messaging::Duration/1#Qpid::Messaging::Duration'/" app/lib/actions/candlepin/candlepin_listening_service.rb

  cd ../foreman
  git checkout 1.11-stable
  sed -e 's/:locations_enabled: false/:locations_enabled: true/' config/settings.yaml.example > config/settings.yaml
  sed -i 's/:organizations_enabled: false/:organizations_enabled: true/' config/settings.yaml
  cp ../fusor/.foreman_database.yml config/database.yml
  echo "gem 'fusor_server', :path => '../fusor/server'" >> bundler.d/local.rb
  echo "gem 'katello', :path => '../katello'" >> bundler.d/local.rb
  echo "gem 'foretello_api_v21', :path => '../foretello_api_v21'" >> bundler.d/local.rb
  echo "gem 'foreman_discovery', '5.0.0'" >> bundler.d/local.rb
  echo "gem 'dynflow'" >> bundler.d/local.rb
  echo "gem 'less-rails'" >> bundler.d/local.rb
  echo "gem 'logger'" >> bundler.d/local.rb
  echo "gem 'egon'" >> bundler.d/local.rb
  echo "gem 'coveralls', require: false" >> bundler.d/local.rb
  echo "gem 'foreman_docker', '2.0.1'" >> bundler.d/local.rb
  echo "gem 'jwt', '< 1.5.3'" >> bundler.d/local.rb
  echo "gem 'webmock'" >> bundler.d/local.rb
  echo "gem 'vcr', '< 3.0.0'" >> bundler.d/local.rb
  echo "gem 'rake', '< 11'" >> bundler.d/local.rb

  # TODO: use the latest version of foreman once this PR is merged
  # https://github.com/theforeman/foreman/pull/3034
  sed -i "s/gem 'net-ldap', '>= 0.8.0'/gem 'net-ldap', '>= 0.8.0', '< 0.13.0'/" Gemfile

  bundle install --retry 3 --without development mysql2 libvirt

  # hacky, find a better way to do this...
  # rails only supports loading fixtures from one directory, so link the
  # katello / fusor fixtures in to forman so they all will be loaded
  # Now with an even uglier workaround for katello and fusor both having a hosts.yml

  pushd test
  sed -i 's/relative_url_root/relative_url_root rescue nil/g' test_helper.rb
  popd

  cd test/fixtures
  ln -s ../../../fusor/server/test/fixtures/* .
  rm -f hosts.yml
  ln -s ../../../katello/test/fixtures/models/* .
  echo "" >> hosts.yml
  cat ../../../fusor/server/test/fixtures/hosts.yml >> hosts.yml

  ############################################################
  # Front-end deps install
  ############################################################
  cd ../../../fusor
  source $HOME/.nvm/nvm.sh
  nvm install v4.2 && nvm use v4.2
  npm install -g bower
  npm install -g ember-cli
  cd fusor-ember-cli && bower install && npm install
  node --version && npm --version && bower --version && ember --version
elif [ $1 == "ember-run" ]; then
  # Expects to be called from fusor project root
  source $HOME/.nvm/nvm.sh
  nvm use v4.2
  cd fusor-ember-cli

  # Confirm ESLint passes and project can build
  TRAVIS_CI=1 ember build
  # TODO: Execute test suite
  ember test
else
  cd ../foreman
  rake db:create
  rake db:migrate
fi
