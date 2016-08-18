export default [
  {
    "id": 1,
    "name": "Default Organization",
    "title": "Default Organization",
    "created_at": "2015-11-05T08:40:31Z",
    "updated_at": "2015-11-05T08:45:36Z",
    "select_all_types": [],
    "description": null,
    "parameters": [],
    "users": [],
    "smart_proxies": [
      {
        "name": "sat61dev.example.com",
        "id": 1,
        "url": "https://sat61dev.example.com:9090"
      }
    ],
    "subnets": [
      {
        "id": 1,
        "name": "default",
        "network_address": "192.168.152.0/24"
      }
    ],
    "compute_resources": [],
    "media": [
      {
        "id": 1,
        "name": "CentOS mirror"
      },
      {
        "id": 7,
        "name": "Default_Organization/Library/Red_Hat_Server/Red_Hat_Enterprise_Linux_6_Server_Kickstart_x86_64_6_7"
      },
      {
        "id": 8,
        "name": "Default_Organization/Library/Red_Hat_Server/Red_Hat_Enterprise_Linux_7_Server_Kickstart_x86_64_7_1"
      }
    ],
    "config_templates": [
      {
        "id": 44,
        "name": "Boot disk iPXE - generic host",
        "template_kind_id": 1,
        "template_kind_name": "Bootdisk"
      },
      {
        "id": 43,
        "name": "Boot disk iPXE - host",
        "template_kind_id": 1,
        "template_kind_name": "Bootdisk"
      },
      {
        "id": 50,
        "name": "custom_deployment_repositories",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 48,
        "name": "idm_register",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 18,
        "name": "Kickstart default",
        "template_kind_id": 5,
        "template_kind_name": "provision"
      },
      {
        "id": 22,
        "name": "Kickstart default iPXE",
        "template_kind_id": 4,
        "template_kind_name": "iPXE"
      },
      {
        "id": 21,
        "name": "Kickstart default PXELinux",
        "template_kind_id": 2,
        "template_kind_name": "PXELinux"
      },
      {
        "id": 39,
        "name": "kickstart_networking_setup",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 19,
        "name": "Kickstart RHEL default",
        "template_kind_id": 5,
        "template_kind_name": "provision"
      },
      {
        "id": 40,
        "name": "puppet.conf",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 2,
        "name": "PXELinux default local boot",
        "template_kind_id": 2,
        "template_kind_name": "PXELinux"
      },
      {
        "id": 1,
        "name": "PXELinux global default",
        "template_kind_id": 2,
        "template_kind_name": "PXELinux"
      },
      {
        "id": 41,
        "name": "redhat_register",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 45,
        "name": "Satellite Kickstart Default",
        "template_kind_id": 5,
        "template_kind_name": "provision"
      },
      {
        "id": 47,
        "name": "Satellite Kickstart Default Finish",
        "template_kind_id": 6,
        "template_kind_name": "finish"
      },
      {
        "id": 46,
        "name": "Satellite Kickstart Default User Data",
        "template_kind_id": 8,
        "template_kind_name": "user_data"
      },
      {
        "id": 51,
        "name": "ssh_public_key",
        "template_kind_id": null,
        "template_kind_name": null
      },
      {
        "id": 49,
        "name": "subscription_manager_registration",
        "template_kind_id": null,
        "template_kind_name": null
      }
    ],
    "domains": [
      {
        "id": 1,
        "name": "example.com"
      }
    ],
    "environments": [
      {
        "name": "KT_Default_Organization_dev20_Fusor_Deployment___testnew_3",
        "id": 6
      },
      {
        "name": "KT_Default_Organization_Library_Fusor_Deployment___testnew_3",
        "id": 5
      },
      {
        "name": "KT_Default_Organization_Library_Fusor_Puppet_Content_2",
        "id": 3
      },
      {
        "name": "KT_Default_Organization_Library_Fusor_RPM_Content_4",
        "id": 4
      }
    ],
    "hostgroups": [
      {
        "id": 1,
        "name": "Fusor Base",
        "title": "Fusor Base"
      },
      {
        "id": 5,
        "name": "aaaaa",
        "title": "Fusor Base/aaaaa"
      },
      {
        "id": 6,
        "name": "RHV-Engine",
        "title": "Fusor Base/aaaaa/RHV-Engine"
      },
      {
        "id": 7,
        "name": "RHV-Hypervisor",
        "title": "Fusor Base/aaaaa/RHV-Hypervisor"
      },
      {
        "id": 2,
        "name": "rhev only222",
        "title": "Fusor Base/rhev only222"
      },
      {
        "id": 3,
        "name": "RHV-Engine",
        "title": "Fusor Base/rhev only222/RHV-Engine"
      },
      {
        "id": 4,
        "name": "RHV-Hypervisor",
        "title": "Fusor Base/rhev only222/RHV-Hypervisor"
      },
      {
        "id": 8,
        "name": "testnew",
        "title": "Fusor Base/testnew"
      },
      {
        "id": 9,
        "name": "OpenStack-Undercloud",
        "title": "Fusor Base/testnew/OpenStack-Undercloud"
      }
    ],
    "locations": [],
    "label": "Default_Organization",
    "owner_details": {
      "parentOwner": null,
      "id": "ff80808150d6cd1b0150d6ce03ef0001",
      "key": "Default_Organization",
      "displayName": "Default Organization",
      "contentPrefix": "/Default_Organization/$env",
      "defaultServiceLevel": null,
      "upstreamConsumer": {
        "id": "ff80808150d6d8ad0150f0fe88d802ac",
        "uuid": "7ffddefd-aacb-4192-a999-01beb7c2e473",
        "name": "tsanders-rhci",
        "idCert": {
          "key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAhnYNVp8bo9LdLsLS3paT24HE6le6tX4wu4TneWGRNCOtAfT0\npiAmyeH1hkKbAuEPnJGF4Qw2mot0UlWFGkaReTuY5VbWWFUk8103QWO1DcfwRDwP\nxxIP4JPaT4xOY1McO4LDa9WODk0hrIEEvM6w/lna4L4NZ5xUGaRaWRB62Jmv2u99\nVrlZ954tHpLlVmMPR8rDZyJSwnJ0WMcqul16FnJTDeZN4SVe9uwanoTmoiKZezES\nN7X2QT9GwGbpkPPyMCH8pkCJHwYdvLiG82/v1/Ilg94S5n28CnggUYXHU06jIDui\nGZdnMUxlMNnt4esRivQkrlKiIrJeVaJ/U/4K7QIDAQABAoIBAFn1y7DDnNN7db4e\nXMTNi7kV1nBPJ7zb47DiF5gvPd3bbJndkH1BD5KMWh9smpdPiolfF2pdKH83hCi9\nzOKqihPJWt89vQS2WpV0LU7TbcP9m/ObF5dBr1u6sBn+rkdnyIDMWQDhjTxmQHxQ\niaHky6gw5+7rWL6UafQJ8OSb0QTuu+1x6qJZzZkwZXxrmXqGwMAAZmy82QCeFwfO\ntwaM1iuoI7QIIyvno7vnvmM4Ez3WpPF/jp0dwJ2ADjQg1ZNSa35BULxd6tQDT/KG\nTH3Z7GHNChkzlM3EmTgbrD18imj2yqgIoJh2IO0NkFC91oxoSiAUlD01Ya7KfWCR\nSOK1nQUCgYEA0mqAXIT9SSnVvo4gecglxcPqjOQNjSKTlGOSsRh5aGQEW0uOUW+/\nBycbn5Y48nWAcit/U0rAQRvEkOVRrkap6dbYwoIZNjejnF6+h8RwtuhloDqJdEYP\n6oLwkX87Et9EdzX4h5iRVnxqHmw/YfaTnm+Uh5J4I7lrTdVTtrn0VtMCgYEAo5cn\n5HQhJ0g0TL4z4P75LH5UEb8Nbb2s7zteFkQDxJRUkvrm6rYUNxV589qtjBYb9RCB\n4BuN+hF3iTU0nvs8dBCal59/24NabNQI++5AaGAB3/BuCNadFMFjuCC3MjqSAw10\ncN3IAveyVyApcpWuKOFPvirjyg85S9xY+xTOfz8CgYAPJDLQdZF0blo/OCMGIGz3\naj26nb6L5W0RRIkNzWEPLgNSPoGjQpNQhHPsa/b1G5d+n7qt17c1+DWQ56+VBui7\nNwaqGIqP6DkRy4+SXYRu5RJLEWtKvq/uhDWjgrBRj1dx7KRRvZzXyGQqhEebWQ8O\nW6EokFWs3G7oTu2TPJZkmQKBgAqgSe4UAQdNMGB/xlzqEwNp3Uodz+B9/pq3j4AA\nwQHm5Kt7cr5yP1PoqDhHzxgXY4+Cl/0XrRw+QDaAZz+gcCfV4ETTDnoSyS/iggbj\nTfm5qsWCF5OpZSCxAyo1rdCsb0mVeSfPsCtJLaNtKmQQBvUO1aAzpwI8BOvBj2IX\n0uX/AoGBANCYxXM1mpVj/Nnav1qwkeIvDbcJZEy7gtZtx3mPwcCcsF0KPzrFzKN3\n1H1OpR91SGMinoovEmdfUOC60g7Eh16hUDY/I/xrjRKB4R52uIICIVDUUqKw0RWY\noYwVIwuGpW7YZEz8ZKxpJibx/IrEBlQlGGDfooktmdMaxLsojAoa\n-----END RSA PRIVATE KEY-----\n",
          "cert": "-----BEGIN CERTIFICATE-----\nMIIFrTCCA5WgAwIBAgIIakR3GA8CX9MwDQYJKoZIhvcNAQEFBQAwgaQxCzAJBgNV\nBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEWMBQGA1UECgwNUmVkIEhh\ndCwgSW5jLjEYMBYGA1UECwwPUmVkIEhhdCBOZXR3b3JrMSQwIgYDVQQDDBtSZWQg\nSGF0IENhbmRsZXBpbiBBdXRob3JpdHkxJDAiBgkqhkiG9w0BCQEWFWNhLXN1cHBv\ncnRAcmVkaGF0LmNvbTAeFw0xNTA2MTAxMjQ3MzJaFw0xNjA2MTAxMjQ3MzJaMC8x\nLTArBgNVBAMTJDE1OTAwMDMxLTI3ZGYtNDAwNC1iZTM2LTEyMDNkZjEwYjIzODCC\nASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBAIZ2DVafG6PS3S7C0t6Wk9uB\nxOpXurV+MLuE53lhkTQjrQH09KYgJsnh9YZCmwLhD5yRheEMNpqLdFJVhRpGkXk7\nmOVW1lhVJPNdN0FjtQ3H8EQ8D8cSD+CT2k+MTmNTHDuCw2vVjg5NIayBBLzOsP5Z\n2uC+DWecVBmkWlkQetiZr9rvfVa5WfeeLR6S5VZjD0fKw2ciUsJydFjHKrpdehZy\nUw3mTeElXvbsGp6E5qIimXsxEje19kE/RsBm6ZDz8jAh/KZAiR8GHby4hvNv79fy\nJYPeEuZ9vAp4IFGFx1NOoyA7ohmXZzFMZTDZ7eHrEYr0JK5SoiKyXlWif1P+Cu0C\nAwEAAaOCAVUwggFRMBEGCWCGSAGG+EIBAQQEAwIFoDALBgNVHQ8EBAMCBLAwgd4G\nA1UdIwSB1jCB04AUdy6lzTcNqOHT6mHFVmdD6JHHbRyhgbekgbQwgbExCzAJBgNV\nBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEWMBQGA1UECgwNUmVkIEhh\ndCwgSW5jLjEYMBYGA1UECwwPUmVkIEhhdCBOZXR3b3JrMTEwLwYDVQQDDChSZWQg\nSGF0IEVudGl0bGVtZW50IE9wZXJhdGlvbnMgQXV0aG9yaXR5MSQwIgYJKoZIhvcN\nAQkBFhVjYS1zdXBwb3J0QHJlZGhhdC5jb22CAT8wHQYDVR0OBBYEFO1aJ4WnLpWt\ntAjC8RewrfEazGhZMBMGA1UdJQQMMAoGCCsGAQUFBwMCMBoGA1UdEQQTMBGGD0NO\nPWptYWdlbjItcmhjaTANBgkqhkiG9w0BAQUFAAOCAgEAM+Mw2UkC0x5fZS5FCgcT\nQmZnm4GK1isXXDx2717qOKL/1e+J04y26Ky20r/tQDPYJxg1wCkQ2oWmTQEzmI1a\nbNxfrnEJkNLapCqcdwccSWD5EnDnQizWH22Co/OTYvCuSW9Sk9ivtsef0toRFIj1\n2eakLFfN2Jveu4EvI032fo5hufWrgD5ztPAQg+0b1vkjxtF0u4zzpNq71+3Z8yoI\nVlj3kEY+Jkl68AiGU/BsYDKMexmINH3te7i01KHBA8ZbKfl9o4sMfBLQxWClVtV+\ntIrLLHhS9U/VYASheJQrG2X6VnGyMnA/w81cWuqdAhBMGPNKMcoAseTJIjNZiJdI\nIY7x7cLGJoi0rRZXLUAt9RCaXEkYKuikUr2jzIOlInyVPCeGjtEUE298yiaqSZqO\nBSeVSJv6d9mBXhD0kHxENjWPWUc5+ID8BEVfpUcjs6CRFqhAat2PI9kiNoVzO5yh\nCStbgsH5VSa/b3KGIMz59HW6raMynBWhCqqM2B6zSk3fSXOyDv8kfKzwTaVNtch1\nGU+m/+SO78b7OypWC7SxPh1/RE8g86Xa0xAjG1j363QNpBqlIw7ncza5yHbShoyf\nU6k1GXt92SZRrEP87mYkxbGeKJFaHopq/4Hh72eP2/C0d1Vj4WTNGLuXbpSD3tFg\nO+rPEbXYpmQryBQmYP1oxt8=\n-----END CERTIFICATE-----\n",
          "id": "ff80808150d6d8ad0150f0fe88d702ab",
          "serial": {
            "id": 283230217608562925,
            "revoked": false,
            "collected": false,
            "expiration": "2016-06-10T12:47:32.000+0000",
            "serial": 283230217608562925,
            "created": "2015-11-10T10:43:44.470+0000",
            "updated": "2015-11-10T10:43:44.470+0000"
          },
          "created": "2015-11-10T10:43:44.471+0000",
          "updated": "2015-11-10T10:43:44.471+0000"
        },
        "type": {
          "id": "ff80808150d6d8ad0150e8d07ad00024",
          "label": "satellite",
          "manifest": true,
          "created": "2015-11-08T20:36:28.496+0000",
          "updated": "2015-11-08T20:36:28.496+0000"
        },
        "ownerId": "ff80808150d6cd1b0150d6ce03ef0001",
        "webUrl": "access.redhat.com/management/distributors/",
        "apiUrl": "https://subscription.rhn.redhat.com/subscription/consumers/",
        "created": "2015-11-10T10:43:44.472+0000",
        "updated": "2015-11-10T10:43:44.472+0000"
      },
      "logLevel": null,
      "href": "/owners/Default_Organization",
      "created": "2015-11-05T08:40:37.103+0000",
      "updated": "2015-11-10T10:43:44.775+0000"
    },
    "redhat_repository_url": "https://cdn.redhat.com",
    "redhat_docker_registry_url": "https://registry.access.redhat.com",
    "service_levels": [
      "Premium"
    ],
    "service_level": null,
    "default_content_view_id": 1,
    "library_id": 1
  }
];