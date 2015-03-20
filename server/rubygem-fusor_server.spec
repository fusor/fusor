%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name fusor_server

%global foreman_dir /usr/share/foreman
%global foreman_bundlerd_dir %{foreman_dir}/bundler.d

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

Version: 0.0.1
Release: 4%{dist}
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
BuildRequires: foreman >= 1.7.0
BuildRequires: foreman-assets >= 1.7.0
BuildRequires: foreman-plugin >= 1.6.0
BuildRequires: %{?scl_prefix}rubygem-active_model_serializers

BuildArch: noarch
Provides: %{?scl_prefix}rubygem(fusor_server) = %{version}
Provides: %{?scl_prefix}rubygem(fusor) = %{version}

Requires: %{?scl_prefix}rubygem-foretello_api_v21
Requires: %{?scl_prefix}rubygem-active_model_serializers

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

%foreman_bundlerd_file
%foreman_precompile_plugin

#mkdir -p %{buildroot}%{foreman_dir}/public/assets
#ln -s %{foreman_assets_plugin} %{buildroot}%{foreman_dir}/public/assets/fusor_ui

%clean
%{__rm} -rf %{buildroot}

%files
%defattr(-, root, root)
%{gem_instdir}/
%exclude %{gem_cache}
%{gem_spec}
%{foreman_bundlerd_dir}/%{gem_name}.rb
#%{foreman_dir}/public/assets/fusor_ui
#%{foreman_assets_plugin}

%files doc
%{gem_dir}/doc/%{gem_name}-%{version}

%changelog
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

