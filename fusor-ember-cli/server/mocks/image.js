module.exports = function(app) {
  var express = require('express');
  var imageRouter = express.Router();

  imageRouter.get('/:id/images', function(req, res) {
    res.send({
      'images': [
        {
            "checksum": "eafcb9601b03261a7c608bebcfdff41c",
            "container_format": "ari",
            "created_at": "2015-10-12T19:42:30.000000",
            "deleted": false,
            "deleted_at": null,
            "disk_format": "ari",
            "id": "7bcd5577-92fd-4793-a38d-acb183f4b1fb",
            "is_public": true,
            "min_disk": 0,
            "min_ram": 0,
            "name": "bm-deploy-ramdisk",
            "owner": "434547ba69cf4a30aa5747ff012efb4e",
            "properties": {},
            "protected": false,
            "size": 56355601,
            "status": "active",
            "updated_at": "2015-10-12T19:42:33.000000",
            "virtual_size": null
        },
        {
            "checksum": "061e63c269d9c5b9a48a23f118c865de",
            "container_format": "aki",
            "created_at": "2015-10-12T19:42:29.000000",
            "deleted": false,
            "deleted_at": null,
            "disk_format": "aki",
            "id": "69c1410b-2e59-4bad-b6ab-9a7570744fc1",
            "is_public": true,
            "min_disk": 0,
            "min_ram": 0,
            "name": "bm-deploy-kernel",
            "owner": "434547ba69cf4a30aa5747ff012efb4e",
            "properties": {},
            "protected": false,
            "size": 5027584,
            "status": "active",
            "updated_at": "2015-10-12T19:42:29.000000",
            "virtual_size": null
        },
        {
            "checksum": "5b11e671ff1f63f884382066648f2ad6",
            "container_format": "bare",
            "created_at": "2015-10-12T19:42:08.000000",
            "deleted": false,
            "deleted_at": null,
            "disk_format": "qcow2",
            "id": "4da3aa47-c02b-4ffd-b395-5fdad581fc04",
            "is_public": true,
            "min_disk": 0,
            "min_ram": 0,
            "name": "overcloud-full",
            "owner": "434547ba69cf4a30aa5747ff012efb4e",
            "properties": {
                "kernel_id": "930e26f7-0c4c-438f-9bb4-bb7558ab729c",
                "ramdisk_id": "68f8a4e7-fd20-434d-b52b-c9cebeeff925"
            },
            "protected": false,
            "size": 913954816,
            "status": "active",
            "updated_at": "2015-10-12T19:42:28.000000",
            "virtual_size": null
        },
        {
            "checksum": "c0be19750ce23e07e9f8102c6b6fe748",
            "container_format": "ari",
            "created_at": "2015-10-12T19:42:05.000000",
            "deleted": false,
            "deleted_at": null,
            "disk_format": "ari",
            "id": "68f8a4e7-fd20-434d-b52b-c9cebeeff925",
            "is_public": true,
            "min_disk": 0,
            "min_ram": 0,
            "name": "overcloud-full-initrd",
            "owner": "434547ba69cf4a30aa5747ff012efb4e",
            "properties": {},
            "protected": false,
            "size": 36760304,
            "status": "active",
            "updated_at": "2015-10-12T19:42:08.000000",
            "virtual_size": null
        },
        {
            "checksum": "061e63c269d9c5b9a48a23f118c865de",
            "container_format": "aki",
            "created_at": "2015-10-12T19:42:03.000000",
            "deleted": false,
            "deleted_at": null,
            "disk_format": "aki",
            "id": "930e26f7-0c4c-438f-9bb4-bb7558ab729c",
            "is_public": true,
            "min_disk": 0,
            "min_ram": 0,
            "name": "overcloud-full-vmlinuz",
            "owner": "434547ba69cf4a30aa5747ff012efb4e",
            "properties": {},
            "protected": false,
            "size": 5027584,
            "status": "active",
            "updated_at": "2015-10-12T19:42:04.000000",
            "virtual_size": null
        }
      ]
    });
  });

  imageRouter.get('/:id/images/show_by_name/bm-deploy-kernel', function(req, res) {
    res.send({
      'image':
        {
        "checksum": "061e63c269d9c5b9a48a23f118c865de",
        "container_format": "aki",
        "created_at": "2015-10-12T19:42:29.000000",
        "deleted": false,
        "deleted_at": null,
        "disk_format": "aki",
        "id": "69c1410b-2e59-4bad-b6ab-9a7570744fc1",
        "is_public": true,
        "min_disk": 0,
        "min_ram": 0,
        "name": "bm-deploy-kernel",
        "owner": "434547ba69cf4a30aa5747ff012efb4e",
        "properties": {},
        "protected": false,
        "size": 5027584,
        "status": "active",
        "updated_at": "2015-10-12T19:42:29.000000",
        "virtual_size": null
        }
    });
  });

  imageRouter.get('/:id/images/show_by_name/bm-deploy-ramdisk', function(req, res) {
    res.send({
      'image':
        {
        "checksum": "eafcb9601b03261a7c608bebcfdff41c",
        "container_format": "ari",
        "created_at": "2015-10-12T19:42:30.000000",
        "deleted": false,
        "deleted_at": null,
        "disk_format": "ari",
        "id": "7bcd5577-92fd-4793-a38d-acb183f4b1fb",
        "is_public": true,
        "min_disk": 0,
        "min_ram": 0,
        "name": "bm-deploy-ramdisk",
        "owner": "434547ba69cf4a30aa5747ff012efb4e",
        "properties": {},
        "protected": false,
        "size": 56355601,
        "status": "active",
        "updated_at": "2015-10-12T19:42:33.000000",
        "virtual_size": null
        }
    });
  });

  app.use('/fusor/api222/openstack/deployments', imageRouter);
};
