define("fusor-ember-cli/adapters/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.ActiveModelAdapter.extend({
      namespace: "api/v2"

      // TODO - Why can't adapter access session?
      // headers: function() {
      //     alert(this.get('session.access_token'));
      //   return {
      //     "Accept": "application/json",
      //     "Authorization": 'Bearer ' + this.get('session.access_token'),
      // //    //  Authorization: "Basic " + "YWRtaW46c2VjcmV0"
      //   };
      // }.property("session").volatile()
    });
  });
define("fusor-ember-cli/adapters/hostgroup", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.ActiveModelAdapter.extend({
      namespace: "api/v3",
      host: "http://localhost:3000"
    });
  });
define("fusor-ember-cli/adapters/traffic-type", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.FixtureAdapter.extend({
      latency: 300,
      queryFixtures: function (fixtures, query, type) {
        var key = Ember.keys(query)[0];
        return fixtures.filterBy(key, query[key]);
      }
    });
  });
define("fusor-ember-cli/app", 
  ["ember","ember/resolver","ember/load-initializers","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Resolver = __dependency2__["default"];
    var loadInitializers = __dependency3__["default"];
    var config = __dependency4__["default"];

    Ember.MODEL_FACTORY_INJECTIONS = true;

    var App = Ember.Application.extend({
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix,
      Resolver: Resolver
    });

    loadInitializers(App, config.modulePrefix);

    __exports__["default"] = App;
  });
define("fusor-ember-cli/authenticators/foreman", 
  ["simple-auth/authenticators/base","fusor-ember-cli/adapters/application","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    // app/authenticators/custom.js
    var Base = __dependency1__["default"];
    var ApplicationAdapter = __dependency2__["default"];

    __exports__["default"] = Base.extend({

      // Check session if you refresh browser (F5)
      restore: function (options) {
        console.log("OPTIONS");
        console.log(options);

        var self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
          Ember.$.ajax({
            url: "/api/v2/users/" + options.loginUsername,
            headers: {
              Authorization: "Basic " + options.basicAuthToken
            },
            success: function (response) {
              resolve({ currentUser: response,
                loginUsername: response.login,
                basicAuthToken: options.basicAuthToken,
                authType: "Basic" });
            },

            error: function (response) {
              reject(response);
            }
          });
        });
      },

      authenticate: function (credentials) {
        var self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
          Ember.$.ajax({
            url: "/api/v2/users/" + credentials.identification,
            headers: {
              Authorization: "Basic " + btoa(credentials.identification + ":" + credentials.password)
            },
            success: function (response) {
              resolve({ currentUser: response,
                loginUsername: response.login,
                basicAuthToken: btoa(credentials.identification + ":" + credentials.password),
                authType: "Basic" });
            },
            error: function (response) {
              reject(response);
            }
          });
        });
      },

      invalidate: function (options) {
        return this._super(options);
      }
    });
  });
define("fusor-ember-cli/components/accordion-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      isOpen: false,
      actions: {
        openItem: function () {
          this.set("isOpen", this.toggleProperty("isOpen"));
        }
      }
    });
  });
define("fusor-ember-cli/components/base-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      labelClassSize: (function () {
        return this.getWithDefault("labelSize", "col-md-2");
      }).property(),
      inputClassSize: (function () {
        return this.getWithDefault("inputSize", "col-md-4");
      }).property()
    });
  });
define("fusor-ember-cli/components/draggable-object-target", 
  ["ember","ember-drag-drop/mixins/droppable","fusor-ember-cli/helpers/log","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Droppable = __dependency2__["default"];
    var log = __dependency3__["default"];

    __exports__["default"] = Ember.Component.extend(Droppable, {
      classNames: ["draggable-object-target"],

      handlePayload: function (payload) {
        log("in handlePayload");
        var obj = this.get("coordinator").getObject(payload, { target: this });
        this.sendAction("action", obj, { target: this });
        //throw obj.get("rating");
        // obj.set('rating','good');
        // if (obj.save) {
        //   obj.save();
        // }
      },

      handleDrop: function (event) {
        var dataTransfer = event.dataTransfer;
        var payload = dataTransfer.getData("Text");
        this.handlePayload(payload);
      },

      acceptDrop: function (event) {
        this.handleDrop(event);
      },

      actions: {
        acceptForDrop: function () {
          var hashId = this.get("coordinator.clickedId");
          this.handlePayload(hashId);
        }
      }
    });
  });
define("fusor-ember-cli/components/draggable-object", 
  ["ember","fusor-ember-cli/helpers/log","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var log = __dependency2__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "div",
      classNames: ["draggable-object"],
      classNameBindings: ["isDraggingObject"],
      attributeBindings: ["draggable"],

      draggable: (function () {
        return "true";
      }).property(),

      handleDragStart: (function (event) {
        log("handleDragStart");

        var dataTransfer = event.dataTransfer;

        var obj = this.get("content");
        var id = this.get("coordinator").setObject(obj, { source: this });

        dataTransfer.setData("Text", id);

        obj.set("isDraggingObject", true);
        this.set("isDraggingObject", true);
      }).on("dragStart"),

      handleDragEnd: (function () {
        log("handleDragEnd");
        this.set("content.isDraggingObject", false);
        this.set("isDraggingObject", false);
      }).on("dragEnd"),

      actions: {
        selectForDrag: function () {
          log("selectForDrag");
          var obj = this.get("content");
          var hashId = this.get("coordinator").setObject(obj, { source: this });
          this.get("coordinator").set("clickedId", hashId);
        }
      }
    });
  });
define("fusor-ember-cli/components/env-path-list-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "li",
      classNames: ["path-list-item", "list_item_active"],

      isChecked: (function () {
        var env = this.get("env");
        var env_name = env.get("name");
        return this.get("selectedEnvironment") === env_name;
      }).property("selectedEnvironment", "env"),

      bgColor: (function () {
        if (this.get("isChecked")) {
          return "env_path_active";
        } else {
          return null;
        }
      }).property("isChecked"),

      click: function (event) {
        //this.set('color', 'blue');
        var env = this.get("env");
        var env_name = env.get("name");
        this.set("selectedEnvironment", env_name);
      } });
  });
define("fusor-ember-cli/components/modal-confirm", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      dismissButtonLabel: (function () {
        return this.getWithDefault("dismissLabel", "Close");
      }).property("dismissLabel"),
      okButtonLabel: (function () {
        return this.getWithDefault("okLabel", "Yes");
      }).property("okLabel"),

      actions: {
        ok: function () {
          this.$(".modal").modal("hide");
          this.sendAction("ok");
        }
      },

      show: (function () {
        this.$(".modal").modal().on("hidden.bs.modal", (function () {
          this.sendAction("close");
        }).bind(this));
      }).on("didInsertElement")

    });
  });
define("fusor-ember-cli/components/object-bin", 
  ["ember","fusor-ember-cli/helpers/log","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var log = __dependency2__["default"];

    var YieldLocalMixin = Ember.Mixin.create({
      _yield: function (context, options) {
        var view = options.data.view;
        var parentView = this._parentView;
        var template = Ember.get(this, "template");

        if (template) {
          Ember.assert("A Component must have a parent view in order to yield.", parentView);

          view.appendChild(Ember.View, {
            isVirtual: true,
            tagName: "",
            _contextView: parentView,
            template: template,
            context: Ember.get(view, "context"),
            controller: Ember.get(view, "controller"),
            templateData: { keywords: {} }
          });
        }
      }
    });

    var removeOne = function (arr, obj) {
      var l = arr.get("length");
      arr.removeObject(obj);
      var l2 = arr.get("length");

      if (l - 1 !== l2) {
        throw "bad length " + l + " " + l2;
      }
    };

    __exports__["default"] = Ember.Component.extend(YieldLocalMixin, {
      model: [],
      classNames: ["draggable-object-bin"],

      manageList: true,

      handleObjectMoved: (function () {
        log("bin objectMoved");
      }).on("objectMoved"),

      actions: {
        handleObjectDropped: function (obj) {
          log("bin handleObjectDropped");
          log("manageList " + this.get("manageList"));

          if (this.get("manageList")) {
            log("pushing object");
            this.get("model").pushObject(obj);
          }

          this.trigger("objectDroppedInternal", obj);
          this.sendAction("objectDropped", { obj: obj, bin: this });
        },

        handleObjectDragged: function (obj) {
          log("bin handleObjectDragged");
          if (this.get("manageList")) {
            removeOne(this.get("model"), obj);
          }
          this.trigger("objectDraggedInternal", obj);
          this.sendAction("objectDragged");
        }
      }
    });
  });
define("fusor-ember-cli/components/radio-button-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({});
  });
define("fusor-ember-cli/components/rchi-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["rhci-item"],
      classNameBindings: ["isChecked:rhci-item-selected:rhci-item-deselected", "isHover:rhci-item-hover"],

      click: function () {
        this.set("isChecked", this.toggleProperty("isChecked"));
        // if (this.get('isChecked')) {
        //   this.set('isHover', false);
        // }
      },

      isHover: false,

      showMsgToSelect: (function () {
        return this.get("isHover") && !this.get("isChecked");
      }).property("isHover", "isChecked"),

      showMsgToDeselect: (function () {
        return this.get("isHover") && this.get("isChecked");
      }).property("isHover", "isChecked"),

      mouseEnter: function () {
        this.set("isHover", true);
      },

      mouseLeave: function () {
        this.set("isHover", false);
      } });


    // didInsertElement: function(){
    //     this.$().hide().show('fast');
    // }

    // actions: {
    //   toggleHover: function() {
    //     this.set('isHover', this.toggleProperty('isHover'));
    //   }
    // }
  });
define("fusor-ember-cli/components/rhci-hover-text", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["rhci-footer-hover"] });
    // didInsertElement: function(){
    //     this.$().hide().show('fast');
    // }
  });
define("fusor-ember-cli/components/select-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({});
  });
define("fusor-ember-cli/components/select-simple-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({});
  });
define("fusor-ember-cli/components/step-number", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "span",
      classNames: ["badge"],
      classNameBindings: ["badgeInverse"],
      badgeInverse: false
    });
  });
define("fusor-ember-cli/components/sub-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "li",
      classNames: ["dropdown", "menu_tab_dropdown"]
    });
  });
define("fusor-ember-cli/components/subnet-drop-area", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["subnet-drop-zone", "panel", "panel-default"]

    });
  });
define("fusor-ember-cli/components/text-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({});
  });
define("fusor-ember-cli/components/textarea-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({

      rowsPassed: (function () {
        if (this.get("rows")) {
          if (this.get("rows") > 0) {
            return true;
          }
        }
      }).property("rows"),

      numRows: (function () {
        return this.getWithDefault("rows", "");
      }).property(),
      numCols: (function () {
        return this.getWithDefault("cols", "");
      }).property() });
  });
define("fusor-ember-cli/components/tr-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "tr",

      isChecked: (function () {
        var org = this.get("org");
        var org_name = org.get("name");
        return this.get("selectedOrganzation") == org_name;
      }).property("selectedOrganzation", "org"),

      showCheckMark: (function () {
        if (this.get("isChecked")) {
          return "✔";
        }
      }).property("isChecked"),

      classNameBindings: ["bgColor", "fontColor"],
      bgColor: (function () {
        if (this.get("isChecked")) {
          return "blue";
        } else {
          return null;
        }
      }).property("isChecked"),

      fontColor: (function () {
        if (this.get("isChecked")) {
          return "fontwhite";
        } else {
          return null;
        }
      }).property("isChecked"),

      // highlight: function() {
      //   return this.get('color');
      // },

      // mouseEnter: function(event) {
      //   if (isChecked) {
      //     this.set('color', 'blue');
      //   } else {
      //     this.set('color', 'yellow');
      //   }
      // },

      // mouseLeave: function(event) {
      //   if (isChecked) {
      //     this.set('color', 'blue');
      //   } else {
      //     this.set('color', null);
      //   }
      // },
      click: function (event) {
        //this.set('color', 'blue');
        var org = this.get("org");
        var org_name = org.get("name");
        this.set("selectedOrganzation", org_name);
      } });
  });
define("fusor-ember-cli/components/traffic-type", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["subnet-type-pull", "existing ui-draggable"]
    });
  });
define("fusor-ember-cli/components/upstream-downstream", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      classNames: ["pull-left", "toggle_updown"],

      actions: {

        showUpstream: function () {
          this.set("isUpstream", true);
        },

        showDownstream: function () {
          this.set("isUpstream", false);
        } }
    });
  });
define("fusor-ember-cli/components/vertical-tab", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Component.extend({
      tagName: "li"
    });
  });
define("fusor-ember-cli/controllers/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["side-menu", "rhci"],

      isUpstream: true,

      deployAsPlugin: true,
      isEmberCliMode: Ember.computed.not("deployAsPlugin"),

      isContainer: Ember.computed.alias("isUpstream"),

      showMainMenu: Ember.computed.and("isLoggedIn", "isEmberCliMode"),
      showSideMenu: Ember.computed.alias("controllers.side-menu.showSideMenu"),

      isLoggedIn: Ember.computed.alias("session.isAuthenticated"),

      loginUsername: Ember.computed.alias("session.currentUser.login"),

      accessToken: (function () {
        return this.get("session.access_token");
      }).property("session.access_token"),

      myModalButtons: [Ember.Object.create({ title: "Submit", type: "primary", clicked: "submit" }), Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" })],

      nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
      nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
      nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
      nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
      nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),
      logoPath: Ember.computed.alias("controllers.rhci.logoPath"),

      actions: {
        invalidate: function (data) {
          return this.get("session").invalidate("authenticator:foreman");
        },

        signOut: function () {
          this.controllerFor("application").set("isLoggedIn", false);
          this.transitionTo("login");
        },

        //Submit the modal
        submit: function () {
          Bootstrap.NM.push("Successfully submitted modal", "success");
          return Bootstrap.ModalManager.hide("myModal");
        },

        //Cancel the modal, we don't need to hide the model manually because we set {..., dismiss: 'modal'} on the button meta data
        cancel: function () {
          return Bootstrap.NM.push("Modal was cancelled", "info");
        },

        //Show the modal
        show: function () {
          return Bootstrap.ModalManager.show("myModal");
        },

        // show side menu
        toggleSideMenu: function () {
          this.set("showSideMenu", this.toggleProperty("showSideMenu"));
        } }
    });
  });
define("fusor-ember-cli/controllers/cancel-modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      actions: {
        save: function () {
          return this.transitionTo("deployments");
        }
      }
    });
  });
define("fusor-ember-cli/controllers/cloudforms-storage-domain", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      nfsShare: "/export/export_domain"
    });
  });
define("fusor-ember-cli/controllers/cloudforms-vm", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({});
  });
define("fusor-ember-cli/controllers/configure-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      fields_env: {},

      selectedEnvironment: "Development",

      rhciNewEnvButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createEnvironment", type: "primary" })],

      envLabelName: (function () {
        if (this.get("fields_env.name")) {
          return this.get("fields_env.name").underscore();
        }
      }).property("fields_env.name"),

      hasNewEnvs: (function () {
        return this.get("newenvs").get("length") > 0;
      }).property("newenvs.@each.[]"),

      actions: {
        createEnvironment: function () {
          var environment = this.store.createRecord("newenv", this.get("fields_env"));
          this.set("selectedEnvironment", environment.get("name"));
          this.set("fields_env", {});
          return Bootstrap.ModalManager.hide("newEnvironmentModal");
        }
      }

    });
  });
define("fusor-ember-cli/controllers/configure-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["organization", "organizations", "satellite/index"],

      fields_org: {},
      fields_env: {},

      deploymentName: Ember.computed.alias("controllers.satellite/index.name"),
      defaultOrgName: (function () {
        return this.getWithDefault("defaultOrg", this.get("deploymentName"));
      }).property(),

      selectedEnvironment: "Development",
      selectedOrganzation: "Default_Organization",

      rhciModalButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createOrganization", type: "primary" })],

      rhciNewEnvButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createEnvironment", type: "primary" })],

      envLabelName: (function () {
        if (this.get("fields_env.name")) {
          return this.get("fields_env.name").underscore();
        }
      }).property("fields_env.name"),

      hasNewEnvs: (function () {
        return this.get("newenvs").get("length") > 0;
      }).property("newenvs.@each.[]"),

      actions: {
        // cancel: function() {
        //   //nothing needed here alert('cancel');
        // },
        createOrganization: function () {
          //if (this.get('fields.isDirty')) {
          this.set("fields_org.name", this.get("defaultOrgName"));
          var organization = this.store.createRecord("organization", this.get("fields_org"));
          this.set("selectedOrganzation", organization.get("name"));
          this.set("fields_org", {});
          //}
          return Bootstrap.ModalManager.hide("newOrganizationModal");
        },
        createEnvironment: function () {
          var environment = this.store.createRecord("newenv", this.get("fields_env"));
          this.set("selectedEnvironment", environment.get("name"));
          this.set("fields_env", {});
          return Bootstrap.ModalManager.hide("newEnvironmentModal");
        }

      }

    });
  });
define("fusor-ember-cli/controllers/configure", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["organization", "organizations", "satellite/index"],

      fields_org: {},
      fields_env: {},

      deploymentName: Ember.computed.alias("controllers.satellite/index.name"),
      defaultOrgName: (function () {
        return this.getWithDefault("defaultOrg", this.get("deploymentName"));
      }).property(),

      selectedEnvironment: "Development",
      selectedOrganzation: "Default_Organization",

      rhciModalButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createOrganization", type: "primary" })],

      rhciNewEnvButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createEnvironment", type: "primary" })],

      envLabelName: (function () {
        if (this.get("fields_env.name")) {
          return this.get("fields_env.name").underscore();
        }
      }).property("fields_env.name"),

      hasNewEnvs: (function () {
        return this.get("newenvs").get("length") > 0;
      }).property("newenvs.@each.[]"),

      actions: {
        // cancel: function() {
        //   //nothing needed here alert('cancel');
        // },
        createOrganization: function () {
          //if (this.get('fields.isDirty')) {
          this.set("fields_org.name", this.get("defaultOrgName"));
          var organization = this.store.createRecord("organization", this.get("fields_org"));
          this.set("selectedOrganzation", organization.get("name"));
          this.set("fields_org", {});
          //}
          return Bootstrap.ModalManager.hide("newOrganizationModal");
        },
        createEnvironment: function () {
          var environment = this.store.createRecord("newenv", this.get("fields_env"));
          this.set("selectedEnvironment", environment.get("name"));
          this.set("fields_env", {});
          return Bootstrap.ModalManager.hide("newEnvironmentModal");
        }

      }

    });
  });
define("fusor-ember-cli/controllers/deployment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      needs: ["rhci", "subscriptions", "satellite/index"],

      isSatellite: Ember.computed.alias("controllers.rhci.isSatellite"),
      isRhev: Ember.computed.alias("controllers.rhci.isRhev"),
      isOpenStack: Ember.computed.alias("controllers.rhci.isOpenStack"),
      isCloudForms: Ember.computed.alias("controllers.rhci.isCloudForms"),

      nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
      nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
      nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
      nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
      nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite"),

      deploymentName: Ember.computed.alias("controllers.satellite/index.name"),

      disableReview: false, //Ember.computed.alias("controllers.subscriptions.disableNext"),
      stepNumberRhev: 2,

      stepNumberOpenstack: (function () {
        if (this.get("isRhev")) {
          return "3";
        } else {
          return "2";
        }
      }).property("isRhev"),

      stepNumberCloudForms: (function () {
        if (this.get("isRhev") && this.get("isOpenStack")) {
          return "4";
        } else if (this.get("isRhev") || this.get("isOpenStack")) {
          return "3";
        } else {
          return "2";
        }
      }).property("isRhev", "isOpenStack"),

      stepNumberReview: (function () {
        if (this.get("isRhev") && this.get("isOpenStack") && this.get("isCloudForms")) {
          return "5";
        } else if (this.get("isRhev") && this.get("isOpenStack") || this.get("isRhev") && this.get("isCloudForms") || this.get("isOpenStack") && this.get("isCloudForms")) {
          return "4";
        } else if (this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms")) {
          return "3";
        } else {
          return "2";
        }
      }).property("isRhev", "isOpenStack", "isCloudForms") });
  });
define("fusor-ember-cli/controllers/engine/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({

      //  isSelected: Em.computed.alias('isSelectedAsEngine'),

      // Filter out hosts already selected as Hypervisor, since we are NOT in self-hosted
      avialableHosts: Em.computed.filterBy("model", "isSelectedAsHypervisor", false),

      selectedHosts: Em.computed.filterBy("model", "isSelectedAsEngine", true),

      // TODO Why didn't this work???
      // selectedHosts: function() {
      //   return this.filter(function(item, index, enumerable){
      //     return (item.isSelectedAsEngine);
      //   });
      // }.property('model.@each.isSelectedAsEngine')

      cntSelectedHosts: Em.computed.alias("selectedHosts.length"),

      // TODO Why didn't this work???
      // numSelectedHosts: function() {
      //   return this.get('selectedHosts').get('length');
      // }.property('selectedHosts'),

      hostInflection: (function () {
        return this.get("cntSelectedHosts") === 1 ? "host" : "hosts";
      }).property("cntSelectedHosts"),

      allChecked: (function (key, value) {
        if (arguments.length === 1) {
          var model = this.get("model");
          return model && model.isEvery("isSelectedAsEngine");
        } else {
          this.get("model").setEach("isSelectedAsEngine", value);
          return value;
        }
      }).property("model.@each.isSelectedAsEngine") });
  });
define("fusor-ember-cli/controllers/host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({});
    // isSelectedAsHypervisor: true,
    // isSelectedAsEngine: true,
  });
define("fusor-ember-cli/controllers/hostgroup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({});
  });
define("fusor-ember-cli/controllers/hypervisor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["rhev"] });
  });
define("fusor-ember-cli/controllers/hypervisor/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({

      selectedHosts: Em.computed.filterBy("model", "isSelectedAsHypervisor", true),

      // TODO Why didn't this work???
      // selectedHosts: function() {
      //   return this.filter(function(item, index, enumerable){
      //     return (item.isSelectedAsHypervisor);
      //   });
      // }.property('model.@each.isSelectedAsHypervisor')

      cntSelectedHosts: Em.computed.alias("selectedHosts.length"),

      // TODO Why didn't this work???
      // numSelectedHosts: function() {
      //   return this.get('selectedHosts').get('length');
      // }.property('selectedHosts'),

      hostInflection: (function () {
        return this.get("cntSelectedHosts") === 1 ? "host" : "hosts";
      }).property("cntSelectedHosts"),

      allChecked: (function (key, value) {
        if (arguments.length === 1) {
          var model = this.get("model");
          return model && model.isEvery("isSelectedAsHypervisor");
        } else {
          this.get("model").setEach("isSelectedAsHypervisor", value);
          return value;
        }
      }).property("model.@each.isSelectedAsHypervisor") });
  });
define("fusor-ember-cli/controllers/lifecycle-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({});
  });
define("fusor-ember-cli/controllers/lifecycle-environments", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({});
  });
define("fusor-ember-cli/controllers/login", 
  ["ember","simple-auth/mixins/login-controller-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var LoginControllerMixin = __dependency2__["default"];

    __exports__["default"] = Ember.ObjectController.extend(LoginControllerMixin, {
      needs: ["application"],

      identification: null,
      password: null,
      errorMessage: null,

      authType: "Basic",
      sessionAuthType: Ember.computed.alias("session.authType"),

      authenticator: (function () {
        if (this.get("isOauth")) {
          return "simple-auth-authenticator:oauth2-password-grant";
        } else {
          return "authenticator:foreman";
        }
      }).property("isOauth"),

      isOauth: (function () {
        return this.get("authType") == "oAuth" || this.get("sessionAuthType") == "oAuth";
      }).property("authType", "sessionAuthType"),

      actions: {

        authenticate: function () {
          var self = this;
          if (this.get("authType") == "Basic") {
            return this._super().then(function () {
              var adapter = self.store.adapterFor("ApplicationAdapter");
              adapter.set("headers", { Authorization: "Basic " + self.get("session.basicAuthToken") });
              return self.transitionTo("rhci");
            }, function () {
              return self.set("errorMessage", "Your username or password is incorrect. Please try again.");
            });
          } else {
            return this._super().then(function () {
              var adapter = self.store.adapterFor("ApplicationAdapter");
              // add token to adapter header
              adapter.set("headers", { Authorization: "Bearer " + self.get("session.access_token") });

              // add user to local storage session
              self.store.find("user", self.get("identification")).then(function (response) {
                self.get("session").set("authType", "oAuth");
                self.get("session").set("currentUser", response);
                console.log("SESSION");
                console.log(self.get("session"));
                console.log(self.get("session.authType"));
                console.log(self.get("session.basicAuthToken"));
                return self.transitionTo("rhci");
              }, function (response) {
                alert("error oAuth");
              });
            }, function () {
              return self.set("errorMessage", "Your username or password is incorrect. Please try again.");
            });
          }
        },

        // getCurrentUser: function
        // // authenticate called from LoginControllerMixin,
        authenticateOauth: function () {
          var pw = this.get("password");
          var self = this;
          return this._super().then(function () {
            var adapter = self.store.adapterFor("ApplicationAdapter");
            if (self.get("authType") == "Basic") {
              self.get("session").set("basicAuthToken", btoa(self.get("identification") + ":" + pw));
              pw = null;
              adapter.set("headers", { Authorization: "Basic " + self.get("session.basicAuthToken") });
            } else {
              // add token to adapter header
              adapter.set("headers", { Authorization: "Bearer " + self.get("session.access_token") });
            }

            // add user to local storage session
            self.store.find("user", self.get("identification")).then(function (response) {
              self.get("session").set("currentUser", response);
              return self.transitionTo("rhci");
            }, function (response) {
              alert("error");
            });

          }, function () {
            return self.set("errorMessage", "Your username or password is incorrect. Please try again.");
          });
        },

        authenticateSession: function (authType) {
          var self = this;
          return this.get("session").authenticate("simple-auth-authenticator:torii", authType + "-oauth2").then(function () {
            console.log(self.get("session.content"));
            return self.transitionToRoute("rhci");
          });
        },

        authenticateWithFacebook: function () {
          var self = this;
          this.get("session").authenticate("simple-auth-authenticator:torii", "facebook-oauth2").then(function () {
            var authCode = self.get("session.authorizationCode");
            // Ember.$.ajax({
            //         type: "POST",
            //         url: window.ENV.host + "/facebook/auth.json",
            //         data: JSON.stringify({
            //                 auth_code: authCode
            //         }),
            //         contentType: "application/json; charset=utf-8",
            //         dataType: "json",
            //         success: function(data) {
            //                 // TODO : manage access_token and save it to the session
            //         },
            //         failure: function(errMsg) {
            //                 // TODO : manage error
            //         }
            // });
          }, function (error) {
            alert("There was an error when trying to sign you in: " + error);
          });
        }

      }
    });
  });
define("fusor-ember-cli/controllers/logout-model", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      actions: {
        logout: function () {
          alert("logout");
        }
      }
    });
  });
define("fusor-ember-cli/controllers/networking", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      dnsName: null
    });
  });
define("fusor-ember-cli/controllers/new-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({});
  });
define("fusor-ember-cli/controllers/new-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      fields: {},

      rhciModalButtons: [Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Create", clicked: "createOrganization" })],

      myModalButtons: [Ember.Object.create({ title: "Submit", type: "primary", clicked: "submit" }), Ember.Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" })],

      actions: {

        cancel: function () {
          this.transitionTo("configure");
        },

        createOrganization: function () {
          var self = this;
          var organization = this.store.createRecord("organization", this.get("fields"));
          organization.save().then(function () {
            self.controllerFor("configure").set("selectedOrganization", organization);
            self.transitionTo("configure");
          }, function () {
            alert("error");
          });
        }
      }
    });
  });
define("fusor-ember-cli/controllers/organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({});
  });
define("fusor-ember-cli/controllers/organizations", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({});
  });
define("fusor-ember-cli/controllers/osp-configuration", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      tenantType: "vxlan",
      corePlugin: "ml2",
      glanceBackend: "local",
      cinderBackend: "NFS" });
  });
define("fusor-ember-cli/controllers/osp-network", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({
      unusedTrafficTypes: (function () {
        return this.get("trafficTypes").filter(function (item, index, enumerable) {
          return item.get("subnets").get("length") == 0;
        });
      }).property("trafficTypes.@each.subnets", "model.@each.trafficTypes"),

      usedTrafficTypes: (function () {
        return this.get("trafficTypes").filter(function (item, index, enumerable) {
          return item.get("subnets").get("length") > 0;
        });
      }).property("trafficTypes.@each.subnets", "model.@each.trafficTypes"),

      actions: {
        assignTrafficTypeToSubnet: function (obj, ops) {
          var subnets = obj.get("subnets");
          subnets.forEach(function (item) {
            obj.get("subnets").removeObject(item);
          });

          var subnet = ops.target.subnet;
          subnet.get("trafficTypes").then(function (results) {
            return results.pushObject(obj);
          });
        },
        removeTrafficTypeFromSubnet: function (obj, ops) {
          var subnets = obj.get("subnets");
          subnets.forEach(function (item) {
            obj.get("subnets").removeObject(item);
          });
          return this.get("unusedTrafficTypes").pushObject(obj);
        }
      }

      //      })

      // var subnet = ops.target.subnet;
      // subnet.get('trafficTypes').then(function(results) {
      //    return results.pushObject(obj);
      // })


    });
  });
define("fusor-ember-cli/controllers/osp-settings", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      ha: "compute",
      networking: "neutron",
      messaging: "rabbitmq",
      platform: "rhel7",
      password: "random",
      customRepos: null });
  });
define("fusor-ember-cli/controllers/products", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({

      syncingInProgress: false,
      showSuccessMessage: false,
      disableSyncButton: false,

      prog: 20,
      incrementBy: 20,

      actions: {
        syncProducts: function () {
          this.set("syncingInProgress", true);
          this.set("disableSyncButton", true);
          this.send("incrementProgressBar");
        },

        incrementProgressBar: function () {
          var self = this;
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 1000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 2000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 3000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 4000);
          Ember.run.later(function () {
            self.set("syncingInProgress", false);
            self.set("showSuccessMessage", true);
          }, 4500);
        }

      } });
  });
define("fusor-ember-cli/controllers/review", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({

      needs: ["subscriptions", "rhci", "application"],

      isUpstream: Ember.computed.alias("controllers.application.isUpstream"),
      disableNext: Ember.computed.alias("controllers.subscriptions.disableNext"),
      disableTabProgress: true,

      disableTabInstallation: (function () {
        return this.get("disableNext") && !this.get("isUpstream");
      }).property("disableNext", "isUpstream"),

      nameSelectSubscriptions: Ember.computed.alias("controllers.rhci.nameSelectSubscriptions") });
  });
define("fusor-ember-cli/controllers/review/installation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["application", "rhci", "deployment", "satellite", "satellite/index", "configure-organization", "configure-environment", "rhev-setup", "hypervisor", "hypervisor/discovered-host", "engine/discovered-host", "storage", "networking", "rhev-options", "osp-settings", "osp-configuration", "where-install", "cloudforms-storage-domain", "cloudforms-vm"],

      nameDeployment: Ember.computed.alias("controllers.satellite/index.name"),
      selectedOrganization: Ember.computed.alias("controllers.configure-organization.selectedOrganzation"),
      selectedEnvironment: Ember.computed.alias("controllers.configure-organization.selectedEnvironment"),
      rhevSetup: Ember.computed.alias("controllers.rhev-setup.rhevSetup"),

      hypervisorSelectedHosts: Ember.computed.alias("controllers.hypervisor/discovered-host.selectedHosts"),
      engineSelectedHosts: Ember.computed.alias("controllers.engine/discovered-host.selectedHosts"),

      oVirtHostedtype: (function () {
        if (this.get("rhevSetup") === "selfhost") {
          return "Self Hosted";
        } else {
          return "Host + Engine";
        }
      }).property("rhevSetup"),

      isSelfHosted: (function () {
        return this.get("rhevSetup") === "selfhost";
      }).property("rhevSetup"),

      nameRHCI: Ember.computed.alias("controllers.rhci.nameRHCI"),
      nameRhev: Ember.computed.alias("controllers.rhci.nameRhev"),
      nameOpenStack: Ember.computed.alias("controllers.rhci.nameOpenStack"),
      nameCloudForms: Ember.computed.alias("controllers.rhci.nameCloudForms"),
      nameSatellite: Ember.computed.alias("controllers.rhci.nameSatellite") });
  });
define("fusor-ember-cli/controllers/rhci", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      needs: ["application"],

      isUpstream: Ember.computed.alias("controllers.application.isUpstream"),

      isRhev: true,
      isOpenStack: true,
      isCloudForms: true,

      nameRHCI: (function () {
        if (this.get("isUpstream")) {
          return "Fusor";
        } else {
          return "RHCI";
        }
      }).property("isUpstream"),

      nameSatellite: (function () {
        if (this.get("isUpstream")) {
          return "Foreman";
        } else {
          return "Satellite";
        }
      }).property("isUpstream"),

      nameRhev: (function () {
        if (this.get("isUpstream")) {
          return "oVirt";
        } else {
          return "RHEV";
        }
      }).property("isUpstream"),

      nameOpenStack: (function () {
        if (this.get("isUpstream")) {
          return "RDO";
        } else {
          return "RHELOSP";
        }
      }).property("isUpstream"),

      nameCloudForms: (function () {
        if (this.get("isUpstream")) {
          return "ManageIQ";
        } else {
          return "CloudForms";
        }
      }).property("isUpstream"),

      imgRhev: (function () {
        if (this.get("isUpstream")) {
          return "assets/ovirt-640-210.png";
        } else {
          return "assets/rhci-rhev-640-210.png";
        }
      }).property("isUpstream"),

      imgOpenStack: (function () {
        if (this.get("isUpstream")) {
          return "assets/rdo-640-210.png";
        } else {
          return "assets/rhci-openstack-640-210.png";
        }
      }).property("isUpstream"),

      imgCloudForms: (function () {
        if (this.get("isUpstream")) {
          return "assets/manageiq-640-210.png";
        } else {
          return "assets/rhci-cloudforms-640-210.png";
        }
      }).property("isUpstream"),

      nameSelectSubscriptions: (function () {
        if (this.get("isUpstream")) {
          return "Select Content Source";
        } else {
          return "Select Subscriptions";
        }
      }).property("isUpstream"),

      logoPath: (function () {
        if (this.get("isUpstream")) {
          return "assets/foreman.png";
        } else {
          return "assets/Header-logotype.png";
        }
      }).property("isUpstream"),



      disableNext: (function () {
        return !(this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms"));
      }).property("isRhev", "isOpenStack", "isCloudForms")
    });
  });
define("fusor-ember-cli/controllers/rhev-options", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      applicationModes: ["Both", "Virt", "Gluster"],
      engineLocation: ["Local", "Remote"],
      dbSetup: ["Automatic", "Manual"],
      yesNo: ["Yes", "No"],
      applicationModes2: [{
        id: 1,
        name: "Both" }, {
        id: 2,
        name: "Virt" }, {
        id: 3,
        name: "Gluster" }],
      datacenterName: null,
      clusterName: null,
      hostName: null,
      hostAddress: null,
      storageName: null });
  });
define("fusor-ember-cli/controllers/rhev-setup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      rhevSetup: "rhevhost"
    });
  });
define("fusor-ember-cli/controllers/rhev", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      needs: ["application", "rhev-setup", "side-menu"],

      rhevSetup: Ember.computed.alias("controllers.rhev-setup.rhevSetup"),

      isSelfHost: (function () {
        return this.get("rhevSetup") === "selfhost";
      }).property("rhevSetup"),

      hypervisorTabName: (function () {
        if (this.get("isSelfHost")) {
          return "Hypervisor / Engine";
        } else {
          return "Hypervisor";
        }
      }).property("isSelfHost") });
  });
define("fusor-ember-cli/controllers/satellite", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      needs: ["subscriptions", "rhci"],
      disableContentTab: Ember.computed.alias("controllers.subscriptions.disableNext") });
  });
define("fusor-ember-cli/controllers/satellite/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      rhciModalButtons: [Ember.Object.create({ title: "No", clicked: "cancel", dismiss: "modal" }), Ember.Object.create({ title: "Yes", clicked: "redirectToDeployments", type: "primary" })],
      actions: {
        redirectToDeployments: function () {
          this.transitionTo("deployments");
        }
      }
    });
  });
define("fusor-ember-cli/controllers/satellite/product", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({});
  });
define("fusor-ember-cli/controllers/satellite/subscription", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ObjectController.extend({
      isChecked: false,

      registerOnParent: (function () {
        this.send("registerToggle", this);
      }).on("init") });
  });
define("fusor-ember-cli/controllers/side-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      showSideMenu: false,

      uxDefaultNote: "Note: Please write notes on [etherpad](http://rhci.pad.engineering.redhat.com/wireframe-mtg-10-30-2014), since this pad is ready-only and will note save anything.\n\n",
      uxHeaderNote: "\n\n\n**UX Notes / Specs** for this route\n\n",
      uxHeaderTodo: "\n\n\n\n\n\n\n**UX Todos / Questions** for this route\n\n",
      uxNotes: "none", //this should be overwritten by controller
      uxTodos: "none", //this should be overwritten by controller
      uxNotesDisplay: (function () {
        return this.get("uxDefaultNote") + this.get("uxHeaderNote") + this.get("uxNotes") + this.get("uxHeaderTodo") + this.get("uxTodos");
      }).property("uxNotes"),

      etherpadBaseUrl: "http://rhci.pad.engineering.redhat.com/",
      etherpadName: "",
      etherpadUrl: (function () {
        return this.get("etherpadBaseUrl") + this.get("etherpadName");
      }).property("etherpadName"),


      actions: {
        toggleSideMenu: function () {
          this.set("showSideMenu", this.toggleProperty("showSideMenu"));
        }
      }
    });
  });
define("fusor-ember-cli/controllers/storage", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({
      storageType: "NFS",
      isNFS: (function () {
        return this.storageType === "NFS";
      }).property("storageType"),

      isoDomainPath: "/var/lib/exports/iso",
      isoDomainAcl: "3980292e1905(rw)",
      isoDomainName: "ISO_DOMAIN" });
  });
define("fusor-ember-cli/controllers/subscriptions", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.ArrayController.extend({
      needs: ["application"],

      isUpstream: Ember.computed.alias("controllers.application.isUpstream"),

      isOnlyShowSubscriptions: true,

      toggles: (function () {
        return Ember.A([]);
      }).property(),

      /* boolean, computed getter and setter */
      allChecked: (function (key, value) {
        if (arguments.length === 1) {
          var toggles = this.get("toggles");
          return toggles && toggles.isEvery("isChecked");
        } else {
          this.get("toggles").setEach("isChecked", value);
          return value;
        }
      }).property("toggles.@each.isChecked"),

      totalCountSubscriptions: Ember.computed.alias("model.length"),

      allSelectedItems: Ember.computed.filterBy("toggles", "isChecked", true),
      totalSelectedCount: Ember.computed.alias("allSelectedItems.length"),

      disableNext: true, // CHANGE to true when deploying
      attachingInProgress: false,
      showAttachedSuccessMessage: false,

      prog: 20,
      incrementBy: 20,

      disableAttachButton: (function () {
        return this.get("totalSelectedCount") === 0;
      }).property("totalSelectedCount"),

      actions: {
        registerToggle: function (toggle) {
          this.get("toggles").addObject(toggle);
        },
        deregisterToggle: function (toggle) {
          this.get("toggles").removeObject(toggle);
        },
        attachSubscriptions: function () {
          this.set("attachingInProgress", true);
          this.set("disableAttachButton", true);
          this.send("incrementProgressBar");
        },

        incrementProgressBar: function () {
          var self = this;
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 1000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 2000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 3000);
          Ember.run.later(function () {
            return self.incrementProperty("prog", self.incrementBy);
          }, 4000);
          Ember.run.later(function () {
            self.set("disableNext", false);
            self.set("disableAttachButton", false);
            self.set("attachingInProgress", false);
            self.set("showAttachedSuccessMessage", true);
          }, 4500);
        } } });
  });
define("fusor-ember-cli/controllers/where-install", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Controller.extend({});
  });
define("fusor-ember-cli/helpers/fa-icon", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    var FA_PREFIX = /^fa\-.+/;

    var warn = Ember.Logger.warn;

    /**
     * Handlebars helper for generating HTML that renders a FontAwesome icon.
     *
     * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
     *                          For example, you can pass in either `fa-camera` or just `camera`.
     * @param  {Object} options Options passed to helper.
     * @return {Ember.Handlebars.SafeString} The HTML markup.
     */
    var faIcon = function (name, options) {
      if (Ember.typeOf(name) !== "string") {
        var message = "fa-icon: no icon specified";
        warn(message);
        return new Ember.Handlebars.SafeString(message);
      }

      var params = options.hash,
          classNames = [],
          html = "";

      classNames.push("fa");
      if (!name.match(FA_PREFIX)) {
        name = "fa-" + name;
      }
      classNames.push(name);
      if (params.spin) {
        classNames.push("fa-spin");
      }
      if (params.flip) {
        classNames.push("fa-flip-" + params.flip);
      }
      if (params.rotate) {
        classNames.push("fa-rotate-" + params.rotate);
      }
      if (params.lg) {
        warn("fa-icon: the 'lg' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"lg\"}}");
        classNames.push("fa-lg");
      }
      if (params.x) {
        warn("fa-icon: the 'x' parameter is deprecated. Use 'size' instead. I.e. {{fa-icon size=\"" + params.x + "\"}}");
        classNames.push("fa-" + params.x + "x");
      }
      if (params.size) {
        if (Ember.typeOf(params.size) === "number") {
          classNames.push("fa-" + params.size + "x");
        } else {
          classNames.push("fa-" + params.size);
        }
      }
      if (params.fixedWidth) {
        classNames.push("fa-fw");
      }
      if (params.listItem) {
        classNames.push("fa-li");
      }
      if (params.pull) {
        classNames.push("pull-" + params.pull);
      }
      if (params.border) {
        classNames.push("fa-border");
      }
      if (params.classNames && !Ember.isArray(params.classNames)) {
        params.classNames = [params.classNames];
      }
      if (!Ember.isEmpty(params.classNames)) {
        Array.prototype.push.apply(classNames, params.classNames);
      }

      html += "<i";
      html += " class='" + classNames.join(" ") + "'";
      if (params.title) {
        html += " title='" + params.title + "'";
      }
      html += "></i>";
      return new Ember.Handlebars.SafeString(html);
    };

    __exports__.faIcon = faIcon;

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(faIcon);
  });
define("fusor-ember-cli/helpers/log", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = function () {};
    //console.debug(str);
  });
define("fusor-ember-cli/helpers/radio-button", 
  ["ember","fusor-ember-cli/views/radio-button","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var RadioView = __dependency2__["default"];

    __exports__["default"] = Ember.Handlebars.makeViewHelper(RadioView);
  });
define("fusor-ember-cli/helpers/raw-text", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    function rawText(input) {
      return new Handlebars.SafeString(input);
    }

    __exports__.rawText = rawText;
    __exports__["default"] = Ember.Handlebars.makeBoundHelper(rawText);
  });
define("fusor-ember-cli/helpers/showdown-addon", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    /* global Showdown */
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Handlebars.makeBoundHelper(function (value) {
      if (typeof value === "string") {
        var converter = new Showdown.converter();
        return new Ember.Handlebars.SafeString(converter.makeHtml(value));
      }
    });
  });
define("fusor-ember-cli/initializers/coordinator-setup", 
  ["fusor-ember-cli/models/coordinator","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Coordinator = __dependency1__["default"];

    __exports__["default"] = {
      name: "setup coordinator",

      initialize: function (container, app) {
        app.register("drag:coordinator", Coordinator);
        app.inject("component", "coordinator", "drag:coordinator");
      }
    };
  });
define("fusor-ember-cli/initializers/export-application-global", 
  ["ember","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    function initialize(container, application) {
      var classifiedName = Ember.String.classify(config.modulePrefix);

      if (config.exportApplicationGlobal) {
        window[classifiedName] = application;
      }
    };
    __exports__.initialize = initialize;

    __exports__["default"] = {
      name: "export-application-global",

      initialize: initialize
    };
  });
define("fusor-ember-cli/initializers/initialize-torii-callback", 
  ["torii/redirect-handler","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var RedirectHandler = __dependency1__["default"];

    __exports__["default"] = {
      name: "torii-callback",
      before: "torii",
      initialize: function (container, app) {
        app.deferReadiness();
        RedirectHandler.handle(window.location.toString())["catch"](function () {
          app.advanceReadiness();
        });
      }
    };
  });
define("fusor-ember-cli/initializers/initialize-torii-session", 
  ["torii/configuration","torii/bootstrap/session","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var configuration = __dependency1__["default"];
    var bootstrapSession = __dependency2__["default"];

    __exports__["default"] = {
      name: "torii-session",
      after: "torii",

      initialize: function (container) {
        if (configuration.sessionServiceName) {
          bootstrapSession(container, configuration.sessionServiceName);
          container.injection("adapter", configuration.sessionServiceName, "torii:session");
        }
      }
    };
  });
define("fusor-ember-cli/initializers/initialize-torii", 
  ["torii/bootstrap/torii","torii/configuration","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var bootstrapTorii = __dependency1__["default"];
    var configuration = __dependency2__["default"];

    var initializer = {
      name: "torii",
      initialize: function (container, app) {
        bootstrapTorii(container);

        // Walk all configured providers and eagerly instantiate
        // them. This gives providers with initialization side effects
        // like facebook-connect a chance to load up assets.
        for (var key in configuration.providers) {
          if (configuration.providers.hasOwnProperty(key)) {
            container.lookup("torii-provider:" + key);
          }
        }

        app.inject("route", "torii", "torii:main");
      }
    };

    if (window.DS) {
      initializer.after = "store";
    }

    __exports__["default"] = initializer;
  });
define("fusor-ember-cli/initializers/simple-auth-oauth2", 
  ["simple-auth-oauth2/configuration","simple-auth-oauth2/authenticators/oauth2","simple-auth-oauth2/authorizers/oauth2","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Configuration = __dependency1__["default"];
    var Authenticator = __dependency2__["default"];
    var Authorizer = __dependency3__["default"];
    var ENV = __dependency4__["default"];

    __exports__["default"] = {
      name: "simple-auth-oauth2",
      before: "simple-auth",
      initialize: function (container, application) {
        Configuration.load(container, ENV["simple-auth-oauth2"] || {});
        container.register("simple-auth-authorizer:oauth2-bearer", Authorizer);
        container.register("simple-auth-authenticator:oauth2-password-grant", Authenticator);
      }
    };
  });
define("fusor-ember-cli/initializers/simple-auth-torii", 
  ["simple-auth-torii/initializer","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var initializer = __dependency1__["default"];

    __exports__["default"] = initializer;
  });
define("fusor-ember-cli/initializers/simple-auth", 
  ["simple-auth/configuration","simple-auth/setup","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __exports__) {
    "use strict";
    var Configuration = __dependency1__["default"];
    var setup = __dependency2__["default"];
    var ENV = __dependency3__["default"];

    __exports__["default"] = {
      name: "simple-auth",
      initialize: function (container, application) {
        Configuration.load(container, ENV["simple-auth"] || {});
        setup(container, application);
      }
    };
  });
define("fusor-ember-cli/mixins/meta", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Mixin.create({
      meta: (function () {
        return this.store.metadataFor(this.get("model").type);
      }).property("")
    });
  });
define("fusor-ember-cli/models/coordinator", 
  ["ember","fusor-ember-cli/models/obj-hash","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var ObjHash = __dependency2__["default"];

    __exports__["default"] = Ember.Object.extend(Ember.Evented, {
      objectMap: (function () {
        return ObjHash.create();
      }).property(),

      getObject: function (id, ops) {
        ops = ops || {};
        var payload = this.get("objectMap").getObj(id);

        if (payload.ops.source) {
          payload.ops.source.sendAction("action", payload.obj);
        }

        if (payload.ops.target) {
          payload.ops.target.sendAction("action", payload.obj);
        }

        this.trigger("objectMoved", { obj: payload.obj, source: payload.ops.source, target: ops.target });

        return payload.obj;
      },

      setObject: function (obj, ops) {
        ops = ops || {};
        return this.get("objectMap").add({ obj: obj, ops: ops });
      }
    });
  });
define("fusor-ember-cli/models/deployment", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Deployment = DS.Model.extend({
      name: DS.attr("string"),
      organization: DS.attr("string"),
      environment: DS.attr("string") });

    Deployment.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "My first RHEV",
        organization: "default_organization",
        environment: "development" }, {
        id: 2,
        name: "My second RHEV and CloudForms",
        organization: "default_organization",
        environment: "staging" }, {
        id: 3,
        name: "Going Live RHEV and CloudForms",
        organization: "default_organization",
        environment: "production" }]
    });

    __exports__["default"] = Deployment;
  });
define("fusor-ember-cli/models/host", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Host = DS.Model.extend({
      name: DS.attr("string"),
      hostgroup: DS.attr("string"),
      mac: DS.attr("string"),
      domain: DS.attr("string"),
      subnet: DS.attr("string"),
      operatingsystem: DS.attr("string"),
      environment: DS.attr("string"),
      model: DS.attr("string"),
      location: DS.attr("string"),
      organization: DS.attr("string"),
      cpu: DS.attr("string"),
      memory: DS.attr("string"),
      vendor: DS.attr("string"),
      isSelectedAsHypervisor: DS.attr("boolean"),
      isSelectedAsEngine: DS.attr("boolean")
    });

    Host.reopenClass({
      FIXTURES: [
      // {
      //    id: 1,
      //    name: 'dhcp-3-100.example.com',
      //    hostgroup: 'RHEV Self Hosted Engine',
      //    mac: 'aa:bb:cc:dd:ee',
      //    domain: 'example.com',
      //    subnet: '10.0.3.100',
      //    operatingsystem: 'Fedora 19',
      //    environment: 'Development',
      //    location: 'Tel Aviv',
      //    organization: 'Default_Organization',
      //    type: 'Host::Managed'
      // },
      // {
      //    id: 2,
      //    name: 'dhcp-3-102.example.com',
      //    hostgroup: 'RHEV Self Hosted Engine',
      //    mac: 'aa:bb:aa:dd:ee',
      //    domain: 'example.com',
      //    subnet: '10.0.3.102',
      //    operatingsystem: 'Fedora 19',
      //    environment: 'Development',
      //    location: 'Tel Aviv',
      //    organization: 'Default_Organization',
      //    type: 'Host::Managed'
      // },
      // {
      //    id: 3,
      //    name: 'dhcp-3-103.example.com',
      //    hostgroup: 'RHEV Host',
      //    mac: 'ee:bb:aa:dd:ee',
      //    domain: 'example.com',
      //    subnet: '10.0.3.103',
      //    operatingsystem: 'Fedora 19',
      //    environment: 'Development',
      //    location: 'Tel Aviv',
      //    organization: 'Default_Organization',
      //    type: 'Host::Managed'
      // },
      // {
      //    id: 4,
      //    name: 'dhcp-3-104.example.com',
      //    hostgroup: 'RHEV Host',
      //    mac: '22:bb:11:dd:aa',
      //    domain: 'example.com',
      //    subnet: '10.0.3.104',
      //    operatingsystem: 'Fedora 19',
      //    environment: 'Development',
      //    location: 'Tel Aviv',
      //    organization: 'Default_Organization',
      //    type: 'Host::Managed'
      // },
      {
        id: 5,
        name: "dhcp-3-105.example.com",
        hostgroup: null,
        mac: "aa:33:ab:22:ee",
        domain: "example.com",
        subnet: "10.0.3.105",
        operatingsystem: "Fedora 19",
        environment: "Development",
        location: "Tel Aviv",
        organization: "Default_Organization",
        cpu: "4 CPU",
        memory: "8 GB",
        vendor: "Dell",
        type: "Host::Discovered",
        isSelectedAsHypervisor: false,
        isSelectedAsEngine: false }, {
        id: 6,
        name: "dhcp-3-106.example.com",
        hostgroup: null,
        mac: "bb:cc:ee:dd:aa",
        domain: "example.com",
        subnet: "10.0.3.106",
        operatingsystem: "Fedora 19",
        environment: "Development",
        location: "Tel Aviv",
        organization: "Default_Organization",
        cpu: "4 CPU",
        memory: "8 GB",
        vendor: "Dell",
        type: "Host::Discovered",
        isSelectedAsHypervisor: false,
        isSelectedAsEngine: false }, {
        id: 7,
        name: "cc:01:0E:16:A3:A3",
        hostgroup: null,
        mac: "cc:01:0E:16:A3:A3",
        domain: null,
        subnet: null,
        operatingsystem: null,
        environment: null,
        location: null,
        organization: null,
        cpu: "4 CPU",
        memory: "8 GB",
        vendor: "Dell",
        type: "Host::Discovered",
        isSelectedAsHypervisor: false,
        isSelectedAsEngine: false }, {
        id: 8,
        name: "dd:bb:dd:dd:aaa",
        hostgroup: null,
        mac: "dd:bb:dd:dd:aaa",
        domain: null,
        subnet: null,
        operatingsystem: null,
        environment: null,
        location: null,
        organization: null,
        cpu: "4 CPU",
        memory: "8 GB",
        vendor: "Dell",
        type: "Host::Discovered",
        isSelectedAsHypervisor: false,
        isSelectedAsEngine: false }]
    });

    __exports__["default"] = Host;
  });
define("fusor-ember-cli/models/hostgroup", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Hostgroup = DS.Model.extend({
      name: DS.attr("string") });

    // Hostgroup.reopenClass({
    //     FIXTURES: [
    //        {
    //           id: 1,
    //           parent: null,
    //           name: 'RHEV Self Hosted Engine',
    //           title: 'RHEV Self Hosted Engine',
    //           domain: 'example.com',
    //           subnet: '10.0.3.100',
    //           operatingsystem: 'Fedora 19',
    //           environment: 'Development',
    //           location: 'Tel Aviv',
    //           organization: 'Default_Organization'
    //        },
    //        {
    //           id: 2,
    //           parent: null,
    //           name: 'RHEV Host',
    //           title: 'RHEV Host',
    //           domain: 'example.com',
    //           subnet: '10.0.4.100',
    //           operatingsystem: 'Fedora 19',
    //           environment: 'Development',
    //           location: 'Tel Aviv',
    //           organization: 'Default_Organization'
    //        },
    //     ]
    // });

    __exports__["default"] = Hostgroup;
    // hostgroup: DS.attr('string'),
    // mac: DS.attr('string'),
    // domain: DS.attr('string'),
    // subnet: DS.attr('string'),
    // operatingsystem: DS.attr('string'),
    // environment: DS.attr('string'),
    // model: DS.attr('string'),
    // location: DS.attr('string'),
    // organization: DS.attr('string')
  });
define("fusor-ember-cli/models/lifecycle-environment", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Environment = DS.Model.extend({
      name: DS.attr("string"),
      label: DS.attr("string"),
      description: DS.attr("string") });

    Environment.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "Library" }, {
        id: 2,
        name: "Development" }, {
        id: 3,
        name: "Test" }, {
        id: 4,
        name: "Production" }]
    });

    __exports__["default"] = Environment;
  });
define("fusor-ember-cli/models/location", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Location = DS.Model.extend({
      name: DS.attr("string"),
      title: DS.attr("string")
    });

    Location.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "Tel Aviv",
        title: "Tel Aviv" }, {
        id: 2,
        name: "Brno",
        title: "Brno" }, {
        id: 3,
        name: "Raleigh",
        title: "Raleigh" }]
    });

    __exports__["default"] = Location;
  });
define("fusor-ember-cli/models/newenv", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Newenv = DS.Model.extend({
      name: DS.attr("string"),
      label: DS.attr("string"),
      description: DS.attr("string") });

    Newenv.reopenClass({
      FIXTURES: []
    });

    __exports__["default"] = Newenv;
  });
define("fusor-ember-cli/models/note", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Note = DS.Model.extend({
      route: DS.attr("string"),
      desc: DS.attr("string")
    });

    Note.reopenClass({
      FIXTURES: [{
        id: 1,
        route: "rhev",
        desc: "we are in the RHEV route"
      }, {
        id: 2,
        route: "satellite",
        desc: "we are in the satellite route"
      }, {
        id: 3,
        route: "configure",
        desc: " configure"
      }]
    });

    __exports__["default"] = Note;
  });
define("fusor-ember-cli/models/oauth-access-token", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      token: DS.attr("string"),
      user: DS.belongsTo("user", { async: true })
    });
  });
define("fusor-ember-cli/models/obj-hash", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Object.extend({
      content: {},
      contentLength: 0,

      add: function (obj) {
        var id = this.generateId();
        this.get("content")[id] = obj;
        this.incrementProperty("contentLength");
        return id;
      },

      getObj: function (key) {
        var res = this.get("content")[key];
        if (!res) {
          throw "no obj for key " + key;
        }
        return res;
      },

      generateId: function () {
        var num = Math.random() * 1000000000000;
        num = parseInt(num);
        num = "" + num;
        return num;
      },

      keys: function () {
        var res = [];
        for (var key in this.get("content")) {
          res.push(key);
        }
        return Ember.A(res);
      },

      lengthBinding: "contentLength"
    });
  });
define("fusor-ember-cli/models/organization", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Organization = DS.Model.extend({
      name: DS.attr("string"),
      title: DS.attr("string")
    });

    Organization.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "Default_Organization",
        title: "Default_Organization" }]
    });

    __exports__["default"] = Organization;
    // {
    //    id: 2,
    //    name: 'Engineering',
    //    title: 'Engineering',
    // },
    // {
    //    id: 3,
    //    name: 'QA',
    //    title: 'QA',
    // }
  });
define("fusor-ember-cli/models/product", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Product = DS.Model.extend({
      name: DS.attr("string"),
      state_time: DS.attr("string"),
      duration: DS.attr("string"),
      size: DS.attr("string"),
      result: DS.attr("string") });

    Product.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "Red Hat Enterprise Virtualization",
        state_time: null,
        duration: "25 minutes",
        size: "3 GB",
        result: "Sync in progress" }, {
        id: 2,
        name: "Red Hat CloudForms Management Engine",
        state_time: null,
        duration: "14 minutes",
        size: "1 GB",
        result: "Sync in progress" }, {
        id: 3,
        name: "Red Hat OpenStack Platform",
        state_time: null,
        duration: "22 minutes",
        size: "2 GB",
        result: "Sync in progress" }]
    });

    __exports__["default"] = Product;
  });
define("fusor-ember-cli/models/subnet", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Subnet = DS.Model.extend({
      network: DS.attr("string"),
      mask: DS.attr("string"),
      priority: DS.attr("number"),
      name: DS.attr("string"),
      vlanid: DS.attr("string"),
      created_at: DS.attr("date"),
      updated_at: DS.attr("date"),
      dhcp_id: DS.attr("number"),
      tftp_id: DS.attr("number"),
      from: DS.attr("string"),
      to: DS.attr("string"),
      gateway: DS.attr("string"),
      dns_primary: DS.attr("string"),
      dns_secondary: DS.attr("string"),
      dns_id: DS.attr("number"),
      sort_network_id: DS.attr("number"),
      boot_mode: DS.attr("string"),
      ipam: DS.attr("string"),
      trafficTypes: DS.hasMany("trafficType", { async: true })
    });

    Subnet.reopenClass({
      FIXTURES: [{
        id: 7,
        network: "10.35.115.0",
        mask: "255.255.255.0",
        priority: "",
        name: "ForemanSubnetUC",
        vlanid: "",
        dhcp_id: "",
        tftp_id: "",
        from: "",
        to: "",
        gateway: "",
        dns_primary: "",
        dns_secondary: "",
        boot_mode: "DHCP",
        ipam: "DHCP",
        trafficTypes: []
      }, {
        id: 1,
        network: "10.35.27.0",
        mask: "255.255.255.192",
        priority: "",
        name: "SAT Lab 180",
        vlanid: "",
        dhcp_id: "",
        tftp_id: "",
        from: "",
        to: "",
        gateway: "",
        dns_primary: "",
        dns_secondary: "",
        boot_mode: "DHCP",
        ipam: "DHCP",
        trafficTypes: [] }, {
        id: 4,
        network: "10.35.64.0",
        mask: "255.255.255.0",
        priority: "",
        name: "QA-Default",
        vlanid: "",
        dhcp_id: "",
        tftp_id: "",
        from: "",
        to: "",
        gateway: "10.35.27.62",
        dns_primary: "",
        dns_secondary: "",
        boot_mode: "DHCP",
        ipam: "Static",
        trafficTypes: [] }, {
        id: 9,
        network: "10.35.27.128",
        mask: "255.255.255.192",
        priority: "",
        name: "SatLab 182",
        vlanid: "",
        dhcp_id: "",
        tftp_id: "",
        from: "",
        to: "",
        gateway: "10.35.27.190",
        dns_primary: "",
        dns_secondary: "",
        boot_mode: "DHCP",
        ipam: "Static",
        trafficTypes: [] }]
    });

    __exports__["default"] = Subnet;
  });
define("fusor-ember-cli/models/subscription", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var Subscription = DS.Model.extend({
      name: DS.attr("string"),
      contract_number: DS.attr("string"),
      available: DS.attr("string"),
      subscription_type: DS.attr("string"),
      start_date: DS.attr("date"),
      end_date: DS.attr("date"),
      quantity: DS.attr("number")
    });

    Subscription.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "Red Hat Employee Subscription",
        contract_number: "1234567",
        available: "12831 of 25000",
        subscription_type: "System: Physical",
        start_date: "03/03/2014",
        end_date: "01/01/2022",
        quantity: null
      }, {
        id: 2,
        name: "30 Day Self-Supported OpenShift Enterprise, 2 Cores Evaluation",
        contract_number: "234234234",
        available: "2 or 3",
        subscription_type: "System: Physical",
        start_date: "09/01/2014",
        end_date: "09/30/2014",
        quantity: 1
      }, {
        id: 3,
        name: "CloudForms Employee Subscription",
        contract_number: "675676576",
        available: "2 or 1000",
        subscription_type: "System: Physical",
        start_date: "07/01/2014",
        end_date: "07/30/2019",
        quantity: null
      }]
    });

    __exports__["default"] = Subscription;
  });
define("fusor-ember-cli/models/traffic-type", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    var trafficType = DS.Model.extend({
      name: DS.attr("string"),
      subnets: DS.hasMany("subnet", { async: true })
    });

    trafficType.reopenClass({
      FIXTURES: [{
        id: 1,
        name: "External" }, {
        id: 2,
        name: "Tenant" }, {
        id: 3,
        name: "Management" }, {
        id: 4,
        name: "Cluster Management" }, {
        id: 5,
        name: "Admin API" }, {
        id: 6,
        name: "Public API" }, {
        id: 7,
        name: "Storage" }, {
        id: 8,
        name: "Storage Clustering" }]
    });

    __exports__["default"] = trafficType;
  });
define("fusor-ember-cli/models/user", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.Model.extend({
      login: DS.attr("string"),
      mail: DS.attr("string"),
      firstname: DS.attr("string"),
      lastname: DS.attr("string"),
      admin: DS.attr("boolean"),
      auth_source_id: DS.attr("number"),
      lastLoginOn: DS.attr("date"),
      oauth_access_tokens: DS.hasMany("oauthAccessToken"),
      fullName: (function () {
        return this.get("firstname") + " " + this.get("lastname");
      }).property("firstname", "lastname")


    });
  });
define("fusor-ember-cli/router", 
  ["ember","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var config = __dependency2__["default"];

    var Router = Ember.Router.extend({
      location: config.locationType,
      // log when Ember generates a controller or a route from a generic class
      LOG_ACTIVE_GENERATION: true,
      // log when Ember looks up a template or a view
      LOG_VIEW_LOOKUPS: true
    });

    Router.map(function () {
      this.route("login");
      this.route("loggedin");

      this.route("rhci", { path: "/deployments/new" });
      this.route("deployments");

      this.resource("deployment", function () {
        this.resource("satellite", function () {
          this.resource("configure");
          this.resource("configure-organization");
          this.resource("configure-environment");
        });

        this.resource("rhev", function () {
          this.resource("rhev-setup", { path: "setup" });
          this.resource("hypervisor", function () {
            this.route("discovered-host");
            this.route("existing-host");
            this.route("new-host");
          });
          this.resource("engine", function () {
            this.route("hypervisor");
            this.route("discovered-host");
            this.route("existing-host");
            this.route("new-host");
          });
          this.resource("rhev-options", { path: "configuration" });
          this.resource("storage");
          this.resource("networking");
        });

        this.resource("openstack", function () {
          this.resource("osp-settings", { path: "settings" });
          this.resource("osp-network", { path: "network" });
          this.resource("osp-overview", { path: "overview" });
          this.resource("osp-configuration", { path: "configuration" });
        });
        this.resource("cloudforms", function () {
          this.resource("where-install");
          this.resource("cloudforms-storage-domain", { path: "storage-domain" });
          this.resource("cloudforms-vm", { path: "vm" });
        });
        this.resource("review", function () {
          this.resource("subscriptions");
          this.resource("products");
          this.route("installation");
          this.route("progress");
        });
      });


      this.resource("hostgroups", function () {
        this.resource("hostgroup", { path: "/:hostgroup_id" }, function () {
          this.route("edit");
        });
      });


      this.route("hostgroup/edit");
      this.route("review/installation");
      this.route("review/progress");
    });

    __exports__["default"] = Router;
  });
define("fusor-ember-cli/routes/application", 
  ["ember","simple-auth/mixins/application-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    // app/routes/application.js
    var Ember = __dependency1__["default"];
    var ApplicationRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(ApplicationRouteMixin, {

      beforeModel: function (transition) {
        if (!this.controllerFor("application").get("isEmberCliMode")) {
          return this.get("session").set("isAuthenticated", true);
        };
      },

      setupController: function (controller, model) {
        controller.set("model", model);

        // Ensure headers are set in ApplicationAdapter. TODO - Why can't adapter access session?
        var adapter = this.store.adapterFor("ApplicationAdapter");
        if (this.get("session.authType") == "oAuth") {
          adapter.set("headers", { Authorization: "Bearer " + this.get("session.access_token") });
        } else if (this.get("session.authType") == "Basic") {
          adapter.set("headers", { Authorization: "Basic " + this.get("session.basicAuthToken") });
        }
      },

      actions: {
        invalidateSession: function () {
          this.get("session").invalidate();
          return this.transitionTo("login");
        },

        notImplemented: function () {
          alert("This link is not implemented in the fusor-ember-cli prototype");
        },
        willImplement: function () {
          alert("Check back soon. This will be implemented soon.");
        },

        // OLD MODAL CODE MANUALLY NOT USING BS EMBER
        // showModal: function(controller_name) {
        //   this.render(controller_name, {
        //     into: 'application',
        //     outlet: 'modal'
        //   });
        // },
        // removeModal: function() {
        //   this.disconnectOutlet({
        //     outlet: 'modal',
        //     parentView: 'application'
        //   });
        // },

        //Submit the modal
        submit: function () {
          Bootstrap.NM.push("Successfully submitted modal", "success");
          return Bootstrap.ModalManager.hide("myModal");
        },

        //Cancel the modal, we don't need to hide the model manually because we set {..., dismiss: 'modal'} on the button meta data
        cancel: function () {
          return Bootstrap.NM.push("Modal was cancelled", "info");
        },

        //Show the modal
        showModal: function (name) {
          return Bootstrap.ModalManager.show(name);
        },

        //Show the modal
        showRHCIModal: function () {
          return Bootstrap.ModalManager.show("newRHCI");
        } }
    });
  });
define("fusor-ember-cli/routes/cloudforms-storage-domain", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/cloudforms-vm", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/cloudforms/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("where-install");
      }
    });
  });
define("fusor-ember-cli/routes/configure-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("environments", this.store.find("environment"));
        controller.set("newenvs", this.store.find("newenv"));
      },
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "44"); //route-configure-environment
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }

    });
  });
define("fusor-ember-cli/routes/configure-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("organizations", this.store.find("organization"));
      },
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "43"); //route-configure-organization
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/configure", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("organizations", this.store.find("organization"));
        controller.set("environments", this.store.find("environment"));
        controller.set("newenvs", this.store.find("newenv"));
      },
      activate: function () {
        this.controllerFor("side-menu").set("uxNotes", "Configure notes");
      }

    });
  });
define("fusor-ember-cli/routes/deployment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/deployment/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("satellite");
      }
    });
  });
define("fusor-ember-cli/routes/deployment/review", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("product");
      }
    });
  });
define("fusor-ember-cli/routes/deployments", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("deployment");
      }
    });
  });
define("fusor-ember-cli/routes/engine", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("engine.discovered-host");
      }
    });
  });
define("fusor-ember-cli/routes/engine/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("host", { type: "Host::Discovered" });
      },
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "47"); //route-engine-discovered
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/engine/existing-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("host", { type: "Host::Managed" });
      }
    });
  });
define("fusor-ember-cli/routes/engine/hypervisor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("host", { type: "Host::Discovered" });
      }
    });
  });
define("fusor-ember-cli/routes/engine/new-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("organizations", this.store.find("organization"));
        controller.set("locations", this.store.find("location"));
        controller.set("environments", this.store.find("environment"));
        controller.set("hostgroups", this.store.find("hostgroup"));
      },
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "48"); //route-engine-new-host
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/hostgroup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function (params) {
        return this.store.find("hostgroup", params.hostgroup_id);
      },
      activate: function () {
        console.log("entered hostgroup route");
        this.controllerFor("hostgroups").set("onShowPage", true);
      },

      deactivate: function () {
        console.log("left hostgroup route");
        this.controllerFor("hostgroups").set("onShowPage", false);
      },

      setupController: function (controller, model) {
        controller.set("model", model);
        // TODO - how to make parent_id dynamic
        controller.set("parent_hostgroup", this.store.find("hostgroup", 1));
      } });
  });
define("fusor-ember-cli/routes/hostgroup/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/hostgroups", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("hostgroup");
      }
    });
  });
define("fusor-ember-cli/routes/hypervisor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("hypervisor.discovered-host");
      }
    });
  });
define("fusor-ember-cli/routes/hypervisor/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("host", { type: "Host::Discovered" });
      },
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "46"); //route-rhev-hypervisor
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/hypervisor/existing-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("host", { type: "Host::Managed" });
      }
    });
  });
define("fusor-ember-cli/routes/hypervisor/new-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("organizations", this.store.find("organization"));
        controller.set("locations", this.store.find("location"));
        controller.set("environments", this.store.find("environment"));
        controller.set("hostgroups", this.store.find("hostgroup"));
      }
    });
  });
define("fusor-ember-cli/routes/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("login");
      }
    });
  });
define("fusor-ember-cli/routes/loggedin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/login", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    //import UnauthenticatedRouteMixin from 'simple-auth/mixins/unauthenticated-route-mixin';

    __exports__["default"] = Ember.Route.extend({
      //export default Ember.Route.extend(UnauthenticatedRouteMixin, {

      beforeModel: function (transition) {
        if (!this.controllerFor("application").get("isEmberCliMode")) {
          return this.transitionTo("rhci");
        };
      },

      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("errorMessage", null);
      }

    });
  });
define("fusor-ember-cli/routes/networking", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "51"); //route-rhev-networking
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/new-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/new-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("fields", {});
      }
    });
  });
define("fusor-ember-cli/routes/openstack/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("osp-settings");
      }
    });
  });
define("fusor-ember-cli/routes/osp-configuration", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "56"); //route-openstack-services-config
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }

    });
  });
define("fusor-ember-cli/routes/osp-network", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("subnet");
      },

      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "54");
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      },

      setupController: function (controller, model) {
        controller.set("model", model);
        controller.set("trafficTypes", this.store.find("traffic-type"));
      } });
  });
define("fusor-ember-cli/routes/osp-overview", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "55");
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/osp-settings", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "53");
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/products", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("product");
      }

    });
  });
define("fusor-ember-cli/routes/review/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      afterModel: function () {
        if (!this.controllerFor("application").get("isUpstream") && this.controllerFor("subscriptions").get("disableNext")) {
          this.transitionTo("subscriptions");
        } else {
          this.transitionTo("review.installation");
        }
      }
    });
  });
define("fusor-ember-cli/routes/review/installation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({

      setupController: function (controller, model) {
        controller.set("model", model);
      } });
  });
define("fusor-ember-cli/routes/review/progress", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/rhci", 
  ["ember","simple-auth/mixins/authenticated-route-mixin","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var AuthenticatedRouteMixin = __dependency2__["default"];

    __exports__["default"] = Ember.Route.extend(AuthenticatedRouteMixin, {

      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "40"); //route-deployments-new
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }

    });
  });
define("fusor-ember-cli/routes/rhev-options", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "52"); //route-rhev-options
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/rhev-setup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "45"); //route-rhev-setup
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/rhev", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/rhev/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        this.transitionTo("hypervisor");
      }
    });
  });
define("fusor-ember-cli/routes/satellite", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({});
  });
define("fusor-ember-cli/routes/satellite/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "41"); //route-satellite
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/setpassword", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      beforeModel: function () {
        if (this.controllerFor("application").get("isPasswordSet")) {
          this.transitionTo("rhci");
        }
      },
      actions: {
        updatePassword: function () {
          this.controllerFor("application").set("isPasswordSet", true);
          this.transitionTo("rhci");
        }
      }

    });
  });
define("fusor-ember-cli/routes/storage", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "50"); //route-rhev-storage
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/routes/subscriptions", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      model: function () {
        return this.store.find("subscription");
      }

    });
  });
define("fusor-ember-cli/routes/where-install", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.Route.extend({
      activate: function () {
        this.controllerFor("side-menu").set("etherpadName", "57");
      },

      deactivate: function () {
        this.controllerFor("side-menu").set("etherpadName", "");
      }
    });
  });
define("fusor-ember-cli/serializers/application", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.RESTSerializer.extend({
      extractArray: function (store, type, payload) {
        // 'foreman-experimental-ui@model:setting:'
        var wrapped_payload = {};
        var model_name = type.toString().split(":")[1];
        wrapped_payload[model_name] = payload.results;
        return this._super(store, type, wrapped_payload);
      },
      extractSingle: function (store, type, payload) {
        var wrapped_payload = {};
        var model_name = type.toString().split(":")[1];
        wrapped_payload[model_name] = payload;
        return this._super(store, type, wrapped_payload);
      },
      extractMeta: function (store, type, payload) {
        var metaFields = ["total", "subtotal", "page", "per_page", "search"];
        var meta_payload = {};
        metaFields.forEach(function (meta) {
          meta_payload[meta] = payload[meta];
          delete payload[meta];
        });
        meta_payload.sort = payload.sort;
        store.metaForType(type, meta_payload);
      }
    });
  });
define("fusor-ember-cli/serializers/puppetclass", 
  ["ember-data","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var DS = __dependency1__["default"];

    __exports__["default"] = DS.RESTSerializer.extend({
      extractArray: function (store, type, payload) {
        // 'foreman-experimental-ui@model:setting:'
        var wrapped_payload = {};
        var model_name = type.toString().split(":")[1];
        wrapped_payload[model_name] = $.map(payload.results, function (v) {
          return v;
        });
        return this._super(store, type, wrapped_payload);
      } });
  });
define("fusor-ember-cli/templates/application", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "isLoggedIn", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  ");
      stack1 = helpers['if'].call(depth0, "showMainMenu", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "topbar", options) : helperMissing.call(depth0, "partial", "topbar", options))));
      data.buffer.push("\n  ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "mainmenu", options) : helperMissing.call(depth0, "partial", "mainmenu", options))));
      data.buffer.push("\n  ");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "isEmberCliMode", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression((helper = helpers['upstream-downstream'] || (depth0 && depth0['upstream-downstream']),options={hash:{
        'isUpstream': ("isUpstream")
      },hashTypes:{'isUpstream': "ID"},hashContexts:{'isUpstream': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "upstream-downstream", options))));
      data.buffer.push("\n\n<div class=\"pull-right\">\n      <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleSideMenu", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"uxnotes\">\n      UX Notes &nbsp;<i class=\"fa fa-bars fa-lg white\"></i>\n      </a>\n</div>\n\n");
      data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "side-menu", options) : helperMissing.call(depth0, "render", "side-menu", options))));
      data.buffer.push("\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isContainer:container:container-fluid")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/application/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("application index");
      
    });
  });
define("fusor-ember-cli/templates/cancel-modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n  Are you sure you want to cancel?\n");
      }

      stack1 = (helper = helpers['modal-confirm'] || (depth0 && depth0['modal-confirm']),options={hash:{
        'title': ("Cancel"),
        'ok': ("save"),
        'close': ("removeModal")
      },hashTypes:{'title': "STRING",'ok': "STRING",'close': "STRING"},hashContexts:{'title': depth0,'ok': depth0,'close': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-confirm", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/cloudforms-storage-domain", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("NFS Share"),
        'value': ("nfsShare")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n    </form>\n  </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/cloudforms-vm", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("VM Name"),
        'value': ("vmName")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n    </form>\n  </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/cloudforms", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n        <a>Where to Install</a>\n      ");
      }

      data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "where-install", options) : helperMissing.call(depth0, "link-to", "where-install", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/cloudforms/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/accordion-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <h4 ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "openItem", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":fa :fa-play isOpen:fa-rotate-90")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n      ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </h4>\n    <div class='col-md-offset-1'>\n      ");
      stack1 = helpers['if'].call(depth0, "isOpen", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/base-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"clearfix\">\n   <div class=\"form-group\">\n\n      <label ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":control-label labelClassSize class")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        ");
      stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </label>\n\n      <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("inputClassSize")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n        ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <span class='help-block'>\n      ");
      stack1 = helpers._triageMustache.call(depth0, "help-inline", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </span>\n\n\n\n   </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/draggable-object-target", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "acceptForDrop", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </a>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "enableClicking", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/draggable-object", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <a href=\"#\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "selectForDrag", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </a>\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "enableClicking", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      
    });
  });
define("fusor-ember-cli/templates/components/env-path-list-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<label ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("bgColor")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  ");
      stack1 = helpers._triageMustache.call(depth0, "env.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</label>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/modal-confirm", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class=\"modal fade\">\n  <div class=\"modal-dialog\">\n    <div class=\"modal-content\">\n      <div class=\"modal-header\">\n        <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button>\n        <h4 class=\"modal-title\">");
      stack1 = helpers._triageMustache.call(depth0, "title", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h4>\n      </div>\n      <div class=\"modal-body\">\n        ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">");
      stack1 = helpers._triageMustache.call(depth0, "dismissButtonLabel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</button>\n        <button type=\"button\" class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "ok", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">");
      stack1 = helpers._triageMustache.call(depth0, "okButtonLabel", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</button>\n      </div>\n    </div>\n  </div>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/object-bin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <div class=\"object-bin-title\">");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</div>\n  <br>\n\n  ");
      stack1 = helpers.each.call(depth0, "obj", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    ");
      stack1 = (helper = helpers['draggable-object'] || (depth0 && depth0['draggable-object']),options={hash:{
        'content': ("obj"),
        'action': ("handleObjectDragged")
      },hashTypes:{'content': "ID",'action': "STRING"},hashContexts:{'content': depth0,'action': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "draggable-object", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      ");
      stack1 = helpers['with'].call(depth0, "obj", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }

      stack1 = (helper = helpers['draggable-object-target'] || (depth0 && depth0['draggable-object-target']),options={hash:{
        'action': ("handleObjectDropped")
      },hashTypes:{'action': "STRING"},hashContexts:{'action': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "draggable-object-target", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      
    });
  });
define("fusor-ember-cli/templates/components/radio-button-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("     ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
        'name': ("name"),
        'value': ("value"),
        'checked': ("checked")
      },hashTypes:{'name': "ID",'value': "ID",'checked': "ID"},hashContexts:{'name': depth0,'value': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options))));
      data.buffer.push("\n     ");
      stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/rchi-item", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n         ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data}
      if (helper = helpers['rhci-hover-text']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['rhci-hover-text']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['rhci-hover-text']) { stack1 = blockHelperMissing.call(depth0, 'rhci-hover-text', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n       ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n           Click to select ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" to Install\n         ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n         ");
      stack1 = helpers['if'].call(depth0, "showMsgToDeselect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(8, program8, data),fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n       ");
      return buffer;
      }
    function program5(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n           ");
      options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}
      if (helper = helpers['rhci-hover-text']) { stack1 = helper.call(depth0, options); }
      else { helper = (depth0 && depth0['rhci-hover-text']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
      if (!helpers['rhci-hover-text']) { stack1 = blockHelperMissing.call(depth0, 'rhci-hover-text', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data}); }
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n         ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n             Click to deselect ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n           ");
      return buffer;
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          <div class='rhci-item-text'>\n            ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          </div>\n         ");
      return buffer;
      }

    function program10(depth0,data) {
      
      
      data.buffer.push("\n         Install\n       ");
      }

    function program12(depth0,data) {
      
      
      data.buffer.push("\n         Do not install\n       ");
      }

      data.buffer.push("\n<img ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'src': ("srcImage")
      },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" class=\"img-responsive\">\n\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":rhci-footer-box")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n       ");
      stack1 = helpers['if'].call(depth0, "showMsgToSelect", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":rhci-footer isChecked:rhci-footer-selected:rhci-footer-unselected")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n     <i ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":fa :fa-5x isChecked:fa-check:fa-remove")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push("></i>\n     <span class='rhci-install-footer'>\n       ");
      stack1 = helpers['if'].call(depth0, "isChecked", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n       ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n     </span>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/rhci-hover-text", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/select-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'content': ("content"),
        'value': ("value"),
        'optionLabelPath': ("optionLabelPath"),
        'optionValuePath': ("optionValuePath"),
        'selection': ("selection"),
        'prompt': ("prompt"),
        'class': ("form-control")
      },hashTypes:{'content': "ID",'value': "ID",'optionLabelPath': "ID",'optionValuePath': "ID",'selection': "ID",'prompt': "ID",'class': "STRING"},hashContexts:{'content': depth0,'value': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'selection': depth0,'prompt': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      }

      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("label"),
        'labelSize': ("labelSize"),
        'inputSize': ("inputSize")
      },hashTypes:{'label': "ID",'labelSize': "ID",'inputSize': "ID"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/select-simple-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression(helpers.view.call(depth0, "Ember.Select", {hash:{
        'content': ("content"),
        'value': ("value"),
        'selection': ("selection"),
        'prompt': ("prompt"),
        'class': ("form-control")
      },hashTypes:{'content': "ID",'value': "ID",'selection': "ID",'prompt': "ID",'class': "STRING"},hashContexts:{'content': depth0,'value': depth0,'selection': depth0,'prompt': depth0,'class': depth0},contexts:[depth0],types:["ID"],data:data})));
      data.buffer.push("\n\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      }

      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("label"),
        'labelSize': ("labelSize"),
        'inputSize': ("inputSize")
      },hashTypes:{'label': "ID",'labelSize': "ID",'inputSize': "ID"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/step-number", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/sub-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("All Deployments");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("New ");
      stack1 = helpers._triageMustache.call(depth0, "nameRHCI", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" Deployment");
      return buffer;
      }

      data.buffer.push("<a class=\"dropdown-toggle\" data-toggle=\"dropdown\">");
      stack1 = helpers._triageMustache.call(depth0, "nameRHCI", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" Installer<span class=\"caret\"></span></a>\n\n<ul class=\"dropdown-menu\">\n  <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n  <li>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhci", options) : helperMissing.call(depth0, "link-to", "rhci", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</li>\n</ul>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/subnet-drop-area", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n  <div class=\"panel-heading\">\n    <h3 class=\"panel-title\"> ");
      stack1 = helpers._triageMustache.call(depth0, "subnet.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <small> - ");
      stack1 = helpers._triageMustache.call(depth0, "subnet.network", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</small></h3>\n  </div>\n  ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      ");
      stack1 = (helper = helpers['draggable-object'] || (depth0 && depth0['draggable-object']),options={hash:{
        'content': ("trafficType")
      },hashTypes:{'content': "ID"},hashContexts:{'content': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "draggable-object", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['traffic-type'] || (depth0 && depth0['traffic-type']),options={hash:{
        'trafficType': ("trafficType")
      },hashTypes:{'trafficType': "ID"},hashContexts:{'trafficType': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "traffic-type", options))));
      data.buffer.push("\n        \n      ");
      return buffer;
      }

    function program6(depth0,data) {
      
      
      data.buffer.push("\n      <div class=\"empty-zone\">&nbsp;</div>\n    ");
      }

      data.buffer.push("<div class=\" ui-droppable\">\n\n  ");
      stack1 = helpers.unless.call(depth0, "hidePanelHeading", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  <div class=\"panel-body subnet-types\">\n    ");
      stack1 = helpers.each.call(depth0, "trafficType", "in", "trafficTypes", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      stack1 = helpers.unless.call(depth0, "hideEmptyZone", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/text-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'class': ("form-control"),
        'value': ("value"),
        'placeholder': ("placeholder")
      },hashTypes:{'class': "STRING",'value': "ID",'placeholder': "ID"},hashContexts:{'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      }

      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("label"),
        'labelSize': ("labelSize"),
        'inputSize': ("inputSize"),
        'help-inline': ("help-inline")
      },hashTypes:{'label': "ID",'labelSize': "ID",'inputSize': "ID",'help-inline': "ID"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0,'help-inline': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/textarea-f", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n\n  \n  ");
      stack1 = helpers['if'].call(depth0, "rowsPassed", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'class': ("form-control"),
        'value': ("value"),
        'placeholder': ("placeholder"),
        'rows': ("numRows")
      },hashTypes:{'class': "STRING",'value': "ID",'placeholder': "ID",'rows': "ID"},hashContexts:{'class': depth0,'value': depth0,'placeholder': depth0,'rows': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n  ");
      return buffer;
      }

    function program4(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers.textarea || (depth0 && depth0.textarea),options={hash:{
        'class': ("form-control"),
        'value': ("value"),
        'placeholder': ("placeholder")
      },hashTypes:{'class': "STRING",'value': "ID",'placeholder': "ID"},hashContexts:{'class': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea", options))));
      data.buffer.push("\n  ");
      return buffer;
      }

      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("label"),
        'labelSize': ("labelSize"),
        'inputSize': ("inputSize"),
        'help-inline': ("help-inline")
      },hashTypes:{'label': "ID",'labelSize': "ID",'inputSize': "ID",'help-inline': "ID"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0,'help-inline': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/tr-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var helper, options;
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("radio")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      }

      data.buffer.push("\n  <td class=\"checkmark\"> ");
      stack1 = helpers.unless.call(depth0, "isChecked", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      stack1 = helpers._triageMustache.call(depth0, "showCheckMark", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n  <td> ");
      stack1 = helpers._triageMustache.call(depth0, "org.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n  <td> ");
      stack1 = helpers._triageMustache.call(depth0, "org.description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/traffic-type", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "trafficType.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/upstream-downstream", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":updown isUpstream:active_upstream:nonactive_upstream")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showUpstream", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-arrow-up\"></i>\n    Upstream\n    </a>\n</div>\n\n<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":updown isUpstream:nonactive_downstream:active_downstream")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showDownstream", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">\n    <i class=\"fa fa-arrow-down\"></i>\n    Downstream\n    </a>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/components/vertical-tab", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<a>");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</a>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/configure-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n            ");
      data.buffer.push(escapeExpression((helper = helpers['env-path-list-item'] || (depth0 && depth0['env-path-list-item']),options={hash:{
        'env': ("env"),
        'selectedEnvironment': ("selectedEnvironment")
      },hashTypes:{'env': "ID",'selectedEnvironment': "ID"},hashContexts:{'env': depth0,'selectedEnvironment': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "env-path-list-item", options))));
      data.buffer.push("\n          ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      ");
      stack1 = helpers.each.call(depth0, "env", "in", "newenvs", {hash:{
        'itemController': ("environment")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      <div class=\"path-selector\">\n        <ul class=\"path-list\">\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\">\n              Library\n            </label>\n          </li>\n          ");
      data.buffer.push(escapeExpression((helper = helpers['env-path-list-item'] || (depth0 && depth0['env-path-list-item']),options={hash:{
        'env': ("env"),
        'selectedEnvironment': ("selectedEnvironment")
      },hashTypes:{'env': "ID",'selectedEnvironment': "ID"},hashContexts:{'env': depth0,'selectedEnvironment': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "env-path-list-item", options))));
      data.buffer.push("\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\" style='color:gray;'>\n              &nbsp;\n            </label>\n          </li>\n        </ul>\n      </div>\n      ");
      return buffer;
      }

    function program6(depth0,data) {
      
      
      data.buffer.push("Back");
      }

    function program8(depth0,data) {
      
      
      data.buffer.push("Next");
      }

    function program10(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-environment", options) : helperMissing.call(depth0, "partial", "new-environment", options))));
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  <div class='col-md-9'>\n\n    <div style='text-align:right;margin-top:15px;'>\n      <button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newEnvironmentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Add Environment</button>\n    </div>\n\n    <div class=\"path-selector\">\n        <ul class=\"path-list\">\n          ");
      stack1 = helpers.each.call(depth0, "env", "in", "environments", {hash:{
        'itemController': ("environment")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\" style='color:gray;'>\n              &nbsp;\n            </label>\n          </li>\n        </ul>\n    </div>\n\n    ");
      stack1 = helpers['if'].call(depth0, "hasNewEnvs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n    <br />\n    <br />\n    <div style='float:right'>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-organization", options) : helperMissing.call(depth0, "link-to", "configure-organization", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-setup", options) : helperMissing.call(depth0, "link-to", "rhev-setup", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n  </div>\n</div>\n\n");
      stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
        'name': ("newEnvironmentModal"),
        'fade': (true),
        'footerButtonsBinding': ("rhciNewEnvButtons"),
        'title': ("Create New Environment")
      },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/configure-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['tr-organization'] || (depth0 && depth0['tr-organization']),options={hash:{
        'org': ("org"),
        'selectedOrganzation': ("selectedOrganzation")
      },hashTypes:{'org': "ID",'selectedOrganzation': "ID"},hashContexts:{'org': depth0,'selectedOrganzation': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "tr-organization", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("Back");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("Next");
      }

    function program7(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-organization", options) : helperMissing.call(depth0, "partial", "new-organization", options))));
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  <div class='col-md-9'>\n    <div style='text-align:right;margin-top:15px;margin-bottom:15px;'>\n     <button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newOrganizationModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Add Organization</button>\n    </div>\n\n    <table class=\"table table-bordered small\">\n      <thead>\n        <tr>\n          <th class=\"col-md-1\"></th>\n          <th class=\"col-md-4\"> Organization Name</th>\n          <th class=\"col-md-4\"> Description </th>\n        </tr>\n      </thead>\n\n      <tbody>\n      ");
      stack1 = helpers.each.call(depth0, "org", "in", "organizations", {hash:{
        'itemController': ("organization")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </tbody>\n    </table>\n\n    <br />\n    <br />\n    <div style='float:right'>\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite", options) : helperMissing.call(depth0, "link-to", "satellite", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-environment", options) : helperMissing.call(depth0, "link-to", "configure-environment", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n  </div>\n</div>\n\n\n");
      stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
        'name': ("newOrganizationModal"),
        'fade': (true),
        'footerButtonsBinding': ("rhciModalButtons"),
        'title': ("Create New Organization")
      },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/configure", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n    ");
      data.buffer.push(escapeExpression((helper = helpers['tr-organization'] || (depth0 && depth0['tr-organization']),options={hash:{
        'org': ("org"),
        'selectedOrganzation': ("selectedOrganzation")
      },hashTypes:{'org': "ID",'selectedOrganzation': "ID"},hashContexts:{'org': depth0,'selectedOrganzation': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "tr-organization", options))));
      data.buffer.push("\n  ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n            ");
      data.buffer.push(escapeExpression((helper = helpers['env-path-list-item'] || (depth0 && depth0['env-path-list-item']),options={hash:{
        'env': ("env"),
        'selectedEnvironment': ("selectedEnvironment")
      },hashTypes:{'env': "ID",'selectedEnvironment': "ID"},hashContexts:{'env': depth0,'selectedEnvironment': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "env-path-list-item", options))));
      data.buffer.push("\n          ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n      ");
      stack1 = helpers.each.call(depth0, "env", "in", "newenvs", {hash:{
        'itemController': ("environment")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n      <div class=\"path-selector\">\n        <ul class=\"path-list\">\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\" style='color:gray;'>\n              Library\n            </label>\n          </li>\n          ");
      data.buffer.push(escapeExpression((helper = helpers['env-path-list-item'] || (depth0 && depth0['env-path-list-item']),options={hash:{
        'env': ("env"),
        'selectedEnvironment': ("selectedEnvironment")
      },hashTypes:{'env': "ID",'selectedEnvironment': "ID"},hashContexts:{'env': depth0,'selectedEnvironment': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "env-path-list-item", options))));
      data.buffer.push("\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\" style='color:gray;'>\n              &nbsp;\n            </label>\n          </li>\n        </ul>\n      </div>\n      ");
      return buffer;
      }

    function program8(depth0,data) {
      
      
      data.buffer.push("Back");
      }

    function program10(depth0,data) {
      
      
      data.buffer.push("Next");
      }

    function program12(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-organization", options) : helperMissing.call(depth0, "partial", "new-organization", options))));
      data.buffer.push("\n");
      return buffer;
      }

    function program14(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-environment", options) : helperMissing.call(depth0, "partial", "new-environment", options))));
      data.buffer.push("\n");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  <div class='col-md-9'>\n        <form class=\"form form-horizontal\">\n\n<h4 style='text-align:right;'>\n <button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newOrganizationModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Add Organization</button>\n</h4>\n\n<table class=\"table table-bordered small\">\n  <thead>\n    <tr>\n      <th class=\"col-md-1\"></th>\n      <th class=\"col-md-4\"> Organization Name</th>\n      <th class=\"col-md-4\"> Description </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "org", "in", "organizations", {hash:{
        'itemController': ("organization")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n        <br />\n        <br />\n<div class='col-md-offset-0 col-md-5'>\n  <strong>Lifecycle Environment</strong>\n</div>\n <div style='text-align:right;'>\n <button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newEnvironmentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Add Environment</button>\n </div>\n\n    <div class=\"path-selector\">\n        <ul class=\"path-list\">\n          <li class=\"path-list-item\">\n          </li>\n          ");
      stack1 = helpers.each.call(depth0, "env", "in", "environments", {hash:{
        'itemController': ("environment")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          <li class=\"path-list-item\">\n            <label class=\"path-list-item-label\" style='color:gray;'>\n              &nbsp;\n            </label>\n          </li>\n        </ul>\n    </div>\n\n    ");
      stack1 = helpers['if'].call(depth0, "hasNewEnvs", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n         <br />\n         <br />\n          <div style='float:right'>\n              ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite", options) : helperMissing.call(depth0, "link-to", "satellite", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n              ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite.subscriptions", options) : helperMissing.call(depth0, "link-to", "satellite.subscriptions", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          </div>\n\n        </form>\n  </div>\n\n\n</div>\n\n\n");
      stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
        'name': ("newOrganizationModal"),
        'fade': (true),
        'footerButtonsBinding': ("rhciModalButtons"),
        'title': ("Create New Organization")
      },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(12, program12, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<!-- if use RENDER here, I get binding in new-environment controller -->\n");
      stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
        'name': ("newEnvironmentModal"),
        'fade': (true),
        'footerButtonsBinding': ("rhciNewEnvButtons"),
        'title': ("Create New Environment")
      },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(14, program14, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/content-source-upstream", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Next");
      }

      data.buffer.push("<h1>No subscriptiosn for upstream</h1>\n\n<p>\n  There are no subscriptions for upstream.\n</p>\n\n<p>\n  Do we need to define the source(s) of the content?\n</p>\n\n\n\n<div style='text-align:right'>\n  <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancel-modal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" class='btn btn-default'>Cancel</button>\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary"),
        'disabled': ("disableTabInstallation")
      },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.installation", options) : helperMissing.call(depth0, "link-to", "review.installation", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/deployment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push(escapeExpression((helper = helpers['step-number'] || (depth0 && depth0['step-number']),options={hash:{
        'value': (1)
      },hashTypes:{'value': "INTEGER"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "step-number", options))));
      stack1 = helpers._triageMustache.call(depth0, "nameSatellite", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev", options) : helperMissing.call(depth0, "link-to", "rhev", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push(escapeExpression((helper = helpers['step-number'] || (depth0 && depth0['step-number']),options={hash:{
        'value': ("stepNumberRhev")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "step-number", options))));
      stack1 = helpers._triageMustache.call(depth0, "nameRhev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "openstack", options) : helperMissing.call(depth0, "link-to", "openstack", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program7(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push(escapeExpression((helper = helpers['step-number'] || (depth0 && depth0['step-number']),options={hash:{
        'value': ("stepNumberOpenstack")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "step-number", options))));
      stack1 = helpers._triageMustache.call(depth0, "nameOpenStack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

    function program9(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cloudforms", options) : helperMissing.call(depth0, "link-to", "cloudforms", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      return buffer;
      }
    function program10(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push(escapeExpression((helper = helpers['step-number'] || (depth0 && depth0['step-number']),options={hash:{
        'value': ("stepNumberCloudForms")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "step-number", options))));
      stack1 = helpers._triageMustache.call(depth0, "nameCloudForms", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      }

    function program12(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push(escapeExpression((helper = helpers['step-number'] || (depth0 && depth0['step-number']),options={hash:{
        'value': ("stepNumberReview")
      },hashTypes:{'value': "ID"},hashContexts:{'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "step-number", options))));
      data.buffer.push("Review");
      return buffer;
      }

      data.buffer.push("<br />\n<h1>New ");
      stack1 = helpers._triageMustache.call(depth0, "nameRHCI", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" Deployment: ");
      stack1 = helpers._triageMustache.call(depth0, "deploymentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</h1>\n\n<ul class=\"wizard\">\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite", options) : helperMissing.call(depth0, "link-to", "satellite", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "isRhev", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "isOpenStack", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = helpers['if'].call(depth0, "isCloudForms", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li"),
        'disabled': ("disableReview")
      },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review", options) : helperMissing.call(depth0, "link-to", "review", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</ul>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/deployment/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("deployment index");
      
    });
  });
define("fusor-ember-cli/templates/deployment/new", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<br />\n<h1>New Custom Deployment</h1>\n\n<br />\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/deployment/review", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<h3>Review Content Sync started in Step 1</h3>\n\n<br />\n\n");
      data.buffer.push(escapeExpression((helper = helpers.render || (depth0 && depth0.render),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "products", options) : helperMissing.call(depth0, "render", "products", options))));
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/deployment/satellite/configure/new-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("app/templates/deployment/satellite/configure/new-organization.hbs");
      
    });
  });
define("fusor-ember-cli/templates/deployments", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("New Deployment");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <tr>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "environment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "organization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      data.buffer.push("<br />\n<h1>Deployments <span style='float:right;'>");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-success")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhci", options) : helperMissing.call(depth0, "link-to", "rhci", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</span>\n</h1>\n\n<br />\n\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> Name </th>\n      <th> Environment </th>\n      <th> Organization </th>\n    </tr>\n    </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "controller.model", {hash:{
        'itemController': ("deployment")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/devonly", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      <div class=\"alert alert-danger\" role=\"alert\">\n        You are already logged in and shouldn't be here.<br />\n        You can\n        <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">logout</a>\n        or go to ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhci", options) : helperMissing.call(depth0, "link-to", "rhci", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n    ");
      return buffer;
      }
    function program2(depth0,data) {
      
      
      data.buffer.push("new deployment");
      }

    function program4(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n      or Login using credentials from\n      <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticateSession", "facebook", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Facebook</a>\n      |\n      <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticateSession", "google", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Google</a>\n      |\n      <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticateSession", "github", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(">Github</a>\n      |\n    ");
      return buffer;
      }

      data.buffer.push("<div class=\"row\">\n  <div class=\"col-md-7 col col-md-offset-2\">\n    ");
      stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/engine", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n          <a>Discovered Hosts</a>\n        ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n          <a>New VM</a>\n        ");
      }

      data.buffer.push("<div class=\"row\">\n  </div class='col-md-12'>\n\n    <h4 style='padding-left:15px;'>Select Target Machine to Install Engine</h4>\n\n    <ul class=\"nav nav-tabs col-md-12\" data-tabs=\"pills\">\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.discovered-host", options) : helperMissing.call(depth0, "link-to", "engine.discovered-host", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.new-host", options) : helperMissing.call(depth0, "link-to", "engine.new-host", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </ul>\n    <div class=\"col-md-12\">\n          ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/engine/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <tr>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("isSelectedAsEngine"),
        'checked': ("host.isSelectedAsEngine")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.mac", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.vendor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.cpu", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.memory", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      data.buffer.push("\n\n<!-- NOTE: This will assign the <strong>Self Hosted Engine</strong> hostgroup to the selected hosts.\n -->\n<strong>");
      stack1 = helpers._triageMustache.call(depth0, "avialableHosts.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong> hosts found\n");
      data.buffer.push(escapeExpression((helper = helpers['bs-button'] || (depth0 && depth0['bs-button']),options={hash:{
        'title': ("Refresh Discovered Hosts"),
        'type': ("default")
      },hashTypes:{'title': "STRING",'type': "STRING"},hashContexts:{'title': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-button", options))));
      data.buffer.push("\n<br />\n<br />\n<strong>");
      stack1 = helpers._triageMustache.call(depth0, "cntSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong> ");
      stack1 = helpers._triageMustache.call(depth0, "hostInflection", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" selected\n<br />\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'checked': ("allChecked")
      },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n      <th> MAC </th>\n      <th> Vendor </th>\n      <th> CPU </th>\n      <th> Memory </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "host", "in", "avialableHosts", {hash:{
        'itemController': ("host")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/engine/existing-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor/existing-host", options) : helperMissing.call(depth0, "partial", "hypervisor/existing-host", options))));
      
    });
  });
define("fusor-ember-cli/templates/engine/hypervisor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <tr>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'checked': ("isChecked")
      },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "mac", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "vendor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "cpu", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "memory", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      data.buffer.push("<strong>Select from the hypervisors selected in previous step</strong>\n\n<br />\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n      <th> MAC </th>\n      <th> Vendor </th>\n      <th> CPU </th>\n      <th> Memory </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "controller.model", {hash:{
        'itemController': ("host")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n<div style='float:right;padding:25px 0px;'>\n  <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "goNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='btn btn-primary btn-sm'>Next</button>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/engine/new-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor/new-host", options) : helperMissing.call(depth0, "partial", "hypervisor/new-host", options))));
      
    });
  });
define("fusor-ember-cli/templates/hostgroup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hostgroup/edit", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hostgroups", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n          <th>Subnet</th>\n          <th>Domain</th>\n          <th></th>\n          ");
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n        <tr>\n          <td style='word-wrap:break-word;' width='100'>\n            ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hostgroup.edit", "", options) : helperMissing.call(depth0, "link-to", "hostgroup.edit", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          </td>\n          ");
      stack1 = helpers.unless.call(depth0, "onShowPage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        </tr>\n      ");
      return buffer;
      }
    function program4(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n             ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            ");
      return buffer;
      }

    function program6(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          <td>  </td>\n          <td>  </td>\n          <td> ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "hostgroup.edit", "", options) : helperMissing.call(depth0, "link-to", "hostgroup.edit", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</td>\n          ");
      return buffer;
      }
    function program7(depth0,data) {
      
      
      data.buffer.push("Edit");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("\n        <li>No hostgroups found.</li>\n      ");
      }

      data.buffer.push("    <table class=\"table table-bordered\" style='table-layout:fixed;'>\n      <thead>\n        <tr>\n          <th>Title</th>\n          ");
      stack1 = helpers.unless.call(depth0, "onShowPage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        </tr>\n        </thead>\n\n      <tbody>\n      ");
      stack1 = helpers.each.call(depth0, {hash:{
        'itemController': ("hostgroup")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.program(9, program9, data),fn:self.program(3, program3, data),contexts:[],types:[],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </tbody>\n    </table>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hypervisor", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      data.buffer.push("<div class=\"row\">\n  </div class='col-md-12'>\n\n   <h4 style='padding-left:15px;'>Select Target Machines for ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev.hypervisorTabName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(":</h4>\n\n   <br />\n    <div class=\"col-md-12\">\n          ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hypervisor/discovered-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <tr>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("isSelectedAsHypervisor"),
        'checked': ("host.isSelectedAsHypervisor")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.vendor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.cpu", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "host.memory", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      data.buffer.push("<!-- NOTE: This will assign the <strong>Self Hosted Engine</strong> hostgroup to the selected hosts.\n -->\n TODO - LIMIT SELCTION TO ONE ONLY<BR />\n\n<strong>");
      stack1 = helpers._triageMustache.call(depth0, "model.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong> hosts found\n");
      data.buffer.push(escapeExpression((helper = helpers['bs-button'] || (depth0 && depth0['bs-button']),options={hash:{
        'title': ("Refresh Discovered Hosts"),
        'type': ("default")
      },hashTypes:{'title': "STRING",'type': "STRING"},hashContexts:{'title': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-button", options))));
      data.buffer.push("\n<br />\n<br />\n<strong>");
      stack1 = helpers._triageMustache.call(depth0, "cntSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</strong> ");
      stack1 = helpers._triageMustache.call(depth0, "hostInflection", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" selected\n<br />\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'checked': ("allChecked")
      },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n      <th> FQDN </th>\n      <th> Vendor </th>\n      <th> CPU </th>\n      <th> Memory </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "host", "in", "controller.model", {hash:{
        'itemController': ("host")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hypervisor/existing-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <tr>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'checked': ("isChecked")
      },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "hostgroup", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "environment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "operatingsystem", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      data.buffer.push("<!-- NOTE: This will assign the <strong>RHEV Host</strong> hostgroup to the selected hosts. -->\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n      <th> Name </th>\n      <th> Host group </th>\n      <th> Environment </th>\n      <th> OS </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "controller.model", {hash:{
        'itemController': ("host")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n<div style='float:right;padding:25px 0px;'>\n  <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "goNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='btn btn-primary btn-sm'>Next</button>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hypervisor/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '';


      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/hypervisor/new-host", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<form class=\"form form-horizontal\">\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Name"),
        'value': ("name")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Organization"),
        'content': ("organizations"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'value': ("selectedOrganization.id"),
        'selection': ("selectedOrganization")
      },hashTypes:{'label': "STRING",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'selection': "ID"},hashContexts:{'label': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'selection': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Location"),
        'content': ("locations"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'value': ("selectedLocation.id"),
        'selection': ("selectedLocation")
      },hashTypes:{'label': "STRING",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'selection': "ID"},hashContexts:{'label': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'selection': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Hostgroup"),
        'content': ("hostgroups"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'value': ("selectedHostgroup.id"),
        'selection': ("selectedHostgroup"),
        'prompt': ("Select Host group")
      },hashTypes:{'label': "STRING",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'selection': "ID",'prompt': "STRING"},hashContexts:{'label': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'selection': depth0,'prompt': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Environment"),
        'content': ("environments"),
        'optionLabelPath': ("content.name"),
        'optionValuePath': ("content.id"),
        'value': ("selectedEnvironment.id"),
        'selection': ("selectedEnvironment"),
        'prompt': ("Select Environment")
      },hashTypes:{'label': "STRING",'content': "ID",'optionLabelPath': "STRING",'optionValuePath': "STRING",'value': "ID",'selection': "ID",'prompt': "STRING"},hashContexts:{'label': depth0,'content': depth0,'optionLabelPath': depth0,'optionValuePath': depth0,'value': depth0,'selection': depth0,'prompt': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Deploy on"),
        'content': ("null"),
        'prompt': ("Select Compute Resource")
      },hashTypes:{'label': "STRING",'content': "ID",'prompt': "STRING"},hashContexts:{'label': depth0,'content': depth0,'prompt': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Subnet"),
        'content': ("null"),
        'prompt': ("Select Subnet")
      },hashTypes:{'label': "STRING",'content': "ID",'prompt': "STRING"},hashContexts:{'label': depth0,'content': depth0,'prompt': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['select-f'] || (depth0 && depth0['select-f']),options={hash:{
        'label': ("Domain"),
        'content': ("null"),
        'prompt': ("Select Domain")
      },hashTypes:{'label': "STRING",'content': "ID",'prompt': "STRING"},hashContexts:{'label': depth0,'content': depth0,'prompt': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "select-f", options))));
      data.buffer.push("\n\n  ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("MAC address"),
        'value': ("mac")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n  <div class='col-md-offset-1' style='padding-top:15px;'>\n    NOTE: THIS IS FOR DEMO PURPOSES AND IS NOT THE FULL NEW HOST FORM\n  </div>\n\n</form>\n\n\n<div style='float:right;padding:25px 0px;'>\n  <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "goNext", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='btn btn-primary btn-sm'>Next</button>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Login");
      }

      data.buffer.push("index template\n<br />\n<br />\n");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "login", options) : helperMissing.call(depth0, "link-to", "login", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n<br />\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/loading", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<h2>\nLoading ....\n</h2>");
      
    });
  });
define("fusor-ember-cli/templates/loggedin", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<h1>ALREADY LOGGED IN</h1>\n");
      
    });
  });
define("fusor-ember-cli/templates/login", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <div class=\"alert alert-danger col-md-offset-2\" role=\"alert\">\n          <p>\n            <strong>Login failed:</strong> <code>");
      stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</code>\n          </p>\n        </div>\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n          ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("authType"),
        'value': ("Basic"),
        'label': ("Basic Authorization")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n          ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("authType"),
        'value': ("oAuth"),
        'label': ("oAuth Token")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

      data.buffer.push("<br />\n<br />\n<br />\n<br />\n<div class=\"login-page222\" >\n\n<div id=\"login\" class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <div id=\"brand\">\n        <!-- <img alt=\"Foreman_white\" src=\"assets/foreman_white.png\" /> -->\n      </div><!--/#brand-->\n    </div>\n    <div class=\"col-sm-7 col-md-6 col-lg-5 login\">\n\n     ");
      stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      <form accept-charset=\"UTF-8\" action=\"/users/login\" class=\"form-horizontal\" id=\"login-form\" method=\"post\"><div style=\"margin:0;padding:0;display:inline\"><input name=\"utf8\" type=\"hidden\" value=\"&#x2713;\" /><input name=\"authenticity_token\" type=\"hidden\" value=\"1f770GegsrWb4ZJIC0UkSEkvBVG9MnRJ7jypTsrjeLU=\" /></div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-2 control-label\" for=\"login_login\">Username</label>\n            <div class=\"col-sm-10\">\n              ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("identification"),
        'size': ("30"),
        'class': ("form-control")
      },hashTypes:{'type': "STRING",'value': "ID",'size': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'size': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-2 control-label\" for=\"login_password\">Password</label>\n            <div class=\"col-sm-10\">\n              ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("password"),
        'value': ("password"),
        'size': ("30"),
        'class': ("form-control")
      },hashTypes:{'type': "STRING",'value': "ID",'size': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'size': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("\n            </div>\n          </div>\n\n      <h3>\n      </h3>\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': (""),
        'labelSize': ("col-md-2"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n          <div class=\"form-group\">\n            <div class=\"col-xs-offset-8 col-xs-4 submit\">\n              <button class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticate", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" >Login</button>\n            </div>\n          </div>\n\n          ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "devonly", options) : helperMissing.call(depth0, "partial", "devonly", options))));
      data.buffer.push("\n      </form>\n    </div>\n    <div class=\"col-sm-5 col-md-6 col-lg-7 details\">\n<!--       <p><strong>Welcome to Foreman</strong>\n      <p>Version 1.7.0-develop</p>\n -->    </div><!--/.col-*-->\n  </div>\n</div>\n  </div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/logout-modal", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n  Are you sure you want to logout?\n");
      }

      stack1 = (helper = helpers['modal-confirm'] || (depth0 && depth0['modal-confirm']),options={hash:{
        'title': ("Logout"),
        'ok': ("logout"),
        'close': ("removeModal")
      },hashTypes:{'title': "STRING",'ok': "STRING",'close': "STRING"},hashContexts:{'title': depth0,'ok': depth0,'close': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "modal-confirm", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      
    });
  });
define("fusor-ember-cli/templates/mainmenu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing;


      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":navbar :navbar-default :navbar-inner :navbar-fixed-top :persist-header isUpstream:navbar-inner-upstream")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" style=\"position: static; top: 0px;\">\n\n  <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-menu\">\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n    <span class=\"icon-bar\"></span>\n  </button>\n  <button type=\"button\" class=\"navbar-toggle\" data-toggle=\"collapse\" data-target=\".navbar-admin\">\n    <span class=\"glyphicon glyphicon-cog\"></span>\n  </button>\n\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isUpstream:container:container-fluid")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    <!-- menu -->\n    <ul class=\"nav navbar-nav navbar-menu navbar-collapse collapse\" id=\"menu\">\n      <li class=\"dropdown org-switcher menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">Any Context<span class=\"caret\"></span></a>\n\n        <ul class=\"dropdown-menu\">\n          <li class=\"nav-header\">Organization</li>\n          <li class=\"dropdown-submenu org-menu\">\n            <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\">Any Organization</a>\n            <ul class=\"dropdown-menu org-submenu\" style=\"display: none;\">\n                <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_organizations_clear\">Any Organization</a></li>\n                <li class=\"divider\"></li>\n            </ul>\n          </li>\n          <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"manage-menu\" data-id=\"aid_organizations\">Manage Organizations</a></li>\n              <li class=\"divider\"></li>\n            <li class=\"nav-header\">Location</li>\n          <li><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class=\"manage-menu\" data-id=\"aid_locations\">Manage Locations</a></li>\n        </ul>\n      </li>\n\n      <li class=\"dropdown menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\" id=\"monitor_menu\">Monitor<span class=\"caret\"></span></a>\n        <ul class=\"dropdown-menu\">\n              <li class=\"menu_tab_dashboard_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_dashboard\" id=\"menu_item_dashboard\">Dashboard</a></li>\n              <li class=\"menu_tab_/reports_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_reports\" id=\"menu_item_reports\">Reports</a></li>\n              <li class=\"menu_tab_fact_values_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" id=\"menu_item_fact_values\">Facts</a></li>\n              <li class=\"menu_tab_statistics_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" id=\"menu_item_statistics\">Statistics</a></li>\n              <li class=\"menu_tab_trends_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_trends\" id=\"menu_item_trends\">Trends</a></li>\n              <li class=\"menu_tab_audits_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_audits\" id=\"menu_item_audits\">Audits</a></li>\n        </ul>\n      </li>\n\n\n      <li class=\"dropdown menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\" id=\"hosts_menu\">Hosts<span class=\"caret\"></span></a>\n        <ul class=\"dropdown-menu\">\n                <li class=\"menu_tab_hosts_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_hosts\" id=\"menu_item_hosts\">All hosts</a></li>\n                <li class=\"menu_tab_/hosts_new\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_hosts_new\" id=\"menu_item_newhost\">New host</a></li>\n              <li class=\"divider\"></li>\n              <li class=\"nav-header\">Provisioning Setup</li>\n                <li class=\"menu_tab_operatingsystems_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_operatingsystems\" id=\"menu_item_operatingsystems\">Operating systems</a></li>\n                <li class=\"menu_tab_config_templates_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_config_templates\" id=\"menu_item_config_templates\">Provisioning templates</a></li>\n                <li class=\"menu_tab_ptables_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_ptables\" id=\"menu_item_ptables\">Partition tables</a></li>\n                <li class=\"menu_tab_media_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_media\" id=\"menu_item_media\">Installation media</a></li>\n                <li class=\"menu_tab_models_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_models\" id=\"menu_item_models\">Hardware models</a></li>\n                <li class=\"menu_tab_architectures_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_architectures\" id=\"menu_item_architectures\">Architectures</a></li>\n        </ul>\n      </li>\n\n      <li class=\"dropdown menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\" id=\"configure_menu\">Configure<span class=\"caret\"></span></a>\n        <ul class=\"dropdown-menu\">\n                <li class=\"menu_tab_common_parameters_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_common_parameters\" id=\"menu_item_common_parameters\">Host groups</a></li>\n                <li class=\"menu_tab_common_parameters_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_common_parameters\" id=\"menu_item_common_parameters\">Global parameters</a></li>\n                <li class=\"divider\"></li>\n                <li class=\"nav-header\">Puppet</li>\n                <li class=\"menu_tab_environments_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_environments\" id=\"menu_item_environments\">Environments</a></li>\n                <li class=\"menu_tab_puppetclasses_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_puppetclasses\" id=\"menu_item_puppetclasses\">Puppet classes</a></li>\n                <li class=\"menu_tab_config_groups_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_config_groups\" id=\"menu_item_config_groups\">Config groups</a></li>\n                <li class=\"menu_tab_lookup_keys_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_lookup_keys\" id=\"menu_item_lookup_keys\">Smart variables</a></li>\n        </ul>\n      </li>\n\n      <li class=\"dropdown menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\" id=\"infrastructure_menu\">Infrastructure<span class=\"caret\"></span></a>\n        <ul class=\"dropdown-menu\">\n                <li class=\"menu_tab_smart_proxies_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push("data-id=\"aid_smart_proxies\" id=\"menu_item_smart_proxies\">Smart proxies</a></li>\n                <li class=\"menu_tab_compute_resources_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_compute_resources\" id=\"menu_item_compute_resources\">Compute resources</a></li>\n                <li class=\"menu_tab_compute_profiles_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_compute_profiles\" id=\"menu_item_compute_profiles\">Compute profiles</a></li>\n                <li class=\"menu_tab_compute_profiles_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_compute_profiles\" id=\"menu_item_compute_profiles\">Subnets</a></li>\n                <li class=\"menu_tab_compute_profiles_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_compute_profiles\" id=\"menu_item_compute_profiles\">Domains</a></li>\n                <li class=\"menu_tab_domains_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_domains\" id=\"menu_item_domains\">Domains</a></li>\n                <li class=\"menu_tab_realms_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_realms\" id=\"menu_item_realms\">Realms</a></li>\n        </ul>\n      </li>\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['sub-menu'] || (depth0 && depth0['sub-menu']),options={hash:{
        'nameRHCI': ("nameRHCI")
      },hashTypes:{'nameRHCI': "ID"},hashContexts:{'nameRHCI': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "sub-menu", options))));
      data.buffer.push("\n    </ul>\n\n    <ul class=\"nav navbar-nav navbar-admin navbar-right navbar-collapse collapse\" id=\"menu2\">\n      <li class=\"dropdown menu_tab_dropdown\">\n        <a href=\"#\" class=\"dropdown-toggle\" data-id=\"aid_not_defined\" data-toggle=\"dropdown\" id=\"administer_menu\">Administer<span class=\"caret\"></span></a>\n        <ul class=\"dropdown-menu\">\n          <li class=\"menu_tab_locations_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_locations\" id=\"menu_item_locations\">Locations</a></li>\n          <li class=\"menu_tab_organizations_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_organizations\" id=\"menu_item_organizations\">Organizations</a></li>\n          <li class=\"divider\"></li>\n\n          <li class=\"menu_tab_auth_source_ldaps_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_auth_source_ldaps\" id=\"menu_item_auth_source_ldaps\">LDAP authentication</a></li>\n          <li class=\"menu_tab_users_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_users\" id=\"menu_item_users\">Users</a></li>\n          <li class=\"menu_tab_usergroups_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_usergroups\" id=\"menu_item_usergroups\">User groups</a></li>\n          <li class=\"menu_tab_roles_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_roles\" id=\"menu_item_roles\">Roles</a></li>\n          <li class=\"divider\"></li>\n\n          <li class=\"menu_tab_bookmarks_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_bookmarks\" id=\"menu_item_bookmarks\">Bookmarks</a></li>\n          <li class=\"menu_tab_settings_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_settings\" id=\"menu_item_settings\">Settings</a></li>\n          <li class=\"menu_tab_about_index\"><a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" data-id=\"aid_about\" id=\"menu_item_about_index\">About</a></li>\n        </ul>\n      </li>\n\n    </ul>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/networking", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<h4>Networking Configuration</h4>\n\n<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("DNS name"),
        'value': ("dnsName")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n    </form>\n  </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/new-environment", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<form class=\"form form-horizontal\">\n  ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Name"),
        'value': ("fields_env.name"),
        'labelSize': ("col-md-4"),
        'inputSize': ("col-md-8")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Label"),
        'value': ("envLabelName"),
        'labelSize': ("col-md-4"),
        'inputSize': ("col-md-8")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
        'label': ("Description"),
        'value': ("fields_env.description"),
        'labelSize': ("col-md-4"),
        'inputSize': ("col-md-8")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
      data.buffer.push("\n</form>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/new-organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<form class=\"form form-horizontal\">\n  ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Name"),
        'value': ("defaultOrgName"),
        'labelSize': ("col-md-4"),
        'inputSize': ("col-md-8")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
        'label': ("Description"),
        'value': ("fields_org.description"),
        'labelSize': ("col-md-4"),
        'inputSize': ("col-md-8")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
      data.buffer.push("\n</form>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/nodes", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("adfasdf");
      
    });
  });
define("fusor-ember-cli/templates/openstack", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n        <a>Settings</a>\n      ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n        <a>Network Configuration</a>\n      ");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("\n        <a>Services Overview</a>\n      ");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("\n        <a>Services Configuration</a>\n      ");
      }

      data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-network", options) : helperMissing.call(depth0, "link-to", "osp-network", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-overview", options) : helperMissing.call(depth0, "link-to", "osp-overview", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/openstack/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/osp-configuration", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("tenantType"),
        'value': ("vxlan"),
        'label': ("VXLAN Segmentation")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("tenantType"),
        'value': ("gre"),
        'label': ("GRE Segmentation")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("tenantType"),
        'value': ("vlan"),
        'label': ("VLAN Segmentation")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("tenantType"),
        'value': ("flat"),
        'label': ("Flat")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("corePlugin"),
        'value': ("ml2"),
        'label': ("ML2 Core Plugin")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        <div style='margin-left:20px'>\n          <span style='font-size:90%'>ML2 Mechanism Drivers</span>\n          <br />\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push(" Open vSwitch\n          <br />\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push(" L2 Population\n          <br />\n          ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox")
      },hashTypes:{'type': "STRING"},hashContexts:{'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push(" Cisco Nexus\n        </div>\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("corePlugin"),
        'value': ("n1kv"),
        'label': ("N1KV Core Plugin")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("glanceBackend"),
        'value': ("local"),
        'label': ("Local File")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("glanceBackend"),
        'value': ("ceph"),
        'label': ("Ceph")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("cinderBackend"),
        'value': ("NFS"),
        'label': ("NFS")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("cinderBackend"),
        'value': ("LVM"),
        'label': ("LVM")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("cinderBackend"),
        'value': ("Ceph"),
        'label': ("Ceph")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("cinderBackend"),
        'value': ("EqualLogic"),
        'label': ("EqualLogic")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

      data.buffer.push("\n<form class=\"form-horizontal\" role=\"form\">\n\n  <div class='row'>\n    <div class='col-md-12'>\n\n      <h3>Neutron Service Configuration</h3>\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Tenant Network Type *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Core Plugin Type *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n      <h3>Glance Service Configuration</h3>\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Choose Driver Backend *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    <h3>Cinder Service Configuration</h3>\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Choose Driver Backend *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/osp-network", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['subnet-drop-area'] || (depth0 && depth0['subnet-drop-area']),options={hash:{
        'trafficTypes': ("unusedTrafficTypes"),
        'hidePanelHeading': (true),
        'hideEmptyZone': (true)
      },hashTypes:{'trafficTypes': "ID",'hidePanelHeading': "BOOLEAN",'hideEmptyZone': "BOOLEAN"},hashContexts:{'trafficTypes': depth0,'hidePanelHeading': depth0,'hideEmptyZone': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "subnet-drop-area", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("New Subnet");
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      \n      ");
      stack1 = (helper = helpers['draggable-object-target'] || (depth0 && depth0['draggable-object-target']),options={hash:{
        'action': ("assignTrafficTypeToSubnet"),
        'subnet': ("subnet")
      },hashTypes:{'action': "STRING",'subnet': "ID"},hashContexts:{'action': depth0,'subnet': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "draggable-object-target", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    ");
      return buffer;
      }
    function program6(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['subnet-drop-area'] || (depth0 && depth0['subnet-drop-area']),options={hash:{
        'subnet': ("subnet"),
        'trafficTypes': ("subnet.trafficTypes")
      },hashTypes:{'subnet': "ID",'trafficTypes': "ID"},hashContexts:{'subnet': depth0,'trafficTypes': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "subnet-drop-area", options))));
      data.buffer.push(" <br />\n      ");
      return buffer;
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <h4>Available Network Traffic Types</h4>\n    <br />\n      \n      ");
      stack1 = (helper = helpers['draggable-object-target'] || (depth0 && depth0['draggable-object-target']),options={hash:{
        'action': ("removeTrafficTypeFromSubnet")
      },hashTypes:{'action': "STRING"},hashContexts:{'action': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "draggable-object-target", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    <br />\n    <div class='pull-right'>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-success")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "", options) : helperMissing.call(depth0, "link-to", "", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n    <br />\n    <br />\n\n    <br />\n    <h4>Subnets</h4>\n    ");
      stack1 = helpers.each.call(depth0, "subnet", "in", "model", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n    <br />\n    <br />\n\n\n\n\n    </form>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/osp-overview", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("    <h3>Deployment Roles &amp; Available Services</h3>\n    <h4>Controller / Compute - Neutron Networking</h4>\n\n    <!--Neutron Non-HA-->\n<div class=\"clearfix\">\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Controller</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>Horizon</li>\n        <li>Keystone</li>\n        <li>Glance</li>\n        <li>Cinder</li>\n        <li>Nova</li>\n        <li>Neutron Server</li>\n        <li>Database</li>\n        <li>Messaging</li>\n        <li>Heat</li>\n        <li>Ceilometer</li>\n      </ul>\n     </div>\n  </div>\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Compute</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>Nova-Compute</li>\n        <li>Open vSwitch Agent</li>\n        <li>Ceilometer Agent</li>\n      </ul>\n     </div>\n  </div>\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Neutron Network Node</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>L3 Agent</li>\n        <li>Open vSwitch Agent</li>\n        <li>DHCP Agent</li>\n        <li>Metadata Agent</li>\n      </ul>\n     </div>\n  </div>\n</div>\n\n\n\n");
      
    });
  });
define("fusor-ember-cli/templates/osp-settings", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("ha"),
        'value': ("compute"),
        'label': ("Controller / Compute")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("ha"),
        'value': ("high_availability"),
        'label': ("High Availability Controllers / Compute")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("networking"),
        'value': ("neutron"),
        'label': ("Neutron Networking")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("networking"),
        'value': ("nova"),
        'label': ("Nova Network")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program5(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("messaging"),
        'value': ("rabbitmq"),
        'label': ("RabbitMQ")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("messaging"),
        'value': ("qpid"),
        'label': ("Qpid")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("platform"),
        'value': ("rhel7"),
        'label': ("Red Hat Enterprise Linux OpenStack Platform 5 with RHEL 7")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

    function program9(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("password"),
        'value': ("random"),
        'label': ("Generate random password for each service")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("password"),
        'value': ("single"),
        'label': ("Use single password for all services")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("\n      ");
      return buffer;
      }

      data.buffer.push("<br />\n<form class=\"form-horizontal\" role=\"form\">\n\n  <div class='row'>\n    <div class='col-md-12'>\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("High Availability *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Networking *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Messaging Provider *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Platform *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Service Password *"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-9")
      },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
        'label': ("Custom repos"),
        'value': ("customRepos"),
        'labelSize': ("col-md-3"),
        'inputSize': ("col-md-5"),
        'rows': (5),
        'help-inline': ("If you need to add custom repositories on provisioned hosts you can specify base urls here, one per line. These repositories will have highest priority (50)")
      },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING",'rows': "INTEGER",'help-inline': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0,'rows': depth0,'help-inline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
      data.buffer.push("\n\n    </div>\n  </div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/products", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  Syncronizing content (");
      stack1 = helpers._triageMustache.call(depth0, "prog", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("% complete)\n  ");
      data.buffer.push(escapeExpression((helper = helpers['bs-progress'] || (depth0 && depth0['bs-progress']),options={hash:{
        'progressBinding': ("prog"),
        'type': ("success"),
        'stripped': (true),
        'animated': (true)
      },hashTypes:{'progressBinding': "STRING",'type': "STRING",'stripped': "BOOLEAN",'animated': "BOOLEAN"},hashContexts:{'progressBinding': depth0,'type': depth0,'stripped': depth0,'animated': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-progress", options))));
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n  <div class='alert alert-success'>\n   Yeah! You successfully synced content!\n  </div>\n");
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n    <tr>\n      <td> + </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "start_time", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "duration", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "size", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "result", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "syncingInProgress", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "showSuccessMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n\n\n\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> </th>\n      <th> Product </th>\n      <th> Start Time </th>\n      <th> Duration </th>\n      <th> Size </th>\n      <th> Result </th>\n    </tr>\n    </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "controller.model", {hash:{
        'itemController': ("satellite/product")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n<br />\n<button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'disabled': ("disableSyncButton")
      },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "syncProducts", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Sync Products</button>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/review", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions", options) : helperMissing.call(depth0, "link-to", "subscriptions", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          <a>");
      stack1 = helpers._triageMustache.call(depth0, "nameSelectSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</a>\n        ");
      return buffer;
      }

    function program4(depth0,data) {
      
      
      data.buffer.push("\n        <a>Review Installation</a>\n      ");
      }

    function program6(depth0,data) {
      
      
      data.buffer.push("\n        <a>Installation Progress</a>\n      ");
      }

      data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n      ");
      stack1 = helpers.unless.call(depth0, "isUpstream", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li"),
        'disabled': ("disableTabInstallation")
      },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.installation", options) : helperMissing.call(depth0, "link-to", "review.installation", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li"),
        'disabled': ("disableTabProgress")
      },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.progress", options) : helperMissing.call(depth0, "link-to", "review.progress", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/review/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1;


      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/review/installation", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      Name: ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite", options) : helperMissing.call(depth0, "link-to", "satellite", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n\n      Organization: ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-organization", options) : helperMissing.call(depth0, "link-to", "configure-organization", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n\n      Environment: ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-environment", options) : helperMissing.call(depth0, "link-to", "configure-environment", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("  <br />\n\n    ");
      return buffer;
      }
    function program2(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "nameDeployment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

    function program4(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "selectedOrganization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

    function program6(depth0,data) {
      
      var stack1;
      stack1 = helpers._triageMustache.call(depth0, "selectedEnvironment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      else { data.buffer.push(''); }
      }

    function program8(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      Setup Type: ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-setup", options) : helperMissing.call(depth0, "link-to", "rhev-setup", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      <br />\n      <br />\n      ");
      stack1 = helpers['if'].call(depth0, "isSelfHosted", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(15, program15, data),fn:self.program(11, program11, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      <br />\n      Storage Type:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(18, program18, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n        ");
      stack1 = helpers['if'].call(depth0, "controllers.storage.isNFS", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(20, program20, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      <br />\n      DNS Name:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "networking", options) : helperMissing.call(depth0, "link-to", "networking", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n\n      <br />\n      Datacenter Name:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(29, program29, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Cluster Name:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(31, program31, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Host Name:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(33, program33, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Host Address:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(35, program35, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Storage Name:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(37, program37, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n\n      <br />\n    ");
      return buffer;
      }
    function program9(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "oVirtHostedtype", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      return buffer;
      }

    function program11(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        Hypervisor/Engine: <br />\n        ");
      stack1 = helpers.each.call(depth0, "host", "in", "hypervisorSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }
    function program12(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor.discovered-host", options) : helperMissing.call(depth0, "link-to", "hypervisor.discovered-host", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("<br />\n        ");
      return buffer;
      }
    function program13(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push(" ");
      stack1 = helpers._triageMustache.call(depth0, "host.mac", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" ");
      return buffer;
      }

    function program15(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        Hypervisor: <br />\n        ");
      stack1 = helpers.each.call(depth0, "host", "in", "hypervisorSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(12, program12, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        <br />\n        Engine: <br />\n        ");
      stack1 = helpers.each.call(depth0, "host", "in", "engineSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }
    function program16(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.discovered-host", options) : helperMissing.call(depth0, "link-to", "engine.discovered-host", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("<br />\n        ");
      return buffer;
      }

    function program18(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.storage.storageType", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program20(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n          Local ISO domain path:\n           ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n          Local ISO domain ACL:\n           ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n          Local ISO domain name:\n           ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n        ");
      return buffer;
      }
    function program21(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.storage.isoDomainPath", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      return buffer;
      }

    function program23(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.storage.isoDomainAcl", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      return buffer;
      }

    function program25(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.storage.isoDomainName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n          ");
      return buffer;
      }

    function program27(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.networking.dnsName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program29(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-options.datacenterName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program31(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-options.clusterName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program33(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-options.hostName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program35(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-options.hostAddress", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program37(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-options.storageName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program39(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      High Availability:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(40, program40, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Networking:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(42, program42, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Messaging Provider:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(44, program44, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Platform:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(46, program46, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Service Password:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(48, program48, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Custom Repos:\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(50, program50, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("<br />\n        <br />\n\n      Tenant Network Type\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(52, program52, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Core Plugin Type\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(54, program54, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Glance Driver Backend\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(56, program56, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n      Cinder Driver Backend\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(58, program58, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n    ");
      return buffer;
      }
    function program40(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.ha", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program42(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.networking", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program44(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.messaging", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program46(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.platform", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program48(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program50(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n          ");
      data.buffer.push(escapeExpression((helper = helpers['showdown-addon'] || (depth0 && depth0['showdown-addon']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "controllers.osp-settings.customRepos", options) : helperMissing.call(depth0, "showdown-addon", "controllers.osp-settings.customRepos", options))));
      data.buffer.push("\n        ");
      return buffer;
      }

    function program52(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.tenantType", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program54(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.corePlugin", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program56(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.glanceBackend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program58(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.cinderBackend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program60(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      Where to Install?\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(61, program61, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "where-install", options) : helperMissing.call(depth0, "link-to", "where-install", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <br />\n    ");
      return buffer;
      }
    function program61(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n          ");
      stack1 = helpers._triageMustache.call(depth0, "controllers.where-install.whereInstallCf", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n        ");
      return buffer;
      }

    function program63(depth0,data) {
      
      
      data.buffer.push("Install");
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-11 col-md-offset-1'>\n\n    ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'name': ("nameSatellite"),
        'isOpen': (true)
      },hashTypes:{'name': "ID",'isOpen': "BOOLEAN"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'name': ("nameRhev"),
        'isOpen': (false)
      },hashTypes:{'name': "ID",'isOpen': "BOOLEAN"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'name': ("nameOpenStack"),
        'isOpen': (false)
      },hashTypes:{'name': "ID",'isOpen': "BOOLEAN"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(39, program39, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    ");
      stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
        'name': ("nameCloudForms"),
        'isOpen': (false)
      },hashTypes:{'name': "ID",'isOpen': "BOOLEAN"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(60, program60, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n    <br />\n    <br />\n\n    <div class='pull-right'>\n      <br />\n      <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" class='btn btn-default'>Cancel</button>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(63, program63, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.progress", options) : helperMissing.call(depth0, "link-to", "review.progress", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n\n  </div>\n</div>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/review/progress", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("Next");
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <div class='row'>\n      <h3>Red Hat Enterprise Virtualization (25% complete, 3 hours 15 minutes remaining)</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>Red Hat Enterprise Linux OpenStack Platform</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>Red Hat Enterprise Linux OpenStack Platform</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div>\n\n    <br />\n    <br />\n    <br />\n    <br />\n\n    <div class='pull-right'>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary"),
        'disabled': (true)
      },hashTypes:{'class': "STRING",'disabled': "BOOLEAN"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n\n  </div>\n</div>\n\n");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/rhci", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n        Complete virtualization management bacon ipsum dolor sit amet kevin incididunt enim minim. Id\n        officia aliqua, mollit short ribs cillum consectetur spare ribs magna commodo.\n    ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n        OpenStack gives you a flexible, secure foundation to build a\n        massively scalable private or public cloud ... lorem ipsum\n    ");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("\n        Manage your virtual, private, and hybrid cloud infrastructures. bacon ipsum dolor sit amet kevin incididunt enim minim. Id\n        officia aliqua, mollit short ribs cillum consectetur spare ribs.\n    ");
      }

    function program7(depth0,data) {
      
      
      data.buffer.push("Cancel");
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("Next");
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <h1>New Deployment: Select Cloud Infrastructure Products</h1>\n\n    Choose the products to deploy. The installer guides you through creating a new ");
      stack1 = helpers._triageMustache.call(depth0, "nameRHCI", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" Cloud Infrastructure deployment.\n    <br />\n    You may click anywhere in a box to select or de-select.\n    <br />\n    <br />\n  </div>\n</div>\n\n<div class='row' style='height:370px;'>\n\n  <div class='col-md-4'>\n    ");
      stack1 = (helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
        'srcImage': ("imgRhev"),
        'isChecked': ("isRhev"),
        'name': ("nameRhev")
      },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n  <div class='col-md-4'>\n    ");
      stack1 = (helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
        'srcImage': ("imgOpenStack"),
        'isChecked': ("isOpenStack"),
        'name': ("nameOpenStack")
      },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n  <div class='col-md-4'>\n    ");
      stack1 = (helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
        'srcImage': ("imgCloudForms"),
        'isChecked': ("isCloudForms"),
        'name': ("nameCloudForms")
      },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n\n<br />\n<div class='row'>\n  <div class='col-md-12'>\n    <div style='float:right;'>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-default")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary"),
        'disabled': ("disableNext")
      },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployment", options) : helperMissing.call(depth0, "link-to", "deployment", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/rhev-options", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<h4> Engine Configuration </h4>\n\n<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Engine admin password")
      },hashTypes:{'label': "STRING"},hashContexts:{'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Confirm admin password")
      },hashTypes:{'label': "STRING"},hashContexts:{'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Datacenter Name"),
        'value': ("datacenterName")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Cluster Name"),
        'value': ("clusterName")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Storage name"),
        'value': ("storageName")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("CPU Type"),
        'value': ("cpuType"),
        'help-inline': ("TODO selection list")
      },hashTypes:{'label': "STRING",'value': "ID",'help-inline': "STRING"},hashContexts:{'label': depth0,'value': depth0,'help-inline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n      \n\n\n      \n\n      \n\n\n      \n\n      \n\n\n    </form>\n  </div>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/rhev-setup", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      
      data.buffer.push("Next");
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <div class='row'>\n      <h3>");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("rhevSetup"),
        'value': ("rhevhost"),
        'label': ("Host + Engine")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("</h3>\n      <div class='col-md-offset-1'>\n          Installation flow using separate machines for the Engine and the Hypervisor(s).\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("rhevSetup"),
        'value': ("selfhost"),
        'label': ("Self Hosted")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("</h3>\n      <div class='col-md-offset-1'>\n          Installation flow using separate machines for the Engine and the Hypervisor(s).\n      </div>\n    </div>\n\n\n\n    <div class='pull-right'>\n      <br />\n      <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" class='btn btn-default'>Cancel</button>\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor.discovered-host", options) : helperMissing.call(depth0, "link-to", "hypervisor.discovered-host", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </div>\n\n  </div>\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/rhev", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n        <a>");
      stack1 = helpers._triageMustache.call(depth0, "hypervisorTabName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("</a>\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine", options) : helperMissing.call(depth0, "link-to", "engine", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      ");
      return buffer;
      }
    function program4(depth0,data) {
      
      
      data.buffer.push("\n        <a>Engine</a>\n      ");
      }

    function program6(depth0,data) {
      
      
      data.buffer.push("\n        <a>Configuration</a>\n      ");
      }

    function program8(depth0,data) {
      
      
      data.buffer.push("\n        <a>Storage</a>\n      ");
      }

      data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n\n      \n<!--         <a>Setup Architecture</a> -->\n      \n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor", options) : helperMissing.call(depth0, "link-to", "hypervisor", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = helpers.unless.call(depth0, "isSelfHost", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      \n<!--         <a>Networking</a> -->\n      \n\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/rhev/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("rhev.index.hbs\n");
      
    });
  });
define("fusor-ember-cli/templates/satellite", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n        <a>Deployment Name</a>\n      ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n        <a>Configure Organization</a>\n      ");
      }

    function program5(depth0,data) {
      
      
      data.buffer.push("\n        <a>Configure Lifecycle Environment</a>\n      ");
      }

      data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite.index", options) : helperMissing.call(depth0, "link-to", "satellite.index", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-organization", options) : helperMissing.call(depth0, "link-to", "configure-organization", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'tagName': ("li")
      },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-environment", options) : helperMissing.call(depth0, "link-to", "configure-environment", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
      stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </div>\n\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/satellite/index", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      
      data.buffer.push("Next");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n  Are you sure you want to cancel?\n");
      }

      data.buffer.push("<div class=\"row\">\n  <div class='col-md-9'>\n    <br />\n    <form class=\"form-horizontal\" role=\"form\">\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Name"),
        'value': ("name"),
        'inputSize': ("col-md-5")
      },hashTypes:{'label': "STRING",'value': "ID",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
        'label': ("Description"),
        'value': ("description"),
        'inputSize': ("col-md-5")
      },hashTypes:{'label': "STRING",'value': "ID",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
      data.buffer.push("\n\n      <div class='pull-right'>\n        <br />\n        <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" class='btn btn-default'>Cancel</button>\n        ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-organization", options) : helperMissing.call(depth0, "link-to", "configure-organization", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n    </form>\n  </div>\n</div>\n\n");
      stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
        'name': ("cancelDeploymentModal"),
        'fade': (true),
        'footerButtonsBinding': ("rhciModalButtons"),
        'title': ("Cancel Deployment")
      },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/satellite/loading", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("Loading ....\n");
      
    });
  });
define("fusor-ember-cli/templates/setpassword", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<br /><h1>Change Administrator Password</h1>\n\n<br />\nIt is required that you change the admin password the first time that you log in.\n\n<br />\n<br />\n\n    <div class=\"col-sm-8 col-md-8 col-lg-8 login\">\n      <form accept-charset=\"UTF-8\" action=\"/users/login\" class=\"form-horizontal\" id=\"login-form\" method=\"post\"><div style=\"margin:0;padding:0;display:inline\"><input name=\"utf8\" type=\"hidden\" value=\"&#x2713;\" /><input name=\"authenticity_token\" type=\"hidden\" value=\"1f770GegsrWb4ZJIC0UkSEkvBVG9MnRJ7jypTsrjeLU=\" /></div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-3 control-label\" for=\"login_login\">Password *</label>\n            <div class=\"col-sm-9\">\n              <input class=\"form-control\" focus_on_load=\"true\" id=\"login_login\" name=\"login[login]\" size=\"30\" type=\"text\" />\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-3 control-label\" for=\"login_password\">Confirm Password *</label>\n            <div class=\"col-sm-9\">\n              <input class=\"form-control\" id=\"login_password\" name=\"login[password]\" type=\"password\" />\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <div class=\"col-xs-offset-8 col-xs-4 submit\">\n            <button class=\"btn btn-primary\" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "updatePassword", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" >Change Password</button>\n            </div>\n          </div>\n      </form>\n  </div>\n\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/side-menu", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', escapeExpression=this.escapeExpression;


      data.buffer.push("<div class='row'>\n  <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":col-md-12 showSideMenu:nav-expanded")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n    <nav>\n      <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "toggleSideMenu", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(" class='btn btn-default btn-block'>\n          Close Etherpad\n          <span style='float:right'>X&nbsp;&nbsp;</span>\n      </button>\n<!--       <iframe class='notepad' ></iframe>\n -->    </nav>\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/side-menu.loading", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("Loading ...");
      
    });
  });
define("fusor-ember-cli/templates/storage", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
        'label': ("NFS"),
        'checked': ("storageType"),
        'value': ("NFS")
      },hashTypes:{'label': "STRING",'checked': "ID",'value': "STRING"},hashContexts:{'label': depth0,'checked': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options))));
      data.buffer.push("NFS\n        &nbsp;&nbsp;&nbsp;&nbsp;\n        ");
      data.buffer.push(escapeExpression((helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
        'label': ("Gluster"),
        'checked': ("storageType"),
        'value': ("Gluster")
      },hashTypes:{'label': "STRING",'checked': "ID",'value': "STRING"},hashContexts:{'label': depth0,'checked': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options))));
      data.buffer.push("Gluster\n      ");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n\n      ");
      }

      data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
      stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
        'label': ("Storage Type")
      },hashTypes:{'label': "STRING"},hashContexts:{'label': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Storage Address"),
        'value': ("storageAddress")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n      ");
      data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
        'label': ("Share Path"),
        'value': ("sharePath")
      },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
      data.buffer.push("\n\n\n      ");
      stack1 = helpers['if'].call(depth0, "isNFS", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n    </form>\n  </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/subscriptions-downstream", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n  Attaching subscriptions (");
      stack1 = helpers._triageMustache.call(depth0, "prog", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("% complete)\n  ");
      data.buffer.push(escapeExpression((helper = helpers['bs-progress'] || (depth0 && depth0['bs-progress']),options={hash:{
        'progressBinding': ("prog"),
        'type': ("success"),
        'stripped': (true),
        'animated': (true)
      },hashTypes:{'progressBinding': "STRING",'type': "STRING",'stripped': "BOOLEAN",'animated': "BOOLEAN"},hashContexts:{'progressBinding': depth0,'type': depth0,'stripped': depth0,'animated': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-progress", options))));
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n  <div class='alert alert-success'>\n   Yeah! Successfully attached subscriptions! Attach more if you want.\n  </div>\n");
      }

    function program5(depth0,data) {
      
      var buffer = '', stack1, helper, options;
      data.buffer.push("\n    <tr>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'checked': ("isChecked")
      },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "contract_number", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "available", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "subscription_type", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "start_date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      stack1 = helpers._triageMustache.call(depth0, "end_date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" </td>\n      <td> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("text"),
        'value': ("quantity"),
        'size': (4)
      },hashTypes:{'type': "STRING",'value': "ID",'size': "INTEGER"},hashContexts:{'type': depth0,'value': depth0,'size': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push(" </td>\n    </tr>\n  ");
      return buffer;
      }

    function program7(depth0,data) {
      
      var buffer = '', stack1;
      data.buffer.push("\n<div class='alert alert-info'>\n");
      stack1 = helpers._triageMustache.call(depth0, "totalSelectedCount", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" of ");
      stack1 = helpers._triageMustache.call(depth0, "totalCountSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" subscriptions selected\n</div>\n");
      return buffer;
      }

    function program9(depth0,data) {
      
      
      data.buffer.push("Next");
      }

      data.buffer.push("\n<br />\n");
      stack1 = helpers['if'].call(depth0, "attachingInProgress", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      stack1 = helpers['if'].call(depth0, "showAttachedSuccessMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("isOnlyShowSubscriptions"),
        'checked': ("isOnlyShowSubscriptions")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push(" Only show subscriptions that match this Subscription Asset Manager Organization\n<br />\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> ");
      data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
        'type': ("checkbox"),
        'name': ("allChecked"),
        'checked': ("allChecked")
      },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
      data.buffer.push("</th>\n      <th> Subscription Name </th>\n      <th> Contract Number </th>\n      <th> Available </th>\n      <th> Type </th>\n      <th> Start Date </th>\n      <th> End Date </th>\n      <th> Quantity </th>\n    </tr>\n    </thead>\n\n  <tbody>\n  ");
      stack1 = helpers.each.call(depth0, "controller.model", {hash:{
        'itemController': ("satellite/subscription")
      },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n  </tbody>\n</table>\n\n");
      stack1 = helpers.unless.call(depth0, "attachingInProgress", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n<button class='btn btn-success' ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'disabled': ("disableAttachButton")
      },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(" ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "attachSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Attach Selected</button>\n\n<br />\n<br />\n\n\n<div style='text-align:right'>\n  <button ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancel-modal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
      data.buffer.push(" class='btn btn-default'>Cancel</button>\n  ");
      stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
        'class': ("btn btn-primary"),
        'disabled': ("disableNext")
      },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.installation", options) : helperMissing.call(depth0, "link-to", "review.installation", options));
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/subscriptions", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "content-source-upstream", options) : helperMissing.call(depth0, "partial", "content-source-upstream", options))));
      data.buffer.push("\n");
      return buffer;
      }

    function program3(depth0,data) {
      
      var buffer = '', helper, options;
      data.buffer.push("\n  ");
      data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions-downstream", options) : helperMissing.call(depth0, "partial", "subscriptions-downstream", options))));
      data.buffer.push("\n");
      return buffer;
      }

      stack1 = helpers['if'].call(depth0, "isUpstream", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/subscriptions/loading", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      


      data.buffer.push("<h2>Hey there, it's coming</h2>\n\nsubscriptions/loading.hbs\n\n\n");
      
    });
  });
define("fusor-ember-cli/templates/topbar", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

    function program1(depth0,data) {
      
      
      data.buffer.push("\n          <img alt=\"Foreman\" src=\"assets/foreman.png\">\n          <a href=\"/\">Foreman</a>\n        ");
      }

    function program3(depth0,data) {
      
      
      data.buffer.push("\n          <a href=\"/\">RED HAT SATELLITE</a>\n        ");
      }

    function program5(depth0,data) {
      
      var buffer = '';
      data.buffer.push("\n            <li class=\"menu_tab_/users_edit\">\n              <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "notImplemented", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">My account</a>\n            </li>\n\n            <li class=\"divider\">\n            </li>\n\n            <li class=\"menu_tab_/users_logout\">\n              <a ");
      data.buffer.push(escapeExpression(helpers.action.call(depth0, "invalidateSession", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
      data.buffer.push(">Log out</a>\n            </li>\n            ");
      return buffer;
      }

      data.buffer.push("<div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': (":navbar :navbar-default :navbar-outer isUpstream:navbar-outer-upstream")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n  <div class=\"navbar-header\">\n    <div ");
      data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
        'class': ("isUpstream:container:container-fluid")
      },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
      data.buffer.push(">\n\n      <div class=\"navbar-brand\">\n        ");
      stack1 = helpers['if'].call(depth0, "isUpstream", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n      </div>\n\n      <ul class=\"nav navbar-nav navbar-right navbar-header-menu navbar-collapse collapse\">\n\n        <li class=\"dropdown menu_tab_dropdown\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n            \n            ");
      stack1 = helpers._triageMustache.call(depth0, "session.content.provider", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            ");
      stack1 = helpers._triageMustache.call(depth0, "session.authType", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("&nbsp;\n            ");
      stack1 = helpers._triageMustache.call(depth0, "session.basicAuthToken", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n            ");
      stack1 = helpers._triageMustache.call(depth0, "session.access_token", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("&nbsp;\n            <img alt=\"Change your avatar at gravatar.com\" class=\"avatar small\" src=\"assets/user.jpg\">");
      stack1 = helpers._triageMustache.call(depth0, "loginUsername", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push(" <span class=\"caret\"></span>\n          </a>\n\n          <ul class=\"dropdown-menu pull-right\">\n\n            ");
      stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
      if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
      data.buffer.push("\n\n          </ul>\n\n        </li>\n      </ul>\n\n    </div>\n  </div>\n</div>");
      return buffer;
      
    });
  });
define("fusor-ember-cli/templates/where-install", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    __exports__["default"] = Ember.Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
    this.compilerInfo = [4,'>= 1.0.0'];
    helpers = this.merge(helpers, Ember.Handlebars.helpers); data = data || {};
      var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


      data.buffer.push("<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <div class='row'>\n      <h3>");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("whereInstallCf"),
        'value': ("onOpenstack"),
        'label': ("Cloudforms on Openstack")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("</h3>\n      <div class='col-md-offset-1'>\n        this means explanation text .....\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>");
      data.buffer.push(escapeExpression((helper = helpers['radio-button-f'] || (depth0 && depth0['radio-button-f']),options={hash:{
        'checked': ("whereInstallCf"),
        'value': ("onRhev"),
        'label': ("Cloudforms on RHEV")
      },hashTypes:{'checked': "ID",'value': "STRING",'label': "STRING"},hashContexts:{'checked': depth0,'value': depth0,'label': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-f", options))));
      data.buffer.push("</h3>\n      <div class='col-md-offset-1'>\n        this means explanation text .....\n      </div>\n    </div>\n\n  </div>\n</div>\n");
      return buffer;
      
    });
  });
define("fusor-ember-cli/tests/adapters/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/application.js should pass jshint', function() { 
      ok(true, 'adapters/application.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/adapters/hostgroup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/hostgroup.js should pass jshint', function() { 
      ok(true, 'adapters/hostgroup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/adapters/traffic-type.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - adapters');
    test('adapters/traffic-type.js should pass jshint', function() { 
      ok(false, 'adapters/traffic-type.js should pass jshint.\nadapters/traffic-type.js: line 6, col 17, \'Ember\' is not defined.\nadapters/traffic-type.js: line 5, col 46, \'type\' is defined but never used.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('app.js should pass jshint', function() { 
      ok(true, 'app.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/authenticators/foreman.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - authenticators');
    test('authenticators/foreman.js should pass jshint', function() { 
      ok(false, 'authenticators/foreman.js should pass jshint.\nauthenticators/foreman.js: line 13, col 16, \'Ember\' is not defined.\nauthenticators/foreman.js: line 14, col 7, \'Ember\' is not defined.\nauthenticators/foreman.js: line 35, col 20, \'Ember\' is not defined.\nauthenticators/foreman.js: line 36, col 11, \'Ember\' is not defined.\nauthenticators/foreman.js: line 3, col 8, \'ApplicationAdapter\' is defined but never used.\nauthenticators/foreman.js: line 12, col 9, \'self\' is defined but never used.\nauthenticators/foreman.js: line 34, col 13, \'self\' is defined but never used.\n\n7 errors'); 
    });
  });
define("fusor-ember-cli/tests/components/accordion-item.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/accordion-item.js should pass jshint', function() { 
      ok(true, 'components/accordion-item.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/base-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/base-f.js should pass jshint', function() { 
      ok(true, 'components/base-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/env-path-list-item.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/env-path-list-item.js should pass jshint', function() { 
      ok(false, 'components/env-path-list-item.js should pass jshint.\ncomponents/env-path-list-item.js: line 21, col 19, \'event\' is defined but never used.\n\n1 error'); 
    });
  });
define("fusor-ember-cli/tests/components/modal-confirm.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/modal-confirm.js should pass jshint', function() { 
      ok(true, 'components/modal-confirm.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/radio-button-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/radio-button-f.js should pass jshint', function() { 
      ok(true, 'components/radio-button-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/rchi-item.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/rchi-item.js should pass jshint', function() { 
      ok(true, 'components/rchi-item.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/rhci-hover-text.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/rhci-hover-text.js should pass jshint', function() { 
      ok(true, 'components/rhci-hover-text.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/select-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/select-f.js should pass jshint', function() { 
      ok(true, 'components/select-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/select-simple-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/select-simple-f.js should pass jshint', function() { 
      ok(true, 'components/select-simple-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/step-number.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/step-number.js should pass jshint', function() { 
      ok(true, 'components/step-number.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/sub-menu.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/sub-menu.js should pass jshint', function() { 
      ok(true, 'components/sub-menu.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/subnet-drop-area.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/subnet-drop-area.js should pass jshint', function() { 
      ok(true, 'components/subnet-drop-area.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/text-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/text-f.js should pass jshint', function() { 
      ok(true, 'components/text-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/textarea-f.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/textarea-f.js should pass jshint', function() { 
      ok(true, 'components/textarea-f.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/tr-organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/tr-organization.js should pass jshint', function() { 
      ok(false, 'components/tr-organization.js should pass jshint.\ncomponents/tr-organization.js: line 9, col 47, Expected \'===\' and instead saw \'==\'.\ncomponents/tr-organization.js: line 54, col 19, \'event\' is defined but never used.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/components/traffic-type.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/traffic-type.js should pass jshint', function() { 
      ok(true, 'components/traffic-type.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/upstream-downstream.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/upstream-downstream.js should pass jshint', function() { 
      ok(true, 'components/upstream-downstream.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/components/vertical-tab.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - components');
    test('components/vertical-tab.js should pass jshint', function() { 
      ok(true, 'components/vertical-tab.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/application.js should pass jshint', function() { 
      ok(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 48, col 7, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 49, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 54, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 59, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 37, col 26, \'data\' is defined but never used.\n\n5 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/cancel-modal.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/cancel-modal.js should pass jshint', function() { 
      ok(true, 'controllers/cancel-modal.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/cloudforms-storage-domain.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/cloudforms-storage-domain.js should pass jshint', function() { 
      ok(true, 'controllers/cloudforms-storage-domain.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/cloudforms-vm.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/cloudforms-vm.js should pass jshint', function() { 
      ok(true, 'controllers/cloudforms-vm.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/configure-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/configure-environment.js should pass jshint', function() { 
      ok(false, 'controllers/configure-environment.js should pass jshint.\ncontrollers/configure-environment.js: line 28, col 14, \'Bootstrap\' is not defined.\n\n1 error'); 
    });
  });
define("fusor-ember-cli/tests/controllers/configure-organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/configure-organization.js should pass jshint', function() { 
      ok(false, 'controllers/configure-organization.js should pass jshint.\ncontrollers/configure-organization.js: line 48, col 14, \'Bootstrap\' is not defined.\ncontrollers/configure-organization.js: line 54, col 14, \'Bootstrap\' is not defined.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/configure.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/configure.js should pass jshint', function() { 
      ok(false, 'controllers/configure.js should pass jshint.\ncontrollers/configure.js: line 48, col 14, \'Bootstrap\' is not defined.\ncontrollers/configure.js: line 54, col 14, \'Bootstrap\' is not defined.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/deployment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/deployment.js should pass jshint', function() { 
      ok(true, 'controllers/deployment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/engine/discovered-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/engine');
    test('controllers/engine/discovered-host.js should pass jshint', function() { 
      ok(false, 'controllers/engine/discovered-host.js should pass jshint.\ncontrollers/engine/discovered-host.js: line 8, col 19, \'Em\' is not defined.\ncontrollers/engine/discovered-host.js: line 10, col 18, \'Em\' is not defined.\ncontrollers/engine/discovered-host.js: line 19, col 21, \'Em\' is not defined.\n\n3 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/host.js should pass jshint', function() { 
      ok(true, 'controllers/host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/hostgroup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/hostgroup.js should pass jshint', function() { 
      ok(true, 'controllers/hostgroup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/hypervisor.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/hypervisor.js should pass jshint', function() { 
      ok(true, 'controllers/hypervisor.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/hypervisor/discovered-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/hypervisor');
    test('controllers/hypervisor/discovered-host.js should pass jshint', function() { 
      ok(false, 'controllers/hypervisor/discovered-host.js should pass jshint.\ncontrollers/hypervisor/discovered-host.js: line 5, col 18, \'Em\' is not defined.\ncontrollers/hypervisor/discovered-host.js: line 14, col 21, \'Em\' is not defined.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/lifecycle-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/lifecycle-environment.js should pass jshint', function() { 
      ok(true, 'controllers/lifecycle-environment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/lifecycle-environments.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/lifecycle-environments.js should pass jshint', function() { 
      ok(true, 'controllers/lifecycle-environments.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/login.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/login.js should pass jshint', function() { 
      ok(false, 'controllers/login.js should pass jshint.\ncontrollers/login.js: line 23, col 36, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 23, col 80, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 23, col 89, Missing semicolon.\ncontrollers/login.js: line 30, col 34, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 58, col 39, Missing semicolon.\ncontrollers/login.js: line 72, col 36, Missing semicolon.\ncontrollers/login.js: line 77, col 38, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 92, col 29, Missing semicolon.\ncontrollers/login.js: line 57, col 26, \'response\' is defined but never used.\ncontrollers/login.js: line 91, col 22, \'response\' is defined but never used.\ncontrollers/login.js: line 117, col 21, \'authCode\' is defined but never used.\n\n11 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/logout-model.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/logout-model.js should pass jshint', function() { 
      ok(true, 'controllers/logout-model.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/networking.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/networking.js should pass jshint', function() { 
      ok(true, 'controllers/networking.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/new-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/new-environment.js should pass jshint', function() { 
      ok(true, 'controllers/new-environment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/new-organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/new-organization.js should pass jshint', function() { 
      ok(true, 'controllers/new-organization.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/organization.js should pass jshint', function() { 
      ok(true, 'controllers/organization.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/organizations.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/organizations.js should pass jshint', function() { 
      ok(true, 'controllers/organizations.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/osp-configuration.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/osp-configuration.js should pass jshint', function() { 
      ok(true, 'controllers/osp-configuration.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/osp-network.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/osp-network.js should pass jshint', function() { 
      ok(false, 'controllers/osp-network.js should pass jshint.\ncontrollers/osp-network.js: line 6, col 51, Expected \'===\' and instead saw \'==\'.\ncontrollers/osp-network.js: line 26, col 9, Missing semicolon.\ncontrollers/osp-network.js: line 5, col 66, \'enumerable\' is defined but never used.\ncontrollers/osp-network.js: line 5, col 59, \'index\' is defined but never used.\ncontrollers/osp-network.js: line 11, col 66, \'enumerable\' is defined but never used.\ncontrollers/osp-network.js: line 11, col 59, \'index\' is defined but never used.\ncontrollers/osp-network.js: line 28, col 47, \'ops\' is defined but never used.\n\n7 errors'); 
    });
  });
define("fusor-ember-cli/tests/controllers/osp-settings.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/osp-settings.js should pass jshint', function() { 
      ok(true, 'controllers/osp-settings.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/products.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/products.js should pass jshint', function() { 
      ok(true, 'controllers/products.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/review.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/review.js should pass jshint', function() { 
      ok(true, 'controllers/review.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/review/installation.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/review');
    test('controllers/review/installation.js should pass jshint', function() { 
      ok(true, 'controllers/review/installation.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/rhci.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/rhci.js should pass jshint', function() { 
      ok(true, 'controllers/rhci.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/rhev-options.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/rhev-options.js should pass jshint', function() { 
      ok(true, 'controllers/rhev-options.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/rhev-setup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/rhev-setup.js should pass jshint', function() { 
      ok(true, 'controllers/rhev-setup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/rhev.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/rhev.js should pass jshint', function() { 
      ok(true, 'controllers/rhev.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/satellite.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/satellite.js should pass jshint', function() { 
      ok(true, 'controllers/satellite.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/satellite/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/satellite');
    test('controllers/satellite/index.js should pass jshint', function() { 
      ok(true, 'controllers/satellite/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/satellite/product.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/satellite');
    test('controllers/satellite/product.js should pass jshint', function() { 
      ok(true, 'controllers/satellite/product.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/satellite/subscription.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers/satellite');
    test('controllers/satellite/subscription.js should pass jshint', function() { 
      ok(true, 'controllers/satellite/subscription.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/side-menu.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/side-menu.js should pass jshint', function() { 
      ok(true, 'controllers/side-menu.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/storage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/storage.js should pass jshint', function() { 
      ok(true, 'controllers/storage.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/subscriptions.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/subscriptions.js should pass jshint', function() { 
      ok(true, 'controllers/subscriptions.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/controllers/where-install.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - controllers');
    test('controllers/where-install.js should pass jshint', function() { 
      ok(true, 'controllers/where-install.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/helpers/resolver.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/helpers');
    test('fusor-ember-cli/tests/helpers/resolver.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/helpers/resolver.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/helpers/start-app.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/helpers');
    test('fusor-ember-cli/tests/helpers/start-app.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/helpers/start-app.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/test-helper.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests');
    test('fusor-ember-cli/tests/test-helper.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/test-helper.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/adapters');
    test('fusor-ember-cli/tests/unit/adapters/application-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/adapters/application-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/hostgroup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/adapters');
    test('fusor-ember-cli/tests/unit/adapters/hostgroup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/adapters/hostgroup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/traffic-type-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/adapters');
    test('fusor-ember-cli/tests/unit/adapters/traffic-type-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/adapters/traffic-type-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/accordion-item-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/accordion-item-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/accordion-item-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/base-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/base-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/base-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/env-path-list-item-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/env-path-list-item-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/env-path-list-item-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/modal-confirm-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/modal-confirm-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/modal-confirm-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/radio-button-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/radio-button-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/radio-button-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rchi-item-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/rchi-item-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/rchi-item-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rhci-hover-text-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/rhci-hover-text-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/rhci-hover-text-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/select-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/select-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/select-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/select-simple-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/select-simple-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/select-simple-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/step-number-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/step-number-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/step-number-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/sub-menu-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/sub-menu-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/sub-menu-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/subnet-drop-area-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/subnet-drop-area-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/subnet-drop-area-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/text-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/text-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/text-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/textarea-f-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/textarea-f-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/textarea-f-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/tr-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/tr-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/tr-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/traffic-type-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/traffic-type-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/traffic-type-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/upstream-downstream-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/upstream-downstream-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/upstream-downstream-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/vertical-tab-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/vertical-tab-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/vertical-tab-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/wrap-in-container-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/components');
    test('fusor-ember-cli/tests/unit/components/wrap-in-container-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/components/wrap-in-container-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/application-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/application-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cancel-modal-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/cancel-modal-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/cancel-modal-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/configure-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/configure-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/configure-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/configure-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/configure-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/configure-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/configure');
    test('fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/deployment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/engine');
    test('fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hostgroup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/hostgroup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/hostgroup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hypervisor-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/hypervisor-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/hypervisor-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/hypervisor');
    test('fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/login-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/login-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/login-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/logout-model-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/logout-model-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/logout-model-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/networking-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/networking-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/networking-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/new-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/new-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/new-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/new-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/new-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/new-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/organizations-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/organizations-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/organizations-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-configuration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/osp-configuration-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-configuration-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-network-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/osp-network-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-network-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-settings-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/osp-settings-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-settings-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/product-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/product-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/product-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/products-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/products-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/products-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/review-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/review-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/review-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/review/installation-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/review');
    test('fusor-ember-cli/tests/unit/controllers/review/installation-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/review/installation-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhci-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/rhci-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/rhci-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-options-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/rhev-options-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-options-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-setup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/rhev-setup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-setup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/rhev-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/rhev');
    test('fusor-ember-cli/tests/unit/controllers/rhev/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/satellite-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/satellite-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/satellite-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/satellite/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/satellite');
    test('fusor-ember-cli/tests/unit/controllers/satellite/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/satellite/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/satellite/subscriptions-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/satellite');
    test('fusor-ember-cli/tests/unit/controllers/satellite/subscriptions-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/satellite/subscriptions-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/side-menu-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/side-menu-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/side-menu-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/storage-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/storage-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/storage-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscription-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/subscription-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/subscription-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscriptions-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/subscriptions-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/subscriptions-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/user-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/user-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/user/edit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/user');
    test('fusor-ember-cli/tests/unit/controllers/user/edit-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/user/edit-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/users-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/users-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/users-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/users/new-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers/users');
    test('fusor-ember-cli/tests/unit/controllers/users/new-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/users/new-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/where-install-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/controllers');
    test('fusor-ember-cli/tests/unit/controllers/where-install-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/controllers/where-install-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/helpers/raw-text-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/helpers');
    test('fusor-ember-cli/tests/unit/helpers/raw-text-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/helpers/raw-text-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/deployment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/deployment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/deployment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/hostgroup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/hostgroup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/hostgroup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/lifecycle-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/lifecycle-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/lifecycle-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/location-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/location-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/location-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/note-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/note-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/note-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/oauth-access-token-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/oauth-access-token-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/oauth-access-token-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/product-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/product-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/product-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/rhev-setup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/rhev-setup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/rhev-setup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/subnet-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/subnet-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/subnet-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/subscription-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/subscription-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/subscription-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/traffic-type-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/traffic-type-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/traffic-type-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/models');
    test('fusor-ember-cli/tests/unit/models/user-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/models/user-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/application-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/application-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/cloudforms');
    test('fusor-ember-cli/tests/unit/routes/cloudforms/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/configure-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/configure-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/configure-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/configure-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure/new-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/configure');
    test('fusor-ember-cli/tests/unit/routes/configure/new-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/configure/new-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/content-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/content-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/content-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/deployment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
    test('fusor-ember-cli/tests/unit/routes/deployment/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/new-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
    test('fusor-ember-cli/tests/unit/routes/deployment/new-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/new-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/review-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
    test('fusor-ember-cli/tests/unit/routes/deployment/review-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/review-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/deployment/satellite/configure');
    test('fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployments-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/deployments-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/deployments-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/engine-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/engine-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
    test('fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/existing-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
    test('fusor-ember-cli/tests/unit/routes/engine/existing-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/engine/existing-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
    test('fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/new-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
    test('fusor-ember-cli/tests/unit/routes/engine/new-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/engine/new-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/hostgroup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/hostgroup');
    test('fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroups-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/hostgroups-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroups-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/hypervisor-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
    test('fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
    test('fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
    test('fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/loggedin-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/loggedin-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/loggedin-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/login-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/login-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/login-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/networking-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/networking-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/networking-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/new-environment-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/new-environment-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/new-environment-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/new-organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/new-organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/new-organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/openstack/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/openstack');
    test('fusor-ember-cli/tests/unit/routes/openstack/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/openstack/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-configuration-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/osp-configuration-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/osp-configuration-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-network-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/osp-network-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/osp-network-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-overview-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/osp-overview-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/osp-overview-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-settings-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/osp-settings-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/osp-settings-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/review');
    test('fusor-ember-cli/tests/unit/routes/review/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/review/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/installation-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/review');
    test('fusor-ember-cli/tests/unit/routes/review/installation-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/review/installation-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/progress-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/review');
    test('fusor-ember-cli/tests/unit/routes/review/progress-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/review/progress-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhci-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/rhci-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhci-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-options-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/rhev-options-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-options-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-setup-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/rhev-setup-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-setup-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/rhev-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev/engine-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/rhev');
    test('fusor-ember-cli/tests/unit/routes/rhev/engine-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhev/engine-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/rhev');
    test('fusor-ember-cli/tests/unit/routes/rhev/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/rhev/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/satellite-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/satellite-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/configure-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
    test('fusor-ember-cli/tests/unit/routes/satellite/configure-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/configure-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/index-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
    test('fusor-ember-cli/tests/unit/routes/satellite/index-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/index-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/review-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
    test('fusor-ember-cli/tests/unit/routes/satellite/review-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/review-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
    test('fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/setpassword-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/setpassword-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/setpassword-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/storage-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/storage-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/storage-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/user-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/user-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/user-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/user/edit-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/user');
    test('fusor-ember-cli/tests/unit/routes/user/edit-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/user/edit-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/users-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/users-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/users-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/users/new-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes/users');
    test('fusor-ember-cli/tests/unit/routes/users/new-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/users/new-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/where-install-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/routes');
    test('fusor-ember-cli/tests/unit/routes/where-install-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/routes/where-install-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/application-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/views');
    test('fusor-ember-cli/tests/unit/views/application-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/views/application-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/configure-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/views');
    test('fusor-ember-cli/tests/unit/views/configure-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/views/configure-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/organization-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/views');
    test('fusor-ember-cli/tests/unit/views/organization-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/views/organization-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/rhci-test.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - fusor-ember-cli/tests/unit/views');
    test('fusor-ember-cli/tests/unit/views/rhci-test.js should pass jshint', function() { 
      ok(true, 'fusor-ember-cli/tests/unit/views/rhci-test.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/helpers/raw-text.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - helpers');
    test('helpers/raw-text.js should pass jshint', function() { 
      ok(false, 'helpers/raw-text.js should pass jshint.\nhelpers/raw-text.js: line 4, col 14, \'Handlebars\' is not defined.\n\n1 error'); 
    });
  });
define("fusor-ember-cli/tests/helpers/resolver", 
  ["ember/resolver","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __exports__) {
    "use strict";
    var Resolver = __dependency1__["default"];
    var config = __dependency2__["default"];

    var resolver = Resolver.create();

    resolver.namespace = {
      modulePrefix: config.modulePrefix,
      podModulePrefix: config.podModulePrefix
    };

    __exports__["default"] = resolver;
  });
define("fusor-ember-cli/tests/helpers/start-app", 
  ["ember","fusor-ember-cli/app","fusor-ember-cli/router","fusor-ember-cli/config/environment","exports"],
  function(__dependency1__, __dependency2__, __dependency3__, __dependency4__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];
    var Application = __dependency2__["default"];
    var Router = __dependency3__["default"];
    var config = __dependency4__["default"];

    __exports__["default"] = function startApp(attrs) {
      var application;

      var attributes = Ember.merge({}, config.APP);
      attributes = Ember.merge(attributes, attrs); // use defaults, but you can override;

      Ember.run(function () {
        application = Application.create(attributes);
        application.setupForTesting();
        application.injectTestHelpers();
      });

      return application;
    }
  });
define("fusor-ember-cli/tests/mixins/meta.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - mixins');
    test('mixins/meta.js should pass jshint', function() { 
      ok(true, 'mixins/meta.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/deployment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/deployment.js should pass jshint', function() { 
      ok(true, 'models/deployment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/host.js should pass jshint', function() { 
      ok(true, 'models/host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/hostgroup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/hostgroup.js should pass jshint', function() { 
      ok(true, 'models/hostgroup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/lifecycle-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/lifecycle-environment.js should pass jshint', function() { 
      ok(true, 'models/lifecycle-environment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/location.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/location.js should pass jshint', function() { 
      ok(true, 'models/location.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/newenv.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/newenv.js should pass jshint', function() { 
      ok(true, 'models/newenv.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/note.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/note.js should pass jshint', function() { 
      ok(true, 'models/note.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/oauth-access-token.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/oauth-access-token.js should pass jshint', function() { 
      ok(true, 'models/oauth-access-token.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/organization.js should pass jshint', function() { 
      ok(true, 'models/organization.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/product.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/product.js should pass jshint', function() { 
      ok(true, 'models/product.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/subnet.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/subnet.js should pass jshint', function() { 
      ok(true, 'models/subnet.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/subscription.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/subscription.js should pass jshint', function() { 
      ok(true, 'models/subscription.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/traffic-type.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/traffic-type.js should pass jshint', function() { 
      ok(true, 'models/traffic-type.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/models/user.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - models');
    test('models/user.js should pass jshint', function() { 
      ok(true, 'models/user.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/router.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - .');
    test('router.js should pass jshint', function() { 
      ok(true, 'router.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/application.js should pass jshint', function() { 
      ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 10, col 6, Unnecessary semicolon.\nroutes/application.js: line 18, col 40, Expected \'===\' and instead saw \'==\'.\nroutes/application.js: line 20, col 47, Expected \'===\' and instead saw \'==\'.\nroutes/application.js: line 54, col 7, \'Bootstrap\' is not defined.\nroutes/application.js: line 55, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 60, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 65, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 70, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 7, col 25, \'transition\' is defined but never used.\n\n9 errors'); 
    });
  });
define("fusor-ember-cli/tests/routes/cloudforms-storage-domain.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/cloudforms-storage-domain.js should pass jshint', function() { 
      ok(true, 'routes/cloudforms-storage-domain.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/cloudforms-vm.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/cloudforms-vm.js should pass jshint', function() { 
      ok(true, 'routes/cloudforms-vm.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/cloudforms/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/cloudforms');
    test('routes/cloudforms/index.js should pass jshint', function() { 
      ok(true, 'routes/cloudforms/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/configure-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/configure-environment.js should pass jshint', function() { 
      ok(true, 'routes/configure-environment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/configure-organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/configure-organization.js should pass jshint', function() { 
      ok(true, 'routes/configure-organization.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/configure.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/configure.js should pass jshint', function() { 
      ok(true, 'routes/configure.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/deployment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/deployment.js should pass jshint', function() { 
      ok(true, 'routes/deployment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/deployment/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/deployment');
    test('routes/deployment/index.js should pass jshint', function() { 
      ok(true, 'routes/deployment/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/deployment/review.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/deployment');
    test('routes/deployment/review.js should pass jshint', function() { 
      ok(true, 'routes/deployment/review.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/deployments.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/deployments.js should pass jshint', function() { 
      ok(true, 'routes/deployments.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/engine.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/engine.js should pass jshint', function() { 
      ok(true, 'routes/engine.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/engine/discovered-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/engine');
    test('routes/engine/discovered-host.js should pass jshint', function() { 
      ok(true, 'routes/engine/discovered-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/engine/existing-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/engine');
    test('routes/engine/existing-host.js should pass jshint', function() { 
      ok(true, 'routes/engine/existing-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/engine/hypervisor.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/engine');
    test('routes/engine/hypervisor.js should pass jshint', function() { 
      ok(true, 'routes/engine/hypervisor.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/engine/new-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/engine');
    test('routes/engine/new-host.js should pass jshint', function() { 
      ok(true, 'routes/engine/new-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hostgroup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/hostgroup.js should pass jshint', function() { 
      ok(true, 'routes/hostgroup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hostgroup/edit.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hostgroup');
    test('routes/hostgroup/edit.js should pass jshint', function() { 
      ok(true, 'routes/hostgroup/edit.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hostgroups.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/hostgroups.js should pass jshint', function() { 
      ok(true, 'routes/hostgroups.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hypervisor.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/hypervisor.js should pass jshint', function() { 
      ok(true, 'routes/hypervisor.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hypervisor/discovered-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hypervisor');
    test('routes/hypervisor/discovered-host.js should pass jshint', function() { 
      ok(true, 'routes/hypervisor/discovered-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hypervisor/existing-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hypervisor');
    test('routes/hypervisor/existing-host.js should pass jshint', function() { 
      ok(true, 'routes/hypervisor/existing-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/hypervisor/new-host.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/hypervisor');
    test('routes/hypervisor/new-host.js should pass jshint', function() { 
      ok(true, 'routes/hypervisor/new-host.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/index.js should pass jshint', function() { 
      ok(true, 'routes/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/loggedin.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/loggedin.js should pass jshint', function() { 
      ok(true, 'routes/loggedin.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/login.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/login.js should pass jshint', function() { 
      ok(false, 'routes/login.js should pass jshint.\nroutes/login.js: line 10, col 6, Unnecessary semicolon.\nroutes/login.js: line 7, col 25, \'transition\' is defined but never used.\n\n2 errors'); 
    });
  });
define("fusor-ember-cli/tests/routes/networking.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/networking.js should pass jshint', function() { 
      ok(true, 'routes/networking.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/new-environment.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/new-environment.js should pass jshint', function() { 
      ok(true, 'routes/new-environment.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/new-organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/new-organization.js should pass jshint', function() { 
      ok(true, 'routes/new-organization.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/openstack/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/openstack');
    test('routes/openstack/index.js should pass jshint', function() { 
      ok(true, 'routes/openstack/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/osp-configuration.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/osp-configuration.js should pass jshint', function() { 
      ok(true, 'routes/osp-configuration.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/osp-network.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/osp-network.js should pass jshint', function() { 
      ok(true, 'routes/osp-network.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/osp-overview.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/osp-overview.js should pass jshint', function() { 
      ok(true, 'routes/osp-overview.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/osp-settings.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/osp-settings.js should pass jshint', function() { 
      ok(true, 'routes/osp-settings.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/products.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/products.js should pass jshint', function() { 
      ok(true, 'routes/products.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/review/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/review');
    test('routes/review/index.js should pass jshint', function() { 
      ok(true, 'routes/review/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/review/installation.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/review');
    test('routes/review/installation.js should pass jshint', function() { 
      ok(true, 'routes/review/installation.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/review/progress.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/review');
    test('routes/review/progress.js should pass jshint', function() { 
      ok(true, 'routes/review/progress.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/rhci.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/rhci.js should pass jshint', function() { 
      ok(true, 'routes/rhci.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/rhev-options.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/rhev-options.js should pass jshint', function() { 
      ok(true, 'routes/rhev-options.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/rhev-setup.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/rhev-setup.js should pass jshint', function() { 
      ok(true, 'routes/rhev-setup.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/rhev.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/rhev.js should pass jshint', function() { 
      ok(true, 'routes/rhev.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/rhev/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/rhev');
    test('routes/rhev/index.js should pass jshint', function() { 
      ok(true, 'routes/rhev/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/satellite.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/satellite.js should pass jshint', function() { 
      ok(true, 'routes/satellite.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/satellite/index.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes/satellite');
    test('routes/satellite/index.js should pass jshint', function() { 
      ok(true, 'routes/satellite/index.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/setpassword.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/setpassword.js should pass jshint', function() { 
      ok(true, 'routes/setpassword.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/storage.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/storage.js should pass jshint', function() { 
      ok(true, 'routes/storage.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/subscriptions.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/subscriptions.js should pass jshint', function() { 
      ok(true, 'routes/subscriptions.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/routes/where-install.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - routes');
    test('routes/where-install.js should pass jshint', function() { 
      ok(true, 'routes/where-install.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/serializers/application.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/application.js should pass jshint', function() { 
      ok(true, 'serializers/application.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/serializers/puppetclass.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - serializers');
    test('serializers/puppetclass.js should pass jshint', function() { 
      ok(false, 'serializers/puppetclass.js should pass jshint.\nserializers/puppetclass.js: line 8, col 35, \'$\' is not defined.\n\n1 error'); 
    });
  });
define("fusor-ember-cli/tests/test-helper", 
  ["fusor-ember-cli/tests/helpers/resolver","ember-qunit"],
  function(__dependency1__, __dependency2__) {
    "use strict";
    var resolver = __dependency1__["default"];
    var setResolver = __dependency2__.setResolver;

    setResolver(resolver);

    document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

    QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
    var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
    document.getElementById("ember-testing-container").style.visibility = containerVisibility;
  });
define("fusor-ember-cli/tests/torii-providers/foreman.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - torii-providers');
    test('torii-providers/foreman.js should pass jshint', function() { 
      ok(false, 'torii-providers/foreman.js should pass jshint.\ntorii-providers/foreman.js: line 1, col 16, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 5, col 16, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 7, col 7, \'exampleAsyncLogin\' is not defined.\ntorii-providers/foreman.js: line 14, col 11, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 5, col 53, \'reject\' is defined but never used.\n\n5 errors'); 
    });
  });
define("fusor-ember-cli/tests/unit/adapters/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("adapter:application", "ApplicationAdapter", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var adapter = this.subject();
      ok(adapter);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("fusor-ember-cli/tests/unit/adapters/hostgroup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("adapter:hostgroup", "HostgroupAdapter", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var adapter = this.subject();
      ok(adapter);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("fusor-ember-cli/tests/unit/adapters/traffic-type-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("adapter:traffic-type", "TrafficTypeAdapter", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var adapter = this.subject();
      ok(adapter);
    });
    // Specify the other units that are required for this test.
    // needs: ['serializer:foo']
  });
define("fusor-ember-cli/tests/unit/components/accordion-item-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("accordion-item", "AccordionItemComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/base-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("base-f", "BaseFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/env-path-list-item-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("env-path-list-item", "EnvPathListItemComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/modal-confirm-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("model-confirm", "ModelConfirmComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/radio-button-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("radio-button-f", "RadioButtonFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/rchi-item-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("rchi-item", "RchiItemComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/rhci-hover-text-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("rhci-hover-text", "RhciHoverTextComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/select-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("select-f", "SelectFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/select-simple-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("select-simple-f", "SelectSimpleFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/step-number-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("step-number", "StepNumberComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/sub-menu-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("sub-menu", "SubMenuComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/subnet-drop-area-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("subnet-drop-area", "SubnetDropAreaComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/text-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("text-f", "TextFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/textarea-f-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("textarea-f", "TextareaFComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/tr-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("tr-organization", "TrOrganizationComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/traffic-type-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("traffic-type", "TrafficTypeComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/upstream-downstream-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("upstream-downstream", "UpstreamDownstreamComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/vertical-tab-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("vertical-tab", "VerticalTabComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/components/wrap-in-container-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForComponent = __dependency1__.moduleForComponent;
    var test = __dependency1__.test;

    moduleForComponent("wrap-in-container", "WrapInContainerComponent", {});

    test("it renders", function () {
      expect(2);

      // creates the component instance
      var component = this.subject();
      equal(component._state, "preRender");

      // appends the component to the page
      this.append();
      equal(component._state, "inDOM");
    });
    // specify the other units that are required for this test
    // needs: ['component:foo', 'helper:bar']
  });
define("fusor-ember-cli/tests/unit/controllers/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:application", "ApplicationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/cancel-modal-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:settings-model", "SettingsModelController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:cloudforms-storage-domain", "CloudformsStorageDomainController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:cloudforms-vm", "CloudformsVmController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/configure-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:configure-environment", "ConfigureEnvironmentController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/configure-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:configure-organization", "ConfigureOrganizationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/configure-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:configure", "ConfigureController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/configure/new-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:configure/new-organization", "ConfigureNewOrganizationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/deployment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:deployment", "DeploymentController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:engine/discovered-host", "EngineDiscoveredHostController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:host", "HostController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/hostgroup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:hostgroup", "HostgroupController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/hypervisor-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:hypervisor", "HypervisorController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:hypervisor/discovered-host", "HypervisorDiscoveredHostController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:environment", "EnvironmentController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:environments", "EnvironmentsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/login-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:login", "LoginController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/logout-model-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:logout-model", "LogoutModelController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/networking-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:networking", "NetworkingController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/new-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:new-environment", "NewEnvironmentController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/new-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:new-organization", "NewOrganizationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:organization", "OrganizationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/organizations-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:organizations", "OrganizationsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/osp-configuration-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:osp-configuration", "OspConfigurationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/osp-network-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:osp-network", "OspNetworkController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/osp-settings-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:osp-settings", "OspSettingsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/product-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:product", "ProductController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/products-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:products", "ProductsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/review-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:review", "ReviewController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/review/installation-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:review/installation", "ReviewInstallationController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/rhci-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:rhci", "RhciController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/rhev-options-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:rhev-options", "RhevOptionsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/rhev-setup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:rhev-setup", "RhevSetupController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/rhev-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:rhev", "RhevController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/rhev/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:rhev/index", "RhevIndexController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/satellite-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:satellite", "SatelliteController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/satellite/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:satellite/index", "SatelliteIndexController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/satellite/subscriptions-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:subscriptions", "SatelliteSubscriptionsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/side-menu-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:side-menu", "SideMenuController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/storage-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:storage", "StorageController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/subscription-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:subscription", "SubscriptionController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/subscriptions-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:subscriptions", "SubscriptionsController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:user", "UserController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/user/edit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:user/edit", "UserEditController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/users-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:users", "UsersController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/users/new-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:users/new", "UsersNewController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/controllers/where-install-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("controller:where-install", "WhereInstallController", {});

    // Replace this with your real tests.
    test("it exists", function () {
      var controller = this.subject();
      ok(controller);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/helpers/raw-text-test", 
  ["fusor-ember-cli/helpers/raw-text"],
  function(__dependency1__) {
    "use strict";
    var rawText = __dependency1__.rawText;

    module("RawTextHelper");

    // Replace this with your real tests.
    test("it works", function () {
      var result = rawText(42);
      ok(result);
    });
  });
define("fusor-ember-cli/tests/unit/models/deployment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("deployment", "Deployment", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("host", "Host", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/hostgroup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("hostgroup", "Hostgroup", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/lifecycle-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("environment", "Environment", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/location-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("location", "Location", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/note-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("note", "Note", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/oauth-access-token-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("oauth-access-token", "OauthAccessToken", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("organization", "Organization", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/product-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("product", "Product", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/rhev-setup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("rhev-setup", "RhevSetup", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/subnet-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("subnet", "Subnet", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/subscription-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("subscription", "Subscription", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/traffic-type-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("traffic-type", "TrafficType", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/models/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleForModel = __dependency1__.moduleForModel;
    var test = __dependency1__.test;

    moduleForModel("user", "User", {
      // Specify the other units that are required for this test.
      needs: []
    });

    test("it exists", function () {
      var model = this.subject();
      // var store = this.store();
      ok(!!model);
    });
  });
define("fusor-ember-cli/tests/unit/routes/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:application", "ApplicationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:cloudforms-storage-domain", "CloudformsStorageDomainRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/cloudforms-vm-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:cloudforms-vm", "CloudformsVmRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/cloudforms/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:cloudforms/index", "CloudformsIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/configure-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:configure-environment", "ConfigureEnvironmentRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/configure-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:configure-organization", "ConfigureOrganizationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/configure/new-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:configure/new-organization", "ConfigureNewOrganizationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/content-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:content", "ContentRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployment", "DeploymentRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployment/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployment/index", "DeploymentIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployment/new-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployment/new", "DeploymentNewRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployment/review-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployment/review", "DeploymentReviewRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployment/satellite/configure/new-organization", "DeploymentSatelliteConfigureNewOrganizationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/deployments-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:deployments", "DeploymentsRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/engine-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:engine", "EngineRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/engine/discovered-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:engine/discovered-host", "EngineDiscoveredHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/engine/existing-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:engine/existing-host", "EngineExistingHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/engine/hypervisor-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:engine/hypervisor", "EngineHypervisorRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/engine/new-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:engine/new-host", "EngineNewHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hostgroup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hostgroup", "HostgroupRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hostgroup/edit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hostgroup/edit", "HostgroupEditRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hostgroups-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hostgroups", "HostgroupsRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hypervisor-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hypervisor", "HypervisorRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hypervisor/discovered-host", "HypervisorDiscoveredHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hypervisor/existing-host", "HypervisorExistingHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:hypervisor/new-host", "HypervisorNewHostRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:index", "IndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/loggedin-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:loggedin", "LoggedinRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/login-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:login", "LoginRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/networking-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:networking", "NetworkingRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/new-environment-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:new-environment", "NewEnvironmentRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/new-organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:new-organization", "NewOrganizationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/openstack/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:openstack/index", "OpenstackIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/osp-configuration-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:osp-configuration", "OspConfigurationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/osp-network-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:osp-network", "OspNetworkRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/osp-overview-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:osp-overview", "OspOverviewRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/osp-settings-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:osp-settings", "OspSettingsRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/review/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:review/index", "ReviewIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/review/installation-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:review/installation", "ReviewInstallationRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/review/progress-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:review/progress", "ReviewProgressRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhci-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhci", "RhciRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhev-options-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhev-options", "RhevOptionsRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhev-setup-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhev-setup", "RhevSetupRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhev-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhev", "RhevRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhev/engine-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhev/engine", "RhevEngineRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/rhev/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:rhev/index", "RhevIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/satellite-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:satellite", "SatelliteRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/satellite/configure-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:satellite/configure", "SatelliteConfigureRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/satellite/index-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:satellite/index", "SatelliteIndexRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/satellite/review-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:satellite/review", "SatelliteReviewRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:subscriptions", "SatelliteSubscriptionsRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/setpassword-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:setpassword", "SetpasswordRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/storage-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:storage", "StorageRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/user-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:user", "UserRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/user/edit-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:user/edit", "UserEditRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/users-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:users", "UsersRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/users/new-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:users/new", "UsersNewRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/routes/where-install-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("route:where-install", "WhereInstallRoute", {});

    test("it exists", function () {
      var route = this.subject();
      ok(route);
    });
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });
define("fusor-ember-cli/tests/unit/views/application-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:application", "ApplicationView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("fusor-ember-cli/tests/unit/views/configure-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:configure", "ConfigureView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("fusor-ember-cli/tests/unit/views/organization-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:organization", "OrganizationView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("fusor-ember-cli/tests/unit/views/rhci-test", 
  ["ember-qunit"],
  function(__dependency1__) {
    "use strict";
    var moduleFor = __dependency1__.moduleFor;
    var test = __dependency1__.test;

    moduleFor("view:rhci", "RhciView");

    // Replace this with your real tests.
    test("it exists", function () {
      var view = this.subject();
      ok(view);
    });
  });
define("fusor-ember-cli/tests/views/configure.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/configure.js should pass jshint', function() { 
      ok(true, 'views/configure.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/tests/views/organization.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/organization.js should pass jshint', function() { 
      ok(false, 'views/organization.js should pass jshint.\nviews/organization.js: line 18, col 25, \'event\' is defined but never used.\n\n1 error'); 
    });
  });
define("fusor-ember-cli/tests/views/rhci.jshint", 
  [],
  function() {
    "use strict";
    module('JSHint - views');
    test('views/rhci.js should pass jshint', function() { 
      ok(true, 'views/rhci.js should pass jshint.'); 
    });
  });
define("fusor-ember-cli/torii-providers/foreman", 
  ["exports"],
  function(__exports__) {
    "use strict";
    __exports__["default"] = Ember.Object.extend({

      // credentials as passed from torii.open
      open: function (credentials) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
          alert(credentials.username);
          exampleAsyncLogin(credentials.username, credentials.password,

          // callback function:
          function (error, response) {
            // the promise is resolved with the authorization
            Ember.run.bind(null, resolve, { sessionToken: response.token });
          });
        });
      }

    });
  });
define("fusor-ember-cli/views/configure", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({});
  });
define("fusor-ember-cli/views/organization", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({
      classNameBindings: ["color"],
      color: null,
      highlight: function () {
        return this.get("color");
      },

      // mouseEnter: function(event) {
      //   this.set('color', 'yellow');
      // },

      // mouseLeave: function(event) {
      //   this.set('color', 'green');
      //   //alert("mouseLeave!");
      // },
      doubleClick: function (event) {
        this.set("color", "red");
        //alert("ClickableView was clicked!");
      } });
  });
define("fusor-ember-cli/views/radio-button", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend({
      tagName: "input",
      type: "radio",
      attributeBindings: ["type", "htmlChecked:checked", "value", "name"],

      htmlChecked: (function () {
        return this.get("value") === this.get("checked");
      }).property("value", "checked"),

      change: function () {
        this.set("checked", this.get("value"));
      },

      _updateElementValue: (function () {
        Ember.run.next(this, function () {
          this.$().prop("checked", this.get("htmlChecked"));
        });
      }).observes("htmlChecked")
    });
  });
define("fusor-ember-cli/views/rhci", 
  ["ember","exports"],
  function(__dependency1__, __exports__) {
    "use strict";
    var Ember = __dependency1__["default"];

    __exports__["default"] = Ember.View.extend(Ember.ViewTargetActionSupport, {});


    // classNameBindings: ['color'],
    // color: null,
    // highlight: function() {
    //   return this.get('color');
    // },

    // mouseEnter: function(event) {
    //   this.set('color', 'yellow');
    // },

    // mouseLeave: function(event) {
    //   this.set('color', 'green');
    //   //alert("mouseLeave!");
    // },
    // doubleClick: function(event) {
    //   this.set('color', 'red');
    //   //alert("ClickableView was clicked!");
    // },

    // didInsertElement: function(){
    //     this.$().hide().show('slow');
    // }

    // click: function() {
    //   this.triggerAction({
    //     action: 'showRHCIModal'
    //   }); // Sends the `save` action, along with the current context
    //       // to the current controller
    // },
    // doRhciModal: function() {
    //   // this.triggerAction({
    //   //   action: 'ddd'
    //   // });
    //   alert('DDD');
    // }.on('didInsertElement'),
  });
/* jshint ignore:start */

define('fusor-ember-cli/config/environment', ['ember'], function(Ember) {
  var prefix = 'fusor-ember-cli';
/* jshint ignore:start */

try {
  var metaName = prefix + '/config/environment';
  var rawConfig = Ember['default'].$('meta[name="' + metaName + '"]').attr('content');
  var config = JSON.parse(unescape(rawConfig));

  return { 'default': config };
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

/* jshint ignore:end */

});

if (runningTests) {
  require("fusor-ember-cli/tests/test-helper");
} else {
  require("fusor-ember-cli/app")["default"].create({"LOG_ACTIVE_GENERATION":true,"LOG_TRANSITIONS":true,"LOG_VIEW_LOOKUPS":true,"rootElement":"#ember-app"});
}

/* jshint ignore:end */
//# sourceMappingURL=fusor-ember-cli.map