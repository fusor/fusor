module.exports = function(app) {
  var express = require('express');
  var consumerRouter = express.Router();
  var consumersCollection = [
    {
        "id": "8a85f9814e0ab1b0014e1af581883e18",
        "uuid": "e82825bf-b9a1-41c8-9679-2873c7a2c1d1",
        "name": "apagac-rhci-rhevm3333",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 4,
        "lastCheckin": "2015-06-22T14:21:35.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f98a4e009a5b014e1b11abec5589",
                "name": "derived_product"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558a",
                "name": "ram"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558b",
                "name": "guest_limit"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558c",
                "name": "cert_v3"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558d",
                "name": "cores"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558f",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f98a4e009a5b014e1b11abec558e",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/e82825bf-b9a1-41c8-9679-2873c7a2c1d1",
        "created": "2015-06-22T11:09:33.000+0000",
        "updated": "2015-06-22T14:21:35.000+0000"
    },
    {
        "id": "8a85f9824d432b38014d72309d492fcf",
        "uuid": "ed940c5e-9279-4daf-bba8-5f983bcbae55",
        "name": "zeus-sat61-cfme",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 21,
        "lastCheckin": "2015-06-12T01:47:33.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9824d432b38014d72309d492fd0",
                "name": "derived_product"
            },
            {
                "id": "8a85f9824d432b38014d72309d492fd1",
                "name": "ram"
            },
            {
                "id": "8a85f9824d432b38014d72309d492fd2",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9824d432b38014d72309d492fd3",
                "name": "cores"
            },
            {
                "id": "8a85f9824d432b38014d72309d492fd4",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/ed940c5e-9279-4daf-bba8-5f983bcbae55",
        "created": "2015-05-20T16:38:18.000+0000",
        "updated": "2015-06-12T01:47:33.000+0000"
    },
    {
        "id": "8a85f9824dd3d1ce014dd91685af4f44",
        "uuid": "5ab7f9bb-4170-4aea-955a-0e06b4232b8f",
        "name": "dafna-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 6,
        "lastCheckin": "2015-06-19T06:07:02.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9814dd3d358014dde3cf59f52cb",
                "name": "derived_product"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052cc",
                "name": "ram"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052cd",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052ce",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052cf",
                "name": "cores"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052d1",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9814dd3d358014dde3cf5a052d0",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/5ab7f9bb-4170-4aea-955a-0e06b4232b8f",
        "created": "2015-06-09T16:10:41.000+0000",
        "updated": "2015-06-19T06:07:02.000+0000"
    },
    {
        "id": "8a85f9834d9b3bdb014dad45435d4072",
        "uuid": "dec66612-c335-4418-9e39-f50616e4bc9c",
        "name": "dajo",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 5,
        "lastCheckin": "2015-06-19T05:58:39.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9814dc7d540014dd3c34e087bea",
                "name": "derived_product"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087beb",
                "name": "ram"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087bec",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087bed",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087bee",
                "name": "cores"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087bf0",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9814dc7d540014dd3c34e087bef",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/dec66612-c335-4418-9e39-f50616e4bc9c",
        "created": "2015-06-01T03:58:27.000+0000",
        "updated": "2015-06-19T05:58:39.000+0000"
    },
    {
        "id": "8a85f9844c7a3d77014c7a40b0e420b5",
        "uuid": "b9350f8a-7c67-4ca6-9557-2ef46aebfc6a",
        "name": "jmontleo-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 8,
        "lastCheckin": "2015-06-22T13:58:17.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9844c7a3d77014c7a40b0e420b6",
                "name": "derived_product"
            },
            {
                "id": "8a85f9844c7a3d77014c7a40b0e420b7",
                "name": "ram"
            },
            {
                "id": "8a85f9844c7a3d77014c7a40b0e420b8",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9844c7a3d77014c7a40b0e420b9",
                "name": "cores"
            },
            {
                "id": "8a85f9844c7a3d77014c7a40b0e420ba",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/b9350f8a-7c67-4ca6-9557-2ef46aebfc6a",
        "created": "2015-04-02T13:10:02.000+0000",
        "updated": "2015-06-22T13:58:17.000+0000"
    },
    {
        "id": "8a85f9844c7a3d77014c80336cfb436b",
        "uuid": "63170c3b-994d-4dd3-82ac-7cccf353206c",
        "name": "jmatthews-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 17,
        "lastCheckin": "2015-06-15T00:10:37.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6474",
                "name": "derived_product"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6475",
                "name": "ram"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6476",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6477",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6478",
                "name": "cores"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f647a",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9814d0bf2ce014d2b41350f6479",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/63170c3b-994d-4dd3-82ac-7cccf353206c",
        "created": "2015-04-03T16:53:16.000+0000",
        "updated": "2015-06-15T00:10:37.000+0000"
    },
    {
        "id": "8a85f9844d5d2e11014d6d320ad603b0",
        "uuid": "1dc9d3fc-60fa-471d-b137-c6d43372f934",
        "name": "sherr-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 0,
        "lastCheckin": "2015-06-09T12:36:29.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9824dd3d1ce014dd85263786633",
                "name": "derived_product"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786634",
                "name": "ram"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786635",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786636",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786637",
                "name": "cores"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786639",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9824dd3d1ce014dd85263786638",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/1dc9d3fc-60fa-471d-b137-c6d43372f934",
        "created": "2015-05-19T17:21:45.000+0000",
        "updated": "2015-06-09T12:36:29.000+0000"
    },
    {
        "id": "8a85f9844de526c5014dedd998835d8a",
        "uuid": "7c714eb7-b253-4887-b08f-850e26f49dd0",
        "name": "dajo2",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 0,
        "lastCheckin": null,
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9844de526c5014dedd998835d8b",
                "name": "derived_product"
            },
            {
                "id": "8a85f9844de526c5014dedd998835d8c",
                "name": "ram"
            },
            {
                "id": "8a85f9844de526c5014dedd998835d8d",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9844de526c5014dedd998835d8e",
                "name": "cores"
            },
            {
                "id": "8a85f9844de526c5014dedd998835d8f",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/7c714eb7-b253-4887-b08f-850e26f49dd0",
        "created": "2015-06-13T16:56:10.000+0000",
        "updated": "2015-06-13T16:56:11.000+0000"
    },
    {
        "id": "8a85f9844df26b1c014df71601eb0bcd",
        "uuid": "1205e19f-d024-4fd8-a40b-f18e4048f861",
        "name": "unified-installer-demo",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 5,
        "lastCheckin": "2015-06-15T23:18:49.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9844df26b1c014df71601eb0bce",
                "name": "derived_product"
            },
            {
                "id": "8a85f9844df26b1c014df71601eb0bcf",
                "name": "ram"
            },
            {
                "id": "8a85f9844df26b1c014df71601eb0bd0",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9844df26b1c014df71601eb0bd1",
                "name": "cores"
            },
            {
                "id": "8a85f9844df26b1c014df71601eb0bd2",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/1205e19f-d024-4fd8-a40b-f18e4048f861",
        "created": "2015-06-15T11:58:44.000+0000",
        "updated": "2015-06-15T23:18:49.000+0000"
    },
    {
        "id": "8a85f9864c6426b7014c6845676f1fb9",
        "uuid": "e769da32-8914-4c69-bfb1-74e676fc15ea",
        "name": "zeus-sat61",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 2,
        "lastCheckin": "2015-05-21T04:23:51.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9864d432dc0014d68dbaedb421e",
                "name": "derived_product"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb421f",
                "name": "ram"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb4220",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb4221",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb4222",
                "name": "cores"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb4224",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9864d432dc0014d68dbaedb4223",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/e769da32-8914-4c69-bfb1-74e676fc15ea",
        "created": "2015-03-30T01:22:01.000+0000",
        "updated": "2015-05-21T04:23:51.000+0000"
    },
    {
        "id": "8a85f9874d432db7014d4e5c79a34039",
        "uuid": "e7d013dd-daf9-4567-94b3-25a76c1dcfb8",
        "name": "bbuckingham-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 16,
        "lastCheckin": "2015-06-12T12:59:57.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9864d432dc0014d4e98497d04a8",
                "name": "derived_product"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04a9",
                "name": "ram"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04aa",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04ab",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04ac",
                "name": "cores"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04ae",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9864d432dc0014d4e98497d04ad",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/e7d013dd-daf9-4567-94b3-25a76c1dcfb8",
        "created": "2015-05-13T17:39:52.000+0000",
        "updated": "2015-06-12T12:59:57.000+0000"
    },
    {
        "id": "8a85f9874dd3d5fd014ddd82e29859e6",
        "uuid": "15900031-27df-4004-be36-1203df10b238",
        "name": "jmagen2-rhci",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 0,
        "lastCheckin": null,
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9874dd3d5fd014ddd82e29859e7",
                "name": "derived_product"
            },
            {
                "id": "8a85f9874dd3d5fd014ddd82e29859e8",
                "name": "ram"
            },
            {
                "id": "8a85f9874dd3d5fd014ddd82e29859e9",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9874dd3d5fd014ddd82e29859ea",
                "name": "cores"
            },
            {
                "id": "8a85f9874dd3d5fd014ddd82e29859eb",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/15900031-27df-4004-be36-1203df10b238",
        "created": "2015-06-10T12:47:31.000+0000",
        "updated": "2015-06-10T12:47:33.000+0000"
    },
    {
        "id": "8a85f9874df26cde014dfcf1b4f65e08",
        "uuid": "50f73b81-0242-4f9e-bcd5-d9fac11715af",
        "name": "tzach",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 7,
        "lastCheckin": "2015-06-21T08:08:51.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9874df26cde014dfcf1b4f65e09",
                "name": "derived_product"
            },
            {
                "id": "8a85f9874df26cde014dfcf1b4f65e0a",
                "name": "ram"
            },
            {
                "id": "8a85f9874df26cde014dfcf1b4f65e0b",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9874df26cde014dfcf1b4f65e0c",
                "name": "cores"
            },
            {
                "id": "8a85f9874df26cde014dfcf1b4f65e0d",
                "name": "instance_multiplier"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/50f73b81-0242-4f9e-bcd5-d9fac11715af",
        "created": "2015-06-16T15:16:48.000+0000",
        "updated": "2015-06-21T08:08:51.000+0000"
    },
    {
        "id": "8a85f9894d368c97014d53db16823fec",
        "uuid": "b81fa0af-167c-4f6f-b5e8-654258323bfa",
        "name": "bbuckingham-rhci-multiple-pools",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 4,
        "lastCheckin": "2015-06-04T11:59:51.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f98a4d5216d9014d540245b13222",
                "name": "derived_product"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13223",
                "name": "ram"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13224",
                "name": "guest_limit"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13225",
                "name": "cert_v3"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13226",
                "name": "cores"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13228",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f98a4d5216d9014d540245b13227",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/b81fa0af-167c-4f6f-b5e8-654258323bfa",
        "created": "2015-05-14T19:16:16.000+0000",
        "updated": "2015-06-04T11:59:51.000+0000"
    },
    {
        "id": "8a85f98a4dbe2c21014dc508633a25f4",
        "uuid": "13db1ae1-5b4e-48a4-abd2-f935d9f1664d",
        "name": "zeus-june-sat",
        "username": "rhci-test",
        "entitlementStatus": "valid",
        "serviceLevel": "",
        "releaseVer": {
            "releaseVer": null
        },
        "type": {
            "id": "9",
            "label": "satellite",
            "manifest": true
        },
        "owner": {
            "id": "8a85f9814a192108014a1adef5826b38",
            "key": "7473998",
            "displayName": "7473998",
            "href": "/owners/7473998"
        },
        "environment": null,
        "entitlementCount": 0,
        "lastCheckin": "2015-06-05T18:49:36.000+0000",
        "installedProducts": [],
        "canActivate": false,
        "guestIds": [],
        "capabilities": [
            {
                "id": "8a85f9874dbf0dcd014dc50e532963da",
                "name": "derived_product"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963db",
                "name": "ram"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963dc",
                "name": "guest_limit"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963dd",
                "name": "cert_v3"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963de",
                "name": "cores"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963e0",
                "name": "instance_multiplier"
            },
            {
                "id": "8a85f9874dbf0dcd014dc50e532963df",
                "name": "vcpu"
            }
        ],
        "hypervisorId": null,
        "autoheal": true,
        "href": "/consumers/13db1ae1-5b4e-48a4-abd2-f935d9f1664d",
        "created": "2015-06-05T18:42:50.000+0000",
        "updated": "2015-06-05T18:49:36.000+0000"
    }
];

  consumerRouter.get('/', function(req, res) {
    res.send(consumersCollection);
  });

  consumerRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  consumerRouter.get('/:id', function(req, res) {
    var consumer;
    switch (req.params.id) {
      case '8a85f9814e0ab1b0014e1af581883e18':
        consumer = consumersCollection[0];
      case '8a85f9824d432b38014d72309d492fcf':
        consumer = consumersCollection[1];
      case '8a85f9824dd3d1ce014dd91685af4f44':
        consumer = consumersCollection[2];
      case '8a85f9834d9b3bdb014dad45435d4072':
        consumer = consumersCollection[3];
      case '8a85f9844c7a3d77014c7a40b0e420b5':
        consumer = consumersCollection[4];
      case '8a85f9844c7a3d77014c80336cfb436b':
        consumer = consumersCollection[5];
      case '8a85f9844d5d2e11014d6d320ad603b0':
        consumer = consumersCollection[6];
      case '8a85f9844de526c5014dedd998835d8a':
        consumer = consumersCollection[7];
      case '8a85f9844df26b1c014df71601eb0bcd':
        consumer = consumersCollection[8];
      case '8a85f9864c6426b7014c6845676f1fb9':
        consumer = consumersCollection[9];
      case '8a85f9874d432db7014d4e5c79a34039':
        consumer = consumersCollection[10];
      case '8a85f9874dd3d5fd014ddd82e29859e6':
        consumer = consumersCollection[11];
      case '8a85f9874df26cde014dfcf1b4f65e08':
        consumer = consumersCollection[12];
      case '8a85f9894d368c97014d53db16823fec':
        consumer = consumersCollection[13];
      case '8a85f98a4dbe2c21014dc508633a25f4':
        consumer = consumersCollection[14];
    }
    res.send(consumer);
  });

  consumerRouter.put('/:id', function(req, res) {
    res.send({
      'consumer': {
        id: req.params.id
      }
    });
  });

  consumerRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/api-mock/consumers', consumerRouter);
};
