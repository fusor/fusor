%{?scl:%scl_package rubygem-%{gem_name}}
%{!?scl:%global pkg_name %{name}}

Name:           fusor
Version:        1.1.0
Release:        0%{?dist}
Summary:        fusor meta package

License:        GPL

Requires:       %{?scl_prefix}rubygem-fusor_ui
Requires:       foreman-discovery-image
Requires:       fusor-initial-setup
Requires:       fusor-installer
Requires:       fusor-release
Requires:       rubygem-smart_proxy_pulp
Requires:       satellite
Requires:       redhat-access-insights
Requires:       bind-utils
Requires:       bind
Requires:       dhcp
Requires:       katello-client-bootstrap
Requires:       python-qpid-qmf
Requires:       puppet-server
Requires:       qpid-qmf
Requires:       qpid-tools
Requires:       tftp-server
Requires:       xinetd
Requires:       qci-sos-plugin


BuildArch:      noarch

Provides:       qci

%description
Meta-package to install all requirements for Fusor/QCI.

%prep

%build

%install

%files

%changelog
