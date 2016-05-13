export default [
  {
    "id": 3,
    "name": "Development",
    "label": "Development",
    "description": null,
    "organization": {
      "name": "Default_Organization",
      "label": "Default_Organization"
    },
    "created_at": "2014-08-03T10:25:18Z",
    "updated_at": "2014-08-03T10:25:18Z",
    "library": false,
    "prior": {
      "name": "Library",
      "id": 2
    },
    "permissions": {
      "view_lifecycle_environments": true,
      "edit_lifecycle_environments": true,
      "destroy_lifecycle_environments": true,
      "promote_or_remove_content_views_to_environments": true
    }
  },
  {
    "id": 4,
    "name": "Test",
    "label": "Test",
    "description": null,
    "organization": {
      "name": "Default_Organization",
      "label": "Default_Organization"
    },
    "created_at": "2014-08-03T10:25:18Z",
    "updated_at": "2014-08-03T10:25:18Z",
    "library": false,
    "prior": {
      "name": "Development",
      "id": 3
    },
    "permissions": {
      "view_lifecycle_environments": true,
      "edit_lifecycle_environments": true,
      "destroy_lifecycle_environments": true,
      "promote_or_remove_content_views_to_environments": true
    }
  },
  {
    "id": 5,
    "name": "Production",
    "label": "Production",
    "description": null,
    "organization": {
      "name": "Default_Organization",
      "label": "Default_Organization"
    },
    "created_at": "2014-08-03T10:25:18Z",
    "updated_at": "2014-08-03T10:25:18Z",
    "library": false,
    "prior": {
      "name": "Test",
      "id": 4
    },
    "permissions": {
      "view_lifecycle_environments": true,
      "edit_lifecycle_environments": true,
      "destroy_lifecycle_environments": true,
      "promote_or_remove_content_views_to_environments": true
    }
  }
];