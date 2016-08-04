%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

Name:           fusor
Version:        1.0 
Release:        0%{?dist}
Summary:        fusor meta package

License:        GPL

Requires:       %{?scl_prefix}rubygem-fusor_ui
Requires:       foreman-discovery-image
Requires:       fusor-installer
Requires:       fusor-release
Requires:       rubygem-smart_proxy_pulp
Requires:       satellite

BuildArch:      noarch

Provides:       qci

%description
Meta-package to install all requirements for Fusor/QCI. 

%prep

%build

%install

%files

%changelog
* Thu Aug  4 2016 jmontleo@redhat.com
- 
