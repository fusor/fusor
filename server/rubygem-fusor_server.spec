%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name fusor_server

%global foreman_dir /usr/share/foreman
%global foreman_bundlerd_dir %{foreman_dir}/bundler.d
%global foreman_pluginconf_dir %{foreman_dir}/config/settings.plugins.d

%if !("%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16)
%global gem_dir /usr/lib/ruby/gems/1.8
%global gem_instdir %{gem_dir}/gems/%{gem_name}-%{version}
%global gem_libdir %{gem_instdir}/lib
%global gem_cache %{gem_dir}/cache/%{gem_name}-%{version}.gem
%global gem_spec %{gem_dir}/specifications/%{gem_name}-%{version}.gemspec
%global gem_docdir %{gem_dir}/doc/%{gem_name}-%{version}
%endif

%if "%{?scl}" == "ruby193"
    %global scl_ruby /usr/bin/ruby193-ruby
    %global scl_rake /usr/bin/ruby193-rake
    ### TODO temp disabled for SCL
    %global nodoc 1
%else
    %global scl_ruby /usr/bin/ruby
    %global scl_rake /usr/bin/rake
%endif

Summary: Fusor Server Plugin
Name: %{?scl_prefix}rubygem-%{gem_name}

Version: 1.0.0
Release: 0%{dist}
Group: Development/Ruby
License: Distributable
URL: https://github.com/fusor/fusor
Source0: http://rubygems.org/downloads/%{gem_name}-%{version}.gem

%if "%{?scl}" == "ruby193"
Requires: %{?scl_prefix}ruby-wrapper
BuildRequires: %{?scl_prefix}ruby-wrapper
%endif
%if "%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16
BuildRequires:  %{?scl_prefix}rubygems-devel
%endif

%if 0%{?fedora} > 19
Requires: %{?scl_prefix}ruby(release) = 2.0.0
BuildRequires: %{?scl_prefix}ruby(release) = 2.0.0
%else
%if "%{?scl}" == "ruby193" || 0%{?rhel} > 6 || 0%{?fedora} > 16
Requires: %{?scl_prefix}ruby(abi) = 1.9.1
BuildRequires: %{?scl_prefix}ruby(abi) = 1.9.1
%else
Requires: ruby(abi) = 1.8
BuildRequires: ruby(abi) = 1.8
%endif
%endif

Requires: foreman >= 1.7.0
Requires: fusor-selinux >= 1.0.0
BuildRequires: foreman >= 1.7.0
BuildRequires: foreman-assets >= 1.7.0
# TODO
# Detect what version of foreman we are building with
# foreman 1.9 uses foreman-plugin
# foreman 1.7 does not have foreman-plugin
#
#BuildRequires: foreman-plugin >= 1.6.0
BuildRequires: %{?scl_prefix}rubygem-active_model_serializers

BuildArch: noarch
Provides: %{?scl_prefix}rubygem(fusor_server) = %{version}
Provides: %{?scl_prefix}rubygem(fusor) = %{version}

Requires: %{?scl_prefix}rubygem-egon
Requires: %{?scl_prefix}rubygem-foretello_api_v21
Requires: %{?scl_prefix}rubygem-active_model_serializers
Requires: %{?scl_prefix}rubygem-net-ssh => 2.9.2
Requires: %{?scl_prefix}rubygem-sys-filesystem
Requires: %{?scl_prefix}rubygem-rubyipmi
Requires: %{?scl_prefix}rubygem-rubyzip
Requires: fusor_ovirt
Requires: fusor-utils

Requires: ansible >= 1.9.0

%description
Fusor Plugin

%package doc
BuildArch:  noarch
Requires:   %{?scl_prefix}%{pkg_name} = %{version}-%{release}
Summary:    Documentation for rubygem-%{gem_name}

%description doc
This package contains documentation for rubygem-%{gem_name}.

%prep
%setup -n %{pkg_name}-%{version} -q -c -T
mkdir -p .%{gem_dir}
%{?scl:scl enable %{scl} "}
gem install --local --install-dir .%{gem_dir} --force %{SOURCE0}
%{?scl:"}

%build

%install

mkdir -p %{buildroot}%{gem_dir}
cp -a .%{gem_dir}/* \
        %{buildroot}%{gem_dir}/

mkdir -p %{buildroot}%{foreman_bundlerd_dir}
cat <<GEMFILE > %{buildroot}%{foreman_bundlerd_dir}/%{gem_name}.rb
gem '%{gem_name}'
gem 'egon'
GEMFILE

mkdir -p %{buildroot}%{foreman_pluginconf_dir}
cp -a %{buildroot}/%{gem_instdir}/config/fusor.yaml %{buildroot}%{foreman_pluginconf_dir}/

%clean
%{__rm} -rf %{buildroot}

%files
%defattr(-, root, root)
%{gem_instdir}/
%exclude %{gem_cache}
%{gem_spec}
%{foreman_bundlerd_dir}/%{gem_name}.rb
%{foreman_pluginconf_dir}/fusor.yaml

%files doc
%{gem_dir}/doc/%{gem_name}-%{version}

%changelog
* Wed Apr 15 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-19
- fusor server: hard-code root_pass and set storage_path param on hostgroup
  (bbuckingham@redhat.com)

* Tue Apr 07 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-18
- Merge pull request #77 from bbuckingham/set_host_address (jmrodri@gmail.com)
- validate rhev engine host (jesusr@redhat.com)
- fusor server: set ovirt::engine::config host_address puppet parameter
  (bbuckingham@redhat.com)
- cleanup logging to make it easier to read logs (jesusr@redhat.com)
- Add deploy rhev action. (jesusr@redhat.com)
- include mix in ::ActionController::Base for disabling CSRF for devs
  (jmagen@redhat.com)

* Mon Apr 06 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-17
- fusor server: add deploy option to 'skip_content' (bbuckingham@redhat.com)

* Thu Apr 02 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-16
- Merge pull request #70 from bbuckingham/fix_rh_common (jmrodri@gmail.com)
- fusor server: update fusor.yaml to fix RH common and add virt agent
  (bbuckingham@redhat.com)

* Thu Apr 02 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-15
- dynamic assign route for next tab after RHEV (jmagen@redhat.com)
- revert hostgroup extension that was deleted by mistake (jmagen@redhat.com)
- prep work to disable CSRF for devs by commenting out one line
  (jmagen@redhat.com)

* Wed Apr 01 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-14
- fusor server: deployment hostgroup: fix the setting of architecture and
  partition table (bbuckingham@redhat.com)

* Wed Apr 01 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-13
- Add RH Common to fusor.yaml (jesusr@redhat.com)
- fixed /deployments redirecting to /deployments/new when it shoudn't
  (jmagen@redhat.com)
- Merge pull request #57 from bbuckingham/use_puppet_default
  (jwmatthews@gmail.com)
- fusor server: if deployment attribute is blank, use the puppet default
  (bbuckingham@redhat.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-12
- fusor server: update hostgroup to override parameters based on deployment
  object (bbuckingham@redhat.com)
- ignore error Encoding::UndefinedConversionError: xBA from ASCII-8BIT to UTF-8
  (jmagen@redhat.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-11
- Merge pull request #46 from jwmatthews/rpm_spec_downstream
  (jwmatthews@gmail.com)
- Merge pull request #52 from bbuckingham/hostgroup_param_overrride
  (jwmatthews@gmail.com)
- fusor server: update config and deploy action to support overriding
  parameters on hostgroups (bbuckingham@redhat.com)
- Updates so we can build with downstream foreman macros (jwmatthews@gmail.com)

* Tue Mar 31 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-10
- add permission to Fusor and FusorUI (jmagen@redhat.com)

* Fri Mar 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-9
- fusor server: update customer_portal_proxies_controller definition
  (bbuckingham@redhat.com)

* Fri Mar 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-8
- fusor server: update akey logic to enable repositories
  (bbuckingham@redhat.com)
- Merge pull request #28 from bbuckingham/portal-proxy (jmrodri@gmail.com)
- fusor server: initial code for proxying api requests to the customer portal
  (bbuckingham@redhat.com)

* Wed Mar 25 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-7
- Merge pull request #37 from bbuckingham/fixes-hostgroup-arch
  (jwmatthews@gmail.com)
- fusor server: hostgroup: set architecture on the deployment hostgroup
  (bbuckingham@redhat.com)
- Include fusor.yaml in RPM of fusor-server (jwmatthews@gmail.com)

* Wed Mar 25 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-6
- fusor server: fix apipie doc cache (bbuckingham@redhat.com)
- Fixed RHEV hypervisor selection and other refactoring
  (joseph@isratrade.co.il)

* Fri Mar 20 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-5
- Add requires for active_model_serializers and foretello_api_v21
  (jwmatthews@gmail.com)

* Thu Mar 19 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-4
- Merge pull request #32 from bbuckingham/update_fusor_yaml (jmrodri@gmail.com)
- Merge pull request #31 from fusor/rpm_fusor (jwmatthews@gmail.com)
- fusor server: update fusor.yaml to support the chgs for hostgroup named by
  deployment (bbuckingham@redhat.com)
- fusor server: allow creation of hostgroup with no parent
  (bbuckingham@redhat.com)
- fusor server: fix to properly locate hostgroup based upon ancestry
  (bbuckingham@redhat.com)
- fixed deployment_serializer to remove deleted attributes
  :rhev_hypervisor_host_id and :rhev_hypervisor_hostname
  (joseph@isratrade.co.il)
- fixed duplication migration (joseph@isratrade.co.il)
- Merge pull request #26 from bbuckingham/create_rhev_hostgroups_2
  (jmrodri@gmail.com)
- fusor server: update to support multiple deployments per org
  (bbuckingham@redhat.com)
- create/edit deployments and persist in database (joseph@isratrade.co.il)
- fusor server: enable puppet smart class parameter overrides
  (bbuckingham@redhat.com)
- fusor server: create hostgroups and activation key for rhev deployment
  (bbuckingham@redhat.com)
- remove hypervisor columns, add self_hosted column. (jesusr@redhat.com)

* Tue Mar 10 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-3
- Remove use of %%{foreman_assets_plugin} since we don't have any files under
  public/assets/fusor_server (jwmatthews@gmail.com)
- Move lib/fusor.rb to lib/fusor_server.rb to allow RPM build to succeed with
  macro: %%{foreman_assets_plugin} (jwmatthews@gmail.com)
- Update requires for rubygem-active_model_serializers to use scl prefix
  (jwmatthews@gmail.com)

* Tue Mar 10 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-2
- new package built with tito

