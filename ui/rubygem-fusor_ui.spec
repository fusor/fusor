%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

%global gem_name fusor_ui

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

Summary: Fusor Plugin
Name: %{?scl_prefix}rubygem-%{gem_name}

Version: 0.0.1
Release: 7%{dist}
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

# Hack so we may try to work with a stable katello 2.0 which requires foreman 1.6
Requires: foreman >= 1.6.0
BuildRequires: foreman >= 1.6.0
BuildRequires: foreman-assets >= 1.6.0

#Requires: foreman >= 1.7.0
#BuildRequires: foreman >= 1.7.0
#BuildRequires: foreman-assets >= 1.7.0

BuildArch: noarch
Provides: %{?scl_prefix}rubygem(fusor_ui) = %{version}

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

mkdir -p %{buildroot}%{foreman_dir}/public/assets
ln -s %{foreman_assets_plugin} %{buildroot}%{foreman_dir}/public/assets/fusor_ui

%clean
%{__rm} -rf %{buildroot}

%files
%defattr(-, root, root)
%{gem_instdir}/
%exclude %{gem_cache}
%{gem_spec}
%{foreman_bundlerd_dir}/%{gem_name}.rb
%{foreman_dir}/public/assets/fusor_ui
#%{foreman_assets_plugin}

%files doc
%{gem_dir}/doc/%{gem_name}-%{version}

%changelog
* Thu Mar 19 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-7
- Updating ui directory to match latest code in fusor-ember-cli
  (jwmatthews@gmail.com)
- Changes so fusor_ui RPM may build (jwmatthews@gmail.com)
- create/edit deployments and persist in database (joseph@isratrade.co.il)
- copy compiled assets from fusor-ember-cli/dist to FusorUI gem at
  fusor/ui/app/assets (joseph@isratrade.co.il)
- FusorUI fixes and refactoring (joseph@isratrade.co.il)
- Merge pull request #14 from fusor/develop-pr (jmagen@redhat.com)
- copy compiled assets from fusor-ember-cli/dist to FusorUI gem at
  fusor/ui/app/assets (joseph@isratrade.co.il)
- README changes (joseph@isratrade.co.il)

* Tue Feb 03 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-6
- Hack to allow us to try to work with a stable Katello 2.0 which requires
  Foreman 1.6 (jwmatthews@gmail.com)

* Mon Feb 02 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-5
- 

* Tue Jan 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-4
- 

* Tue Jan 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-3
- new package built with tito

* Tue Jan 27 2015 John Matthews <jwmatthews@gmail.com> 0.0.1-2
- new package built with tito


