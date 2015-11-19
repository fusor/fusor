module.exports = function(app) {
  var express = require('express');
  var entitlementRouter = express.Router();

  var entitlementsCollections = [
  {
    "id": "8a85f983510e0e2d015110e47e6b562f",
    "consumer": {
      "id": "8a85f98350fe2951015102a33a6d4e9a",
      "uuid": "7ffddefd-aacb-4192-a999-01beb7c2e473",
      "name": "tsanders-rhci",
      "href": "/consumers/7ffddefd-aacb-4192-a999-01beb7c2e473"
    },
    "pool": {
      "id": "8a85f9814c508347014c71b23f4a4775",
      "type": "NORMAL",
      "owner": {
        "id": "8a85f9814a192108014a1adef5826b38",
        "key": "7473998",
        "displayName": "7473998",
        "href": "/owners/7473998"
      },
      "activeSubscription": true,
      "sourceEntitlement": null,
      "quantity": 90,
      "startDate": "2015-03-31T04:00:00.000+0000",
      "endDate": "2016-03-31T03:59:59.000+0000",
      "productId": "RV00007",
      "derivedProductId": null,
      "providedProducts": [
        {
          "id": "8a85f9814c508347014c71b23f4a4789",
          "productId": "220",
          "productName": "Red Hat OpenStack Beta",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478a",
          "productId": "201",
          "productName": "Red Hat Software Collections (for RHEL Server)",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478b",
          "productId": "269",
          "productName": "Red Hat Satellite Capsule",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478c",
          "productId": "150",
          "productName": "Red Hat Enterprise Virtualization",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478d",
          "productId": "239",
          "productName": "Red Hat Enterprise MRG Messaging",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478e",
          "productId": "84",
          "productName": "Red Hat Enterprise Linux High Availability (for RHEL Server) - Extended Update Support",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a478f",
          "productId": "70",
          "productName": "Red Hat Enterprise Linux Server - Extended Update Support",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4790",
          "productId": "180",
          "productName": "Red Hat Beta",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4791",
          "productId": "246",
          "productName": "Oracle Java (for RHEL Server) - Extended Update Support",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4792",
          "productId": "183",
          "productName": "JBoss Enterprise Application Platform",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4793",
          "productId": "240",
          "productName": "Oracle Java (for RHEL Server)",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4795",
          "productId": "86",
          "productName": "Red Hat Enterprise Linux Load Balancer (for RHEL Server) - Extended Update Support",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4794",
          "productId": "191",
          "productName": "Red Hat OpenStack",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4797",
          "productId": "69",
          "productName": "Red Hat Enterprise Linux Server",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4796",
          "productId": "83",
          "productName": "Red Hat Enterprise Linux High Availability (for RHEL Server)",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4798",
          "productId": "250",
          "productName": "Red Hat Satellite",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4799",
          "productId": "205",
          "productName": "Red Hat Software Collections Beta (for RHEL Server)",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a479a",
          "productId": "85",
          "productName": "Red Hat Enterprise Linux Load Balancer (for RHEL Server)",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a479b",
          "productId": "167",
          "productName": "Red Hat CloudForms",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        }
      ],
      "derivedProvidedProducts": [],
      "attributes": [],
      "productAttributes": [
        {
          "id": "8a85f9814c508347014c71b23f4a4777",
          "name": "ph_product_line",
          "value": "RHCI",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4778",
          "name": "name",
          "value": "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4779",
          "name": "ph_product_name",
          "value": "RHCI",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477a",
          "name": "product_family",
          "value": "Red Hat Cloud Infrastructure",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477b",
          "name": "variant",
          "value": "Cloud",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477c",
          "name": "management_enabled",
          "value": "1",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477d",
          "name": "sockets",
          "value": "2",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477e",
          "name": "multi-entitlement",
          "value": "yes",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a477f",
          "name": "arch",
          "value": "x86_64,ppc64le,ppc64,ia64,ppc,s390,x86,s390x",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4780",
          "name": "support_type",
          "value": "L1-L3",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4781",
          "name": "stacking_id",
          "value": "RV00007",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4782",
          "name": "description",
          "value": "Red Hat Cloud Infrastructure",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4784",
          "name": "type",
          "value": "MKT",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4783",
          "name": "enabled_consumer_types",
          "value": "satellite",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4785",
          "name": "ph_category",
          "value": "Subscriptions",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4786",
          "name": "virt_limit",
          "value": "unlimited",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4787",
          "name": "support_level",
          "value": "Premium",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        },
        {
          "id": "8a85f9814c508347014c71b23f4a4788",
          "name": "subtype",
          "value": "Premium",
          "productId": "RV00007",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        }
      ],
      "derivedProductAttributes": [],
      "restrictedToUsername": null,
      "contractNumber": "10670000",
      "accountNumber": "5530698",
      "orderNumber": null,
      "consumed": 76,
      "exported": 73,
      "productName": "Red Hat Cloud Infrastructure with Smart Management, Premium (2-sockets)",
      "derivedProductName": null,
      "branding": [
        {
          "productId": "69",
          "name": "Red Hat Cloud Infrastructure",
          "type": "OS",
          "created": "2015-03-31T21:17:29.000+0000",
          "updated": "2015-03-31T21:17:29.000+0000"
        }
      ],
      "calculatedAttributes": {
        "compliance_type": "Stackable"
      },
      "stacked": true,
      "stackId": "RV00007",
      "href": "/pools/8a85f9814c508347014c71b23f4a4775",
      "created": "2015-03-31T21:17:29.000+0000",
      "updated": "2015-03-31T21:19:26.000+0000",
      "subscriptionId": "3565254",
      "subscriptionSubKey": "master",
      "sourceStackId": null,
      "sourceConsumer": null
    },
    "certificates": [
      {
        "key": "-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAhkO4+XaEKzzTUno9xsMnNCc1pCtmQGMXMtNzgL+Wom+yM1b+\nCHEAjfpJF3Y5IyXu0deQnC22/aIIa6mRU0ixYJznZItIF8znRXvxcnrJmoiEbDK1\nZLhgcSBZCBk3htc/rHG3gcRh9QP6VQjbKPnA11dGj+vQpNJjj6V9S4jmLdh3/BBi\nqCN1B3d48t7odl/UHe/3W1ALfP1bYKe6xej1Uv5NX90jQOqWdfm5LbRAULsKCJ6f\nnP5wdQAR6K3p03zr6HnJl62uUu0ndj8aD+9bwLQjTWCNNXIapflG2RZg6pZV7L+e\n0CHVx3S2DPnihaPPhbrHgK/bOb8fECeuaSA6bwIDAQABAoIBAFCTphg4kztrppsx\n948ooYeAHIYo8ZWkolCDbCcRU/KqO/TpuU0RnDaYxXLKJaI9aqUOzJ+eI9r1ej46\nppen4aPMpmXF3P9Dnmwp5Q5COGmAkpBookoPCPn7YtMkZxmKZpE0MeA0HmGwAHU1\n+mkN8jiKDTPkXvP7u3qC474IK7PI8zx0WD24EsgukszlGzN4StGbnYcj3Ba73xdZ\n9GREZehrCsacw1g00msBUdsf7r/dkUNauu0EBod4lvBo5wwKYwKkDFgbJnRqVnV7\nLPLyGt0IrjGiwzib5h+u4WWpS5oY8k6/DevuIfJJaQzpALnTeabiOxxveHclvHpO\n4E8I7ekCgYEA/YheF1T51rj/MvN9J9liFphMiP0EXG2brV+XLNiULSMLqJKHhGk8\nVkH0CKIO4TBElxmV7qNqVvwzcOHcgLLY4uO5C/n1Zf8cYAkdty5zAgNLMYeNaEHF\nZfBw6duvF8Xpbr+l0NR/6qhFonYzyuU3enJBAV9QIVLABzGsp1Ft5A0CgYEAh5I4\nH/m1kZLS1NGHDCu9g/ipAHfDJV4m7OQtlD7oeTDBWCmZvhQnRcGjIHm40iVtSJ0W\nYlYl2U+QnwPxLxae7OnCoNvjp2e4ksinZPZ9Tv/V+Q3aJG3BCOkTiQF5N0YdRp/F\nhFx/O8iMc1AMVO9KK7QTeWZK31gCLKN4DJSCTWsCgYEA8X1q4h52uygLLKTwmXxe\nCdeXTwRxmvhsSH+8p2LEARpYiIDJxD3Y0vCPWYnDUot/Sc19GoldSO2Asgzw00WH\ngNYX9GhqbnTIulD0lP8RXOF2Rf8vmhbLx4V2h8pQxPwmlO7HKlq+XO1bJpwgSSp7\n5Y3ejUgUMyl272NJaTYOziECgYBX9B8Bb6nCVfT+KSlqVf5P3kUWjpxGY/zw92Ay\nq1V7OoxVPDgIP17zPJsueInVnH53+6IIDkfj4mC7KX2RxSU6IrYoUkAx3XK7l/4x\n3FCTrhsNx1TdCW+Q7lXELvaLS6u2o/Uq2C+bg5LLRQWbHNuL2vo/aoPsvlY6y5sY\n3khjHQKBgB4V9RXFzs1d5bb176NCcnL4Or+pxcPmpjewhWZdr+O5XNByoEBvUisH\n78G9YpCQ7Fa0vMctjwU+rLpDb9uIg/Z83QaJa7PPhlZcXw/oGYTW4+6/rG+hbK8W\nmmi2q8dF0Ci+XdYxmup7al0PjXgB6mew5bT/le6MLcMOUGc5AEX/\n-----END RSA PRIVATE KEY-----\n",
        "cert": "-----BEGIN CERTIFICATE-----\nMIIKfzCCCGegAwIBAgIIO7UV55+tQ8IwDQYJKoZIhvcNAQEFBQAwgaQxCzAJBgNV\nBAYTAlVTMRcwFQYDVQQIDA5Ob3J0aCBDYXJvbGluYTEWMBQGA1UECgwNUmVkIEhh\ndCwgSW5jLjEYMBYGA1UECwwPUmVkIEhhdCBOZXR3b3JrMSQwIgYDVQQDDBtSZWQg\nSGF0IENhbmRsZXBpbiBBdXRob3JpdHkxJDAiBgkqhkiG9w0BCQEWFWNhLXN1cHBv\ncnRAcmVkaGF0LmNvbTAeFw0xNTAzMzEwNDAwMDBaFw0xNjAzMzEwMzU5NTlaMCsx\nKTAnBgNVBAMTIDhhODVmOTgzNTEwZTBlMmQwMTUxMTBlNDdlNmI1NjJmMIIBIjAN\nBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhkO4+XaEKzzTUno9xsMnNCc1pCtm\nQGMXMtNzgL+Wom+yM1b+CHEAjfpJF3Y5IyXu0deQnC22/aIIa6mRU0ixYJznZItI\nF8znRXvxcnrJmoiEbDK1ZLhgcSBZCBk3htc/rHG3gcRh9QP6VQjbKPnA11dGj+vQ\npNJjj6V9S4jmLdh3/BBiqCN1B3d48t7odl/UHe/3W1ALfP1bYKe6xej1Uv5NX90j\nQOqWdfm5LbRAULsKCJ6fnP5wdQAR6K3p03zr6HnJl62uUu0ndj8aD+9bwLQjTWCN\nNXIapflG2RZg6pZV7L+e0CHVx3S2DPnihaPPhbrHgK/bOb8fECeuaSA6bwIDAQAB\no4IGKzCCBicwEQYJYIZIAYb4QgEBBAQDAgWgMAsGA1UdDwQEAwIEsDCB3gYDVR0j\nBIHWMIHTgBR3LqXNNw2o4dPqYcVWZ0PokcdtHKGBt6SBtDCBsTELMAkGA1UEBhMC\nVVMxFzAVBgNVBAgMDk5vcnRoIENhcm9saW5hMRYwFAYDVQQKDA1SZWQgSGF0LCBJ\nbmMuMRgwFgYDVQQLDA9SZWQgSGF0IE5ldHdvcmsxMTAvBgNVBAMMKFJlZCBIYXQg\nRW50aXRsZW1lbnQgT3BlcmF0aW9ucyBBdXRob3JpdHkxJDAiBgkqhkiG9w0BCQEW\nFWNhLXN1cHBvcnRAcmVkaGF0LmNvbYIBPzAdBgNVHQ4EFgQUH4sIAAAAAAAAAAMA\nAAAAAAAAAAAwEwYDVR0lBAwwCgYIKwYBBQUHAwIwEgYJKwYBBAGSCAkGBAUMAzMu\n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\n0D5T\n-----END CERTIFICATE-----\n-----BEGIN ENTITLEMENT DATA-----\neJzlfWtz40aS7V9hKPbDTITZAlB4kP7W9rbHPWtvO6wd37h7Y2MCktgtjilRS1Ky\n2xPz328BfAFkFTKzqhKoYu9OzLTdIkBVVmaefJ3859Xd8mn98jhbXX19VXz8eH8/\n+3g/Lsu723EaT5NxOZ1Ox1F8O7st7pJZWoirr67+96V82sw3n6++jr+6Wr/cru9W\n8+fNfPl09fU/r9a/vsgn/fxLJP+vkD/8VD7Oqn8xux99X25G3y6WL/ej908fV+V6\ns3q527ysZqPf5puH0c1judqMfiyfyk+zx9nT5qvRT6vZ4/zlcfSnZLxe3v0626z/\nLB+4++PV18lXV4+Hn776Wj5tJv92tnqd382qb7KYvc4W8tW7x8iPbj4/V9/lh3j8\ng7j6l/zhTXn36/zp09/n943vLP9iubqvDuSfjV91GtU/v5JvukqiOBtHYizi/4rS\nr6NI/ue/5eNnT/fbv8z3fym+zqbyP9VfymPerMq76uNxlBfVq+S/Le/uli/Vt7/K\nMhHl00n19ufV8l6ejPwV/98/r+qvlqTR8Sg/yMcsZqO/lq/l6E8fl6vRz9+/+2F0\nI3/x2ao6IPk/61oYV9ULVncP882sPufqgVe/T/K/56n8G/mHq//Zfq/6/A7vyqf5\n8aw+1wd3IsR38iOr59V8PRv9MH96+X2U7V4/Go+a3+6b2UZ+xZ9/+rEW3KK8reWx\nepgtxtl4XX9ivHmYr+6f5bl+Hi/rj47/IT86vpUfHa+eH9f1L/R0v1wd3y//1XO5\neZD/4nr37a+rH7+uHny9fex1dv1vq9liVq5n1T/92638Q3UU1413XC/XtdDK28VM\n/uIfy8V6tj0w9Ul9ev7095dV9Rt8nC9mX19fX882d9fPv86v5fccy7+9lr/p+C8/\n/WX8H+/+73g1u38oN/Xv8RXh53dfWr71UX7yvtyUf5/9/jxfyeOf5GkkL+Fq9r8v\n8p/v/74pP9Xfs3WeV//zr6+OghSOBGkmQ7z47ufrjZficyuOyVEc1XdAyCPXyOP9\nzYdzeeSAPObrpak8coQ85OMNBfKw2TxLgZBPOT8/ZZFkgnzKBeWUC75TLtydspPz\nLZTnm7s63617MDrk2j3gT/rMPRR+nm5S1KiAZLJ1JuJm+bK6m42UlhuyFOv6szYG\nHGMwtm+5vpFf8cZfU642MhOqmDp1oEtWKFUgCwytEVQh+Q6UVFqXTxOyTdMhJaU5\ng5CShc/AIKX+PbMK/xRR7Ar/dHgOyLTZeo5gkJC81YXTOK7LSKHCOXsjhbns/XqV\nAeM76YXIAu70Qubuh8Hv4KI738WmRtCZI7FZ4QZ7jIcJV/qCD27hQOoqb2JjM+0F\n5J+5dJtPmbqKlYyCJOboyOf0lgpuFBE529iJ7mziV0dww78gti+/pcaTDb9lFyV1\n4HcUkrTA7yHFS4lThTLXJGYVuqQ6jDpbRMYTOsBnhPSYIR4vUncA7Bo6lUXnh39T\nbmaLxXwzu0LXTtdiGv2urJ6KIo4BYR/eN8re5I0KrrSVn9eb2ePov/8MAsf6B8d/\njNf7Z43ls6wQ4+6JWvt4eNO1fBPe6x1Oqme4OL99PJxSQxfTKIaCr6Z4ioZ4cqx4\ncrV4Cifi0dnTpngK38WT68VTgJnYo3zyN3FDPnuT+WeopHQUinyAXbmu2L5SKQf5\n8KHLSaLIoXJS8zSj9m3fn+a/z25fPgE4vHmm0fi++gRHfNQ83ei6fo2PvkcFAooI\nKhl1+IW9KFDpBHc+oRsxG3qEgWSiQNjS2kDADGFsUDm4ts1xkXqDTI/v8lCYK+mc\nI7z1r71zdwmo7X4Z2l/aXtfE2g9jjeRJg7U4FA7Snb8aABlJgIZ8IBkoAI95zU2D\nYqStn1JOV2Psu9MjbSvPUEBum/c+kYzSVMdQMqTjvu5PFIthqrvKil6qm+pn2KyE\nLgUNRY5HH+p28HKh9pgdgFLhMJe7Z7lBlrqExvn7/IaYavcJZeAROoJKu7uLayka\n4zukUeoO2CmGiMAosRd71BWM3UqjHBpk0MF7i+g3dhH95gC499YsKVUgxruPjowo\nLRXaQw4UUATPMp+ilflEgVJ8cGUFQDHG3wyADnXhc3yOuW3zC8DmK/MJVjYfxEMe\n23wlBspNUzpG/jbmtfN+nrvayFOwZ24bnxkaeIrBCens8Xdee/Zk3O8itYyTRJC4\nP8eXgbW4nyiTyhX0IZPKIwQokzQqKDLRpPspeX7WBL+f9klZhSTV3HNdrplSbLcM\nAJx4CM9q61IMhNp6RyCmy0ur5WCV83eTm3aY89eHV0WOB0DaJKlx3sFtkhS8/oEk\nSdVOgCInjROgZbCdJIVgh+CtGJQ+ISOUyLQACZuhqLSCNUNRqUGfJTJ1upOQ4NHG\nvvgjteqdgmPfgY9TGnRoug6RxaEaij4qXH7bbHUbGyWpA/tWYlzVcq49BFht7xpg\npCUFBo1m0SrGRrXi/qrEwYRi0kdQjJrGRZDTEi463mCHEaSiRHh5aBuFKO2g7H2g\nfuqCany+IKWDYCNFbAR17FWIJst3ZVHnkfD1/I48ksHshpvRGsfZbs/yS2lEKkNo\nW0ppMzU9DNOElubLQYI2ROCCH6GxiqxxwcrgYzRxgT/SDstD6Za2zJy6aarop1s6\nN22Rs5nC6MXnhutqc3y7NSbiNgq1+4ux/QStjYDhKJp4Io7C+Os3y/W6OT3+9vl5\nMb8rq19t9NOi3EhZPF6hx5qfn+86qaHTONPF9ahvIq+KkHdhezeqa/L+mx9HPy1/\nU16Rf9yOZ+WzvAhiLH90vDuR6o/P1SeMbkf9Se3l+MetfKG8DwK6D9tzGsbl179C\nE3bFWnYBqkw6QkqVMA4RJkNMiRaFb6xEqdB2u2LFkZ6LQ+PdDlJJFVLhG/zcCycN\nlzxKTCa6ngSkmM6FpM7172WkkJB1qh8QED7J741cpProwCBVfYozD9MtoKYSFQ0/\nYy6lrbfRgcSjFsFiGsbhFDqHo0vDWDgcQDYqt8OtPtL5BKhAsbYPhSodsgKJYRQI\nIyafFEjkmS64ovkesM587nsKZ8oDSCWoArM0aboyDD2uIWHo3AGGtg5nfKOSlOKw\nBGcqDwNhaJWL4cfQIlwMLbGaroBmEergQVp/QAAD0XyTjshSSyRNztT0nKcJKUsj\npWGZOdNKA7BraqFYGDacbNBWzScpSYtmG9roo09q3MkZcXqpORq0PJlY5jfJUGAI\nIBAuDIizxM7RZGjonPUJnLPQYLPIMks8prVdaIUpXPoYKMT03Mdo0mdCOw1H9TFk\nLNB0NX2iAUqlwCc8IH2PZTINX1nrta7mtWlT+xg7pUnpGYF0kIyAfKtBy4hPgrJD\na0pBkSTELJrANEe6G8tkc8PdwKnNtN/UJhjJ+IbRUhHZdtAocmakbBlrnsxncai1\nw7Z5Rg/GqCiME355GfCrQZd0IXZJmAytIFmf6uF3PKn05bbdfnjH0avb8FoQ6sDe\nsqeMnJTsOSXpp31SB/DSPtmphSLf1R2JqNJefGPIe2sVRgyixFixK4zVMYKsTt/b\n2y7r5L0/bRXSbrlqdKF1Ig3ShxRYF1Iaa0c87BvFCL0WfWaMKd0WPskqzrR7nIyR\nGKFs3JPLCaUGpnY5tg1k+sIxIanfqzJ5n9TXFmBsO2QVGTFS5aUvhQpmQkOpUomr\n7jJ0n6wSy3F3ylK6y3wAdbmzKjPdFxXuVMdZcdkf0aSxdtmIRRszAcv1aNlC6ZtV\ntjfbormOKVqStHrsAPAeeeuma7W7HOhRkolK9WfxDFTKA5sn3ZGr3CghSd1Doiec\nNI/UEVcT6Jh8m0o5WLUiJEG4mszEQ2aVONghM2Ey0wO5xFlilx1QVDTRFYPeOpdC\nqRioh2ZtY019LpSaBOXMfgZUZpPxvysiDQLyUiUA+JEXPU0zoFVrrpRrUBHtjmP0\n7WL5cv+dFMB69I18xRWSfEhJN5QLiKv/5G06b3X3cfw4a4r2Vv4w2U1VH7quH9UQ\n7EGYfXmkrwgfud1KwB5Z5ALidjyThEbV1KIg61i3LHpWp4FEAtL9n8nkO/ljCGlU\nT3Mih/2DfLZnjQOFOO/OzhN3uV3d6l4CkT7v8vHw6w3jJ6fdcPA/zJ9eft958dF4\n9O53eVr38sf+9izfOxvdvDw/L1cbrK/56mpedvLcxYl27kP75XLw67VIErsJEWcv\n6yMVIv76yI+hkqgH7sPAGuEmE2iT8JlYMoxYqj8tZo/yCMvV586lHVlTQuvmx7Zo\nYv70cWkmKy27evMlFB6C9h0fOsRKIm0vkFZ26ejtTYfc1DqUjst1LR0DtSnX16lO\nZdZXRqf8sl5drx/K1ez6fnl33T7Xcfr2pnns5HOuftfGGecTEBGYma0T/eheEXSu\nGXgiY6wBaysFkh5aISWX65fiZlsB8vQL+PQBJu7qtM3PVxeYDky4HecZ2f+aGHqq\niTf3xDjrjnXHfpl2efPBXW5GN38XQcIKsIse3evBLo4cmn9eCO3ii+//c/Rfy+Vi\nXacdbZSjk0G9pROrh6fxpnonPWrHqsXhFQY5Zc+UI0nwTOpbSbb3LjVF97cbcNtP\nrQ4HkvOtmGiriNGmSx7UVkb4bcT+SQdEpd3SyVHSyfmk00F0byAdT+I8qTT41Uwo\npUGHdArhcAV2LQmFG9hNppCszLDaz9+Pvl0+Pi6f8NJbPYzv6o9wyezwgqDlBaXy\nreVFgBJ7gTFCib3IwocSEztnVaCcVcHnrDr25ZCdlQ8Vgzgih6mIuIeSjyzY8pFa\nWZnlI70Ql5Z5y05cQFa/cJzV10mGmNX3QCIiAvcEK5LC70ySwjPjpPCs76TwO9uk\n8KyZFI6TSQOfucsKI7LA7vO+XmR69aRwTpOTaBDVNvtsQKpt+EMHU0IIrTNwl1Oj\nJNM4s2iBZmf0hKZIGWGyzLDPdiEjndOmysgDry09ChlHYRwKnDpj6ITQeHBPEmHy\nqMHNs0Zn3VVayZ2WVrQJSlJphdeji6igYyQIiHYd8QGPmh9vByylHq3O6pue8AkC\nTWMBLfh1EiZTA2SGPIZBNdcDg57GKU8eo5ESxHjZfS6Qw8vuk4DhCCXRgx+z0lRH\nGgksUFFb5c3KVJ5v2VF4jiTSjp8at7V1yOnQ3GYsj44WN4cljT673qT1Ihc0qNYL\ntV3ecUEDtmUBDQ01KruQqyFWdvFpEoVZ40uWtOxa6MmSOALHf3hbjvjkFLpkBN34\noZKRv8xXm5dyMf9jO1WJF9Xrhk9ar5vgBZa20vEuirjo6iADrMMVdEMqEkpTR2+i\nJ9g6ZTpAZevMMy6ArRssLaBuHdZ2tjoqyaKh26Eyy4bcDgXaAIGbiAqDQAeVIeuu\n2JpLA86QOfQifZZ0pdbo+ES4KyHudUKZgPfgwqfwDCjRUaMtEUukgnPVAVqmtLUd\n4cRjuysTwlMoxzKh+0GUY5lw4FmUfEI2PSYjhl260jFpaK0luIHDMIiOVOnKqXZX\nq534oEx/7jrTrxMUNdPvjWjihD7cjqn0YrP+XBn+8HL6QghtVyLOnzjqdnDQdqJX\nE2prkCfCSRNwNJhYFsO7Gg5YhiuMBetw0jji6bkm4IWOFgA+VG2FFzxA1dIdkRPL\nRAoctOK5y8yAhDjBKlocgVx5XB2sztP8pm31PZdekgk5d0lozUP4IzbfE64S0I0W\nqhp2MFo/rZb3L3eb+et887lJO7rGD6k+Nx5hjbp1KtR8SbizqiLKG+Gqo77M7oZM\nt52Y/rRgareAWyXFsLVHrjpjUJVFQe+yNCrVo2r0LMX5MMdMkigz6f7ubuLTWJnS\n2Mp0NO4NaGVanXgSgybkg8SAULho7r5a7lOZXN5QsumALmh38bW0Lb52XNe+i69u\n200lxuQx4xiMSUSXzLgyTHMvsRBPv/Axs4GFRYfEBhc+OuQ1QgJKyWTK4kZaVSrY\npRyrVO6dy7FK5ZObkf6bg8oJHRlzBcPBxr9pnHKEbVhuLc1kA5exMiDX8sBaxTm9\nMc6kI4LaCsHdAxFY3VBEOblxBcokdQ5qzSwHtTqySr0NarltW5RRTAN4OYqzu6es\nS9spaziM8SX4FkJoL7i7rgVsN8mxd4Grr+TYwRBkh4k2hnRHPoNnzXQlK5iIJlgo\nNjFg0TJhfULMhzjarYDjefIpPknjiO5ATLpJEIzzjoSA6x8Znn9eX4Zz51tgMhoX\nHdawP/GCkiaZTHnSjFCnriYHwknMG2YeMZlqt/o666XGwy1XwTncVx0e3EozPcu/\nuwERAkeEs/0Z8LhIiK2Hgp71MiqUYwHy64YNGb9uwoXEQqTazJc7VIBuh3OoVjBG\nCLZFTmI5PYZ2F3tiyiv2WA6ON30KX+KIzpvprHKM5u9oFZDZmDxadeTQOT0kEiTT\nmFORIMEMOmOggrFgsGYwjWMOTkrCHArb5El4gC/NUsuBO5e9qu7SoTA6D6nQmTMN\nBOGXnXRUOy2XneBKnuFFvjG8Msh2igsrL2e9TuAMVzhiakCIJDoXzYfn2dPNprz7\ndfSNfMMVcru9aqF9EoH3oP2y2tzu7kEONR8s5UfX1UfHt/KjBNFWP46U7e4NzPy9\nt9tzto+y4LFX/XkXSBhxcuxkRHF2+oXyxPsCFEZnr6pWwFu5Os8egxNOjp5q0pAn\nz44OXB15AvdEd5oXVHDj/LrDxsbrq682OxBG67z6pEvv/Lp7aNrVdx1qku286xi8\n5Nq8wDfdT1OjhEr1yjgIxG7PGwuZThNKZ/hpklt0f9SXAMf/2bRs+LTombwDYgAV\nmX4PF+5k3U1nt1KfbjTP3/nsr7iVVznPndDJddvx6KqUwnz/WH6adcWb9c+N5/WP\n4SR3P19vTmxmvn1vQ2rb514fnjt0j0hEZ8+te5q3FglqX7bUgLqBuWohHrxxuf5N\nvhqk5Tmd0C98gXcchWPHURg7C67eszQGCSdxfF9Ypi8nLF8oa3IhFF9JmtF31B3u\nOO56k2/2mQCAcsnQHZZRYcMldKwTbk1G9w0/Vgjt03Xnt7pfAs6WZe85t55PCVXf\nk96jt5/kge6KWi1WQlB2s9dxWX3YzhrpClP7p1+L0Aa8EpFBuY8uFTrEEN+Vawny\nZOwOJr139YyPuw8QBLL/yKlQTFe5+yOEFEyOdNVu26XAFvzpTk21i4EM6fBh+Bz7\nsm6qNJeY2nQ3UztXLLpWCNYt+LYVMYmhbEnlaEa/JL/UYHjU2EYAZHdfk9ff5k/j\n2ObkdSBr++xwdm8KkegZKIitrVsr1j3bcmw5qU2XRQAXyHSLjOqge4yO6ujhHGsc\nF5jHTgVIO38mid2dPtt0ohNGoRWG00pSQw491JIG88sTqHFR4wGwddaDI+DzxDt/\nEKwbjsUUEsK3i+XL/XfL1eO66S12cugWwN3HnXpYWir12e+ffh2cqYoL/Z4f0A13\n5plyd3kmgFPZC++bTOhLfDIVtgfrCJkm50Rs11SU1bKOxFO/9bS+nIFq8EAkNtxD\n2FQHS4YjLNsjRGy7ZOygQcBwlMlg1JkZCmsyKknpbconVTJM1577Xr1e2maGQppp\nbjMio0io4jorT9OqVIEpTU9h1SjuQUoiTUBT3x0xZ8cgDTULyFMHVTlu2zqoZ8OA\naWGjNqoUOEZvFBlwp5bOcBImQLs3KayYnlQC7Hb4CtFx9P55S+skMkEufpu0AKLM\n3nkPoH0hyfsh6CF6AZMoJg9NN5rXwN3htrJTtK8NuzV8yC62wmbfuMmqPss1ffj2\nn9D39EnZkHnCGrJB1mmL8zwOn0zM67ReyIO+FU7d8ImIZR33OFx+V0MqwP4USrUL\nBczVNS+34LxR+bpoaJ43bB0VmgMonCHZ5hPIjvMpYc4G260IxqeqxkXembZWD2O/\nVADsMFrZ9gj6G309GFkI5qsAB1YFSNKcXG9pgC2g3lK4rrcU5HqLBwBKGCyhadP/\n1CNiOCKm7ZyYCyhbnKU1d8NiAWJYIRJtCpPIx4SNKoypGwlRRciUqNMmg+2v87tf\n1zJg3SBU49gA8R/7T+ktfvPBLq1987nhWHsJmQhpDxpkQjZFtzETH+VFCzQN0pY1\nBHaKc8oqR0DAGRoTZ2yYWF/1N8PEYWeY0yyHxHuzWa7kuYz+U8r0dTb6djGXZ9Rq\nmtfJcfxp8bKWd2Msxnf1p8byU+O2W6PKk+DL1ru3BlXDlvpGKI1i9Q1X12nomosq\nNosZ9ayQPZnot34YtAlCXU+tBkGrAmhXb6BXOZksJx8waa6Ea5rEiy7WOC9suC1V\ndXpglOS8Ts8AxfrfsjjgDPUko9NjZAgNyFxpQAip3STNyRRKqkY9fLPRoUmPg/2w\nr+a8QVsrCwtaGOK6MtNVZYY19IGZNCYF3adqu7dIjVsMBSR/e7aSNCN37ygz4Rhz\nw9cKHFT0lEYQ3rl5uV3frebP24BpvZ5tRj+WTzIgWSlHZ1Ggp3xkhDrHrzsuq687\nftx+3UvHPUIk2iKH0Xw5rgTbmjJnrMD2vJl3SBKgFKxWEZUSy1L2yDif26GYAROV\n5Va7EAhdjJqIkVNeNl2M3ggoSUEuAuroBHlogmVc4mLZCOJp1jB/lLrkMX2rr0se\ngLZtXVKHr4l1Sb/ys0LE2vIkEUMQ4YN1XcMb5OAS0kWJDf/cvm8FtU5n27ZCHKKn\nMByHd/xpPIEC0u75SNu23jexi3rfeRtRezoypIA1FTkYsELN1uY8TyzkpnSKoaAo\nJtRNMO5qtlSHcyjZMnqcwbqFndRPcnMiF7VCHQuy7svjtcZ4j6viFFyioyd3yqBj\ndUPupDvhU3In7w9bZIKMmkxmf6lDv9zTvj06jyH3fQj9ggoiaQ7cNqkg0GGe37ZZ\nBx8QKlD3BpHLPx2tQSTuMCtBdrUGXSCgUw+CEQZUaV3NtHZm7j7mHoeLhuhelsZV\n359HTQBh+YkZmBE9oyZOopi+zqRBTKE8ySMjhUkvkoKKYrBegBNqCBHpR4UI01qo\n3eyNrBfTrFZI2RV5T+l0qOno7QmBiua6lm3wZHJry/rWvlUQqAx4ect1q/+WDGJU\nG0MIEz3txjnOFba7Lrp+a4GD5qkycxKps+ouQI3XKhsyhPFmPcB+RfYxPTWlUi6i\nXvHV2AdSKZcVqix2QxVEoKk5id3cEtb0TxQ0LB2rzVz8seMSJbdDyyVZYmDPZYDj\n10lakLOU+nZtOp0n2yBhz6yeLjtPIno3V6bwL075IvkmC72hinSUFtYCb2riAtuz\nwtqtEhqNjaCkALt2u0Gnv3f+LKff555Rp5GKzeEfgTESEXNC4cBOXkSJzdHvk1Wo\n5iyrY9f2ZQV24BP6SlYDGg1e7owvZ5lMlJgkFE8ZmYH8t0VCUc/I7Es2PKbTw5Eq\naFxlswuftkqimD5uW6fK4Sy5xcYw/xPkIqITf3espSduAnaWI+9aUv/FJMgn+ZSs\nA2ccO8A8tPX2PG1CfGC9ULNLQeAGZpfSagSGXoqTK/HALxVgti7OJwTYSaN1oxG6\ncVO5fRldhHEEkrbbpvowYUYr02edkUUl+gah6nMSS4jUZjElbXfcec7DLWFErkp9\nhDcrkKQUs6jcTNFds3A5P3uxE7MJYgNFN2zIsdMzex8+djCZps/C0pko/dEIg5HN\nOuEBb5+ywGbeLZ6yzYqkmYD6rD48z55uNpWh3xZ/ijcRlmAcYiqbPa2rB4/lI+1L\nQTrAfHzNtiAkXxYQ475ILMtxBrt4XZPRFMrC3GWTyIH0xijaP1CD7AtJerUhFZI8\n0JWc3ggCcI5ifLluuSt++N+QfvTyCZwkKqbvlDqxd938i7YUpAW97Z+LXDE3oK0E\nrn/34Inb1bi4O+/FFErcTC5STxo4VIYZHi/OTOIYLQ8udW0NDcIwEv33hmScOkmb\nqpHKShiwrTFPWAxJuTagu0wTcGtzN83OPjGrI3Q5FpMUBDtW+dbz0d82tU6YYxaT\ngsz9rR97waTBFZ3JFhxUuAmYYPPgMZ2ZXdnrR8p+syX7Ak5+i4meiWInCc2azI4d\nQE0wcFiWyYYFdiszQwICSaSnOe5OsHYceZ1fNT9lRXrVoXnpM6+apPROYv3eB2QW\nyGmRp5/0z4A5OhmS6NcRUGOS7jSDE44GOA4ZOAORRPQZxm0nn8aWGLZqK3r3TAm3\nuk3GW1uTUbZNRnPhDoWv93gN9Xy9h7toy9eru4Ykvl4P/N8EJMDsaLnDgHG2NpSA\nETeZjwQ9TMaAqDU2wxPUnAhwQSrQrADyIbbaFBgucqNBIcwAP0kLm7nvxrAeLqe5\n775mzGnue69DCmViMYUSX3pWUGTLToMblC2GbzCEhhfFS/hizjaFIz7ga6oOsJM6\niSIyQ9I5xZQeedvm6PUTNL21SrXxeTvW7BPZx3lBDoz0220ohRb2fTaBDb3Ggk6J\n10jJn8wjAPDpdcMBml5DBUtC6A0WkXAYFX85LAHDJMPBxmSTgjwMoK1R4cfCGZqm\nfKxWDUklnEaOl98RWuL2eynZ1hh2LMG7/La4CR1NACqLYlNiaeHAae2XRuEe55m7\nzgHMcKTbZXveUWcOKMo0nkCFwO6mnMaWJZztZdh9Baxbouy+8iYUEJGwWWjZSTh0\nyovNw4gdTGN+khQ2/L84esyDLXNMj5mxJjD6BoX6aSIzUIjGg2xJ0859yOGZJekv\noAwFelcikE1128QJ70cMxl7FOeizDUgqkEkLd3v1UDQVwSYuEhHZpPKOTgXpTRy6\nkTDzd6lIoaAEXBlq3mHOsl/qwleGKivWmflgKqpKzVabDqkinYiU3BjQzbFCW7Xg\nGAMrWVaC3bWQRHTP0aicAiVTR7VSV+YojAppEsUGInkHiGRmIRJFK3o/InlnLBK3\nHexxNLGpDDle/MrN5hUmJJOWzGQf3ltgH15psQ9PYcp8YUxNBLiWAqZ3QvKkNhon\n+dYeWVBBeuOMY/rmnBNaZpREuCeOv5QZ41jQabn0DTT4hoHXDTOV/CuJJC3wIHBC\nyW91bIjG7vze9y3z7eCxIY32y6fHRUTAXdgd0Fi/dcg+cnqtRvoxWL+VpPTGKdWA\nJ3H3G1eErxz9DLArOhb0NTKQf0IZub2D4muJeTVBeYE7qigiS7MR3nQOqpfW7IaK\nUKe3aXVfEjepgJn2oaJAo5qM4xJS1wZ4tlE0SwQXrX6qWnQGZrEtyGGR/u6cI5Zv\nDEhFFRugExRRQt8nouhtev8oYRrc3TSvf8xYFNr+psNzB2M0mNAHls/WsgB1TraI\nKPQ4KEnpA/pKCl1M0dIdPxNIpxtSGTPuYG00RdM4GM2Dn7+MGn+cgp2t1C4/uL+v\n786+wAYPJxl5WJe03YhLab4MjUnSwsbXQEuXFQwOrNwNwTRaJgKsMcMVOUIpjrcG\nF5hJSuMpePjYTmMcfYOi4dhFLAf1HQcYwUnFAHstQXIfXL+xy01ECKKfYPuNxSSG\nmLP1LKUo/TjQlPIlOHY8pQFqhBBCvwHbaBMOlrLR5Y4If7ga05wMSLvLV9S6FUfB\nKhzgE8WJ9jZ3c2Xqe7Yc7bn2pV0rTsFCeCerF6qW0KD14qt4N3i9wq13i4mh+0MS\nrLkj6daJgUrS7c3ZCxGnWmtBpM7p8H0K5hxb3wcT5/i0NjzObHajnHB2k9YC8LKl\n9L0bYMiVYVFiwEH9Ts9BPTOb3teND3hOWy862jtxhsakOffE3vC16R7NzhfTsJuK\nlMw/0jG1iStqcjVoQDOcF92goRrJTcCxKfTGJxRtm45cxmrLELT8KdiUkYzyyM3y\n2yAPZGe1CFa8I2a1DRTzgpzK0LOr0le+2iqAV9teXXqeFITT386eHw6J7K19it8I\npw1kq4c7+ZKxfCx791j9ol2g/4be2u5BWkqKDAILdiLD0dyfSIytJ+dEYCF15iST\niT4lQJvhgXIB+5K1xeoieGrHpzSAhMzWPc22wMoVJ243Xv5yJt7SwqojFr0du1Bj\nBJc1JKON2Fx1JCFibecMldQbOUz45MyRw9nJC2iiJac09WsIaRNqjmL+QSfTBlxP\nmCTCfFtWk98ME9EcqrJUrAXSBYUXt0hoZcOvjVvqpMBXXOuaDXY6+WbG8om+94Me\n4isdtya4twC9uLgeDXydIV71lbfp84f6XxWXnZUCIEwynziNwIV+JhsbkDOVj+wc\nKfp2/i+mGpMkKZk1QOnUUUJlZAEMt48FTnF15K+AzBXD2JiyaOxBAirOKS4Dy5FM\nIFxYHblKmIkXVnaEJe68DMVoVb+dC68kstjNilOwK0YxJeOmLaawA8O+uxn1wgUb\nli5U7HjOkO0kdszMYke/oJwQ+i4kozYaUv8Ma+NMH0NOAwI0IfTmjprPxCYyWTOY\nYcZCUoG0eUvisAc4kulADPqRTJoYPMB1UgG0uM6o1RirBVwTzIOowoClLilAS99z\nIkDarlVels6hFq4OuguQPimkbsLtzns2gyiLSiXAkOtFujNOIyh21U8WZcj41Olk\nkU4frCaLPHP5mb6SbBBokkJM58Elr7sfMrIUU3KlIFdJCVWWPCmO8fA3GFTHvMll\n0vcqaptaoG1xrbIYA1Y2WQ7rAV6OOyIVOkUWlgudjamhdxp0p+32iclQ9Tv9UPXM\nbKhaMfw14FB1e8Arol/Xhv3eM0Oiyk87ekgXc9XnvKw7jsiQ61D0Bt5jUqO7+dCi\na0FnngfuM4xzcPzcoNwEJicOJSaWHF2jrBRmmk7eYaicbUEQjCPuPOcHZuTwPKcH\nDmloIEUsQIIa261Jvzj6Qm1mQAMMwuLMpjP0pKmXwlDAyU1w4YWlNM3AnJPVaBVx\nqIp/nCqcEA6UDJRgxeQyeCk+Lp/ZQ4hEizWINXUqKwXnLqRhCCncEkOB03IgVSWy\n48vpVkUEWWXoOfVJYb6/4Cw/iKP+aKUJGbcbtLKFoctJCGHZdXLCbYnteXBb/ein\n2WHI6kdEb4bcEnpAq6jMY1Z/tlAZ5CbbhI85ee7q6NIxEIytiBRe6UhEhZs6Hh4A\nu27rVWWFe6/mDbuK13ynxHnlCbvlkM+nD7Xg0GlCFFxaBIDhQuW8x58WL2spyrHY\nA2D582P24RPybgMPgvkkaq4sIhUBu9qk6loguTuqsyRI7YhirgwmE3AdBG4GlDTD\n03IJPASBA6+GHrQVVFiSc5yEFUjGLcdsnuog4wvI86cCRMSU5aooarsOIiLO1aqX\n2c6rrPuDC3NRjCxEMhbOnanhbguf5OYuj+DmmOdTvzS3FtNXlxBT/3wJ/+DS/PLV\nt6vySf7A9rw/VF97+29ULfOj908fV9Vc58vd5kW+p9k43CmnH3/+y+jH2Xpdfpo/\nfaoPfbWWdkX+8NX2WKRPqh+pPJ2dHORfHcwspZu89fJRYrGb/HH1afy4f9I4YbxJ\n9Zuuk/Bu1NETUpKpKBFhEM6phNiSgnsBBZgcTKcEC3sqGezes+1vvRdLwaA6qtWA\npmrjAVoRk6ShMGBqoy0XodaY7+RT0MoixtVLefREXO+fHZCeTED6fao8KLZL8Fkt\nfEOqL6JIp4T+4C6TZWSrmIxUOFnXVD90TPHlGaAJmc6LM5QjaELwpgQhjZKx89YY\nJTqsEtywisDW7o2NkkpCSDegAC8N6jKCXJ+VRO0ujD1321106AbkNBzMKehdR0hz\nCVIxCDlRlPdA5eXcRxyQLwkjWFd6FX33raFXMcinCPZ8ignB39AZumZt4SiWD6vy\nbjEb/bV8bZaD9qdfj3LK05Pn9rdn+dpZ3e25XG0cpN4KQd+10J4xVX2xqvjR/JW6\n2UxmL+vx5mG+un8uV5vP42X9yfE/5CcJ5Xv5ENwMy/HpfhCcJEVK7lOkSwA3BKwX\nBFmXTeQRnDofir+xgRoVbtSoYFUjbSWRrkZc48bShuXkw8/cHH7Gevg6hDKsDVO1\n0sV0qmz69e8un3dIwNxqYa5/OImfgr6lhK4nKDTP6WkwWhOGp1Frmg3FswMZYhTO\nWoYYvQuwKiQ10IaAyMZOYlSPV+d8TjupGIoKq/UPNrLCAHJeJO6zrJThdFxvHTqR\nzzdbXn1kjPz8fJenNXis/3R1aL2S/yj/ey3qnuvqN97+w+/KiDrOIojn7d/lwS+W\nz/Ka1H2gs40M978ZHZOTEOPrdgzh9NLshg3uN2t5m1cPt+SUpfzM9p7sxgiy62z7\nptbw1Otm+517zun3sE5h+2u3qEfBOqWdKHNYlLkTUebX+RckylwhyiyCstZqUTrU\nRzZN7NFYD6SGUL3aVHZoBWRTvUuSnVLvwDKqrTf8P8vVr+tNPRh5Ksbfjn/lwi82\nHvfFOcfG795WTSijYOshCeK19JVN8Uqtbbz4i5BxrpMxvFRKLeNGEsG5DpMTDCZK\nPEiSaDhdziIztEuQ8zY6PhXxnvHBgXQ7Rku/AMGeT9/AzeGWMs1hmeZuZKqaSrx4\nmaqoJLLIzOcS9BQZ0ZjLFBfYXKZM1SGOmY91qKBsmnlZIY5KH6HpNWsbSwbBbvAR\nBgVfpo5qwXA65cojGUi5B/FelvJqkS/Er2WbpEACX+PYFYd7LyxiVQHeLDIDvCxR\nKm94ekmq2ZFg4lVNNDyyVU0AJF2YaqpxElcaH21f2SzrZemiSnbMOUB0JcY65gQK\nMpeKZw8xZ4sh91yON8uPm9/K1Wz07XKxmN1V9nh9PpNwheyqUHVIpFEOXSbll4Av\nUdFeezJ697cbjUlYPazvqg6tqsHGfZda/fTrOJzO0DRvTgxVv245f5qt5o/lJ0Uz\ntfqKfLv/1PrPOJ46QDSHb8HAlFlLp/UCbikNRYI9AfGwUppY+ISUJduWp70s+5qg\nHIzLHIxQrcSYtwf+QMOZ14aTKlVsI2LfQnWCbqdgpUUpIVeFlr1cONefbKXSc9v1\nUCugIpjO085wmkAVW43zxYw6solGEuKyhnx20E8YqVYakFHdygiaaQ3bNMpAJtER\nMISqyMZBGAoSMoLBXvRlqHWSU7An3djqoQAGI7K4GLmppvwnYCOsrWlEqR0ft/QF\n40M1+oAKwbZ43wSEsNE0hOLq1KGZkatzVELai4eNZO0ScyDKGb96dyU0gvn9/NPD\n6O1rOZeymC/mm888hDrKEUEdy04sMvLQdtfvkcO/SSfZ2UN53EnUmjXlyug8yF+m\nbPwuARICxlFKJk/okmGGkWHXHH5TiK3hbjYChTMpBr8BLJ441cvCpUwLpzLVoTZr\nmXoQy0rzStgf4Mi80gxrDya1jp68tp9k6gtr+0kznD1YTJ2Q/LKLsXAtq+qP77/5\ncfTT8jdnLq/643P1PEsLWT+DwentIWKFDfsX6vz2cXs6bR2EuCnc6yASh2YucSha\nmP2uMnOqohmBxN2Rz8PqZu4UuqA9YBikXsrtwCl5wbMre4tWz7a5NdZQorWFFdQ/\nM5vGBXnpmXVYgZRj4dLMooOKkOrKUhkdO0m8MpLVkF8BTxCrj9o2IfO0WWsbTc96\n0DB1YDGgOjUUqsjPRXLeLm7cY9yRd01Tg2kgRzMj7hP9p/MGHgOaKegBzw8+cXL0\nCfvZJ96f/gT0YKrTr5fkOiR+SPYLqe236aKkcqmTGwpWDwPtqqXraJSqlqqFOHXg\n4wsaqJoYeKadirqbOk72srReGY+QaN/LVQcR63RC51BKXDIoVSLlW400vL11IqUU\nHEAztp8obGhrP7EA8UIUTekCwb3yGhG6ZbbqD998OehmktIpVoiukQBerV0jCrte\nmGtUamxGd41ulZVvNmpoPXUTs0/oVBuYmB0HWrjRik8xuxKTFIzqgYrqeoGNYaiH\nGjTS1cOxU+rTJ30BHmk6MUmTuQ2/rbvCPYy83SRIMjpxPDWHSciQ2GN8f2PqYZiJ\nCwM2KEdMUKza5jvQmII9zzZWDxdZsc3ChGT11C6JrhWE/CFOOr3ESaHkD5WhrIGU\nXHumXh3Tl+OWJuCUjxZ2OMUb3EDjkvLDSngBtseey9FpoNaHiwvQwaUG6MNx1bPP\noueFRdFqIE/PizgVZh8htOeapvZk9LUEaE9GKKBwl04uyZMpx96TunByylhQbmaL\nxXwzk6KgrLlVErKmILvv6euU/bKd8yG7m1GM1/tHuSufFo27cXi8vD19zbJWX2gg\nHpJUNHkHq+9gKrz3Nx8oUpuvl67FJR9JltLDZvMsT93JUcofd6IGHaMY+vO0RiO6\nU2WfvRjw9gt4906HyHKKyHIGkal2Alyk6BSRgGhRypMNV44zXAqpWRguSF59GjD1\nkYKMmKgTRfhxxcG6aIPqPt9L8+dqGVo4oYYMicJjlBovrd+AspLYCyQWQwEGIlRg\nAAmXISPl+FlSU6djCN9OBLQTj01klRRg05v+m7imfmQItgLgfDSKw1WEj0UGdYvo\nRel4nYL7gMFnDkFXEownYAeXvQSRZJC8bVwXJ01lm3huro+uty4wjwFcqplV8SQX\nmbmSujWwjk2rd+zWDu2qERWym1JDSwUZde8yxKeKYvKkkYgx2v21Bc6uF4DVEqVu\nAUOporebv2xVssGVrODcOBPED8vyfvRNuSif7mYrHp7kDkpkyGigv64tHfLitmc6\n5IX8RW53v4fvpWUlXRkYCrmVXVc+Uis8Nt65lvTCbWIUINByK0Sa9JjF5lOTtrLo\nH08Vu1k/PM+ebjbl3a82Oak0bW6QURdeziR/ePPop0W5kSJ7HBVvolEjmfmn7+ST\nzgV84MFayiesqyeM5QfH1WtdLyA5vuFeHvLdZil/9E10vX9VCNxzYppAnRhHSeQn\nAujwcAopyE/zreU8vOZaviYo9j8pAaiirJcA5ezZT93PrXGqvgu45IW1R/Jfr8oq\nJikX2562lni6YITGTi2f60YzxrVJx/ft3lUbrQBZ+AXcCHqUWnaiOUTRyI/3IZLr\nLFRR5FDZSSOKvNON5GpJsLW6twXhrRtRlfGnCcRPo3UjB4v2vvrlF4sKahP1o3Iw\n8/2nezFe1dtqtxOgukhETF4DgwDENDxW9IPHCp8VSblnD+TFOIoilRLoVBWFAUud\nuBLYgqUB6IbSkIkGOFNHi3pAjI4Jc/aY8GCgAosHoY4+/eEb+Iw+MFWgTiIuwCrX\nURTfSRy/fBz9tJq9zme/YdqLl+uNVL+P9ef6AFTbN/nrClSFqnRKzlhq3PQ+QWQU\nvdeeevcAXlDVymMFE89LowW1RZKwrxno7QftBiOUeJJCSZajUESFo2BrJXhN1KfV\n/I8/Fp89PWO1gSLvZELEEQZpqz78eKBpqjgDmWOPMnm3Xs9+P7pxWCWetz/K0Yhy\nPPlZ9a0uuCElnZJbAyh+3iAu33t7/gC97fO9hWcqt1806fSgSPE0AYyOFDPuSLHO\nNYYUJEp9IW+mNqqf0BVnXz7pQW+a1ZOQ1Eb6IzxaPvFH2LBy75XYGs5PfdMlN54L\nmHpeX1whJifd1Llw5RXfsZy6yoJPDiMiTXoHxTHe7MHEHaLOkOyb9E7k5eyIoIji\nhdjDID8jVBVGy/WLvauDVRz8UT2q49/2+RlYMvnh2WP51Is1270rSIuW61e3EQVE\nlUwvIvFTU1RzSFEB9Tif1B0pBUf2SmMw5ywvvDapT7zwtMaV/bXvpdayvfzeum11\nEoa8w9ooqDQJJ3sLJP1UI3UUiUfCJ1Ekgu2lHUbyDbqexpFfwMCrVDTyMA0l22lQ\nPTikO/toHGvlO31HbOpeS3z+5jQdQMkDsCcA/DR26g1x+CkJAfWEnZQ0+whQ9pVN\n36+7Ghfju7xrXEyDZWk//cSpz1kUZdKxwHcfndZWKF317O30floZ9TwDvvfu9Mhp\nmUQnTfS44/f20qtb7vAx+GnLHdrk73ru+klM1U13AZp9KQq82T8VBVoGfRy+n/ZH\niXIEvs4kAE97AnJ68LB7jOOtwVGOXU8UXIFU2owra3KMRGTk5AtmNv+7cr1ZVdeF\nzIbxcfdJ8s3Zf/D09lwKF4YAoz8DSdEJL/i812WwXQgQSZiIiapFbGY3eCVi4ALa\nklLhhcNFIHbOO8IsmAEZkRORkycpaY6LbBkPnotsImmuK2DTyMADtFU+srCYeTQH\nFNiwSknm16AppYE2cqlhj9ug3CgfVLYzwSV4eXBjEU95to7HTx7Ywdo+KjbkZYQe\nAiAOYPIaRq+Oy06E+e1i+XI/ev/0cVXZlJc6IsdG62oqNX23Vscru5pV7tZ1Omx3\nOwoXaeFiezFbPKh36z7WCxlJ9G4+zlv1cX3LInDGWvhxesgu6tzaU/Y623t+2I10\nhnqGR3Pah2zv+Tqm6iXN4973keA3Me0+gTnyueEept5POoNAGXTQWhOiOW6qKSEe\neiDWJIMCVOjY9VZFc+5k60I8+MAMDJTZhs4ff/BsJ+5hDen8nKGoXuc1YXfJ4yeD\nONRGnpLkHVVe8eRU8d6Qcqoeu8Jm92rUGXn9Ml9tXsrF/I+6jdgGscdxRKjXtN87\n+l5+avUqT1RHSnIMqx9mrw8cwXX9YB9VRZN6SmNC3eXkuH8sn8pPMsYWbwSui6w6\nnMex/HG+Qkv9imv5Ck/hjibNEceEPIdSDI/ymEZvP8n/3q37oHY7VSc3fvz0uBmX\n1VNYdpi13nDdn4wG2boTg0vbKTLFzfOdCpGv7HwuTK9hrkbvEjDIQ3mbAs4pFm3X\nw6NdDxetUdJKEiaV6VbSwD6yWcbLIA9SDkJRxs1BIWadSpfphGeNPzK0WfQWh2Qq\nn5WCFEEog7g1h2rOoFxhCQmEQYTFcJVB7IsoaJAVmwWlOqlF7zEmWqpwe8yJ2Hva\n4OcENhTWNqw694wA6qrjz5jhXCWFLEQYJ6G2OYxTQG1sLOvUo+CBtrceRYmwU9vI\ntlKVlKgqaQ+qkgapKhPKakCtPBKiPJIe5JEEKY+IwpmtkwfSgTOefjjOW544WEJH\nHTkC3VZnbsOFCR36/tlennNGWdqCCfRoIV4vwZ26fc6DSE76XXM738psEZJabCOy\n/ea2nOSqErArCnv+KIKQrQD4+EC2EvDdwSrpDRMX5v5NjjX4b3JLk58rSsVbhJP7\nbfAnlIXFXdCSUktM+GuJib+WRx1xuUhOpDQxpPxiSIMSQxwntoHWWbHCKDHB27d+\nwTVddeLPNtG0S/xhM36sqb5gYjZp0yyceBtOAYsMtkCKY4FBv/UIF9gpSWMX9QVB\nTBZxcnwd+4N8x7JKnxLHTtQAV5njylw8+A5jC/NDbuFYZMCQcOaIJHr1+bSlZbfN\nEu3QKhansiLUYDyqPHYnYTE6D/qGNRP6xu9cqGgZbutggEwfexoT8OaJwmoLVLZu\nJraZjPPYzSBq6yVeu4xOMyVxs3UEvkv8URIhuYtESFcKMKQkiEiyxNzLKBpsUcGb\ndUfZeVvtxXSRqaxdNLWP8kgRHn98573XUdsrF9E2dvXP0WC5kEaXxQpQFjIsAScJ\nkXEJEh6nrPA49RseF9atAru0KsVTZ/wliywobx1nlPXYmI6NLkOkbdywN0f4/g3f\nTZOis0O6CRdlVnC5xdE/sDmGYLIlMiB00MWKIN07Q0rMhHsDwaVBancJyCxCCkUI\nbTmOhHgellya2NTRCYFqG+7tp6VheunnD8cMRpRVWPrOWQJKY8doQSE0GZaYK4PC\nhqGNl1OrdRkZR3XTpzk0a3cpYCTD1ubpp0FST4QTiMnpE+FGxRUmbz9o4DLQpLjL\nKkwG99BpQ1I3PXT+zYyzi1U1Y55NXeps1uXKugXaiygvw9mpJkzi2OXQrS1dEevs\nSSDzt8pStoWUmh1j6KyFiymU7u4x35N26gx3I4FkXk/I0PWEjLWekHldT5AuxmXv\nfYbI+HR7Gns06G1KexAIEbuJs4j5WGeJPK/M2yDENbEFK8SZANGSYxPZZYA8NbOK\nk4QTOuXnYIi4W1Tegjd1k66LUh+WHuINJ0HEm5Dy3EXRAM3maC1Go7WYFa3FfqO1\ngrKis+uwKd0fMX/3RxyUsZFisC207cRAaj+Lexj2ioMMGW1cb3d+hZZZ6SWn4qdv\nUCVUJplt+nI3HYblN2BlNvDz3NUtOC46MvHMpIfuGy5u0iaB02XGDomDrk50jHeQ\nF2Ob1AXHeam5VTsLyPHBHj85xQVRoqt1zAHZC1FsB01jFVyfvTkDic523ON8yNBo\nSUQPWc3LTlErF5zGNTe3avvUd8vV7pBNlyQJsFH/+KLdxqt3T5/mTzOckt99HMur\nwBgh1y+4Diw+nhYgL0Tj1Bsauj/6M9Apj+FxNs4qAojjumFqIqh+yKFMJCH98Zi9\n5ZpRTb+JxO54M+Ww1f6IU4dHnAZ6xGKKXB6rP2JVRnN/xPHxiOnF55MjjkM4YlVl\nUkxQW2O3J3zzeb2ZPR7sA2iU15VR5jHH68och5MMEOACBq0DxLk+RqcXzClLk4za\nnt5pkTWIVGmXzTLBHdY5xLRvImz9oIqTZ3/ewqEfFCEYabX1gJIdWuuBCrD2RoSv\nsrG3JQFe8HiSQeW+bhitMyUtFG1nQ5ogOhhzLS0HanV6p+HQHa5wd7gixMOVwI5w\nuCfADhlzr7lj7nVwMfckQ22j19oK9ckrLYbRwXfYjZDOWSI91Db6TqTXfdap67NO\nAz1rkdmiasW+PmUMbne+sfdmWh1/EwLDEzONxXZrdmy3DhTbybsN1TTgu91tR1o3\n3IUdiUOwI6r5qyyxwtFZR6uW8rCdROdxQNG5inxHJITQUeMoUS7SnXP003gr0V5O\nSJ4q0B5wmxPnuaYkoNusjhgJ3lITMXaba+Ea9okQzLX6rAk1W81ZAxdcOL/gIswL\n3hihqJuaTw76ptzMFov5Zjb6tnxev9QpVuNivCgKyA+fvW+Uv4lG49GH56qZo1yM\n/nTozs1HN/Uv8WckHF3vHz2+2z56vNw9dCzfwYhS5YvPXnktXxnSNTlO5xaQV1eL\nUCk3TLbnXGyVtNhyPw1h1TIKyXCmUdHIAakLIirpxGrpvL/5QJRLPJ6vly4JENvS\niK/l48myeNhsnqUsHN1+KCFhZsCsLFefJisYhCxFBQE2gqEyMVE9GKeQpAFlTQnS\nMHT3vXn5UJ17Gk2gnBTkPgqUcy+6nYgDgpoCdCXeOnbVZt4ILKkR/Lqx+rhJ5cJe\nPkzVMTFwGtUxURpmdfHT1aiIDosC5A8i+Bo6CI7sQDDOuwwOhI2uuwYIFzjb1KEA\njiN53TBusJG8Wk+ghgFITawslhVARgjIY4CslIaRh9dIwxR6OcirYCUTGPyCqi0E\n+GWa9HLS8ASDL28Fo3ZDUKXAzA1Z+Z8+HU9IBs42H2MPE3pDB+GCgglI50QQkxI8\nA/KxAM9YwfQJntXIyyTNAmeRzTxLy3b1UVdpW7DA/I1Z9QvyN2aAza3kyL7HW8mp\nIVxuYtg0CRq6YbMqjWESNAMbNXnAJrV9zfka+3cXKUrMaQfo29PIqPtCE8WYxC/M\nkYufWFjZa1OHLXoKkx/mTy+/j76ff3oYvX0t5/KM5/IwPzcksZPDFbIbR57w8139\nv/Ny/4/yv+XfKht1kiInsKnC3/ao2ePRd+V6syrvftVcoYfy2Jl10PSPu88QbtD+\nI9pFMQ/y+5aNr+vp9VHx6omIwNkOSyerGQ/ff/Pj6Kflb5WQQI6jppCy+o/P1Sdt\nqY7qh2j5288EBuOP/aWvbrup4KqvR6HFMW+hnt8+bs+xyWtc5ATqI4omkoR80EQ3\nZFadesgOK/uSqCr0ywgcZLA0IX/cFOGR08p9cKe2pWcCOzicoeO4aU7g1McY0LZS\ndaHXtulsahXf5osz8VDR6wE22MivP0N6Jm9pRQmcjaZ4hmpLD6iGak/p2CakUF0K\ny6l2IsNKpYj4ksXWOumHpAh09HRwQoQlXICENzAYEI1M3VrFoxvExw47+VknLx0G\nDS59ntN5bQrJvUHUZxLwmcvNy1jPeezmNE5Xow6yTzvADrJzo+OOAJ2a1DOnEbcm\nu0LPq/SQUQE8XfjplGlO4NmnB35Ut8e7LHlg3zdkvCcypzqcKy0vPuXiKn+d28NU\nj3IwjpPY5Cgvcxfl+Z15cYpCY8cW9BSF4qV39I8WAiR6SLT8/IOjInUaP+TUYD13\nFazTstDMFrEvL6faeVnkTqsJUP+rMproIzWmriZ4ECuIzKkxxLXyKXWKrW/PBkR6\ngjSknjgVE65vT6ktbE16QWf8RQaNV1h5JiyiyB2X49AqRQeFgXoskTqtF5wKmmo0\neTdzDWU5B5Tv1G3bWEYAJJkDQELLkwUQq0VO1U2TyTQJ2GwtrM9R27AZThmgO3Wm\n5wE6SdA9hOQnyuhf4J2Q1oXTy+TkCpAjfONF5WfQ8rnT8Pu0mEAsI/RRQMAmVMKu\nHojMaf8RknlHiVD56KoGDkJchvcC3JLjoNhDFp3jMntn6Sdk2TmtAqllR40L3TZm\ndkounGya/H/5Cy+X8s37IaZykn2cTuL0LosmIi0i+acivk3Ex7RMK8K/f/3r/wM+\nbAR2\n-----END ENTITLEMENT DATA-----\n-----BEGIN RSA SIGNATURE-----\nQCBE/Px2qWjlk80BrlH8hUeoE185t8ZahITUfHuMjUqhVY92wwMhyJJrEemOqSa0\nflBgZXHAnw96kSriNowtxCA8Ay2jaoI9QAqYHI6tUdes+Xn0bvBHNvejfn0S+sbT\nhz3lEc6ltyq/rqhmhQDV9Z7DoE1iuNMMpcRzTs63lFWE5TsyBdwO6+3sCCrgkrqz\nstAPI2shkd5/B0NHMbHuRKwOupDdjWqa6kdMKh068+M6z0lEYlBQxeGnkdA3P2yo\nRlT3boR9lAUhEUqMb+tmyQy18s/o/eWjLdgLP/O+IFSdgdqgOM1YeU0/WSqgo8FV\nHtUmTevWVGjwycUIsIdb+ElE4pihce6C8CKz2TUDlhWI7tCnJRXiiWhrSPEmVtD5\nYr/gLnrxc/9MNWZmzPxJ7KVEh2Xp/tDjdnfD1lswwHRHAUqm7PEuH0Xuef26n4ig\nNjtPnO6SN6GRq+G/eMv4ze5qpFpXXMl9oPpS7eC38AJHLvMjE9QIc/TV/+MdT1H9\njCmBMIShTsrnl4Nx3jfzgOEmGm3dW7kkrhVHABg9ADFZhcs9YGQDdMJhEaFeW2l3\nkqHV6R29dBHUARdmUTnSuhegAPPsXXS9iryIk0RqHk8u/M0NQGSwK7HEAQkRklyH\nZjHhrgnFfJYmCS/15uHWdwRYgHeSR1PXpB0Sxdj7oMs=\n-----END RSA SIGNATURE-----\n",
        "id": "8a85f983510e0e2d015110e482965630",
        "serial": {
          "id": 4302369103582938050,
          "revoked": false,
          "collected": false,
          "expiration": "2016-03-31T03:59:59.000+0000",
          "serial": 4302369103582938050,
          "created": "2015-11-16T15:23:09.000+0000",
          "updated": "2015-11-16T15:23:09.000+0000"
        },
        "created": "2015-11-16T15:23:09.000+0000",
        "updated": "2015-11-16T15:23:09.000+0000"
      }
    ],
    "quantity": 1,
    "startDate": "2015-03-31T04:00:00.000+0000",
    "endDate": "2016-03-31T03:59:59.000+0000",
    "href": "/entitlements/8a85f983510e0e2d015110e47e6b562f",
    "created": "2015-11-16T15:23:08.000+0000",
    "updated": "2015-11-16T15:23:08.000+0000"
  }
];

  entitlementRouter.get('/:uuid/entitlements', function(req, res) {
    res.send(entitlementsCollections);
  });

  entitlementRouter.post('/', function(req, res) {
    res.status(201).end();
  });

  entitlementRouter.get('/:id', function(req, res) {
    res.send({
      'entitlement': {
        id: req.params.id
      }
    });
  });

  entitlementRouter.put('/:id', function(req, res) {
    res.send({
      'entitlement': {
        id: req.params.id
      }
    });
  });

  entitlementRouter.delete('/:id', function(req, res) {
    res.status(204).end();
  });

  app.use('/customer_portal/consumers', entitlementRouter);
};
