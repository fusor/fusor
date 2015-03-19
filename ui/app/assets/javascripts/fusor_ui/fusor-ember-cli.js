define('fusor-ember-cli/adapters/application', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    namespace: "api/v21" });

});
define('fusor-ember-cli/adapters/deployment', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].ActiveModelAdapter.extend({
    namespace: "fusor/api/v21" });

});
define('fusor-ember-cli/app', ['exports', 'ember', 'ember/resolver', 'ember/load-initializers', './config/environment'], function (exports, Ember, Resolver, loadInitializers, config) {

  'use strict';

  Ember['default'].MODEL_FACTORY_INJECTIONS = true;

  var App = Ember['default'].Application.extend({
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix,
    Resolver: Resolver['default']
  });

  loadInitializers['default'](App, config['default'].modulePrefix);

  exports['default'] = App;

});
define('fusor-ember-cli/authenticators/foreman', ['exports', 'simple-auth/authenticators/base', 'fusor-ember-cli/adapters/application'], function (exports, Base, ApplicationAdapter) {

  'use strict';

  // app/authenticators/custom.js
  exports['default'] = Base['default'].extend({

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
define('fusor-ember-cli/components/accordion-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    isOpen: false,
    actions: {
      openItem: function () {
        this.set("isOpen", this.toggleProperty("isOpen"));
      }
    }
  });

});
define('fusor-ember-cli/components/base-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    labelClassSize: (function () {
      return this.getWithDefault("labelSize", "col-md-2");
    }).property(),
    inputClassSize: (function () {
      return this.getWithDefault("inputSize", "col-md-4");
    }).property()
  });

});
define('fusor-ember-cli/components/draggable-object-target', ['exports', 'ember', 'ember-drag-drop/mixins/droppable', '../helpers/log'], function (exports, Ember, Droppable, log) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend(Droppable['default'], {
    classNames: ["draggable-object-target"],

    handlePayload: function (payload) {
      log['default']("in handlePayload");
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
define('fusor-ember-cli/components/draggable-object', ['exports', 'ember', '../helpers/log'], function (exports, Ember, log) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "div",
    classNames: ["draggable-object"],
    classNameBindings: ["isDraggingObject"],
    attributeBindings: ["draggable"],

    draggable: (function () {
      return "true";
    }).property(),

    handleDragStart: (function (event) {
      log['default']("handleDragStart");

      var dataTransfer = event.dataTransfer;

      var obj = this.get("content");
      var id = this.get("coordinator").setObject(obj, { source: this });

      dataTransfer.setData("Text", id);

      obj.set("isDraggingObject", true);
      this.set("isDraggingObject", true);
    }).on("dragStart"),

    handleDragEnd: (function () {
      log['default']("handleDragEnd");
      this.set("content.isDraggingObject", false);
      this.set("isDraggingObject", false);
    }).on("dragEnd"),

    actions: {
      selectForDrag: function () {
        log['default']("selectForDrag");
        var obj = this.get("content");
        var hashId = this.get("coordinator").setObject(obj, { source: this });
        this.get("coordinator").set("clickedId", hashId);
      }
    }
  });

});
define('fusor-ember-cli/components/env-path-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "li",
    classNames: ["path-list-item", "list_item_active"],

    isChecked: (function () {
      return this.get("selectedEnvironment") === this.get("env");
    }).property("selectedEnvironment", "env"),

    bgColor: (function () {
      if (this.get("isChecked")) {
        return "env_path_active";
      } else {
        return null;
      }
    }).property("isChecked"),

    click: function (event) {
      this.sendAction("action", this.get("env"));
    }

  });

});
define('fusor-ember-cli/components/modal-confirm', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

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
define('fusor-ember-cli/components/object-bin', ['exports', 'ember', '../helpers/log'], function (exports, Ember, log) {

  'use strict';

  var YieldLocalMixin = Ember['default'].Mixin.create({
    _yield: function (context, options) {
      var view = options.data.view;
      var parentView = this._parentView;
      var template = Ember['default'].get(this, "template");

      if (template) {
        Ember['default'].assert("A Component must have a parent view in order to yield.", parentView);

        view.appendChild(Ember['default'].View, {
          isVirtual: true,
          tagName: "",
          _contextView: parentView,
          template: template,
          context: Ember['default'].get(view, "context"),
          controller: Ember['default'].get(view, "controller"),
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

  exports['default'] = Ember['default'].Component.extend(YieldLocalMixin, {
    model: [],
    classNames: ["draggable-object-bin"],

    manageList: true,

    handleObjectMoved: (function () {
      log['default']("bin objectMoved");
    }).on("objectMoved"),

    actions: {
      handleObjectDropped: function (obj) {
        log['default']("bin handleObjectDropped");
        log['default']("manageList " + this.get("manageList"));

        if (this.get("manageList")) {
          log['default']("pushing object");
          this.get("model").pushObject(obj);
        }

        this.trigger("objectDroppedInternal", obj);
        this.sendAction("objectDropped", { obj: obj, bin: this });
      },

      handleObjectDragged: function (obj) {
        log['default']("bin handleObjectDragged");
        if (this.get("manageList")) {
          removeOne(this.get("model"), obj);
        }
        this.trigger("objectDraggedInternal", obj);
        this.sendAction("objectDragged");
      }
    }
  });

});
define('fusor-ember-cli/components/radio-button-f', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('fusor-ember-cli/components/radio-button-input', ['exports', 'ember-radio-button/components/radio-button-input'], function (exports, RadioButton) {

	'use strict';

	exports['default'] = RadioButton['default'];

});
define('fusor-ember-cli/components/radio-button', ['exports', 'ember-radio-button/components/radio-button'], function (exports, RadioButton) {

	'use strict';

	exports['default'] = RadioButton['default'];

});
define('fusor-ember-cli/components/rchi-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["rhci-item"],
    classNameBindings: ["isChecked:rhci-item-selected:rhci-item-deselected", "isHover:rhci-item-hover"],

    click: function () {
      this.set("isChecked", this.toggleProperty("isChecked"));
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

});
define('fusor-ember-cli/components/rhci-hover-text', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["rhci-footer-hover"] });

});
define('fusor-ember-cli/components/rhci-start', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('fusor-ember-cli/components/rhci-wizard', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('fusor-ember-cli/components/select-f', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('fusor-ember-cli/components/select-simple-f', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Component.extend({});

});
define('fusor-ember-cli/components/step-number', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "span",
    classNames: ["badge"],
    classNameBindings: ["badgeInverse"],
    badgeInverse: false
  });

});
define('fusor-ember-cli/components/sub-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "li",
    classNames: ["dropdown", "menu_tab_dropdown"]
  });

});
define('fusor-ember-cli/components/subnet-drop-area', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["subnet-drop-zone", "panel", "panel-default"]

  });

});
define('fusor-ember-cli/components/text-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    typeInput: (function () {
      return this.get("type") ? this.get("type") : "text";
    }).property("type"),

    actions: {
      showErrors: function () {
        this.set("showError", true);
      }
    }

  });

});
define('fusor-ember-cli/components/textarea-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

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
define('fusor-ember-cli/components/tr-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({

    isChecked: (function () {
      return this.get("selectedOrganization") == this.get("org");
    }).property("selectedOrganization", "org"),

    actions: {
      organizationChanged: function (event) {
        this.sendAction("action", this.get("org"));
      }
    }

  });

});
define('fusor-ember-cli/components/traffic-type', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    classNames: ["subnet-type-pull", "existing ui-draggable"]
  });

});
define('fusor-ember-cli/components/upstream-downstream', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
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
define('fusor-ember-cli/components/vertical-tab', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "li"
  });

});
define('fusor-ember-cli/components/wizard-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Component.extend({
    tagName: "li",
    classNames: ["wizard-item"],

    classNameBindings: "active",

    active: (function () {
      return this.get("childViews.firstObject.active");
    }).property() });


  // isReviewTab: function() {
  //   return (this.get('routeName') == 'review')
  // }.property('routeName')

});
define('fusor-ember-cli/controllers/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["side-menu", "deployment"],

    isLiveBackendMode: true,
    deployAsPlugin: false,
    isEmberCliMode: Ember['default'].computed.not("deployAsPlugin"),
    isUpstream: false,

    isContainer: Ember['default'].computed.alias("isUpstream"),

    showMainMenu: Ember['default'].computed.and("isLoggedIn", "isEmberCliMode"),
    showSideMenu: Ember['default'].computed.alias("controllers.side-menu.showSideMenu"),

    isLoggedIn: Ember['default'].computed.alias("session.isAuthenticated"),

    loginUsername: Ember['default'].computed.alias("session.currentUser.login"),

    accessToken: (function () {
      return this.get("session.access_token");
    }).property("session.access_token"),

    myModalButtons: [Ember['default'].Object.create({ title: "Submit", type: "primary", clicked: "submit" }), Ember['default'].Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" })],

    nameRHCI: Ember['default'].computed.alias("controllers.deployment.nameRHCI"),
    nameRhev: Ember['default'].computed.alias("controllers.deployment.nameRhev"),
    nameOpenStack: Ember['default'].computed.alias("controllers.deployment.nameOpenStack"),
    nameCloudForms: Ember['default'].computed.alias("controllers.deployment.nameCloudForms"),
    nameSatellite: Ember['default'].computed.alias("controllers.deployment.nameSatellite"),
    logoPath: Ember['default'].computed.alias("controllers.deployment.logoPath"),

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
define('fusor-ember-cli/controllers/cancel-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    actions: {
      save: function () {
        return this.transitionTo("deployments");
      }
    }
  });

});
define('fusor-ember-cli/controllers/cloudforms-storage-domain', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    nfsShare: "/export/export_domain"
  });

});
define('fusor-ember-cli/controllers/cloudforms-vm', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('fusor-ember-cli/controllers/cloudforms', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["deployment"],
    stepNumberCloudForms: Ember['default'].computed.alias("controllers.deployment.stepNumberCloudForms") });

});
define('fusor-ember-cli/controllers/configure-environment', ['exports', 'ember', '../mixins/configure-environment-mixin'], function (exports, Ember, ConfigureEnvironmentMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(ConfigureEnvironmentMixin['default'], {

    needs: ["deployment"],

    disableNextOnLifecycleEnvironment: Ember['default'].computed.alias("controllers.deployment.disableNextOnLifecycleEnvironment"),

    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment.organizationTabRouteName"),

    selectedOrganization: Ember['default'].computed.alias("controllers.deployment.organization"),

    step2RouteName: Ember['default'].computed.alias("controllers.deployment.step2RouteName"),

    actions: {
      selectEnvironment: function (environment) {
        this.set("showAlertMessage", false);
        this.set("selectedEnvironment", environment);
        return this.get("controllers.deployment").set("lifecycle_environment", environment);
      },

      createEnvironment: function () {
        var self = this;
        var selectedOrganization = this.get("selectedOrganization");
        this.set("fields_env.name", this.get("name"));
        this.set("fields_env.label", this.get("label"));
        this.set("fields_env.description", this.get("description"));
        this.set("fields_env.organization", selectedOrganization);

        // TODO - refactor DRY
        if (this.get("hasLibrary")) {
          var library = this.get("libraryEnvForOrg");
          // assign library to prior db attribute
          this.set("fields_env.prior", library.get("id"));
          var environment = this.store.createRecord("lifecycle-environment", this.get("fields_env"));
          environment.save().then(function (result) {
            //success
            self.get("nonLibraryEnvironments").pushObject(result);
            self.set("selectedEnvironment", environment);
            self.get("controllers.deployment").set("lifecycle_environment", environment);
            return self.set("showAlertMessage", true);
          }, function (response) {
            alert("error saving environment");
          });
        } else {
          // create library
          var library = this.store.createRecord("lifecycle-environment", { name: "Library", label: "Library", library: true, organization: selectedOrganization });
          // save library first and then save environment
          library.save().then(function (response) {
            self.set("fields_env.prior", response.get("id"));
            var environment = this.store.createRecord("lifecycle-environment", this.get("fields_env"));
            environment.save().then(function (result) {
              //success
              self.get("nonLibraryEnvironments").pushObject(result);
              self.set("selectedEnvironment", environment);
              return self.set("showAlertMessage", true);
            }, function (response) {
              alert("error saving environment");
            });
          });
        }

        return Bootstrap.ModalManager.hide("newEnvironmentModal");
      } }

  });

});
define('fusor-ember-cli/controllers/configure-organization', ['exports', 'ember', '../mixins/configure-organization-mixin'], function (exports, Ember, ConfigureOrganizationMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(ConfigureOrganizationMixin['default'], {

    needs: ["deployment"],

    organization: Ember['default'].computed.alias("controllers.deployment.organization"),

    disableNextOnConfigureOrganization: Ember['default'].computed.alias("controllers.deployment.disableNextOnConfigureOrganization"),
    satelliteTabRouteName: Ember['default'].computed.alias("controllers.deployment.satelliteTabRouteName"),
    lifecycleEnvironmentTabRouteName: Ember['default'].computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),
    deploymentName: Ember['default'].computed.alias("controllers.deployment.name"),

    actions: {
      selectOrganization: function (organization) {
        this.set("showAlertMessage", false);
        this.set("selectedOrganization", organization);
        return this.get("controllers.deployment").set("organization", organization);
      }
    } });

});
define('fusor-ember-cli/controllers/deployment-new', ['exports', 'ember', '../mixins/deployment-controller-mixin', '../mixins/disable-tab-mixin'], function (exports, Ember, DeploymentControllerMixin, DisableTabMixin) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend(DeploymentControllerMixin['default'], DisableTabMixin['default'], {

    // these tabs will always be disabled within deployment-new
    isDisabledRhev: true,
    isDisabledOpenstack: true,
    isDisabledCloudForms: true,
    isDisabledSubscriptions: true,
    isDisabledReview: true });

});
define('fusor-ember-cli/controllers/deployment-new/satellite', ['exports', 'ember', '../../mixins/satellite-controller-mixin'], function (exports, Ember, SatelliteControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SatelliteControllerMixin['default'], {

    needs: ["deployment-new"],

    satelliteTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.satelliteTabRouteName"),
    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.organizationTabRouteName"),
    lifecycleEnvironmentTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.lifecycleEnvironmentTabRouteName"),

    disableTabDeploymentName: Ember['default'].computed.alias("controllers.deployment-new.disableTabDeploymentName"),
    disableTabConfigureOrganization: Ember['default'].computed.alias("controllers.deployment-new.disableTabConfigureOrganization"),
    disableTabLifecycleEnvironment: Ember['default'].computed.alias("controllers.deployment-new.disableTabLifecycleEnvironment") });

});
define('fusor-ember-cli/controllers/deployment-new/satellite/configure-environment', ['exports', 'ember', '../../../mixins/configure-environment-mixin'], function (exports, Ember, ConfigureEnvironmentMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(ConfigureEnvironmentMixin['default'], {

    needs: ["deployment-new"],

    disableNextOnLifecycleEnvironment: Ember['default'].computed.alias("controllers.deployment-new.disableNextOnLifecycleEnvironment"),

    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.organizationTabRouteName"),

    selectedOrganization: Ember['default'].computed.alias("controllers.deployment-new.organization"),

    step2RouteName: Ember['default'].computed.alias("controllers.deployment-new.step2RouteName"),

    actions: {
      selectEnvironment: function (environment) {
        this.set("showAlertMessage", false);
        this.set("selectedEnvironment", environment);
        return this.get("controllers.deployment-new").set("lifecycle_environment", environment);
      },

      createEnvironment: function () {
        var self = this;
        var selectedOrganization = this.get("selectedOrganization");
        this.set("fields_env.name", this.get("name"));
        this.set("fields_env.label", this.get("label"));
        this.set("fields_env.description", this.get("description"));
        this.set("fields_env.organization", selectedOrganization);

        // TODO - refactor DRY
        if (this.get("hasLibrary")) {
          var library = this.get("libraryEnvForOrg");
          // assign library to prior db attribute
          this.set("fields_env.prior", library.get("id"));
          var environment = this.store.createRecord("lifecycle-environment", this.get("fields_env"));
          environment.save().then(function (result) {
            //success
            self.get("nonLibraryEnvironments").pushObject(result);
            self.set("selectedEnvironment", environment);
            self.get("controllers.deployment-new").set("lifecycle_environment", environment);
            return self.set("showAlertMessage", true);
          }, function (response) {
            alert("error saving environment");
          });
        } else {
          // create library
          var library = this.store.createRecord("lifecycle-environment", { name: "Library", label: "Library", library: true, organization: selectedOrganization });
          // save library first and then save environment
          library.save().then(function (response) {
            self.set("fields_env.prior", response.get("id"));
            var environment = this.store.createRecord("lifecycle-environment", this.get("fields_env"));
            environment.save().then(function (result) {
              //success
              self.get("nonLibraryEnvironments").pushObject(result);
              self.set("selectedEnvironment", environment);
              return self.set("showAlertMessage", true);
            }, function (response) {
              alert("error saving environment");
            });
          });
        }

        return Bootstrap.ModalManager.hide("newEnvironmentModal");
      } }
  });

});
define('fusor-ember-cli/controllers/deployment-new/satellite/configure-organization', ['exports', 'ember', '../../../mixins/configure-organization-mixin'], function (exports, Ember, ConfigureOrganizationMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(ConfigureOrganizationMixin['default'], {

    needs: ["deployment-new"],

    organization: Ember['default'].computed.alias("controllers.deployment-new.organization"),

    disableNextOnConfigureOrganization: Ember['default'].computed.alias("controllers.deployment-new.disableNextOnConfigureOrganization"),
    satelliteTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.satelliteTabRouteName"),
    lifecycleEnvironmentTabRouteName: Ember['default'].computed.alias("controllers.deployment-new.lifecycleEnvironmentTabRouteName"),
    deploymentName: Ember['default'].computed.alias("controllers.deployment-new.name"),

    actions: {
      selectOrganization: function (organization) {
        this.set("showAlertMessage", false);
        return this.get("controllers.deployment-new").set("organization", organization);
      }
    } });

});
define('fusor-ember-cli/controllers/deployment-new/satellite/index', ['exports', 'ember', '../../../mixins/satellite-controller-mixin', 'ember-validations'], function (exports, Ember, SatelliteControllerMixin, EmberValidations) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SatelliteControllerMixin['default'], EmberValidations['default'].Mixin, {

    needs: ["deployment-new", "deployment-new/satellite"],

    validations: {
      name: {
        presence: true } },

    name: Ember['default'].computed.alias("controllers.deployment-new.name"),
    description: Ember['default'].computed.alias("controllers.deployment-new.description"),

    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment-new/satellite.organizationTabRouteName"),

    disableNextOnDeploymentName: Ember['default'].computed.alias("controllers.deployment-new.disableNextOnDeploymentName") });

});
define('fusor-ember-cli/controllers/deployment-new/start', ['exports', 'ember', '../../mixins/start-controller-mixin'], function (exports, Ember, StartControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend(StartControllerMixin['default'], {

    needs: ["deployment-new"],

    isRhev: Ember['default'].computed.alias("controllers.deployment-new.deploy_rhev"),
    isOpenStack: Ember['default'].computed.alias("controllers.deployment-new.deploy_openstack"),
    isCloudForms: Ember['default'].computed.alias("controllers.deployment-new.deploy_cfme") });

});
define('fusor-ember-cli/controllers/deployment', ['exports', 'ember', '../mixins/deployment-controller-mixin', '../mixins/disable-tab-mixin', 'ember-validations'], function (exports, Ember, DeploymentControllerMixin, DisableTabMixin, EmberValidations) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend(DeploymentControllerMixin['default'], DisableTabMixin['default'], EmberValidations['default'].Mixin, {

    validations: {
      name: {
        presence: true,
        length: { minimum: 2 }
      } },

    selectedRhevEngine: null,

    satelliteInvalid: Ember['default'].computed.or("hasNoName", "hasNoOrganization", "hasNoLifecycleEnvironment"),

    // disable Steps 2, 3, 4, etc on wizard
    isDisabledRhev: Ember['default'].computed.alias("satelliteInvalid"),
    isDisabledOpenstack: Ember['default'].computed.alias("satelliteInvalid"),
    isDisabledCloudForms: Ember['default'].computed.alias("satelliteInvalid"),
    isDisabledSubscriptions: Ember['default'].computed.alias("satelliteInvalid"),
    isDisabledReview: Ember['default'].computed.alias("satelliteInvalid") });

});
define('fusor-ember-cli/controllers/deployment/start', ['exports', 'ember', '../../mixins/start-controller-mixin'], function (exports, Ember, StartControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend(StartControllerMixin['default'], {

    needs: ["deployment"],

    isRhev: Ember['default'].computed.alias("controllers.deployment.deploy_rhev"),
    isOpenStack: Ember['default'].computed.alias("controllers.deployment.deploy_openstack"),
    isCloudForms: Ember['default'].computed.alias("controllers.deployment.deploy_cfme") });

});
define('fusor-ember-cli/controllers/deployments', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({

    sortProperties: ["name"],
    sortAscending: true,

    sortedDeployments: Ember['default'].computed.sort("model", "sortProperties"),

    searchDeploymentString: "",

    filteredDeployments: (function () {
      var searchDeploymentString = this.get("searchDeploymentString");
      var rx = new RegExp(searchDeploymentString, "gi");
      var model = this.get("sortedDeployments");

      return model.filter(function (record) {
        return record.get("name").match(rx);
      });
    }).property("sortedDeployments", "searchDeploymentString") });

});
define('fusor-ember-cli/controllers/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({

    needs: ["deployment", "hypervisor/discovered-host", "engine/discovered-host"],

    allDiscoveredHosts: Ember['default'].computed.alias("controllers.hypervisor/discovered-host.allDiscoveredHosts"),
    // same as controllers.deployment.discovered_hosts
    selectedRhevHypervisorHosts: Ember['default'].computed.alias("controllers.hypervisor/discovered-host.model"),
    // same as controllers.deployment.discovered_host
    selectedRhevEngineHost: Ember['default'].computed.alias("controllers.engine/discovered-host.model"),

    rhev_engine_hostname: Ember['default'].computed.alias("controllers.deployment.rhev_engine_hostname"),

    isSelectedAsHypervisor: (function () {
      if (this.get("selectedRhevHypervisorHosts")) {
        var selectedIds = this.get("selectedRhevHypervisorHosts").getEach("id");
        return selectedIds.contains(this.get("id"));
      } else {
        return false;
      }
    }).property("allDiscoveredHosts"),

    isSelectedAsEngine: (function () {
      return this.get("selectedRhevEngineHost.id") === this.get("id");
    }).property("selectedRhevEngineHost"),

    actions: {
      engineHostChanged: function (host) {
        var engine_hostname = host.get("name");
        var controller = this.get("controllers.deployment");
        return this.store.find("discovered-host", host.get("id")).then(function (result) {
          controller.set("rhev_engine_hostname", engine_hostname);
          return controller.set("discovered_host", result);
          //TODO save hostname on discovered host on save deploy
        });
      }
    }

  });

});
define('fusor-ember-cli/controllers/engine', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["rhev"],
    engineTabName: Ember['default'].computed.alias("controllers.rhev.engineTabName") });

});
define('fusor-ember-cli/controllers/engine/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    needs: ["deployment", "hypervisor/discovered-host"],

    selectedRhevEngineHost: Ember['default'].computed.alias("model"),

    // Filter out hosts selected as Hypervisor
    availableHosts: Ember['default'].computed.filter("allDiscoveredHosts", function (host, index, array) {
      return host.get("id") != "TODO aray of host ids";
    }).property("allDiscoveredHosts") });

});
define('fusor-ember-cli/controllers/host', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('fusor-ember-cli/controllers/hostgroup', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('fusor-ember-cli/controllers/hypervisor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["rhev"] });

});
define('fusor-ember-cli/controllers/hypervisor/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["deployment"],

    //discovered_hosts: Ember.computed.alias("controllers.deployment.discovered_hosts"),

    selectedRhevEngine: Ember['default'].computed.alias("controllers.deployment.discovered_host"),

    // Filter out hosts selected as Hypervisor
    availableHosts: Ember['default'].computed.filter("allDiscoveredHosts", function (host, index, array) {
      return host.get("id") != this.get("selectedRhevEngine.id");
    }).property("allDiscoveredHosts", "selectedRhevEngine"),

    selectedHosts: Em.computed.filterBy("model", "isSelectedAsHypervisor", true),

    modelIds: (function () {
      return this.get("model").getEach("id");
    }).property("model"),

    cntSelectedHosts: Em.computed.alias("selectedHosts.length"),

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
    }).property("model.@each.isSelectedAsHypervisor"),

    idsChecked: (function (key) {
      var model = this.get("model");
      if (model && model.isAny("isSelectedAsHypervisor")) {
        return this.get("selectedHosts").getEach("id"); //this.//   return model && model.isEvery('isSelectedAsHypervisor');
      } else {
        return "";
      }
    }).property("model.@each.isSelectedAsHypervisor", "selectedHosts") });

});
define('fusor-ember-cli/controllers/lifecycle-environment', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('fusor-ember-cli/controllers/lifecycle-environments', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ArrayController.extend({});

});
define('fusor-ember-cli/controllers/login', ['exports', 'ember', 'simple-auth/mixins/login-controller-mixin'], function (exports, Ember, LoginControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend(LoginControllerMixin['default'], {
    needs: ["application"],

    identification: null,
    password: null,
    errorMessage: null,

    authType: "Basic",
    sessionAuthType: Ember['default'].computed.alias("session.authType"),

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
            return self.transitionTo("deployment-new.start");
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
              return self.transitionTo("deployment-new.start");
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
            return self.transitionTo("deployment-new.start");
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
          var authCode = self.get("session.content.authorizationCode");
          //alert(authCode);
          Ember['default'].$.ajax({
            type: "POST",
            url: "https://github.com/login/oauth/access_token",
            data: {
              code: authCode,
              client_id: "985e267c717e3f873120",
              client_secret: "4855e5732487423f328f0c4ecfd57464aee2ee7b",
              redirect_uri: "http://development.fusor-ember-cli.divshot.io"
            },
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
              "Access-Control-Allow-Credentials": true
            },
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            success: function (data) {
              // TODO : manage access_token and save it to the session
              return alert(data);
            },
            failure: function (errMsg) {
              // TODO : manage error
              return alert("failure");
              return alert(errMsg);
            }
          });

          return self.transitionToRoute("deployment-new.start");
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
define('fusor-ember-cli/controllers/logout-model', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    actions: {
      logout: function () {
        alert("logout");
      }
    }
  });

});
define('fusor-ember-cli/controllers/networking', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    dnsName: null
  });

});
define('fusor-ember-cli/controllers/new-environment', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('fusor-ember-cli/controllers/new-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    fields: {},

    rhciModalButtons: [Ember['default'].Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember['default'].Object.create({ title: "Create", clicked: "createOrganization" })],

    myModalButtons: [Ember['default'].Object.create({ title: "Submit", type: "primary", clicked: "submit" }), Ember['default'].Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" })],

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
define('fusor-ember-cli/controllers/openstack', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["deployment"],
    stepNumberOpenstack: Ember['default'].computed.alias("controllers.deployment.stepNumberOpenstack") });

});
define('fusor-ember-cli/controllers/organization', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('fusor-ember-cli/controllers/organizations', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ArrayController.extend({});

});
define('fusor-ember-cli/controllers/osp-configuration', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    tenantType: "vxlan",
    corePlugin: "ml2",
    glanceBackend: "local",
    cinderBackend: "NFS" });

});
define('fusor-ember-cli/controllers/osp-network', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
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

  });

});
define('fusor-ember-cli/controllers/osp-settings', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    ha: "compute",
    networking: "neutron",
    messaging: "rabbitmq",
    platform: "rhel7",
    password: "random",
    customRepos: null });

});
define('fusor-ember-cli/controllers/products', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({

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
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 1000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 2000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 3000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 4000);
        Ember['default'].run.later(function () {
          self.set("syncingInProgress", false);
          self.set("showSuccessMessage", true);
        }, 4500);
      }

    } });

});
define('fusor-ember-cli/controllers/review', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    needs: ["subscriptions", "rhci", "application", "deployment"],

    isUpstream: Ember['default'].computed.alias("controllers.application.isUpstream"),
    disableNext: Ember['default'].computed.alias("controllers.subscriptions.disableNext"),
    disableTabProgress: true,

    disableTabInstallation: (function () {
      return this.get("disableNext") && !this.get("isUpstream");
    }).property("disableNext", "isUpstream"),

    nameSelectSubscriptions: Ember['default'].computed.alias("controllers.rhci.nameSelectSubscriptions"),

    stepNumberReview: Ember['default'].computed.alias("controllers.deployment.stepNumberReview") });

});
define('fusor-ember-cli/controllers/review/installation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["application", "rhci", "deployment", "satellite", "configure-organization", "configure-environment", "rhev-setup", "hypervisor", "hypervisor/discovered-host", "engine/discovered-host", "storage", "networking", "rhev-options", "osp-settings", "osp-configuration", "where-install", "cloudforms-storage-domain", "cloudforms-vm", "review"],

    hypervisorHostgroupId: 9,
    engineHostgroupId: 7,

    engineAdminPasswordLookupKeyId: 55,
    engineHostAddressLookupKeyId: 61,
    engineHostAddressDefault: "ovirt-hypervisor.rhci.redhat.com",
    hostAddress: Ember['default'].computed.alias("controllers.rhev-options.hostAddress"),
    engineHostName: Ember['default'].computed.alias("controllers.rhev-options.engineHostName"),

    //selectedRhevEngine: Ember.computed.alias("controllers.deployment.selectedRhevEngine"),

    nameDeployment: Ember['default'].computed.alias("controllers.deployment.name"),
    selectedOrganization: Ember['default'].computed.alias("controllers.deployment.selectedOrganzation"),
    selectedEnvironment: Ember['default'].computed.alias("controllers.deployment.selectedEnvironment"),
    rhevSetup: Ember['default'].computed.alias("controllers.deployment.rhevSetup"),

    isRhev: Ember['default'].computed.alias("controllers.deployment.isRhev"),
    isOpenStack: Ember['default'].computed.alias("controllers.deployment.isOpenStack"),
    isCloudForms: Ember['default'].computed.alias("controllers.deployment.isCloudForms"),

    hypervisorSelectedHosts: Ember['default'].computed.alias("controllers.hypervisor/discovered-host.selectedHosts"),
    engineSelectedHosts: Ember['default'].computed.alias("controllers.engine/discovered-host.selectedHosts"),

    hypervisorSelectedId: Ember['default'].computed.alias("controllers.hypervisor/discovered-host.idsChecked"),
    engineSelectedId: Ember['default'].computed.alias("controllers.engine/discovered-host.idsChecked"),
    isSelfHosted: Ember['default'].computed.alias("controllers.deployment.rhev_is_self_hosted"),
    rhev_engine_host: Ember['default'].computed.alias("controllers.deployment.rhev_engine_host"),
    selectedRhevEngine: Ember['default'].computed.alias("controllers.engine/discovered-host.selectedRhevEngine"),


    nameRHCI: Ember['default'].computed.alias("controllers.rhci.nameRHCI"),
    nameRhev: Ember['default'].computed.alias("controllers.rhci.nameRhev"),
    nameOpenStack: Ember['default'].computed.alias("controllers.rhci.nameOpenStack"),
    nameCloudForms: Ember['default'].computed.alias("controllers.rhci.nameCloudForms"),
    nameSatellite: Ember['default'].computed.alias("controllers.rhci.nameSatellite"),

    actions: {
      installDeployment: function (options) {
        console.log("OPTIONS");
        console.log(options);
        this.get("controllers.review").set("disableTabProgress", false);
        return this.transitionTo("review.progress");
      }
    }

  });

});
define('fusor-ember-cli/controllers/review/progress', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    isRhevOpen: false,
    isOpenStackOpen: false,
    isCloudFormsOpen: false,

    installationInProgress: true,

    prog: 1,

    incrementBy: 20 });

});
define('fusor-ember-cli/controllers/rhci', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].ObjectController.extend({});

});
define('fusor-ember-cli/controllers/rhev-options', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    needs: ["deployment"],

    rhev_engine_admin_password: Ember['default'].computed.alias("controllers.deployment.rhev_engine_admin_password"),
    rhev_database_name: Ember['default'].computed.alias("controllers.deployment.rhev_database_name"),
    rhev_cluster_name: Ember['default'].computed.alias("controllers.deployment.rhev_cluster_name"),
    rhev_storage_name: Ember['default'].computed.alias("controllers.deployment.rhev_storage_name"),
    rhev_cpu_type: Ember['default'].computed.alias("controllers.deployment.rhev_cpu_type"),

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
      name: "Gluster" }] });

});
define('fusor-ember-cli/controllers/rhev-setup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    needs: ["deployment"],

    rhev_is_self_hosted: Ember['default'].computed.alias("controllers.deployment.rhev_is_self_hosted"),

    rhevSetup: (function () {
      return this.get("rhev_is_self_hosted") ? "selfhost" : "rhevhost";
    }).property("rhev_is_self_hosted"),

    rhevSetupTitle: (function () {
      return this.get("rhev_is_self_hosted") ? "Self Hosted" : "Host + Engine";
    }).property("rhev_is_self_hosted"),

    isSelfHosted: (function () {
      return this.get("rhevSetup") === "selfhost";
    }).property("rhevSetup"),

    actions: {
      rhevSetupChanged: function (value) {
        return this.get("controllers.deployment").set("rhev_is_self_hosted", this.get("isSelfHosted"));
      }
    }

  });

});
define('fusor-ember-cli/controllers/rhev', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
    needs: ["application", "rhev-setup", "side-menu"],

    rhevSetup: Ember['default'].computed.alias("controllers.rhev-setup.rhevSetup"),

    isSelfHost: (function () {
      return this.get("rhevSetup") === "selfhost";
    }).property("rhevSetup"),

    engineTabName: (function () {
      if (this.get("isSelfHost")) {
        return "Engine / Hypervisor";
      } else {
        return "Engine";
      }
    }).property("isSelfHost") });

});
define('fusor-ember-cli/controllers/satellite', ['exports', 'ember', '../mixins/satellite-controller-mixin'], function (exports, Ember, SatelliteControllerMixin) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SatelliteControllerMixin['default'], {

    needs: ["deployment"],

    satelliteTabRouteName: Ember['default'].computed.alias("controllers.deployment.satelliteTabRouteName"),
    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment.organizationTabRouteName"),
    lifecycleEnvironmentTabRouteName: Ember['default'].computed.alias("controllers.deployment.lifecycleEnvironmentTabRouteName"),

    disableTabDeploymentName: Ember['default'].computed.alias("controllers.deployment.disableTabDeploymentName"),
    disableTabConfigureOrganization: Ember['default'].computed.alias("controllers.deployment.disableTabConfigureOrganization"),
    disableTabLifecycleEnvironment: Ember['default'].computed.alias("controllers.deployment.disableTabLifecycleEnvironment") });

});
define('fusor-ember-cli/controllers/satellite/index', ['exports', 'ember', '../../mixins/satellite-controller-mixin', 'ember-validations'], function (exports, Ember, SatelliteControllerMixin, EmberValidations) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend(SatelliteControllerMixin['default'], EmberValidations['default'].Mixin, {

    needs: ["satellite", "deployment"],

    validations: {
      name: {
        presence: true } },

    name: Ember['default'].computed.alias("controllers.deployment.name"),
    description: Ember['default'].computed.alias("controllers.deployment.description"),

    organizationTabRouteName: Ember['default'].computed.alias("controllers.deployment.organizationTabRouteName"),

    disableNextOnDeploymentName: Ember['default'].computed.alias("controllers.deployment.disableNextOnDeploymentName") });

});
define('fusor-ember-cli/controllers/satellite/subscription', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    isChecked: false,

    registerOnParent: (function () {
      this.send("registerToggle", this);
    }).on("init") });

});
define('fusor-ember-cli/controllers/side-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({
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
define('fusor-ember-cli/controllers/storage', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Controller.extend({

    needs: ["deployment"],

    rhev_storage_type: Ember['default'].computed.alias("controllers.deployment.rhev_storage_type"),
    rhev_storage_address: Ember['default'].computed.alias("controllers.deployment.rhev_storage_address"),
    rhev_share_path: Ember['default'].computed.alias("controllers.deployment.rhev_share_path"),

    isNFS: (function () {
      return this.get("rhev_storage_type") === "NFS";
    }).property("rhev_storage_type") });

});
define('fusor-ember-cli/controllers/subscription', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({
    isChecked: false,

    registerOnParent: (function () {
      this.send("registerToggle", this);
    }).on("init") });

});
define('fusor-ember-cli/controllers/subscriptions', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Controller.extend({});

});
define('fusor-ember-cli/controllers/subscriptions/credentials', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({

    username: "",
    password: "",
    disableCredentialsNext: (function () {
      return this.get("username.length") === 0 || this.get("password.length") === 0;
    }).property("username", "password")

  });

});
define('fusor-ember-cli/controllers/subscriptions/select-subscriptions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ArrayController.extend({
    needs: ["application", "deployment"],

    isUpstream: Ember['default'].computed.alias("controllers.application.isUpstream"),
    stepNumberSubscriptions: Ember['default'].computed.alias("controllers.deployment.stepNumberSubscriptions"),

    isOnlyShowSubscriptions: true,

    toggles: (function () {
      return Ember['default'].A([]);
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

    totalCountSubscriptions: Ember['default'].computed.alias("model.length"),

    allSelectedItems: Ember['default'].computed.filterBy("toggles", "isChecked", true),
    totalSelectedCount: Ember['default'].computed.alias("allSelectedItems.length"),

    disableSubscriptionsNext: true, // CHANGE to true when deploying
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
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 1000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 2000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 3000);
        Ember['default'].run.later(function () {
          return self.incrementProperty("prog", self.incrementBy);
        }, 4000);
        Ember['default'].run.later(function () {
          self.set("disableSubscriptionsNext", false);
          self.set("disableAttachButton", false);
          self.set("attachingInProgress", false);
          self.set("showAttachedSuccessMessage", true);
        }, 4500);
      } } });

});
define('fusor-ember-cli/controllers/where-install', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].ObjectController.extend({

    needs: ["deployment"],

    cfme_install_loc: Ember['default'].computed.alias("controllers.deployment.cfme_install_loc"),

    disableRHEV: false,
    disableOpenStack: false,

    actions: {
      cfmeLocationChanged: function () {}
    }

  });

});
define('fusor-ember-cli/helpers/fa-icon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var FA_PREFIX = /^fa\-.+/;

  var warn = Ember['default'].Logger.warn;

  /**
   * Handlebars helper for generating HTML that renders a FontAwesome icon.
   *
   * @param  {String} name    The icon name. Note that the `fa-` prefix is optional.
   *                          For example, you can pass in either `fa-camera` or just `camera`.
   * @param  {Object} options Options passed to helper.
   * @return {Ember.Handlebars.SafeString} The HTML markup.
   */
  var faIcon = function (name, options) {
    if (Ember['default'].typeOf(name) !== "string") {
      var message = "fa-icon: no icon specified";
      warn(message);
      return new Ember['default'].Handlebars.SafeString(message);
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
      if (Ember['default'].typeOf(params.size) === "number") {
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
    if (params.classNames && !Ember['default'].isArray(params.classNames)) {
      params.classNames = [params.classNames];
    }
    if (!Ember['default'].isEmpty(params.classNames)) {
      Array.prototype.push.apply(classNames, params.classNames);
    }

    html += "<i";
    html += " class='" + classNames.join(" ") + "'";
    if (params.title) {
      html += " title='" + params.title + "'";
    }
    html += "></i>";
    return new Ember['default'].Handlebars.SafeString(html);
  };

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(faIcon);

  exports.faIcon = faIcon;

});
define('fusor-ember-cli/helpers/log', ['exports'], function (exports) {

	'use strict';

	exports['default'] = function () {};
	//console.debug(str);

});
define('fusor-ember-cli/helpers/raw-text', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports.rawText = rawText;

  function rawText(input) {
    return new Handlebars.SafeString(input);
  }

  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(rawText);

});
define('fusor-ember-cli/helpers/showdown-addon', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  /* global Showdown */
  exports['default'] = Ember['default'].Handlebars.makeBoundHelper(function (value) {
    if (typeof value === "string") {
      var converter = new Showdown.converter();
      return new Ember['default'].Handlebars.SafeString(converter.makeHtml(value));
    }
  });

});
define('fusor-ember-cli/initializers/coordinator-setup', ['exports', '../models/coordinator'], function (exports, Coordinator) {

  'use strict';

  exports['default'] = {
    name: "setup coordinator",

    initialize: function (container, app) {
      app.register("drag:coordinator", Coordinator['default']);
      app.inject("component", "coordinator", "drag:coordinator");
    }
  };

});
define('fusor-ember-cli/initializers/export-application-global', ['exports', 'ember', '../config/environment'], function (exports, Ember, config) {

  'use strict';

  exports.initialize = initialize;

  function initialize(container, application) {
    var classifiedName = Ember['default'].String.classify(config['default'].modulePrefix);

    if (config['default'].exportApplicationGlobal) {
      window[classifiedName] = application;
    }
  };

  exports['default'] = {
    name: "export-application-global",

    initialize: initialize
  };

});
define('fusor-ember-cli/initializers/initialize-torii-callback', ['exports', 'torii/redirect-handler'], function (exports, RedirectHandler) {

  'use strict';

  exports['default'] = {
    name: "torii-callback",
    before: "torii",
    initialize: function (container, app) {
      app.deferReadiness();
      RedirectHandler['default'].handle(window.location.toString())["catch"](function () {
        app.advanceReadiness();
      });
    }
  };

});
define('fusor-ember-cli/initializers/initialize-torii-session', ['exports', 'torii/configuration', 'torii/bootstrap/session'], function (exports, configuration, bootstrapSession) {

  'use strict';

  exports['default'] = {
    name: "torii-session",
    after: "torii",

    initialize: function (container) {
      if (configuration['default'].sessionServiceName) {
        bootstrapSession['default'](container, configuration['default'].sessionServiceName);
        container.injection("adapter", configuration['default'].sessionServiceName, "torii:session");
      }
    }
  };

});
define('fusor-ember-cli/initializers/initialize-torii', ['exports', 'torii/bootstrap/torii', 'torii/configuration'], function (exports, bootstrapTorii, configuration) {

  'use strict';

  var initializer = {
    name: "torii",
    initialize: function (container, app) {
      bootstrapTorii['default'](container);

      // Walk all configured providers and eagerly instantiate
      // them. This gives providers with initialization side effects
      // like facebook-connect a chance to load up assets.
      for (var key in configuration['default'].providers) {
        if (configuration['default'].providers.hasOwnProperty(key)) {
          container.lookup("torii-provider:" + key);
        }
      }

      app.inject("route", "torii", "torii:main");
    }
  };

  if (window.DS) {
    initializer.after = "store";
  }

  exports['default'] = initializer;

});
define('fusor-ember-cli/initializers/simple-auth-oauth2', ['exports', 'simple-auth-oauth2/configuration', 'simple-auth-oauth2/authenticators/oauth2', 'simple-auth-oauth2/authorizers/oauth2', '../config/environment'], function (exports, Configuration, Authenticator, Authorizer, ENV) {

  'use strict';

  exports['default'] = {
    name: "simple-auth-oauth2",
    before: "simple-auth",
    initialize: function (container, application) {
      Configuration['default'].load(container, ENV['default']["simple-auth-oauth2"] || {});
      container.register("simple-auth-authorizer:oauth2-bearer", Authorizer['default']);
      container.register("simple-auth-authenticator:oauth2-password-grant", Authenticator['default']);
    }
  };

});
define('fusor-ember-cli/initializers/simple-auth-torii', ['exports', 'simple-auth-torii/initializer'], function (exports, initializer) {

	'use strict';

	exports['default'] = initializer['default'];

});
define('fusor-ember-cli/initializers/simple-auth', ['exports', 'simple-auth/configuration', 'simple-auth/setup', '../config/environment'], function (exports, Configuration, setup, ENV) {

  'use strict';

  exports['default'] = {
    name: "simple-auth",
    initialize: function (container, application) {
      Configuration['default'].load(container, ENV['default']["simple-auth"] || {});
      setup['default'](container, application);
    }
  };

});
define('fusor-ember-cli/mixins/configure-environment-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    selectedEnvironment: Ember['default'].computed.alias("model"),

    nonLibraryEnvironments: Ember['default'].computed.filterBy("lifecycleEnvironments", "library", false),
    libraryEnvironments: Ember['default'].computed.filterBy("lifecycleEnvironments", "library", true),

    hasLibrary: (function () {
      return this.get("libraryEnvironments.length") > 0;
    }).property("libraryEnvironments"),
    libraryEnvForOrg: (function () {
      if (this.get("hasLibrary")) {
        return this.get("libraryEnvironments.firstObject");
      }
    }).property("libraryEnvironments", "hasLibrary"),

    fields_env: {},

    showAlertMessage: false,

    rhciNewEnvButtons: [Ember['default'].Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember['default'].Object.create({ title: "Create", clicked: "createEnvironment", type: "primary" })],

    envLabelName: (function () {
      if (this.get("name")) {
        return this.get("name").underscore();
      }
    }).property("name"),
    label: Ember['default'].computed.alias("envLabelName") });

});
define('fusor-ember-cli/mixins/configure-organization-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    needs: ["application"],

    selectedOrganization: Ember['default'].computed.alias("model"),

    fields_org: {},

    showAlertMessage: false,

    // default Organization name for New Organizations
    defaultOrgName: (function () {
      return this.getWithDefault("defaultOrg", this.get("deploymentName"));
    }).property(),

    orgLabelName: (function () {
      if (this.get("fields_org.name")) {
        return this.get("defaultOrgName").underscore();
      }
    }).property("defaultOrgName"),

    rhciModalButtons: [Ember['default'].Object.create({ title: "Cancel", clicked: "cancel", dismiss: "modal" }), Ember['default'].Object.create({ title: "Create", clicked: "createOrganization", type: "primary" })],

    actions: {
      createOrganization: function () {
        //if (this.get('fields_org.isDirty')) {
        var self = this;
        this.set("fields_org.name", this.get("defaultOrgName"));
        var organization = this.store.createRecord("organization", this.get("fields_org"));
        self.set("fields_org", {});
        self.set("defaultOrgName", null);
        self.set("selectedOrganization", organization);
        organization.save().then(function () {
          //success
          return self.set("showAlertMessage", true);
        }, function (error) {
          alert("There was an error trying to save: " + error);
          //organization.destroyRecord();
          //organization.rollback()
          //organization.reload();
          //organization.unloadRecord();
        });
        //}

        return Bootstrap.ModalManager.hide("newOrganizationModal");
      } }

  });

});
define('fusor-ember-cli/mixins/deployment-controller-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    needs: ["application", "subscriptions", "configure-organization", "configure-environment", "subscriptions/select-subscriptions"],

    isRhev: Ember['default'].computed.alias("deploy_rhev"),
    isOpenStack: Ember['default'].computed.alias("deploy_openstack"),
    isCloudForms: Ember['default'].computed.alias("deploy_cfme"),

    // default is downstream
    isUpstream: false,

    // will be overwritten be routes
    isHideWizard: null,

    // declared in controllers, and not in mixin
    // isRhev
    // isOpenStack
    // isCloudForms

    // route names will be overwrriten by active hook in routes/deployment.js
    // and routes/deployment-new.js and routes/start.js and routes/deployment-new/start.js
    satelliteTabRouteName: null,
    organizationTabRouteName: null,
    lifecycleEnvironmentTabRouteName: null,

    // nameSelectSubscriptions: function() {
    //   if (this.get('isUpstream')) { return "Select Content Source"; } else { return "Select Subscriptions"; }
    // }.property('isUpstream'),

    disableNextOnStart: (function () {
      return !(this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms"));
    }).property("isRhev", "isOpenStack", "isCloudForms"),


    // names
    nameRHCI: (function () {
      if (this.get("isUpstream")) {
        return "Fusor";
      } else {
        return "RHCI";
      }
    }).property("isUpstream"),

    nameRedHat: (function () {
      if (this.get("isUpstream")) {
        return "";
      } else {
        return "Red Hat";
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

    // images
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

    // logo
    logoPath: (function () {
      if (this.get("isUpstream")) {
        return "assets/foreman.png";
      } else {
        return "assets/Header-logotype.png";
      }
    }).property("isUpstream"),

    // steps
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

    stepNumberSubscriptions: (function () {
      if (this.get("isRhev") && this.get("isOpenStack") && this.get("isCloudForms")) {
        return "5";
      } else if (this.get("isRhev") && this.get("isOpenStack") || this.get("isRhev") && this.get("isCloudForms") || this.get("isOpenStack") && this.get("isCloudForms")) {
        return "4";
      } else if (this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms")) {
        return "3";
      } else {
        return "2";
      }
    }).property("isRhev", "isOpenStack", "isCloudForms"),

    stepNumberReview: (function () {
      if (this.get("isRhev") && this.get("isOpenStack") && this.get("isCloudForms")) {
        return "6";
      } else if (this.get("isRhev") && this.get("isOpenStack") || this.get("isRhev") && this.get("isCloudForms") || this.get("isOpenStack") && this.get("isCloudForms")) {
        return "5";
      } else if (this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms")) {
        return "4";
      } else {
        return "3";
      }
    }).property("isRhev", "isOpenStack", "isCloudForms"),

    step2RouteName: (function () {
      if (this.get("isRhev")) {
        return "rhev";
      } else if (this.get("isOpenStack")) {
        return "openstack";
      } else if (this.get("isCloudForms")) {
        return "cloudforms";
      }
    }).property("isRhev", "isOpenStack", "isCloudForms") });

});
define('fusor-ember-cli/mixins/deployment-new-controller-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    beforeModel: function () {
      if (this.controllerFor("deployment-new").get("disableNextOnStart")) {
        return this.transitionTo("deployment-new.start");
      }
    } });

});
define('fusor-ember-cli/mixins/deployment-new-satellite-route-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    beforeModel: function () {
      if (this.controllerFor("deployment-new").get("disableNextOnStart")) {
        return this.transitionTo("deployment-new.start");
      }
    } });

});
define('fusor-ember-cli/mixins/deployment-route-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    actions: {
      saveDeployment: function (routeNameForTransition) {
        var deployment = this.get("controller.model");
        var self = this;
        deployment.save().then(function (result) {
          if (routeNameForTransition) {
            self.transitionTo(routeNameForTransition, result);
          }
        }, function (error) {
          alert("There was an error trying to save: " + error);
        });
      } }

  });

});
define('fusor-ember-cli/mixins/disable-tab-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    needs: ["deployment", "configure-organization", "configure-environment"],

    hasName: (function () {
      return this.get("name.length") > 0;
    }).property("name"),
    hasNoName: Ember['default'].computed.not("hasName"),

    hasOrganization: (function () {
      return !!this.get("organization");
    }).property("organization"),
    hasNoOrganization: Ember['default'].computed.not("hasOrganization"),

    hasLifecycleEnvironment: (function () {
      return !!this.get("lifecycle_environment");
    }).property("lifecycle_environment"),
    hasNoLifecycleEnvironment: Ember['default'].computed.not("hasLifecycleEnvironment"),

    // disable All if there is no deployment name
    disableAll: Ember['default'].computed.alias("hasNoName"),

    // disable Next on Deployment Name if there is no deployment name
    disableNextOnDeploymentName: Ember['default'].computed.alias("hasNoName"),

    // disable Next on Configure Organization if no organization is selected
    disableNextOnConfigureOrganization: Ember['default'].computed.or("hasNoOrganization", "disableAll"),

    // disable Next on Lifecycle Environment if no lifecycle environment is selected
    disableNextOnLifecycleEnvironment: Ember['default'].computed.or("hasNoLifecycleEnvironment", "disableAll"),

    // Satellite Tabs Only
    disableTabDeploymentName: false, // always enable tab for entering deployment name
    disableTabConfigureOrganization: Ember['default'].computed.alias("disableNextOnDeploymentName"),
    disableTabLifecycleEnvironment: Ember['default'].computed.alias("disableNextOnConfigureOrganization") });

});
define('fusor-ember-cli/mixins/meta', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({
    meta: (function () {
      return this.store.metadataFor(this.get("model").type);
    }).property("")
  });

});
define('fusor-ember-cli/mixins/satellite-controller-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    needs: ["configure-organization", "configure-environment"],

    rhciModalButtons: [Ember['default'].Object.create({ title: "No", clicked: "cancel", dismiss: "modal" }), Ember['default'].Object.create({ title: "Yes", clicked: "redirectToDeployments", type: "primary" })],

    actions: {
      redirectToDeployments: function () {
        this.transitionTo("deployments");
      }
    }

  });

});
define('fusor-ember-cli/mixins/start-controller-mixin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Mixin.create({

    isUpstream: false,

    // declared in controllers, and not in mixin
    // isRhev
    // isOpenStack
    // isCloudForms

    // route of Next button. It will be overwrriten by active hook in routes/start.js and routes/deployment-new/start.js
    satelliteTabRouteName: null,

    // disable Next button if none selected
    disableNextOnStart: (function () {
      return !(this.get("isRhev") || this.get("isOpenStack") || this.get("isCloudForms"));
    }).property("isRhev", "isOpenStack", "isCloudForms"),

    // names
    nameRHCI: (function () {
      if (this.get("isUpstream")) {
        return "Fusor";
      } else {
        return "RHCI";
      }
    }).property("isUpstream"),

    nameRedHat: (function () {
      if (this.get("isUpstream")) {
        return "";
      } else {
        return "Red Hat";
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

    // images
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
    }).property("isUpstream") });

});
define('fusor-ember-cli/models/coordinator', ['exports', 'ember', './obj-hash'], function (exports, Ember, ObjHash) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend(Ember['default'].Evented, {
    objectMap: (function () {
      return ObjHash['default'].create();
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
define('fusor-ember-cli/models/deployable', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    deployment: DS['default'].belongsTo("deployment", { inverse: "rhev_engine_host", async: true }),
    discovered_host: DS['default'].belongsTo("discovered-host", { inverse: "rhev_engine_host", async: true })
  });

});
define('fusor-ember-cli/models/deployment-host', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    deployment: DS['default'].belongsTo("deployment"), //, {async: true}
    discovered_host: DS['default'].belongsTo("discovered-host")
  });

});
define('fusor-ember-cli/models/deployment', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    organization: DS['default'].belongsTo("organization", { async: true }),
    lifecycle_environment: DS['default'].belongsTo("lifecycle-environment", { async: true }),

    deploy_rhev: DS['default'].attr("boolean"),
    deploy_cfme: DS['default'].attr("boolean"),
    deploy_openstack: DS['default'].attr("boolean"),

    rhev_is_self_hosted: DS['default'].attr("boolean"),

    // one-to-one: One deployment has one rhev engine host. One host has one deployment
    rhev_engine_host: DS['default'].belongsTo("discovered-host", { inverse: "rhev_deployments", async: true }), //TODO error if I added
    discovered_host: DS['default'].belongsTo("discovered-host", { inverse: "deployment", async: true }), //TODO error if I added
    discovered_hosts: DS['default'].hasMany("discovered-host", { inverse: "deployments", async: true }), //TODO error if I added

    // rhev_hypervisors: DS.hasMany('discovered-host', {async: true}),

    rhev_engine_hostname: DS['default'].attr("string"),

    rhev_engine_admin_password: DS['default'].attr("string"),
    rhev_database_name: DS['default'].attr("string"),
    rhev_cluster_name: DS['default'].attr("string"),
    rhev_storage_name: DS['default'].attr("string"),
    rhev_storage_type: DS['default'].attr("string"),
    rhev_storage_address: DS['default'].attr("string"),
    rhev_cpu_type: DS['default'].attr("string"),
    rhev_share_path: DS['default'].attr("string"),

    cfme_install_loc: DS['default'].attr("string"),

    created_at: DS['default'].attr("date"),
    updated_at: DS['default'].attr("date") });

});
define('fusor-ember-cli/models/discovered-host', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    mac: DS['default'].attr("string"),
    subnet_id: DS['default'].attr("string"),
    subnet_name: DS['default'].attr("string"),
    organization_id: DS['default'].attr("string"),
    organization_name: DS['default'].attr("string"),
    location_id: DS['default'].attr("string"),
    location_name: DS['default'].attr("string"),
    memory: DS['default'].attr("string"),
    disk_count: DS['default'].attr("string"),
    disks_size: DS['default'].attr("string"),
    cpus: DS['default'].attr("string"),

    rhev_deployments: DS['default'].hasMany("deployment", { inverse: "rhev_engine_host", async: true }),
    deployment: DS['default'].belongsTo("deployment", { inverse: "discovered_host", async: true }),
    deployments: DS['default'].belongsTo("deployment", { inverse: "discovered_hosts", async: true }),

    created_at: DS['default'].attr("date"),
    updated_at: DS['default'].attr("date") });

});
define('fusor-ember-cli/models/environment', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string")
    //  organization: DS.belongsTo('organization')
  });

});
define('fusor-ember-cli/models/host', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    hostgroup: DS['default'].attr("string"),
    mac: DS['default'].attr("string"),
    domain: DS['default'].attr("string"),
    subnet: DS['default'].attr("string"),
    operatingsystem: DS['default'].attr("string"),
    environment: DS['default'].attr("string"),
    model: DS['default'].attr("string"),
    location: DS['default'].attr("string"),
    organization: DS['default'].attr("string"),
    cpu: DS['default'].attr("string"),
    memory: DS['default'].attr("string"),
    vendor: DS['default'].attr("string") });

});
define('fusor-ember-cli/models/hostgroup', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string") });
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
define('fusor-ember-cli/models/lifecycle-environment', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    label: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    library: DS['default'].attr("boolean"),
    prior: DS['default'].attr("number"),
    created_at: DS['default'].attr("date"),
    updated_at: DS['default'].attr("date"),
    organization: DS['default'].belongsTo("organization", { async: true })
  });

});
define('fusor-ember-cli/models/location', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    title: DS['default'].attr("string")
  });

});
define('fusor-ember-cli/models/obj-hash', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Object.extend({
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
      return Ember['default'].A(res);
    },

    lengthBinding: "contentLength"
  });

});
define('fusor-ember-cli/models/organization', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    title: DS['default'].attr("string"),
    label: DS['default'].attr("string"),
    description: DS['default'].attr("string"),
    lifecycle_environments: DS['default'].hasMany("lifecycle-environment", { async: true }) });
  //  subnets: DS.hasMany('subnet', { async: true })

});
define('fusor-ember-cli/models/product', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    state_time: DS['default'].attr("string"),
    duration: DS['default'].attr("string"),
    size: DS['default'].attr("string"),
    result: DS['default'].attr("string") });

});
define('fusor-ember-cli/models/subnet', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    network: DS['default'].attr("string"),
    mask: DS['default'].attr("string"),
    priority: DS['default'].attr("number"),
    name: DS['default'].attr("string"),
    vlanid: DS['default'].attr("string"),
    created_at: DS['default'].attr("date"),
    updated_at: DS['default'].attr("date"),
    dhcp_id: DS['default'].attr("number"),
    tftp_id: DS['default'].attr("number"),
    from: DS['default'].attr("string"),
    to: DS['default'].attr("string"),
    gateway: DS['default'].attr("string"),
    dns_primary: DS['default'].attr("string"),
    dns_secondary: DS['default'].attr("string"),
    dns_id: DS['default'].attr("number"),
    sort_network_id: DS['default'].attr("number"),
    boot_mode: DS['default'].attr("string"),
    ipam: DS['default'].attr("string"),
    trafficTypes: DS['default'].hasMany("trafficType", { async: true }),
    organization: DS['default'].belongsTo("organization")
  });

});
define('fusor-ember-cli/models/subscription', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    contract_number: DS['default'].attr("string"),
    available: DS['default'].attr("string"),
    subscription_type: DS['default'].attr("string"),
    start_date: DS['default'].attr("date"),
    end_date: DS['default'].attr("date"),
    quantity: DS['default'].attr("number")
  });

});
define('fusor-ember-cli/models/traffic-type', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    name: DS['default'].attr("string"),
    subnets: DS['default'].hasMany("subnet", { async: true })
  });

});
define('fusor-ember-cli/models/user', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].Model.extend({
    login: DS['default'].attr("string"),
    mail: DS['default'].attr("string"),
    firstname: DS['default'].attr("string"),
    lastname: DS['default'].attr("string"),
    admin: DS['default'].attr("boolean"),
    auth_source_id: DS['default'].attr("number"),
    lastLoginOn: DS['default'].attr("date"),
    fullName: (function () {
      return this.get("firstname") + " " + this.get("lastname");
    }).property("firstname", "lastname")
  });

});
define('fusor-ember-cli/router', ['exports', 'ember', './config/environment'], function (exports, Ember, config) {

  'use strict';

  var Router = Ember['default'].Router.extend({
    location: config['default'].locationType,
    // log when Ember generates a controller or a route from a generic class
    LOG_ACTIVE_GENERATION: true,
    // log when Ember looks up a template or a view
    LOG_VIEW_LOOKUPS: true
  });

  Router.map(function () {
    this.route("login");
    this.route("loggedin");

    this.resource("rhci", { path: "/old-deployments/new-old" }, function () {
      this.route("satellite", function () {
        this.route("configure-organization");
        this.route("configure-environment");
      });
    });

    this.resource("deployments");

    this.resource("deployment-new", { path: "/deployments/new" }, function () {
      this.route("start");
      this.route("satellite", function () {
        this.route("configure-environment");
        this.route("configure-organization");
      });
    });

    this.resource("deployment", { path: "/deployments/:deployment_id" }, function () {
      this.route("start");

      this.resource("satellite", function () {
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
      this.resource("subscriptions", function () {
        this.route("credentials");
        this.route("select-subscriptions", { path: "select" });
      });
      this.resource("review", function () {
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
    this.resource("discovered-hosts", function () {
      this.resource("discovered-host", { path: "/:discovered_hosts_id" });
    });
  });

  exports['default'] = Router;

});
define('fusor-ember-cli/routes/application', ['exports', 'ember', 'simple-auth/mixins/application-route-mixin'], function (exports, Ember, ApplicationRouteMixin) {

  'use strict';

  // app/routes/application.js
  exports['default'] = Ember['default'].Route.extend(ApplicationRouteMixin['default'], {

    beforeModel: function (transition) {
      if (!this.controllerFor("application").get("isLiveBackendMode")) {
        this.get("session").set("isAuthenticated", true);
        return this.transitionTo("deployment-new.start");
      } else if (this.controllerFor("application").get("deployAsPlugin")) {
        this.get("session").set("isAuthenticated", true);
        return this.transitionTo("login");
      };
    },

    setupController: function (controller, model) {
      controller.set("model", model);

      if (!this.controllerFor("application").get("isLiveBackendMode")) {
        this.get("session").set("currentUser", this.store.find("user", 1));
      }

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
define('fusor-ember-cli/routes/cloudforms-storage-domain', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/cloudforms-vm', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/cloudforms/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("where-install");
    }
  });

});
define('fusor-ember-cli/routes/configure-environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return this.modelFor("deployment").get("lifecycle_environment");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      var organization = this.modelFor("deployment").get("organization");
      var lifecycleEnvironments = this.store.find("lifecycle-environment", { organization_id: organization.get("id") });
      lifecycleEnvironments.then(function (results) {
        controller.set("lifecycleEnvironments", results);
        // nullify environment if organization has no environments, it gives validation error if trying to save with no environment
        if (results.get("length") === 0) {
          return controller.set("model", null);
        }
      });
    },

    deactivate: function () {
      return this.send("saveDeployment", null);
    }

  });

});
define('fusor-ember-cli/routes/configure-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    model: function () {
      return this.modelFor("deployment").get("organization");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      var organizations = this.store.find("organization");
      controller.set("organizations", organizations);
    },

    deactivate: function () {
      return this.send("saveDeployment", null);
    }

  });

});
define('fusor-ember-cli/routes/deployment-new', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin', '../mixins/deployment-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin, DeploymentRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], DeploymentRouteMixin['default'], {

    model: function () {
      return this.store.createRecord("deployment");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("satelliteTabRouteName", "deployment-new.satellite.index");
      controller.set("organizationTabRouteName", "deployment-new.satellite.configure-organization");
      controller.set("lifecycleEnvironmentTabRouteName", "deployment-new.satellite.configure-environment");
    },

    // rollback if new deployment not saved
    // TODO modal confirm/cancel
    deactivate: function () {
      var deployment = this.modelFor("deployment-new");
      if (deployment.get("isNew")) {
        return deployment.rollback();
      }
    }

  });

});
define('fusor-ember-cli/routes/deployment-new/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    // if user manually hits this route (deployments/news), then redirecto to deployments/news/start
    beforeModel: function () {
      return this.transitionTo("deployment-new.start");
    } });

});
define('fusor-ember-cli/routes/deployment-new/satellite', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/deployment-new/satellite/configure-environment', ['exports', 'ember', '../../../mixins/deployment-new-satellite-route-mixin'], function (exports, Ember, DeploymentNewSatelliteRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(DeploymentNewSatelliteRouteMixin['default'], {

    model: function () {
      return this.modelFor("deployment-new").get("lifecycle_environment");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      var organization = this.modelFor("deployment-new").get("organization");
      var lifecycleEnvironments = this.store.find("lifecycle-environment", { organization_id: organization.get("id") });
      lifecycleEnvironments.then(function (results) {
        controller.set("lifecycleEnvironments", results);
        // nullify environment if organization has no environments, it gives validation error if trying to save with no environment
        if (results.get("length") === 0) {
          return controller.set("model", null);
        }
      });
    } });

});
define('fusor-ember-cli/routes/deployment-new/satellite/configure-organization', ['exports', 'ember', '../../../mixins/deployment-new-satellite-route-mixin'], function (exports, Ember, DeploymentNewSatelliteRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(DeploymentNewSatelliteRouteMixin['default'], {

    model: function () {
      return this.modelFor("deployment-new").get("organization");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      var organizations = this.store.find("organization");
      controller.set("organizations", organizations);
    } });

});
define('fusor-ember-cli/routes/deployment-new/satellite/index', ['exports', 'ember', '../../../mixins/deployment-new-satellite-route-mixin'], function (exports, Ember, DeploymentNewSatelliteRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(DeploymentNewSatelliteRouteMixin['default'], {});

});
define('fusor-ember-cli/routes/deployment-new/start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("satelliteTabRouteName", "deployment-new.satellite.index");
    },

    activate: function () {
      this.controllerFor("deployment-new").set("isHideWizard", true);
      this.controllerFor("deployment-new").set("deploy_rhev", true);
      this.controllerFor("deployment-new").set("deploy_openstack", false);
      this.controllerFor("deployment-new").set("deploy_cfme", true);
    },

    deactivate: function () {
      this.controllerFor("deployment-new").set("isHideWizard", false);
    } });

});
define('fusor-ember-cli/routes/deployment', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin', '../mixins/deployment-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin, DeploymentRouteMixin) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], DeploymentRouteMixin['default'], {

    model: function (params) {
      return this.store.find("deployment", params.deployment_id);
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("satelliteTabRouteName", "satellite.index");
      controller.set("organizationTabRouteName", "configure-organization");
      controller.set("lifecycleEnvironmentTabRouteName", "configure-environment");
    } });

});
define('fusor-ember-cli/routes/deployment/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    afterModel: function () {
      this.transitionTo("satellite");
    }
  });

});
define('fusor-ember-cli/routes/deployment/review', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/deployment/start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("satelliteTabRouteName", "satellite.index");
    },

    activate: function () {
      this.controllerFor("deployment").set("isHideWizard", true);
    },

    deactivate: function () {
      this.controllerFor("deployment").set("isHideWizard", false);
    }

  });

});
define('fusor-ember-cli/routes/deployments', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("deployment");
    }
  });

});
define('fusor-ember-cli/routes/discovered-host', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/discovered-hosts', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/engine', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("engine.discovered-host");
    }
  });

});
define('fusor-ember-cli/routes/engine/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.modelFor("deployment").get("discovered_host");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("allDiscoveredHosts", this.store.find("discovered-host"));
    },

    deactivate: function () {
      return this.send("saveDeployment", null);
    } });

});
define('fusor-ember-cli/routes/engine/existing-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("host", { type: "Host::Managed" });
    }
  });

});
define('fusor-ember-cli/routes/engine/hypervisor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("host", { type: "Host::Discovered" });
    }
  });

});
define('fusor-ember-cli/routes/engine/new-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

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
define('fusor-ember-cli/routes/hostgroup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
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
define('fusor-ember-cli/routes/hostgroup/edit', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/hostgroups', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("hostgroup");
    }
  });

});
define('fusor-ember-cli/routes/hypervisor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("hypervisor.discovered-host");
    }
  });

});
define('fusor-ember-cli/routes/hypervisor/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.modelFor("deployment").get("discovered_hosts");
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("allDiscoveredHosts", this.store.find("discovered-host"));
    },

    deactivate: function () {
      var model = this.modelFor("deployment");
      return this.send("saveHyperVisors");
    },

    actions: {
      saveHyperVisors: function () {
        var self = this;
        var dep = this.modelFor("deployment");
        //TODO - now working
        // this.store.find('discovered-host').then(function(discoveredHostsToAdd) {
        //   dep.get('discovered_hosts').then(function(discoveredHosts) {
        //     discoveredHosts.addObjects(discoveredHostsToAdd);
        //     dep.save().then(function() {
        //       discoveredHostsToAdd.save();
        //     });
        //   });
        // });
      }
    }

  });

});
define('fusor-ember-cli/routes/hypervisor/existing-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("host", { type: "Host::Managed" });
    }
  });

});
define('fusor-ember-cli/routes/hypervisor/new-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("organizations", this.store.find("organization"));
      controller.set("locations", this.store.find("location"));
      controller.set("environments", this.store.find("environment"));
      controller.set("hostgroups", this.store.find("hostgroup"));
    }
  });

});
define('fusor-ember-cli/routes/index', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/loggedin', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    //export default Ember.Route.extend(UnauthenticatedRouteMixin, {

    beforeModel: function (transition) {
      if (this.controllerFor("application").get("deployAsPlugin") || this.get("session.isAuthenticated")) {
        return this.transitionTo("deployment-new.start");
      };
    },

    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("errorMessage", null);
    }

  });

});
define('fusor-ember-cli/routes/networking', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    activate: function () {
      this.controllerFor("side-menu").set("etherpadName", "51"); //route-rhev-networking
    },

    deactivate: function () {
      this.controllerFor("side-menu").set("etherpadName", "");
    }
  });

});
define('fusor-ember-cli/routes/new-environment', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/new-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    setupController: function (controller, model) {
      controller.set("model", model);
      controller.set("fields", {});
    }
  });

});
define('fusor-ember-cli/routes/openstack/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("osp-settings");
    }
  });

});
define('fusor-ember-cli/routes/osp-configuration', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    activate: function () {
      this.controllerFor("side-menu").set("etherpadName", "56"); //route-openstack-services-config
    },

    deactivate: function () {
      this.controllerFor("side-menu").set("etherpadName", "");
    }

  });

});
define('fusor-ember-cli/routes/osp-network', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
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
define('fusor-ember-cli/routes/osp-overview', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    activate: function () {
      this.controllerFor("side-menu").set("etherpadName", "55");
    },

    deactivate: function () {
      this.controllerFor("side-menu").set("etherpadName", "");
    }
  });

});
define('fusor-ember-cli/routes/osp-settings', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    activate: function () {
      this.controllerFor("side-menu").set("etherpadName", "53");
    },

    deactivate: function () {
      this.controllerFor("side-menu").set("etherpadName", "");
    }
  });

});
define('fusor-ember-cli/routes/products', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("product");
    }

  });

});
define('fusor-ember-cli/routes/review/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("review.installation");
    }
  });

});
define('fusor-ember-cli/routes/review/installation', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/review/progress', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/rhci', ['exports', 'ember', 'simple-auth/mixins/authenticated-route-mixin'], function (exports, Ember, AuthenticatedRouteMixin) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend(AuthenticatedRouteMixin['default'], {});

});
define('fusor-ember-cli/routes/rhev-options', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    deactivate: function () {
      return this.send("saveDeployment", null);
    } });

});
define('fusor-ember-cli/routes/rhev-setup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    deactivate: function () {
      return this.send("saveDeployment", null);
    }
  });

});
define('fusor-ember-cli/routes/rhev', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/rhev/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("rhev-setup");
    }
  });

});
define('fusor-ember-cli/routes/satellite', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    deactivate: function () {
      var deployment = this.modelFor("deployment");
      deployment.save().then(function () {
        return console.log("saved deployment successfully");
      });
    } });

});
define('fusor-ember-cli/routes/satellite/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    deactivate: function () {
      return this.send("saveDeployment", null);
    }

  });

});
define('fusor-ember-cli/routes/setpassword', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      if (this.controllerFor("application").get("isPasswordSet")) {
        this.transitionTo("deployment-new.start");
      }
    },
    actions: {
      updatePassword: function () {
        this.controllerFor("application").set("isPasswordSet", true);
        this.transitionTo("deployment-new.start");
      }
    }

  });

});
define('fusor-ember-cli/routes/single-deployment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function (params) {
      return this.store.find("deployment", params.deployment_id);
    }
  });

});
define('fusor-ember-cli/routes/storage', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    deactivate: function () {
      return this.send("saveDeployment", null);
    } });

});
define('fusor-ember-cli/routes/subscriptions', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/subscriptions/credentials', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].Route.extend({});

});
define('fusor-ember-cli/routes/subscriptions/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    beforeModel: function () {
      this.transitionTo("subscriptions.credentials");
    }
  });

});
define('fusor-ember-cli/routes/subscriptions/select-subscriptions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({
    model: function () {
      return this.store.find("subscription");
    }
  });

});
define('fusor-ember-cli/routes/where-install', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Route.extend({

    setupController: function (controller, model) {
      controller.set("model", model);

      var isRhev = this.controllerFor("deployment").get("isRhev");
      var isOpenStack = this.controllerFor("deployment").get("isOpenStack");
      if (isRhev && !isOpenStack) {
        this.controllerFor("where-install").set("disableRHEV", false);
        this.controllerFor("where-install").set("disableOpenStack", true);
        return this.controllerFor("deployment").set("cfme_install_loc", "RHEV");
      } else if (!isRhev && isOpenStack) {
        this.controllerFor("where-install").set("disableRHEV", true);
        this.controllerFor("where-install").set("disableOpenStack", false);
        return this.controllerFor("deployment").set("cfme_install_loc", "OpenStack");
      } else {
        this.controllerFor("where-install").set("disableRHEV", false);
        this.controllerFor("where-install").set("disableOpenStack", false);
      }
    },

    deactivate: function () {
      return this.send("saveDeployment", null);
    } });

});
define('fusor-ember-cli/serializers/puppetclass', ['exports', 'ember-data'], function (exports, DS) {

  'use strict';

  exports['default'] = DS['default'].RESTSerializer.extend({
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
define('fusor-ember-cli/services/validations', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  var set = Ember['default'].set;

  exports['default'] = Ember['default'].Object.extend({
    init: function () {
      set(this, "cache", {});
    }
  });

});
define('fusor-ember-cli/templates/application', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

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
    data.buffer.push("\n\n\n\n\n\n<div ");
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
define('fusor-ember-cli/templates/application/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '';


    return buffer;
    
  });

});
define('fusor-ember-cli/templates/cancel-deployment-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n  Are you sure you want to cancel?\n");
    }

    stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
      'name': ("cancelDeploymentModal"),
      'fade': (true),
      'footerButtonsBinding': ("rhciModalButtons"),
      'title': ("Cancel Deployment")
    },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/cancel-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/cloudforms-storage-domain', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/cloudforms-vm', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/cloudforms', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberCloudForms", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("A. Installation Location</a>\n      ");
    return buffer;
    }

    data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "where-install", options) : helperMissing.call(depth0, "link-to", "where-install", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/cloudforms/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/accordion-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/base-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
    data.buffer.push("\n      </span>\n\n   </div>\n</div>");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/draggable-object-target', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/draggable-object', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/env-path-list-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/modal-confirm', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/object-bin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/radio-button-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'name': ("name"),
      'value': ("value"),
      'checked': ("checked")
    },hashTypes:{'name': "ID",'value': "ID",'checked': "ID"},hashContexts:{'name': depth0,'value': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options))));
    stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "label", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/radio-button', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<label>\n  ");
    data.buffer.push(escapeExpression((helper = helpers['radio-button-input'] || (depth0 && depth0['radio-button-input']),options={hash:{
      'name': ("name"),
      'value': ("value"),
      'disabled': ("disabled"),
      'required': ("required"),
      'checked': ("checked")
    },hashTypes:{'name': "ID",'value': "ID",'disabled': "ID",'required': "ID",'checked': "ID"},hashContexts:{'name': depth0,'value': depth0,'disabled': depth0,'required': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button-input", options))));
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</label>\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/rchi-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n         <i class=\"fa fa-1x fa-check\"></i>\n         Deploy this product\n       ");
    }

    data.buffer.push("\n<img ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'src': ("srcImage")
    },hashTypes:{'src': "ID"},hashContexts:{'src': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(" class=\"img-responsive\">\n\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":rhci-footer isChecked:rhci-footer-selected:rhci-footer-unselected")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n     <span class='rhci-install-footer'>\n       ");
    stack1 = helpers['if'].call(depth0, "isChecked", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n     </span>\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/rhci-hover-text', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/rhci-start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n<p class='subscriptions_needed'>\n<i class=\"fa fa-info-circle\"></i>\n<strong>Subscriptions needed to complete this deployment.</strong> Check your account in <a>Portal</a> to verify you have subscriptions available to cover the selected products.\n</p>\n");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("<div class='row'>\n  <div class='col-md-12'>\n    <h2>New Deployment: Select Cloud Infrastructure Products</h2>\n\n    Choose the products to deploy. This wizard guides you through creating a new ");
    stack1 = helpers._triageMustache.call(depth0, "nameRedHat", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" Cloud Infrastructure deployment.\n    <br />\n    <br />\n  </div>\n</div>\n\n<div class='row' style='height:370px;'>\n\n  <div class='col-md-4'>\n    ");
    data.buffer.push(escapeExpression((helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
      'srcImage': ("imgRhev"),
      'isChecked': ("isRhev"),
      'name': ("nameRhev")
    },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options))));
    data.buffer.push("\n  </div>\n\n  <div class='col-md-4'>\n    ");
    data.buffer.push(escapeExpression((helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
      'srcImage': ("imgOpenStack"),
      'isChecked': ("isOpenStack"),
      'name': ("nameOpenStack")
    },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options))));
    data.buffer.push("\n  </div>\n\n  <div class='col-md-4'>\n    ");
    data.buffer.push(escapeExpression((helper = helpers['rchi-item'] || (depth0 && depth0['rchi-item']),options={hash:{
      'srcImage': ("imgCloudForms"),
      'isChecked': ("isCloudForms"),
      'name': ("nameCloudForms")
    },hashTypes:{'srcImage': "ID",'isChecked': "ID",'name': "ID"},hashContexts:{'srcImage': depth0,'isChecked': depth0,'name': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rchi-item", options))));
    data.buffer.push("\n  </div>\n\n</div>\n\n\n");
    stack1 = helpers.unless.call(depth0, "isUpstream", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<br />\n<div class='row'>\n  <div class='col-md-12'>\n    <div style='float:right;'>\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary"),
      'disabled': ("disableNextOnStart")
    },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "satelliteTabRouteName", options) : helperMissing.call(depth0, "link-to", "satelliteTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      \n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/rhci-wizard', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': ("stepNumberRhev"),
      'name': ("nameRhev"),
      'routeName': ("rhev"),
      'isDisabled': ("isDisabledRhev")
    },hashTypes:{'num': "ID",'name': "ID",'routeName': "STRING",'isDisabled': "ID"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': ("stepNumberOpenstack"),
      'name': ("nameOpenStack"),
      'routeName': ("openstack"),
      'isDisabled': ("isDisabledOpenstack")
    },hashTypes:{'num': "ID",'name': "ID",'routeName': "STRING",'isDisabled': "ID"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': ("stepNumberCloudForms"),
      'name': ("nameCloudForms"),
      'routeName': ("cloudforms"),
      'isDisabled': ("isDisabledCloudForms")
    },hashTypes:{'num': "ID",'name': "ID",'routeName': "STRING",'isDisabled': "ID"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("<div class=\"wizard-block\">\n\n  <div class=\"white-wizard-line\"></div>\n  <div class=\"wizard-line\"></div>\n\n  <ul class=\"deployment-wizard\">\n    ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': (1),
      'name': ("nameSatellite"),
      'routeName': ("satellite"),
      'isDisabled': (false)
    },hashTypes:{'num': "INTEGER",'name': "ID",'routeName': "STRING",'isDisabled': "BOOLEAN"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "isRhev", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "isOpenStack", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    stack1 = helpers['if'].call(depth0, "isCloudForms", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': ("stepNumberSubscriptions"),
      'name': ("Subscriptions"),
      'routeName': ("subscriptions"),
      'isDisabled': ("isDisabledSubscriptions")
    },hashTypes:{'num': "ID",'name': "STRING",'routeName': "STRING",'isDisabled': "ID"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n\n    ");
    data.buffer.push(escapeExpression((helper = helpers['wizard-item'] || (depth0 && depth0['wizard-item']),options={hash:{
      'num': ("stepNumberReview"),
      'name': ("Review"),
      'routeName': ("review"),
      'isDisabled': ("isDisabledReview")
    },hashTypes:{'num': "ID",'name': "STRING",'routeName': "STRING",'isDisabled': "ID"},hashContexts:{'num': depth0,'name': depth0,'routeName': depth0,'isDisabled': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "wizard-item", options))));
    data.buffer.push("\n  </ul>\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/select-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/select-simple-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/step-number', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "value", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/sub-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployment-new.start", options) : helperMissing.call(depth0, "link-to", "deployment-new.start", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</li>\n</ul>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/subnet-drop-area', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/text-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n\n  ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'class': ("form-control"),
      'value': ("value"),
      'placeholder': ("placeholder"),
      'type': ("typeInput"),
      'focus-out': ("showErrors"),
      'id': ("id")
    },hashTypes:{'class': "STRING",'value': "ID",'placeholder': "ID",'type': "ID",'focus-out': "STRING",'id': "ID"},hashContexts:{'class': depth0,'value': depth0,'placeholder': depth0,'type': depth0,'focus-out': depth0,'id': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n\n  ");
    stack1 = helpers['if'].call(depth0, "showError", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  ");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n    ");
    stack1 = helpers['if'].call(depth0, "errors.name", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <span class=\"error errorForValidation\">\n        <span class=\"glyphicon glyphicon-warning-sign\"></span> ");
    stack1 = helpers._triageMustache.call(depth0, "errors.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </span>\n    ");
    return buffer;
    }

    stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
      'label': ("label"),
      'labelSize': ("labelSize"),
      'inputSize': ("inputSize"),
      'help-inline': ("help-inline"),
      'errors': ("errors")
    },hashTypes:{'label': "ID",'labelSize': "ID",'inputSize': "ID",'help-inline': "ID",'errors': "ID"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0,'help-inline': depth0,'errors': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/textarea-f', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/tr-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n  ");
    stack1 = helpers._triageMustache.call(depth0, "org.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    }

    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("org"),
      'groupValue': ("selectedOrganization"),
      'changed': ("organizationChanged")
    },hashTypes:{'value': "ID",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/traffic-type', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "trafficType.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/upstream-downstream', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/components/vertical-tab', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<a>");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/components/wizard-item', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, escapeExpression=this.escapeExpression, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    stack1 = helpers._triageMustache.call(depth0, "num", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(". ");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<div ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'class': (":full-circle isDisabled:disable-circle")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n</div>\n");
    return buffer;
    }

    data.buffer.push("<center>\n");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("isDisabled")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "routeName", options) : helperMissing.call(depth0, "link-to", "routeName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "yield", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</center>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/configure-environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <div class='alert alert-success'>\n          <i class=\"fa fa-2x fa-check-circle-o green-circle\"></i>\n          &nbsp;\n          ");
    stack1 = helpers._triageMustache.call(depth0, "selectedEnvironment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" added successfully.\n      </div>\n    ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n    <div class=\"path-selector\">\n      <ul class=\"path-list\">\n        <li class=\"path-list-item\">\n          <label class=\"path-list-item-label\">\n            Library\n          </label>\n        </li>\n        ");
    data.buffer.push(escapeExpression((helper = helpers['env-path-list-item'] || (depth0 && depth0['env-path-list-item']),options={hash:{
      'env': ("env"),
      'selectedEnvironment': ("selectedEnvironment"),
      'action': ("selectEnvironment")
    },hashTypes:{'env': "ID",'selectedEnvironment': "ID",'action': "STRING"},hashContexts:{'env': depth0,'selectedEnvironment': depth0,'action': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "env-path-list-item", options))));
    data.buffer.push("\n        <li class=\"path-list-item\">\n          <label class=\"path-list-item-label\" style='color:gray;'>\n            &nbsp;\n          </label>\n        </li>\n      </ul>\n    </div>\n    ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <div class='alert alert-info'>\n        No lifecycle environments are in organization <strong>");
    stack1 = helpers._triageMustache.call(depth0, "selectedOrganization.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong>\n      </div>\n    ");
    return buffer;
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Back");
    }

  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-environment", options) : helperMissing.call(depth0, "partial", "new-environment", options))));
    data.buffer.push("\n");
    return buffer;
    }

    data.buffer.push("\n\n\n\n<br />\n\n<div class=\"row\">\n  <div class='col-md-9'>\n    ");
    stack1 = helpers['if'].call(depth0, "showAlertMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    <p>\n    Select a lifecycle environment for this RHCI deployment. The application lifecycle is divided into lifecycle environments, which mimic each stage of the lifecycle. These lifecycle environments are linked in an environment path. You can promote content along the environment path to the next stage when required. For example, if development completes on a particular version of an application, you can promote this version to the testing environment and start development on the next version.\n    </p>\n\n    ");
    stack1 = helpers.each.call(depth0, "env", "in", "nonLibraryEnvironments", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    <div style='margin-top:15px;'>\n      <button class='btn btn-default' ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newEnvironmentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(">\n        New Environment Path\n      </button>\n    </div>\n\n    <br />\n    <br />\n    <div style='float:right'>\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "organizationTabRouteName", options) : helperMissing.call(depth0, "link-to", "organizationTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveDeployment", "step2RouteName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","ID"],data:data})));
    data.buffer.push("\n              ");
    data.buffer.push(escapeExpression(helpers['bind-attr'].call(depth0, {hash:{
      'disabled': ("disableNextOnLifecycleEnvironment")
    },hashTypes:{'disabled': "ID"},hashContexts:{'disabled': depth0},contexts:[],types:[],data:data})));
    data.buffer.push("\n              class='btn btn-primary'>\n          Next\n      </button> \n    </div>\n\n  </div>\n</div>\n\n");
    stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
      'name': ("newEnvironmentModal"),
      'fade': (true),
      'footerButtonsBinding': ("rhciNewEnvButtons"),
      'title': ("Create New Environment")
    },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/configure-environment.loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading Environments ...");
    
  });

});
define('fusor-ember-cli/templates/configure-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n      <div class='alert alert-success'>\n          <i class=\"fa fa-2x fa-check-circle-o green-circle\"></i>\n          &nbsp;\n          ");
    stack1 = helpers._triageMustache.call(depth0, "selectedOrganization.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" added successfully.\n      </div>\n    ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['tr-organization'] || (depth0 && depth0['tr-organization']),options={hash:{
      'org': ("org"),
      'selectedOrganization': ("selectedOrganization"),
      'action': ("selectOrganization")
    },hashTypes:{'org': "ID",'selectedOrganization': "ID",'action': "STRING"},hashContexts:{'org': depth0,'selectedOrganization': depth0,'action': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "tr-organization", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("\n          Back\n        ");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("\n            Next\n        ");
    }

  function program9(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "new-organization", options) : helperMissing.call(depth0, "partial", "new-organization", options))));
    data.buffer.push("\n");
    return buffer;
    }

    data.buffer.push("\n<br />\n\n<div class=\"row\">\n  <div class='col-md-9'>\n    ");
    stack1 = helpers['if'].call(depth0, "showAlertMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    <p>\n      Select an organization for this RHCI deployment. Organizations divide hosts into logical groups based on ownership, purpose, content, security level, or other divisions.\n    </p>\n    ");
    stack1 = helpers.each.call(depth0, "org", "in", "organizations", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    <div style='margin-top:15px;margin-bottom:15px;'>\n     <button class='btn btn-default' ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "newOrganizationModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(">New Organization</button>\n    </div>\n\n    <br />\n    <br />\n    <div style='float:right'>\n        \n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "satelliteTabRouteName", options) : helperMissing.call(depth0, "link-to", "satelliteTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'disabled': ("disableNextOnConfigureOrganization"),
      'class': ("btn btn-primary")
    },hashTypes:{'disabled': "ID",'class': "STRING"},hashContexts:{'disabled': depth0,'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "lifecycleEnvironmentTabRouteName", options) : helperMissing.call(depth0, "link-to", "lifecycleEnvironmentTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        \n    </div>\n  </div>\n</div>\n\n");
    stack1 = (helper = helpers['bs-modal'] || (depth0 && depth0['bs-modal']),options={hash:{
      'name': ("newOrganizationModal"),
      'fade': (true),
      'footerButtonsBinding': ("rhciModalButtons"),
      'title': ("Create New Organization")
    },hashTypes:{'name': "STRING",'fade': "BOOLEAN",'footerButtonsBinding': "STRING",'title': "STRING"},hashContexts:{'name': depth0,'fade': depth0,'footerButtonsBinding': depth0,'title': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-modal", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/configure-organization.loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading Organizations ...");
    
  });

});
define('fusor-ember-cli/templates/content-source-upstream', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/debug-deployment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("ID: ");
    stack1 = helpers._triageMustache.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("  (isNew: ");
    stack1 = helpers._triageMustache.call(depth0, "isNew", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(")\n<br />\nDesc: ");
    stack1 = helpers._triageMustache.call(depth0, "description", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nOrg: ");
    stack1 = helpers._triageMustache.call(depth0, "organization.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" &nbsp; (");
    stack1 = helpers._triageMustache.call(depth0, "organization.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(") ");
    stack1 = helpers._triageMustache.call(depth0, "organization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nEnv: ");
    stack1 = helpers._triageMustache.call(depth0, "lifecycle_environment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" &nbsp;   (");
    stack1 = helpers._triageMustache.call(depth0, "lifecycle_environment.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(") ");
    stack1 = helpers._triageMustache.call(depth0, "lifecycle_environment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nhasName: ");
    stack1 = helpers._triageMustache.call(depth0, "hasName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nhasOrganization: ");
    stack1 = helpers._triageMustache.call(depth0, "hasOrganization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nhasLifecycleEnvironment: ");
    stack1 = helpers._triageMustache.call(depth0, "hasLifecycleEnvironment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableTabConfigureOrganization: ");
    stack1 = helpers._triageMustache.call(depth0, "disableTabConfigureOrganization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableTabLifecycleEnvironment: ");
    stack1 = helpers._triageMustache.call(depth0, "disableTabLifecycleEnvironment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableAll: ");
    stack1 = helpers._triageMustache.call(depth0, "disableAll", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableNextOnDeploymentName: ");
    stack1 = helpers._triageMustache.call(depth0, "disableNextOnDeploymentName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableNextOnConfigureOrganization: ");
    stack1 = helpers._triageMustache.call(depth0, "disableNextOnConfigureOrganization", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndisableNextOnLifecycleEnvironment: ");
    stack1 = helpers._triageMustache.call(depth0, "disableNextOnLifecycleEnvironment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\n<br />\nisDisabledRhev: ");
    stack1 = helpers._triageMustache.call(depth0, "isDisabledRhev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nisDisabledOpenstack: ");
    stack1 = helpers._triageMustache.call(depth0, "isDisabledOpenstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nisDisabledCloudForms: ");
    stack1 = helpers._triageMustache.call(depth0, "isDisabledCloudForms", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nisDisabledSubscriptions: ");
    stack1 = helpers._triageMustache.call(depth0, "isDisabledSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\nisDisabledReview: ");
    stack1 = helpers._triageMustache.call(depth0, "isDisabledReview", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndeploy_rhev: ");
    stack1 = helpers._triageMustache.call(depth0, "deploy_rhev", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndeploy_openstack: ");
    stack1 = helpers._triageMustache.call(depth0, "deploy_openstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n<br />\ndeploy_cfme: ");
    stack1 = helpers._triageMustache.call(depth0, "deploy_cfme", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<hr />\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployment", options) : helperMissing.call(depth0, "partial", "deployment", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite", options) : helperMissing.call(depth0, "partial", "satellite", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/configure-environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-environment", options) : helperMissing.call(depth0, "partial", "configure-environment", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/configure-environment.loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading Environments ...");
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/configure-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "configure-organization", options) : helperMissing.call(depth0, "partial", "configure-organization", options))));
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/configure-organization.loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading Organizations ...");
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "satellite/index", options) : helperMissing.call(depth0, "partial", "satellite/index", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment-new/satellite/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading ....\n");
    
  });

});
define('fusor-ember-cli/templates/deployment-new/start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['rhci-start'] || (depth0 && depth0['rhci-start']),options={hash:{
      'isRhev': ("isRhev"),
      'isOpenStack': ("isOpenStack"),
      'isCloudForms': ("isCloudForms"),
      'nameRedHat': ("nameRedHat"),
      'nameRhev': ("nameRhev"),
      'nameOpenStack': ("nameOpenStack"),
      'nameCloudForms': ("nameCloudForms"),
      'imgRhev': ("imgRhev"),
      'imgOpenStack': ("imgOpenStack"),
      'imgCloudForms': ("imgCloudForms"),
      'isUpstream': ("isUpstream"),
      'satelliteTabRouteName': ("satelliteTabRouteName"),
      'disableNextOnStart': ("disableNextOnStart")
    },hashTypes:{'isRhev': "ID",'isOpenStack': "ID",'isCloudForms': "ID",'nameRedHat': "ID",'nameRhev': "ID",'nameOpenStack': "ID",'nameCloudForms': "ID",'imgRhev': "ID",'imgOpenStack': "ID",'imgCloudForms': "ID",'isUpstream': "ID",'satelliteTabRouteName': "ID",'disableNextOnStart': "ID"},hashContexts:{'isRhev': depth0,'isOpenStack': depth0,'isCloudForms': depth0,'nameRedHat': depth0,'nameRhev': depth0,'nameOpenStack': depth0,'nameCloudForms': depth0,'imgRhev': depth0,'imgOpenStack': depth0,'imgCloudForms': depth0,'isUpstream': depth0,'satelliteTabRouteName': depth0,'disableNextOnStart': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rhci-start", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n  <br />\n  <h1 class='deployment_name'>New ");
    stack1 = helpers._triageMustache.call(depth0, "nameRHCI", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" Deployment: <strong>");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong></h1>\n  ");
    stack1 = helpers.unless.call(depth0, "isNew", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  <br />\n  <br />\n\n  \n\n  ");
    data.buffer.push(escapeExpression((helper = helpers['rhci-wizard'] || (depth0 && depth0['rhci-wizard']),options={hash:{
      'nameSatellite': ("nameSatellite"),
      'nameRhev': ("nameRhev"),
      'nameOpenStack': ("nameOpenStack"),
      'nameCloudForms': ("nameCloudForms"),
      'stepNumberRhev': ("stepNumberRhev"),
      'stepNumberOpenstack': ("stepNumberOpenstack"),
      'stepNumberCloudForms': ("stepNumberCloudForms"),
      'stepNumberSubscriptions': ("stepNumberSubscriptions"),
      'stepNumberReview': ("stepNumberReview"),
      'isDisabledRhev': ("isDisabledRhev"),
      'isDisabledOpenstack': ("isDisabledOpenstack"),
      'isDisabledCloudForms': ("isDisabledCloudForms"),
      'isDisabledSubscriptions': ("isDisabledSubscriptions"),
      'isDisabledReview': ("isDisabledReview"),
      'isRhev': ("isRhev"),
      'isOpenStack': ("isOpenStack"),
      'isCloudForms': ("isCloudForms")
    },hashTypes:{'nameSatellite': "ID",'nameRhev': "ID",'nameOpenStack': "ID",'nameCloudForms': "ID",'stepNumberRhev': "ID",'stepNumberOpenstack': "ID",'stepNumberCloudForms': "ID",'stepNumberSubscriptions': "ID",'stepNumberReview': "ID",'isDisabledRhev': "ID",'isDisabledOpenstack': "ID",'isDisabledCloudForms': "ID",'isDisabledSubscriptions': "ID",'isDisabledReview': "ID",'isRhev': "ID",'isOpenStack': "ID",'isCloudForms': "ID"},hashContexts:{'nameSatellite': depth0,'nameRhev': depth0,'nameOpenStack': depth0,'nameCloudForms': depth0,'stepNumberRhev': depth0,'stepNumberOpenstack': depth0,'stepNumberCloudForms': depth0,'stepNumberSubscriptions': depth0,'stepNumberReview': depth0,'isDisabledRhev': depth0,'isDisabledOpenstack': depth0,'isDisabledCloudForms': depth0,'isDisabledSubscriptions': depth0,'isDisabledReview': depth0,'isRhev': depth0,'isOpenStack': depth0,'isCloudForms': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rhci-wizard", options))));
    data.buffer.push("\n");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    &nbsp;\n    ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "deployment.start", "", options) : helperMissing.call(depth0, "link-to", "deployment.start", "", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program3(depth0,data) {
    
    
    data.buffer.push("\n        <i class=\"fa fa-2x fa-pencil\"></i>\n    ");
    }

    data.buffer.push("\n\n\n\n<br />\n\n\n");
    stack1 = helpers.unless.call(depth0, "isHideWizard", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployment/start', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push(escapeExpression((helper = helpers['rhci-start'] || (depth0 && depth0['rhci-start']),options={hash:{
      'isRhev': ("isRhev"),
      'isOpenStack': ("isOpenStack"),
      'isCloudForms': ("isCloudForms"),
      'nameRedHat': ("nameRedHat"),
      'nameRhev': ("nameRhev"),
      'nameOpenStack': ("nameOpenStack"),
      'nameCloudForms': ("nameCloudForms"),
      'imgRhev': ("imgRhev"),
      'imgOpenStack': ("imgOpenStack"),
      'imgCloudForms': ("imgCloudForms"),
      'isUpstream': ("isUpstream"),
      'satelliteTabRouteName': ("satelliteTabRouteName"),
      'disableNextOnStart': ("disableNextOnStart")
    },hashTypes:{'isRhev': "ID",'isOpenStack': "ID",'isCloudForms': "ID",'nameRedHat': "ID",'nameRhev': "ID",'nameOpenStack': "ID",'nameCloudForms': "ID",'imgRhev': "ID",'imgOpenStack': "ID",'imgCloudForms': "ID",'isUpstream': "ID",'satelliteTabRouteName': "ID",'disableNextOnStart': "ID"},hashContexts:{'isRhev': depth0,'isOpenStack': depth0,'isCloudForms': depth0,'nameRedHat': depth0,'nameRhev': depth0,'nameOpenStack': depth0,'nameCloudForms': depth0,'imgRhev': depth0,'imgOpenStack': depth0,'imgCloudForms': depth0,'isUpstream': depth0,'satelliteTabRouteName': depth0,'disableNextOnStart': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "rhci-start", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/deployments', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("New Deployment");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    <tr>\n      <td> ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "deployment", "deployment", options) : helperMissing.call(depth0, "link-to", "deployment", "deployment", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "deployment.lifecycle_environment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "deployment.organization.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0,depth0],types:["STRING","ID"],data:data},helper ? helper.call(depth0, "deployment", "deployment", options) : helperMissing.call(depth0, "link-to", "deployment", "deployment", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</td>\n    </tr>\n  ");
    return buffer;
    }
  function program4(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "deployment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    return buffer;
    }

  function program6(depth0,data) {
    
    
    data.buffer.push(" Edit ");
    }

    data.buffer.push("<br />\n<h1>Deployments<span style='float:right;'>");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-success")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployment-new.start", options) : helperMissing.call(depth0, "link-to", "deployment-new.start", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</span>\n</h1>\n\n<br />\n<form class='form'>\n<div class=\"clearfix\">\n   <div class=\"form-group\" style='margin-left: -18px;'>\n     <div class='col-md-5'>\n       ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'class': ("form-control"),
      'placeholder': ("Filter ..."),
      'value': ("searchDeploymentString")
    },hashTypes:{'type': "STRING",'class': "STRING",'placeholder': "STRING",'value': "ID"},hashContexts:{'type': depth0,'class': depth0,'placeholder': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n     </div>\n     <button class='btn btn-default' style='margin-left:-20px'><i class=\"fa fa-search\"></i> Search</button>\n   </div>\n</div>\n</form>\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> Name </th>\n      <th> Environment </th>\n      <th> Organization </th>\n      <th> </th>\n    </tr>\n    </thead>\n\n  <tbody>\n  ");
    stack1 = helpers.each.call(depth0, "deployment", "in", "filteredDeployments", {hash:{
      'itemController': ("deployment")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </tbody>\n</table>\n\n<br />\nDisplaying <strong>");
    stack1 = helpers._triageMustache.call(depth0, "filteredDeployments.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" of ");
    stack1 = helpers._triageMustache.call(depth0, "model.length", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</strong> entries\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/devonly', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/discovered-hosts', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/engine', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"row\">\n  </div class='col-md-12'>\n\n    <h4 style='padding-left:15px;'>Select One Target Machine to Install ");
    stack1 = helpers._triageMustache.call(depth0, "engineTabName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(":</h4>\n\n    <div class=\"col-md-12\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n  </div>\n</div>\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/engine/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    <tr>\n      <td>\n        ");
    data.buffer.push(escapeExpression((helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("host.model"),
      'groupValue': ("selectedRhevEngineHost"),
      'changed': ("engineHostChanged")
    },hashTypes:{'value': "ID",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options))));
    data.buffer.push("  \n      </td>\n      <td>\n           ");
    stack1 = helpers['if'].call(depth0, "host.isSelectedAsEngine", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.mac", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.cpus", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.memory", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</td>\n    </tr>\n  ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n              ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("host.name"),
      'class': ("font-control")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n           ");
    return buffer;
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("\n \n\n<br />\n<table class=\"table table-bordered table-striped small\">\n<thead>\n    <tr>\n      <th> </th>\n      <th> Name </th>\n      <th> MAC </th>\n      <th> CPU's </th>\n      <th> Memory </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
    stack1 = helpers.each.call(depth0, "host", "in", "allDiscoveredHosts", {hash:{
      'itemController': ("discovered-host")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </tbody>\n</table>\n\n\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor.discovered-host", options) : helperMissing.call(depth0, "link-to", "hypervisor.discovered-host", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/hostgroup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/hostgroup/edit', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/hostgroups', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/hypervisor', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    data.buffer.push("<div class=\"row\">\n  </div class='col-md-12'>\n\n    <h4 style='padding-left:15px;'>Select Target Machine(s) to Install Hypervisor(s):</h4>\n\n    <div class=\"col-md-12\">\n        ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/hypervisor/discovered-host', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    <tr>\n      <td>\n        ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("checkbox"),
      'name': ("isSelectedAsHypervisor"),
      'checked': ("host.isSelectedAsHypervisor")
    },hashTypes:{'type': "STRING",'name': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'name': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n        ");
    stack1 = helpers._triageMustache.call(depth0, "host.id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </td>\n      <td>\n        ");
    stack1 = helpers['if'].call(depth0, "host.isSelectedAsHypervisor", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(2, program2, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.mac", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.cpus", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "host.memory", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "host.isSelectedAsHypervisor", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "host.isSelectedAsEngine", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</td>\n    </tr>\n  ");
    return buffer;
    }
  function program2(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n          ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("host.name"),
      'class': ("font-control")
    },hashTypes:{'type': "STRING",'value': "ID",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n        ");
    return buffer;
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

    data.buffer.push("\n\n\n<!-- <strong></strong> of <strong></strong>\navailable hosts selected \n -->\n<br />\n<table class=\"table table-bordered table-striped small\">\n  <thead>\n    <tr>\n      <th> </th>\n      <th> Name </th>\n      <th> MAC </th>\n      <th> CPU's </th>\n      <th> Memory </th>\n    </tr>\n  </thead>\n\n  <tbody>\n  ");
    stack1 = helpers.each.call(depth0, "host", "in", "availableHosts", {hash:{
      'itemController': ("discovered-host")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </tbody>\n</table>\n<!-- <button >saveHyperVisors</button>\n -->\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "saveHyperVisors", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class='btn btn-primary'>Next</button>\n      <!--Next-->\n    </div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h2>\nLoading ....\n</h2>");
    
  });

});
define('fusor-ember-cli/templates/loggedin', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("<h1>ALREADY LOGGED IN</h1>\n");
    
  });

});
define('fusor-ember-cli/templates/login', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <div class=\"alert alert-danger col-md-offset-2\" role=\"alert\">\n          <p>\n            <strong>Login failed:</strong> <code>");
    stack1 = helpers._triageMustache.call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</code>\n          </p>\n        </div>\n      ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n            ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("Basic"),
      'groupValue': ("authType")
    },hashTypes:{'value': "STRING",'groupValue': "ID"},hashContexts:{'value': depth0,'groupValue': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n            ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("oAuth"),
      'groupValue': ("authType")
    },hashTypes:{'value': "STRING",'groupValue': "ID"},hashContexts:{'value': depth0,'groupValue': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program4(depth0,data) {
    
    
    data.buffer.push("\n                Basic Authorization\n            ");
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("\n                oAuth Token\n            ");
    }

    data.buffer.push("<br />\n<br />\n<h1>Login</h1>\n<br />\n<br />\n<div class=\"login-page222\" >\n\n<div id=\"login\" class=\"container\">\n  <div class=\"row\">\n    <div class=\"col-sm-12\">\n      <div id=\"brand\">\n        <!-- <img alt=\"Foreman_white\" src=\"assets/foreman_white.png\" /> -->\n      </div><!--/#brand-->\n    </div>\n    <div class=\"col-sm-7 col-md-6 col-lg-5 login\">\n\n     ");
    stack1 = helpers['if'].call(depth0, "errorMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      <form accept-charset=\"UTF-8\" action=\"/users/login\" class=\"form-horizontal\" id=\"login-form\" method=\"post\"><div style=\"margin:0;padding:0;display:inline\"><input name=\"utf8\" type=\"hidden\" value=\"&#x2713;\" /><input name=\"authenticity_token\" type=\"hidden\" value=\"1f770GegsrWb4ZJIC0UkSEkvBVG9MnRJ7jypTsrjeLU=\" /></div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\" for=\"login_login\">Username</label>\n          <div class=\"col-sm-10\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("identification"),
      'size': ("30"),
      'class': ("form-control")
    },hashTypes:{'type': "STRING",'value': "ID",'size': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'size': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n        </div>\n\n        <div class=\"form-group\">\n          <label class=\"col-sm-2 control-label\" for=\"login_password\">Password</label>\n          <div class=\"col-sm-10\">\n            ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("password"),
      'value': ("password"),
      'size': ("30"),
      'class': ("form-control")
    },hashTypes:{'type': "STRING",'value': "ID",'size': "STRING",'class': "STRING"},hashContexts:{'type': depth0,'value': depth0,'size': depth0,'class': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("\n          </div>\n        </div>\n\n        ");
    stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
      'label': (""),
      'labelSize': ("col-md-2"),
      'inputSize': ("col-md-9")
    },hashTypes:{'label': "STRING",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'labelSize': depth0,'inputSize': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n        <div class=\"form-group\">\n          <div class=\"col-xs-offset-8 col-xs-4 submit\">\n            <button class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "authenticate", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" >Login</button>\n          </div>\n        </div>\n        \n      </form>\n    </div>\n  </div>\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/logout-modal', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/mainmenu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/networking', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/new-environment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<form class=\"form form-horizontal\">\n  ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Name"),
      'value': ("name"),
      'labelSize': ("col-md-4"),
      'inputSize': ("col-md-8")
    },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Label"),
      'value': ("label"),
      'labelSize': ("col-md-4"),
      'inputSize': ("col-md-8")
    },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n  ");
    data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
      'label': ("Description (Optional)"),
      'value': ("description"),
      'labelSize': ("col-md-4"),
      'inputSize': ("col-md-8")
    },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
    data.buffer.push("\n</form>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/new-organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;


    data.buffer.push("<form class=\"form form-horizontal\">\n  ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Name"),
      'value': ("defaultOrgName"),
      'labelSize': ("col-md-4"),
      'inputSize': ("col-md-8")
    },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n  \n  ");
    data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
      'label': ("Description (Optional)"),
      'value': ("fields_org.description"),
      'labelSize': ("col-md-4"),
      'inputSize': ("col-md-8")
    },hashTypes:{'label': "STRING",'value': "ID",'labelSize': "STRING",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'labelSize': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
    data.buffer.push("\n</form>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/nodes', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("adfasdf");
    
  });

});
define('fusor-ember-cli/templates/openstack', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberOpenstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("A. Settings</a>\n      ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberOpenstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("B. Network Configuration</a>\n      ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberOpenstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("C. Services Overview</a>\n      ");
    return buffer;
    }

  function program7(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberOpenstack", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("D. Services Configuration</a>\n      ");
    return buffer;
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
define('fusor-ember-cli/templates/openstack/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/osp-configuration', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/osp-network', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/osp-overview', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("    <h3>Deployment Roles &amp; Available Services</h3>\n    <h4>Controller / Compute - Neutron Networking</h4>\n\n    <!--Neutron Non-HA-->\n<div class=\"clearfix\">\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Controller</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>Horizon</li>\n        <li>Keystone</li>\n        <li>Glance</li>\n        <li>Cinder</li>\n        <li>Nova</li>\n        <li>Neutron Server</li>\n        <li>Database</li>\n        <li>Messaging</li>\n        <li>Heat</li>\n        <li>Ceilometer</li>\n      </ul>\n     </div>\n  </div>\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Compute</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>Nova-Compute</li>\n        <li>Open vSwitch Agent</li>\n        <li>Ceilometer Agent</li>\n      </ul>\n     </div>\n  </div>\n  <div class=\"panel panel-default service-box\">\n    <div class=\"panel-heading\"><strong>Neutron Network Node</strong></div>\n    <div class=\"panel-body\">\n      <ul>\n        <li>L3 Agent</li>\n        <li>Open vSwitch Agent</li>\n        <li>DHCP Agent</li>\n        <li>Metadata Agent</li>\n      </ul>\n     </div>\n  </div>\n</div>\n\n\n\n");
    
  });

});
define('fusor-ember-cli/templates/osp-settings', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/products', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/review', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberReview", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("A. Review Installation</a>\n      ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberReview", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("B. Installation Progress</a>\n      ");
    return buffer;
    }

    data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("disableTabInstallation")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.installation", options) : helperMissing.call(depth0, "link-to", "review.installation", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("disableTabProgress")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.progress", options) : helperMissing.call(depth0, "link-to", "review.progress", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/review/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/review/installation', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }

  function program4(depth0,data) {
    
    var stack1;
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.organization.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }

  function program6(depth0,data) {
    
    var stack1;
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.lifecycle_environment.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    else { data.buffer.push(''); }
    }

  function program8(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    ");
    stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
      'name': ("controllers.deployment.nameRhev"),
      'isOpen': ("isRhevOpen")
    },hashTypes:{'name': "ID",'isOpen': "ID"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program9(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      Setup Type: ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-setup", options) : helperMissing.call(depth0, "link-to", "rhev-setup", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      <br />\n      ");
    stack1 = helpers['if'].call(depth0, "isSelfHosted", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(15, program15, data),fn:self.program(12, program12, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      \n      \n\n      <br />\n      Engine admin password:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(19, program19, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Datacenter Name:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(21, program21, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Cluster Name:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(23, program23, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Storage Name:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(25, program25, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      CPU Type:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(27, program27, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n\n\n      <br />\n      Storage Type:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(29, program29, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n          Storage Address:\n           ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(31, program31, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n          Share Path:\n           ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(33, program33, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n\n      <br />\n\n      <br />\n    ");
    return buffer;
    }
  function program10(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.rhev-setup.rhevSetupTitle", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    return buffer;
    }

  function program12(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n        Hypervisor/Engine:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.discovered-host", options) : helperMissing.call(depth0, "link-to", "engine.discovered-host", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<br />\n      ");
    return buffer;
    }
  function program13(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "rhev_engine_host.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" ");
    return buffer;
    }

  function program15(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n        Engine:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(13, program13, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.discovered-host", options) : helperMissing.call(depth0, "link-to", "engine.discovered-host", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<br />\n        Hypervisor: <br />\n        ");
    stack1 = helpers.each.call(depth0, "host", "in", "hypervisorSelectedHosts", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(16, program16, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    return buffer;
    }
  function program16(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(17, program17, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor.discovered-host", options) : helperMissing.call(depth0, "link-to", "hypervisor.discovered-host", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<br />\n        ");
    return buffer;
    }
  function program17(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push(" ");
    stack1 = helpers._triageMustache.call(depth0, "host.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(".rhci.redhat.com ");
    return buffer;
    }

  function program19(depth0,data) {
    
    
    data.buffer.push("\n          *********\n        ");
    }

  function program21(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_database_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program23(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_cluster_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program25(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_storage_name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program27(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_cpu_type", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program29(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_storage_type", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program31(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_storage_address", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          ");
    return buffer;
    }

  function program33(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.rhev_share_path", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n          ");
    return buffer;
    }

  function program35(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    ");
    stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
      'name': ("controllers.deployment.nameOpenStack"),
      'isOpen': ("isOpenStackOpen")
    },hashTypes:{'name': "ID",'isOpen': "ID"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(36, program36, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program36(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      High Availability:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(37, program37, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Networking:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(39, program39, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Messaging Provider:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(41, program41, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Platform:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(43, program43, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Service Password:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(45, program45, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Custom Repos:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(47, program47, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-settings", options) : helperMissing.call(depth0, "link-to", "osp-settings", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("<br />\n        <br />\n\n      Tenant Network Type\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(49, program49, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Core Plugin Type\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(51, program51, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Glance Driver Backend\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(53, program53, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n      Cinder Driver Backend\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(55, program55, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "osp-configuration", options) : helperMissing.call(depth0, "link-to", "osp-configuration", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n    ");
    return buffer;
    }
  function program37(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.ha", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program39(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.networking", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program41(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.messaging", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program43(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.platform", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program45(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-settings.password", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program47(depth0,data) {
    
    var buffer = '', helper, options;
    data.buffer.push("\n          ");
    data.buffer.push(escapeExpression((helper = helpers['showdown-addon'] || (depth0 && depth0['showdown-addon']),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "controllers.osp-settings.customRepos", options) : helperMissing.call(depth0, "showdown-addon", "controllers.osp-settings.customRepos", options))));
    data.buffer.push("\n        ");
    return buffer;
    }

  function program49(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.tenantType", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program51(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.corePlugin", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program53(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.glanceBackend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program55(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.osp-configuration.cinderBackend", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

  function program57(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n    ");
    stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
      'name': ("controllers.deployment.nameCloudForms"),
      'isOpen': ("isCloudFormsOpen")
    },hashTypes:{'name': "ID",'isOpen': "ID"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(58, program58, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  ");
    return buffer;
    }
  function program58(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      Installation Location:\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(59, program59, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "where-install", options) : helperMissing.call(depth0, "link-to", "where-install", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <br />\n    ");
    return buffer;
    }
  function program59(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n          ");
    stack1 = helpers._triageMustache.call(depth0, "controllers.deployment.cfme_install_loc", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }

    data.buffer.push("<div class='row'>\n  <div class='col-md-11 col-md-offset-1'>\n\n    ");
    stack1 = (helper = helpers['accordion-item'] || (depth0 && depth0['accordion-item']),options={hash:{
      'name': ("controllers.deployment.nameSatellite"),
      'isOpen': (true)
    },hashTypes:{'name': "ID",'isOpen': "BOOLEAN"},hashContexts:{'name': depth0,'isOpen': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "accordion-item", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  ");
    stack1 = helpers['if'].call(depth0, "isRhev", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  ");
    stack1 = helpers['if'].call(depth0, "isOpenStack", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(35, program35, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n  ");
    stack1 = helpers['if'].call(depth0, "isCloudForms", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(57, program57, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n    <br />\n    <br />\n\n    <div class='pull-right'>\n      <br />\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class='btn btn-default'>Cancel</button>\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "installDeployment", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" class='btn btn-primary'>Deploy</button>\n    </div>\n\n\n  </div>\n</div>\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/review/progress', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      Installing (");
    stack1 = helpers._triageMustache.call(depth0, "prog", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("% complete)\n      ");
    data.buffer.push(escapeExpression((helper = helpers['bs-progress'] || (depth0 && depth0['bs-progress']),options={hash:{
      'progressBinding': ("prog"),
      'type': ("success"),
      'stripped': (true),
      'animated': (true)
    },hashTypes:{'progressBinding': "STRING",'type': "STRING",'stripped': "BOOLEAN",'animated': "BOOLEAN"},hashContexts:{'progressBinding': depth0,'type': depth0,'stripped': depth0,'animated': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "bs-progress", options))));
    data.buffer.push("\n    ");
    return buffer;
    }

    data.buffer.push("<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <h1>ONE API CALL TO METHOD 'DEPLOY' WHICH RUNS ASYNC DYNFLOW ACTIONS</h1>\n    <h1>NO ORCHESTRATION LOGIC IN UI</h1>\n    <br />\n\n    <div class='alert alert-success'>\n      INSTALLING: This is currently not hooked up to dynflow to track progress.<br />\n      Go to Virt Manager to view installation progress.\n    </div>\n\n    ");
    stack1 = helpers['if'].call(depth0, "installationInProgress", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<!--\n    <div class='row'>\n      <h3>Red Hat Enterprise Virtualization (25% complete, 3 hours 15 minutes remaining)</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>Red Hat Enterprise Linux OpenStack Platform</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>Red Hat Enterprise Linux OpenStack Platform</h3>\n      <div class='col-md-offset-1'>\n      </div>\n    </div> -->\n\n    <br />\n    <br />\n\n\n  </div>\n</div>\n\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/rhci', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '';


    return buffer;
    
  });

});
define('fusor-ember-cli/templates/rhev-options', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("<h4> Engine Configuration </h4>\n\n<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Engine admin password"),
      'type': ("password"),
      'value': ("rhev_engine_admin_password")
    },hashTypes:{'label': "STRING",'type': "STRING",'value': "ID"},hashContexts:{'label': depth0,'type': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Datacenter Name"),
      'value': ("rhev_database_name"),
      'placeholder': ("Leave blank for default")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Cluster Name"),
      'value': ("rhev_cluster_name"),
      'placeholder': ("Leave blank for default")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Storage name"),
      'value': ("rhev_storage_name"),
      'placeholder': ("Leave blank for default")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("CPU Type"),
      'value': ("rhev_cpu_type"),
      'placeholder': ("Leave blank for default"),
      'help-inline': ("")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING",'help-inline': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0,'help-inline': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n    </form>\n  </div>\n</div>\n\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/rhev-setup', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n        Host + Engine\n      ");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("\n        Self Hosted\n      ");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push(" \n<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <div class='row'>\n      <h3>\n      ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("rhevhost"),
      'groupValue': ("rhevSetup"),
      'changed': ("rhevSetupChanged")
    },hashTypes:{'value': "STRING",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </h3>\n\n      <div class='col-md-offset-1'>\n          Installation flow using separate machines for the Engine and the Hypervisor(s).\n      </div>\n    </div>\n\n    <div class='row'>\n      <h3>\n      ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("selfhost"),
      'groupValue': ("rhevSetup"),
      'changed': ("rhevSetupChanged")
    },hashTypes:{'value': "STRING",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </h3>\n      <div class='col-md-offset-1'>\n          Installation flow using the same machine for the Engine and the Hyperviso.\n      </div>\n    </div>\n\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine.discovered-host", options) : helperMissing.call(depth0, "link-to", "engine.discovered-host", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n\n  </div>\n</div>\n\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel-deployment-modal", options) : helperMissing.call(depth0, "partial", "cancel-deployment-modal", options))));
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/rhev', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n        <a>2A. Setup Architecture</a>\n      ");
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>2B. ");
    stack1 = helpers._triageMustache.call(depth0, "engineTabName", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("</a>\n      ");
    return buffer;
    }

  function program5(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "hypervisor", options) : helperMissing.call(depth0, "link-to", "hypervisor", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    return buffer;
    }
  function program6(depth0,data) {
    
    
    data.buffer.push("\n        <a>2C. Hypervisors</a>\n      ");
    }

  function program8(depth0,data) {
    
    
    data.buffer.push("\n        <a>2D. Configuration</a>\n      ");
    }

  function program10(depth0,data) {
    
    
    data.buffer.push("\n        <a>2E. Storage</a>\n      ");
    }

    data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-setup", options) : helperMissing.call(depth0, "link-to", "rhev-setup", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "engine", options) : helperMissing.call(depth0, "link-to", "engine", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    stack1 = helpers.unless.call(depth0, "isSelfHost", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "rhev-options", options) : helperMissing.call(depth0, "link-to", "rhev-options", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(10, program10, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "storage", options) : helperMissing.call(depth0, "link-to", "storage", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n\n</div>\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/satellite', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n        <a>1A. Deployment Name</a>\n      ");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("\n        <a>1B. Configure Organization</a>\n      ");
    }

  function program5(depth0,data) {
    
    
    data.buffer.push("\n        <a>1C. Configure Lifecycle Environment</a>\n      ");
    }

    data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n     ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("disableTabDeploymentName")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "satelliteTabRouteName", options) : helperMissing.call(depth0, "link-to", "satelliteTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("disableTabConfigureOrganization")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "organizationTabRouteName", options) : helperMissing.call(depth0, "link-to", "organizationTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li"),
      'disabled': ("disableTabLifecycleEnvironment")
    },hashTypes:{'tagName': "STRING",'disabled': "ID"},hashContexts:{'tagName': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "lifecycleEnvironmentTabRouteName", options) : helperMissing.call(depth0, "link-to", "lifecycleEnvironmentTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/satellite/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n            Next\n        ");
    }

    data.buffer.push("<div class=\"row\">\n  <div class='col-md-9'>\n    <br />\n    <form class=\"form-horizontal\" role=\"form\">\n\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Name"),
      'value': ("name"),
      'inputSize': ("col-md-5"),
      'errors': ("errors")
    },hashTypes:{'label': "STRING",'value': "ID",'inputSize': "STRING",'errors': "ID"},hashContexts:{'label': depth0,'value': depth0,'inputSize': depth0,'errors': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n\n      ");
    data.buffer.push(escapeExpression((helper = helpers['textarea-f'] || (depth0 && depth0['textarea-f']),options={hash:{
      'label': ("Description (Optional)"),
      'value': ("description"),
      'inputSize': ("col-md-5")
    },hashTypes:{'label': "STRING",'value': "ID",'inputSize': "STRING"},hashContexts:{'label': depth0,'value': depth0,'inputSize': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "textarea-f", options))));
    data.buffer.push("\n\n      <div class='pull-right'>\n        <br />\n        <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class='btn btn-default'>Cancel</button>\n        ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'disabled': ("disableNextOnDeploymentName"),
      'class': ("btn btn-primary")
    },hashTypes:{'disabled': "ID",'class': "STRING"},hashContexts:{'disabled': depth0,'class': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data},helper ? helper.call(depth0, "organizationTabRouteName", options) : helperMissing.call(depth0, "link-to", "organizationTabRouteName", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" \n      </div>\n\n    </form>\n  </div>\n</div>\n");
    data.buffer.push(escapeExpression((helper = helpers.partial || (depth0 && depth0.partial),options={hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cancel-deployment-modal", options) : helperMissing.call(depth0, "partial", "cancel-deployment-modal", options))));
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/satellite/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading ....\n");
    
  });

});
define('fusor-ember-cli/templates/setpassword', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', escapeExpression=this.escapeExpression;


    data.buffer.push("<br /><h1>Change Administrator Password</h1>\n\n<br />\nIt is required that you change the admin password the first time that you log in.\n\n<br />\n<br />\n\n    <div class=\"col-sm-8 col-md-8 col-lg-8 login\">\n      <form accept-charset=\"UTF-8\" action=\"/users/login\" class=\"form-horizontal\" id=\"login-form\" method=\"post\"><div style=\"margin:0;padding:0;display:inline\"><input name=\"utf8\" type=\"hidden\" value=\"&#x2713;\" /><input name=\"authenticity_token\" type=\"hidden\" value=\"1f770GegsrWb4ZJIC0UkSEkvBVG9MnRJ7jypTsrjeLU=\" /></div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-3 control-label\" for=\"login_login\">Password *</label>\n            <div class=\"col-sm-9\">\n              <input class=\"form-control\" focus_on_load=\"true\" id=\"login_login\" name=\"login[login]\" size=\"30\" type=\"text\" />\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <label class=\"col-sm-3 control-label\" for=\"login_password\">Confirm Password *</label>\n            <div class=\"col-sm-9\">\n              <input class=\"form-control\" id=\"login_password\" name=\"login[password]\" type=\"password\" />\n            </div>\n          </div>\n          <div class=\"form-group\">\n            <div class=\"col-xs-offset-8 col-xs-4 submit\">\n            <button class=\"btn btn-primary\" ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "updatePassword", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["STRING"],data:data})));
    data.buffer.push(" >Change Password</button>\n            </div>\n          </div>\n      </form>\n  </div>\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/side-menu', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
define('fusor-ember-cli/templates/side-menu.loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading ...");
    
  });

});
define('fusor-ember-cli/templates/single-deployment', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "id", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" - ");
    stack1 = helpers._triageMustache.call(depth0, "name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/storage', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n\n        ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("NFS"),
      'groupValue': ("rhev_storage_type")
    },hashTypes:{'value': "STRING",'groupValue': "ID"},hashContexts:{'value': depth0,'groupValue': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        &nbsp;&nbsp;&nbsp;&nbsp;\n        ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("Gluster"),
      'groupValue': ("rhev_storage_type")
    },hashTypes:{'value': "STRING",'groupValue': "ID"},hashContexts:{'value': depth0,'groupValue': depth0},inverse:self.noop,fn:self.program(4, program4, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n          NFS\n        ");
    }

  function program4(depth0,data) {
    
    
    data.buffer.push("\n          Gluster\n        ");
    }

  function program6(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program8(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("\n<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n\n      ");
    stack1 = (helper = helpers['base-f'] || (depth0 && depth0['base-f']),options={hash:{
      'label': ("Storage Type")
    },hashTypes:{'label': "STRING"},hashContexts:{'label': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "base-f", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Storage Address"),
      'value': ("rhev_storage_address"),
      'placeholder': ("Leave blank for default")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Share Path"),
      'value': ("rhev_share_path"),
      'placeholder': ("Leave blank for default")
    },hashTypes:{'label': "STRING",'value': "ID",'placeholder': "STRING"},hashContexts:{'label': depth0,'value': depth0,'placeholder': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n\n    </form>\n  </div>\n</div>\n\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(6, program6, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(8, program8, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "cloudforms", options) : helperMissing.call(depth0, "link-to", "cloudforms", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/subscriptions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("A. Enter Credentials</a>\n      ");
    return buffer;
    }

  function program3(depth0,data) {
    
    var buffer = '', stack1;
    data.buffer.push("\n        <a>");
    stack1 = helpers._triageMustache.call(depth0, "stepNumberSubscriptions", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("B. Select Subscriptions</a>\n      ");
    return buffer;
    }

    data.buffer.push("<div class=\"row tabbed_side_nav_form\">\n\n  <ul class=\"nav nav-pills nav-stacked col-md-3\">\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions.credentials", options) : helperMissing.call(depth0, "link-to", "subscriptions.credentials", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'tagName': ("li")
    },hashTypes:{'tagName': "STRING"},hashContexts:{'tagName': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions.select-subscriptions", options) : helperMissing.call(depth0, "link-to", "subscriptions.select-subscriptions", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </ul>\n\n  <div class=\"tab-content col-md-9\">\n      ");
    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n  </div>\n\n</div>\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/subscriptions/credentials', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, self=this, functionType="function", blockHelperMissing=helpers.blockHelperMissing;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n          <a href='https://www.redhat.com/wapps/sso/lostPassword.html' target='_blank'>\n          Forgot username or password?\n          </a>\n        ");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("Enter your Red Hat account information.\n\n<div class='row'>\n  <div class='col-md-12'>\n    <br />\n    <form class=\"form form-horizontal\">\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Username"),
      'value': ("username")
    },hashTypes:{'label': "STRING",'value': "ID"},hashContexts:{'label': depth0,'value': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n      ");
    data.buffer.push(escapeExpression((helper = helpers['text-f'] || (depth0 && depth0['text-f']),options={hash:{
      'label': ("Password"),
      'value': ("password"),
      'type': ("password")
    },hashTypes:{'label': "STRING",'value': "ID",'type': "STRING"},hashContexts:{'label': depth0,'value': depth0,'type': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "text-f", options))));
    data.buffer.push("\n\n        ");
    options={hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}
    if (helper = helpers['base-f']) { stack1 = helper.call(depth0, options); }
    else { helper = (depth0 && depth0['base-f']); stack1 = typeof helper === functionType ? helper.call(depth0, options) : helper; }
    if (!helpers['base-f']) { stack1 = blockHelperMissing.call(depth0, 'base-f', {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[],types:[],data:data}); }
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </form>\n  </div>\n</div>\n\n    <br />\n    <br />\n    <div style='float:right'>\n      <button ");
    data.buffer.push(escapeExpression(helpers.action.call(depth0, "showModal", "cancelDeploymentModal", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0,depth0],types:["STRING","STRING"],data:data})));
    data.buffer.push(" class='btn btn-default'>Cancel</button>\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary"),
      'disabled': ("disableCredentialsNext")
    },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions.select-subscriptions", options) : helperMissing.call(depth0, "link-to", "subscriptions.select-subscriptions", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n\n\n\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/subscriptions/index', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1;


    stack1 = helpers._triageMustache.call(depth0, "outlet", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/subscriptions/loading', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    


    data.buffer.push("Loading ...\n");
    
  });

});
define('fusor-ember-cli/templates/subscriptions/select-subscriptions', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
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
      'checked': ("subscription.isChecked")
    },hashTypes:{'type': "STRING",'checked': "ID"},hashContexts:{'type': depth0,'checked': depth0},contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "input", options))));
    data.buffer.push("</td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.name", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.contract_number", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.available", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.subscription_type", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.start_date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    stack1 = helpers._triageMustache.call(depth0, "subscription.end_date", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" </td>\n      <td> ");
    data.buffer.push(escapeExpression((helper = helpers.input || (depth0 && depth0.input),options={hash:{
      'type': ("text"),
      'value': ("subscription.quantity"),
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

    data.buffer.push("<br />\n");
    stack1 = helpers['if'].call(depth0, "attachingInProgress", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n");
    stack1 = helpers['if'].call(depth0, "showAttachedSuccessMessage", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(3, program3, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n<p>\nDefault subscription selections have been made for the components of your RHCI deployment. If the selections need to be adjusted, please do so before proceeding.\n</p>\n\n");
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
    stack1 = helpers.each.call(depth0, "subscription", "in", "controller.model", {hash:{
      'itemController': ("subscription")
    },hashTypes:{'itemController': "STRING"},hashContexts:{'itemController': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0,depth0,depth0],types:["ID","ID","ID"],data:data});
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
      'disabled': ("disableSubscriptionsNext")
    },hashTypes:{'class': "STRING",'disabled': "ID"},hashContexts:{'class': depth0,'disabled': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "review.installation", options) : helperMissing.call(depth0, "link-to", "review.installation", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n</div>\n");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/topbar', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, escapeExpression=this.escapeExpression, self=this;

  function program1(depth0,data) {
    
    
    data.buffer.push("\n          <img alt=\"Foreman\" src=\"assets/foreman.png\">\n          <a href=\"/\">Foreman</a>\n        ");
    }

  function program3(depth0,data) {
    
    
    data.buffer.push("\n          <a href=\"/\">\n            <img alt=\"Header-logotype\" src=\"assets/Header-logotype.png\">\n          </a>\n        ");
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
      'class': ("isUpstream:container:container")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},contexts:[],types:[],data:data})));
    data.buffer.push(">\n\n      <div class=\"navbar-brand\">\n        ");
    stack1 = helpers['if'].call(depth0, "isUpstream", {hash:{},hashTypes:{},hashContexts:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      </div>\n\n      <ul class=\"nav navbar-nav navbar-right navbar-header-menu navbar-collapse collapse\">\n\n        <li class=\"dropdown menu_tab_dropdown\">\n          <a href=\"#\" class=\"dropdown-toggle\" data-toggle=\"dropdown\">\n            \n            \n            &nbsp;\n            \n            &nbsp;\n            <img alt=\"Change your avatar at gravatar.com\" class=\"avatar small\" src=\"assets/user.jpg\">");
    stack1 = helpers._triageMustache.call(depth0, "loginUsername", {hash:{},hashTypes:{},hashContexts:{},contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push(" <span class=\"caret\"></span>\n          </a>\n\n          <ul class=\"dropdown-menu pull-right\">\n\n            ");
    stack1 = helpers['if'].call(depth0, "session.isAuthenticated", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(5, program5, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n\n          </ul>\n\n        </li>\n      </ul>\n\n    </div>\n  </div>\n</div>");
    return buffer;
    
  });

});
define('fusor-ember-cli/templates/where-install', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].Handlebars.template(function anonymous(Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
  helpers = this.merge(helpers, Ember['default'].Handlebars.helpers); data = data || {};
    var buffer = '', stack1, helper, options, self=this, helperMissing=helpers.helperMissing;

  function program1(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("RHEV"),
      'groupValue': ("cfme_install_loc"),
      'changed': ("cfmeLocationChanged")
    },hashTypes:{'value': "STRING",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},inverse:self.noop,fn:self.program(2, program2, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program2(depth0,data) {
    
    
    data.buffer.push("\n            Install on RHEV\n          ");
    }

  function program4(depth0,data) {
    
    var buffer = '', stack1, helper, options;
    data.buffer.push("\n          ");
    stack1 = (helper = helpers['radio-button'] || (depth0 && depth0['radio-button']),options={hash:{
      'value': ("OpenStack"),
      'groupValue': ("cfme_install_loc"),
      'changed': ("cfmeLocationChanged")
    },hashTypes:{'value': "STRING",'groupValue': "ID",'changed': "STRING"},hashContexts:{'value': depth0,'groupValue': depth0,'changed': depth0},inverse:self.noop,fn:self.program(5, program5, data),contexts:[],types:[],data:data},helper ? helper.call(depth0, options) : helperMissing.call(depth0, "radio-button", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n        ");
    return buffer;
    }
  function program5(depth0,data) {
    
    
    data.buffer.push("\n            Install on OpenStack\n          ");
    }

  function program7(depth0,data) {
    
    
    data.buffer.push("Cancel");
    }

  function program9(depth0,data) {
    
    
    data.buffer.push("Next");
    }

    data.buffer.push("\n<div class='row'>\n  <div class='col-md-8 col-md-offset-1'>\n\n    <div class='row'>\n      Select the location where to install CloudForms.\n      <h3>\n        ");
    stack1 = helpers.unless.call(depth0, "disableRHEV", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(1, program1, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n\n    <div class='row'>\n      <h3>\n        ");
    stack1 = helpers.unless.call(depth0, "disableOpenStack", {hash:{},hashTypes:{},hashContexts:{},inverse:self.noop,fn:self.program(4, program4, data),contexts:[depth0],types:["ID"],data:data});
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>\n\n  </div>\n</div>\n\n    <div class='pull-right'>\n      <br />\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-default")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(7, program7, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "deployments", options) : helperMissing.call(depth0, "link-to", "deployments", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n      ");
    stack1 = (helper = helpers['link-to'] || (depth0 && depth0['link-to']),options={hash:{
      'class': ("btn btn-primary")
    },hashTypes:{'class': "STRING"},hashContexts:{'class': depth0},inverse:self.noop,fn:self.program(9, program9, data),contexts:[depth0],types:["STRING"],data:data},helper ? helper.call(depth0, "subscriptions.credentials", options) : helperMissing.call(depth0, "link-to", "subscriptions.credentials", options));
    if(stack1 || stack1 === 0) { data.buffer.push(stack1); }
    data.buffer.push("\n    </div>");
    return buffer;
    
  });

});
define('fusor-ember-cli/tests/adapters/application.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/application.js should pass jshint', function() { 
    ok(true, 'adapters/application.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/adapters/deployment.jshint', function () {

  'use strict';

  module('JSHint - adapters');
  test('adapters/deployment.js should pass jshint', function() { 
    ok(true, 'adapters/deployment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/app.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('app.js should pass jshint', function() { 
    ok(true, 'app.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/authenticators/foreman.jshint', function () {

  'use strict';

  module('JSHint - authenticators');
  test('authenticators/foreman.js should pass jshint', function() { 
    ok(false, 'authenticators/foreman.js should pass jshint.\nauthenticators/foreman.js: line 13, col 16, \'Ember\' is not defined.\nauthenticators/foreman.js: line 14, col 7, \'Ember\' is not defined.\nauthenticators/foreman.js: line 35, col 20, \'Ember\' is not defined.\nauthenticators/foreman.js: line 36, col 11, \'Ember\' is not defined.\nauthenticators/foreman.js: line 3, col 8, \'ApplicationAdapter\' is defined but never used.\nauthenticators/foreman.js: line 12, col 9, \'self\' is defined but never used.\nauthenticators/foreman.js: line 34, col 13, \'self\' is defined but never used.\n\n7 errors'); 
  });

});
define('fusor-ember-cli/tests/components/accordion-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/accordion-item.js should pass jshint', function() { 
    ok(true, 'components/accordion-item.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/base-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/base-f.js should pass jshint', function() { 
    ok(true, 'components/base-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/env-path-list-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/env-path-list-item.js should pass jshint', function() { 
    ok(false, 'components/env-path-list-item.js should pass jshint.\ncomponents/env-path-list-item.js: line 19, col 19, \'event\' is defined but never used.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/components/modal-confirm.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/modal-confirm.js should pass jshint', function() { 
    ok(true, 'components/modal-confirm.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/radio-button-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/radio-button-f.js should pass jshint', function() { 
    ok(true, 'components/radio-button-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/rchi-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/rchi-item.js should pass jshint', function() { 
    ok(true, 'components/rchi-item.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/rhci-hover-text.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/rhci-hover-text.js should pass jshint', function() { 
    ok(true, 'components/rhci-hover-text.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/rhci-start.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/rhci-start.js should pass jshint', function() { 
    ok(true, 'components/rhci-start.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/rhci-wizard.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/rhci-wizard.js should pass jshint', function() { 
    ok(true, 'components/rhci-wizard.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/select-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/select-f.js should pass jshint', function() { 
    ok(true, 'components/select-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/select-simple-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/select-simple-f.js should pass jshint', function() { 
    ok(true, 'components/select-simple-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/step-number.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/step-number.js should pass jshint', function() { 
    ok(true, 'components/step-number.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/sub-menu.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/sub-menu.js should pass jshint', function() { 
    ok(true, 'components/sub-menu.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/subnet-drop-area.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/subnet-drop-area.js should pass jshint', function() { 
    ok(true, 'components/subnet-drop-area.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/text-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/text-f.js should pass jshint', function() { 
    ok(true, 'components/text-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/textarea-f.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/textarea-f.js should pass jshint', function() { 
    ok(true, 'components/textarea-f.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/tr-organization.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/tr-organization.js should pass jshint', function() { 
    ok(false, 'components/tr-organization.js should pass jshint.\ncomponents/tr-organization.js: line 6, col 48, Expected \'===\' and instead saw \'==\'.\ncomponents/tr-organization.js: line 10, col 35, \'event\' is defined but never used.\n\n2 errors'); 
  });

});
define('fusor-ember-cli/tests/components/traffic-type.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/traffic-type.js should pass jshint', function() { 
    ok(true, 'components/traffic-type.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/upstream-downstream.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/upstream-downstream.js should pass jshint', function() { 
    ok(true, 'components/upstream-downstream.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/vertical-tab.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/vertical-tab.js should pass jshint', function() { 
    ok(true, 'components/vertical-tab.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/components/wizard-item.jshint', function () {

  'use strict';

  module('JSHint - components');
  test('components/wizard-item.js should pass jshint', function() { 
    ok(true, 'components/wizard-item.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/application.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/application.js should pass jshint', function() { 
    ok(false, 'controllers/application.js should pass jshint.\ncontrollers/application.js: line 48, col 7, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 49, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 54, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 59, col 14, \'Bootstrap\' is not defined.\ncontrollers/application.js: line 37, col 26, \'data\' is defined but never used.\n\n5 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/cancel-modal.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/cancel-modal.js should pass jshint', function() { 
    ok(true, 'controllers/cancel-modal.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/cloudforms-storage-domain.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/cloudforms-storage-domain.js should pass jshint', function() { 
    ok(true, 'controllers/cloudforms-storage-domain.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/cloudforms-vm.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/cloudforms-vm.js should pass jshint', function() { 
    ok(true, 'controllers/cloudforms-vm.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/cloudforms.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/cloudforms.js should pass jshint', function() { 
    ok(true, 'controllers/cloudforms.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/configure-environment.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/configure-environment.js should pass jshint', function() { 
    ok(false, 'controllers/configure-environment.js should pass jshint.\ncontrollers/configure-environment.js: line 25, col 66, Missing semicolon.\ncontrollers/configure-environment.js: line 49, col 21, \'library\' is already defined.\ncontrollers/configure-environment.js: line 65, col 14, \'Bootstrap\' is not defined.\ncontrollers/configure-environment.js: line 43, col 21, \'response\' is defined but never used.\ncontrollers/configure-environment.js: line 59, col 23, \'response\' is defined but never used.\n\n5 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/configure-organization.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/configure-organization.js should pass jshint', function() { 
    ok(true, 'controllers/configure-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/deployment-new.js should pass jshint', function() { 
    ok(true, 'controllers/deployment-new.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new/satellite.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment-new');
  test('controllers/deployment-new/satellite.js should pass jshint', function() { 
    ok(true, 'controllers/deployment-new/satellite.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new/satellite/configure-environment.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment-new/satellite');
  test('controllers/deployment-new/satellite/configure-environment.js should pass jshint', function() { 
    ok(false, 'controllers/deployment-new/satellite/configure-environment.js should pass jshint.\ncontrollers/deployment-new/satellite/configure-environment.js: line 25, col 66, Missing semicolon.\ncontrollers/deployment-new/satellite/configure-environment.js: line 49, col 21, \'library\' is already defined.\ncontrollers/deployment-new/satellite/configure-environment.js: line 65, col 14, \'Bootstrap\' is not defined.\ncontrollers/deployment-new/satellite/configure-environment.js: line 43, col 21, \'response\' is defined but never used.\ncontrollers/deployment-new/satellite/configure-environment.js: line 59, col 23, \'response\' is defined but never used.\n\n5 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new/satellite/configure-organization.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment-new/satellite');
  test('controllers/deployment-new/satellite/configure-organization.js should pass jshint', function() { 
    ok(true, 'controllers/deployment-new/satellite/configure-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new/satellite/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment-new/satellite');
  test('controllers/deployment-new/satellite/index.js should pass jshint', function() { 
    ok(true, 'controllers/deployment-new/satellite/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment-new/start.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment-new');
  test('controllers/deployment-new/start.js should pass jshint', function() { 
    ok(true, 'controllers/deployment-new/start.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/deployment.js should pass jshint', function() { 
    ok(true, 'controllers/deployment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployment/start.jshint', function () {

  'use strict';

  module('JSHint - controllers/deployment');
  test('controllers/deployment/start.js should pass jshint', function() { 
    ok(true, 'controllers/deployment/start.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/deployments.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/deployments.js should pass jshint', function() { 
    ok(false, 'controllers/deployments.js should pass jshint.\ncontrollers/deployments.js: line 18, col 42, Missing semicolon.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/controllers/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/discovered-host.js should pass jshint', function() { 
    ok(false, 'controllers/discovered-host.js should pass jshint.\ncontrollers/discovered-host.js: line 17, col 78, Missing semicolon.\ncontrollers/discovered-host.js: line 18, col 50, Missing semicolon.\ncontrollers/discovered-host.js: line 20, col 19, Missing semicolon.\n\n3 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/engine.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/engine.js should pass jshint', function() { 
    ok(true, 'controllers/engine.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/engine/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - controllers/engine');
  test('controllers/engine/discovered-host.js should pass jshint', function() { 
    ok(false, 'controllers/engine/discovered-host.js should pass jshint.\ncontrollers/engine/discovered-host.js: line 11, col 30, Expected \'!==\' and instead saw \'!=\'.\ncontrollers/engine/discovered-host.js: line 10, col 85, \'array\' is defined but never used.\ncontrollers/engine/discovered-host.js: line 10, col 78, \'index\' is defined but never used.\n\n3 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/host.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/host.js should pass jshint', function() { 
    ok(true, 'controllers/host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/hostgroup.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/hostgroup.js should pass jshint', function() { 
    ok(true, 'controllers/hostgroup.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/hypervisor.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/hypervisor.js should pass jshint', function() { 
    ok(true, 'controllers/hypervisor.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/hypervisor/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - controllers/hypervisor');
  test('controllers/hypervisor/discovered-host.js should pass jshint', function() { 
    ok(false, 'controllers/hypervisor/discovered-host.js should pass jshint.\ncontrollers/hypervisor/discovered-host.js: line 12, col 30, Expected \'!==\' and instead saw \'!=\'.\ncontrollers/hypervisor/discovered-host.js: line 15, col 18, \'Em\' is not defined.\ncontrollers/hypervisor/discovered-host.js: line 21, col 21, \'Em\' is not defined.\ncontrollers/hypervisor/discovered-host.js: line 11, col 85, \'array\' is defined but never used.\ncontrollers/hypervisor/discovered-host.js: line 11, col 78, \'index\' is defined but never used.\ncontrollers/hypervisor/discovered-host.js: line 37, col 24, \'key\' is defined but never used.\n\n6 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/lifecycle-environment.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/lifecycle-environment.js should pass jshint', function() { 
    ok(true, 'controllers/lifecycle-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/lifecycle-environments.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/lifecycle-environments.js should pass jshint', function() { 
    ok(true, 'controllers/lifecycle-environments.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/login.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/login.js should pass jshint', function() { 
    ok(false, 'controllers/login.js should pass jshint.\ncontrollers/login.js: line 23, col 36, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 23, col 80, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 23, col 89, Missing semicolon.\ncontrollers/login.js: line 30, col 34, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 58, col 39, Missing semicolon.\ncontrollers/login.js: line 72, col 36, Missing semicolon.\ncontrollers/login.js: line 77, col 38, Expected \'===\' and instead saw \'==\'.\ncontrollers/login.js: line 92, col 29, Missing semicolon.\ncontrollers/login.js: line 131, col 24, Unreachable \'return\' after \'return\'.\ncontrollers/login.js: line 57, col 26, \'response\' is defined but never used.\ncontrollers/login.js: line 91, col 22, \'response\' is defined but never used.\ncontrollers/login.js: line 146, col 21, \'authCode\' is defined but never used.\n\n12 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/logout-model.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/logout-model.js should pass jshint', function() { 
    ok(true, 'controllers/logout-model.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/networking.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/networking.js should pass jshint', function() { 
    ok(true, 'controllers/networking.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/new-environment.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/new-environment.js should pass jshint', function() { 
    ok(true, 'controllers/new-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/new-organization.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/new-organization.js should pass jshint', function() { 
    ok(true, 'controllers/new-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/openstack.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/openstack.js should pass jshint', function() { 
    ok(true, 'controllers/openstack.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/organization.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/organization.js should pass jshint', function() { 
    ok(true, 'controllers/organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/organizations.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/organizations.js should pass jshint', function() { 
    ok(true, 'controllers/organizations.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/osp-configuration.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/osp-configuration.js should pass jshint', function() { 
    ok(true, 'controllers/osp-configuration.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/osp-network.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/osp-network.js should pass jshint', function() { 
    ok(false, 'controllers/osp-network.js should pass jshint.\ncontrollers/osp-network.js: line 6, col 51, Expected \'===\' and instead saw \'==\'.\ncontrollers/osp-network.js: line 26, col 9, Missing semicolon.\ncontrollers/osp-network.js: line 5, col 66, \'enumerable\' is defined but never used.\ncontrollers/osp-network.js: line 5, col 59, \'index\' is defined but never used.\ncontrollers/osp-network.js: line 11, col 66, \'enumerable\' is defined but never used.\ncontrollers/osp-network.js: line 11, col 59, \'index\' is defined but never used.\ncontrollers/osp-network.js: line 28, col 47, \'ops\' is defined but never used.\n\n7 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/osp-settings.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/osp-settings.js should pass jshint', function() { 
    ok(true, 'controllers/osp-settings.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/products.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/products.js should pass jshint', function() { 
    ok(true, 'controllers/products.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/review.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/review.js should pass jshint', function() { 
    ok(true, 'controllers/review.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/review/installation.jshint', function () {

  'use strict';

  module('JSHint - controllers/review');
  test('controllers/review/installation.js should pass jshint', function() { 
    ok(true, 'controllers/review/installation.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/review/progress.jshint', function () {

  'use strict';

  module('JSHint - controllers/review');
  test('controllers/review/progress.js should pass jshint', function() { 
    ok(true, 'controllers/review/progress.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/rhci.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/rhci.js should pass jshint', function() { 
    ok(true, 'controllers/rhci.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/rhev-options.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/rhev-options.js should pass jshint', function() { 
    ok(true, 'controllers/rhev-options.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/rhev-setup.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/rhev-setup.js should pass jshint', function() { 
    ok(false, 'controllers/rhev-setup.js should pass jshint.\ncontrollers/rhev-setup.js: line 10, col 71, Missing semicolon.\ncontrollers/rhev-setup.js: line 14, col 79, Missing semicolon.\ncontrollers/rhev-setup.js: line 18, col 50, Missing semicolon.\ncontrollers/rhev-setup.js: line 22, col 32, \'value\' is defined but never used.\n\n4 errors'); 
  });

});
define('fusor-ember-cli/tests/controllers/rhev.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/rhev.js should pass jshint', function() { 
    ok(true, 'controllers/rhev.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/satellite.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/satellite.js should pass jshint', function() { 
    ok(true, 'controllers/satellite.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/satellite/index.jshint', function () {

  'use strict';

  module('JSHint - controllers/satellite');
  test('controllers/satellite/index.js should pass jshint', function() { 
    ok(true, 'controllers/satellite/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/satellite/subscription.jshint', function () {

  'use strict';

  module('JSHint - controllers/satellite');
  test('controllers/satellite/subscription.js should pass jshint', function() { 
    ok(true, 'controllers/satellite/subscription.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/side-menu.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/side-menu.js should pass jshint', function() { 
    ok(true, 'controllers/side-menu.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/storage.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/storage.js should pass jshint', function() { 
    ok(true, 'controllers/storage.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/subscription.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/subscription.js should pass jshint', function() { 
    ok(true, 'controllers/subscription.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/subscriptions.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/subscriptions.js should pass jshint', function() { 
    ok(true, 'controllers/subscriptions.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/subscriptions/credentials.jshint', function () {

  'use strict';

  module('JSHint - controllers/subscriptions');
  test('controllers/subscriptions/credentials.js should pass jshint', function() { 
    ok(true, 'controllers/subscriptions/credentials.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/subscriptions/select-subscriptions.jshint', function () {

  'use strict';

  module('JSHint - controllers/subscriptions');
  test('controllers/subscriptions/select-subscriptions.js should pass jshint', function() { 
    ok(true, 'controllers/subscriptions/select-subscriptions.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/controllers/where-install.jshint', function () {

  'use strict';

  module('JSHint - controllers');
  test('controllers/where-install.js should pass jshint', function() { 
    ok(true, 'controllers/where-install.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/helpers/resolver.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/helpers');
  test('fusor-ember-cli/tests/helpers/resolver.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/helpers/resolver.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/helpers/start-app.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/helpers');
  test('fusor-ember-cli/tests/helpers/start-app.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/helpers/start-app.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/test-helper.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests');
  test('fusor-ember-cli/tests/test-helper.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/test-helper.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/application-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/adapters');
  test('fusor-ember-cli/tests/unit/adapters/application-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/adapters/application-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/hostgroup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/adapters');
  test('fusor-ember-cli/tests/unit/adapters/hostgroup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/adapters/hostgroup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/lifecycle-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/adapters');
  test('fusor-ember-cli/tests/unit/adapters/lifecycle-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/adapters/lifecycle-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/subscriptions-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/adapters');
  test('fusor-ember-cli/tests/unit/adapters/subscriptions-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/adapters/subscriptions-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/adapters/traffic-type-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/adapters');
  test('fusor-ember-cli/tests/unit/adapters/traffic-type-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/adapters/traffic-type-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/accordion-item-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/accordion-item-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/accordion-item-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/base-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/base-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/base-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/env-path-list-item-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/env-path-list-item-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/env-path-list-item-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/modal-confirm-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/modal-confirm-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/modal-confirm-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/radio-button-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/radio-button-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/radio-button-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rchi-item-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/rchi-item-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/rchi-item-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rhci-hover-text-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/rhci-hover-text-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/rhci-hover-text-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rhci-start-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/rhci-start-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/rhci-start-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/rhci-wizard-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/rhci-wizard-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/rhci-wizard-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/select-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/select-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/select-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/select-simple-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/select-simple-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/select-simple-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/step-number-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/step-number-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/step-number-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/sub-menu-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/sub-menu-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/sub-menu-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/subnet-drop-area-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/subnet-drop-area-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/subnet-drop-area-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/text-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/text-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/text-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/textarea-f-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/textarea-f-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/textarea-f-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/tr-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/tr-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/tr-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/traffic-type-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/traffic-type-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/traffic-type-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/upstream-downstream-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/upstream-downstream-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/upstream-downstream-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/vertical-tab-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/vertical-tab-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/vertical-tab-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/wizard-item-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/wizard-item-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/wizard-item-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/components/wrap-in-container-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/components');
  test('fusor-ember-cli/tests/unit/components/wrap-in-container-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/components/wrap-in-container-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/application-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/application-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/application-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cancel-modal-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/cancel-modal-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/cancel-modal-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cloudforms-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/cloudforms-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/cloudforms-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/configure-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/configure-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/configure-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/configure-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/configure');
  test('fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/configure/new-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new/satellite-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment-new');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new/satellite-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-new/start-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment-new');
  test('fusor-ember-cli/tests/unit/controllers/deployment-new/start-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-new/start-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/deployment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployment/start-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/deployment');
  test('fusor-ember-cli/tests/unit/controllers/deployment/start-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployment/start-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/deployments-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/deployments-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/deployments-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/engine-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/engine-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/engine-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/engine');
  test('fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hostgroup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/hostgroup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/hostgroup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hypervisor-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/hypervisor-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/hypervisor-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/hypervisor');
  test('fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/login-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/login-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/login-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/logout-model-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/logout-model-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/logout-model-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/networking-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/networking-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/networking-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/new-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/new-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/new-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/new-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/new-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/new-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/openstack-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/openstack-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/openstack-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/organizations-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/organizations-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/organizations-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-configuration-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/osp-configuration-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-configuration-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-network-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/osp-network-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-network-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/osp-settings-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/osp-settings-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/osp-settings-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/product-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/product-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/product-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/products-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/products-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/products-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/review-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/review-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/review-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/review/installation-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/review');
  test('fusor-ember-cli/tests/unit/controllers/review/installation-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/review/installation-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/review/progress-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/review');
  test('fusor-ember-cli/tests/unit/controllers/review/progress-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/review/progress-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhci-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/rhci-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/rhci-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-options-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/rhev-options-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-options-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-setup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/rhev-setup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-setup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/rhev-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/rhev/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/rhev');
  test('fusor-ember-cli/tests/unit/controllers/rhev/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/rhev/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/satellite-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/satellite-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/satellite-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/satellite/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/satellite');
  test('fusor-ember-cli/tests/unit/controllers/satellite/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/satellite/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/side-menu-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/side-menu-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/side-menu-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/storage-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/storage-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/storage-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscription-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/subscription-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/subscription-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscriptions-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/subscriptions-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/subscriptions-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscriptions/credentials-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/subscriptions');
  test('fusor-ember-cli/tests/unit/controllers/subscriptions/credentials-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/subscriptions/credentials-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/subscriptions/select-subscriptions-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/subscriptions');
  test('fusor-ember-cli/tests/unit/controllers/subscriptions/select-subscriptions-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/subscriptions/select-subscriptions-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/user-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/user-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/user-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/user/edit-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/user');
  test('fusor-ember-cli/tests/unit/controllers/user/edit-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/user/edit-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/users-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/users-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/users-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/users/new-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers/users');
  test('fusor-ember-cli/tests/unit/controllers/users/new-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/users/new-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/controllers/where-install-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/controllers');
  test('fusor-ember-cli/tests/unit/controllers/where-install-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/controllers/where-install-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/helpers/raw-text-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/helpers');
  test('fusor-ember-cli/tests/unit/helpers/raw-text-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/helpers/raw-text-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/config-environment-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/config-environment-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/config-environment-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/configure-organization-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/configure-organization-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/configure-organization-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/deployment-controller-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/deployment-controller-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/deployment-controller-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/deployment-new-satellite-route-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/deployment-new-satellite-route-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/deployment-new-satellite-route-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/deployment-route-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/deployment-route-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/deployment-route-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/disable-tab-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/disable-tab-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/disable-tab-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/satellite-controller-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/satellite-controller-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/satellite-controller-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/mixins/start-controller-mixin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/mixins');
  test('fusor-ember-cli/tests/unit/mixins/start-controller-mixin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/mixins/start-controller-mixin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/deployment-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/deployment-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/deployment-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/deployment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/deployment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/deployment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/hostgroup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/hostgroup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/hostgroup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/lifecycle-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/lifecycle-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/lifecycle-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/location-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/location-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/location-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/product-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/product-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/product-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/rhev-setup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/rhev-setup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/rhev-setup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/subnet-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/subnet-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/subnet-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/subscription-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/subscription-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/subscription-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/traffic-type-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/traffic-type-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/traffic-type-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/models/user-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/models');
  test('fusor-ember-cli/tests/unit/models/user-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/models/user-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/application-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/application-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/application-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms-vm-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/cloudforms/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/cloudforms');
  test('fusor-ember-cli/tests/unit/routes/cloudforms/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/cloudforms/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/configure-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/configure-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/configure-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/configure-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/configure/new-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/configure');
  test('fusor-ember-cli/tests/unit/routes/configure/new-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/configure/new-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/content-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/content-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/content-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/deployment-new-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/satellite-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/satellite-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/satellite-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/satellite/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new/satellite');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/satellite/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-new/start-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment-new');
  test('fusor-ember-cli/tests/unit/routes/deployment-new/start-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-new/start-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/deployment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
  test('fusor-ember-cli/tests/unit/routes/deployment/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/new-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
  test('fusor-ember-cli/tests/unit/routes/deployment/new-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/new-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/review-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
  test('fusor-ember-cli/tests/unit/routes/deployment/review-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/review-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment/satellite/configure');
  test('fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployment/start-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/deployment');
  test('fusor-ember-cli/tests/unit/routes/deployment/start-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployment/start-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/deployments-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/deployments-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/deployments-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/discovered-hosts-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/discovered-hosts-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/discovered-hosts-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/engine-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/engine-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
  test('fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/engine/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/existing-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
  test('fusor-ember-cli/tests/unit/routes/engine/existing-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/engine/existing-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
  test('fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/engine/hypervisor-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/engine/new-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/engine');
  test('fusor-ember-cli/tests/unit/routes/engine/new-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/engine/new-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/hostgroup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/hostgroup');
  test('fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroup/edit-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hostgroups-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/hostgroups-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hostgroups-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/hypervisor-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
  test('fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
  test('fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/hypervisor');
  test('fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/loggedin-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/loggedin-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/loggedin-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/login-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/login-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/login-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/networking-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/networking-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/networking-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/new-environment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/new-environment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/new-environment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/new-organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/new-organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/new-organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/openstack/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/openstack');
  test('fusor-ember-cli/tests/unit/routes/openstack/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/openstack/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-configuration-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/osp-configuration-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/osp-configuration-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-network-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/osp-network-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/osp-network-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-overview-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/osp-overview-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/osp-overview-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/osp-settings-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/osp-settings-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/osp-settings-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/review');
  test('fusor-ember-cli/tests/unit/routes/review/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/review/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/installation-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/review');
  test('fusor-ember-cli/tests/unit/routes/review/installation-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/review/installation-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/review/progress-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/review');
  test('fusor-ember-cli/tests/unit/routes/review/progress-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/review/progress-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhci-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/rhci-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhci-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-options-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/rhev-options-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-options-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-setup-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/rhev-setup-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-setup-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/rhev-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhev-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev/engine-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/rhev');
  test('fusor-ember-cli/tests/unit/routes/rhev/engine-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhev/engine-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/rhev/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/rhev');
  test('fusor-ember-cli/tests/unit/routes/rhev/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/rhev/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/satellite-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/satellite-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/configure-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
  test('fusor-ember-cli/tests/unit/routes/satellite/configure-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/configure-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
  test('fusor-ember-cli/tests/unit/routes/satellite/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/review-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
  test('fusor-ember-cli/tests/unit/routes/satellite/review-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/review-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/satellite');
  test('fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/setpassword-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/setpassword-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/setpassword-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/single-deployment-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/single-deployment-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/single-deployment-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/storage-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/storage-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/storage-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/subscriptions/credentials-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/subscriptions');
  test('fusor-ember-cli/tests/unit/routes/subscriptions/credentials-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/subscriptions/credentials-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/subscriptions/index-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/subscriptions');
  test('fusor-ember-cli/tests/unit/routes/subscriptions/index-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/subscriptions/index-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/subscriptions/select-subscriptions-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/subscriptions');
  test('fusor-ember-cli/tests/unit/routes/subscriptions/select-subscriptions-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/subscriptions/select-subscriptions-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/user-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/user-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/user-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/user/edit-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/user');
  test('fusor-ember-cli/tests/unit/routes/user/edit-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/user/edit-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/users-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/users-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/users-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/users/new-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes/users');
  test('fusor-ember-cli/tests/unit/routes/users/new-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/users/new-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/routes/where-install-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/routes');
  test('fusor-ember-cli/tests/unit/routes/where-install-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/routes/where-install-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/application-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/views');
  test('fusor-ember-cli/tests/unit/views/application-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/views/application-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/configure-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/views');
  test('fusor-ember-cli/tests/unit/views/configure-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/views/configure-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/organization-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/views');
  test('fusor-ember-cli/tests/unit/views/organization-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/views/organization-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/fusor-ember-cli/tests/unit/views/rhci-test.jshint', function () {

  'use strict';

  module('JSHint - fusor-ember-cli/tests/unit/views');
  test('fusor-ember-cli/tests/unit/views/rhci-test.js should pass jshint', function() { 
    ok(true, 'fusor-ember-cli/tests/unit/views/rhci-test.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/helpers/raw-text.jshint', function () {

  'use strict';

  module('JSHint - helpers');
  test('helpers/raw-text.js should pass jshint', function() { 
    ok(false, 'helpers/raw-text.js should pass jshint.\nhelpers/raw-text.js: line 4, col 14, \'Handlebars\' is not defined.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/helpers/resolver', ['exports', 'ember/resolver', '../../config/environment'], function (exports, Resolver, config) {

  'use strict';

  var resolver = Resolver['default'].create();

  resolver.namespace = {
    modulePrefix: config['default'].modulePrefix,
    podModulePrefix: config['default'].podModulePrefix
  };

  exports['default'] = resolver;

});
define('fusor-ember-cli/tests/helpers/start-app', ['exports', 'ember', '../../app', '../../router', '../../config/environment'], function (exports, Ember, Application, Router, config) {

  'use strict';

  function startApp(attrs) {
    var application;

    var attributes = Ember['default'].merge({}, config['default'].APP);
    attributes = Ember['default'].merge(attributes, attrs); // use defaults, but you can override;

    Ember['default'].run(function () {
      application = Application['default'].create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
    });

    return application;
  }
  exports['default'] = startApp;

});
define('fusor-ember-cli/tests/mixins/configure-environment-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/configure-environment-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/configure-environment-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/configure-organization-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/configure-organization-mixin.js should pass jshint', function() { 
    ok(false, 'mixins/configure-organization-mixin.js should pass jshint.\nmixins/configure-organization-mixin.js: line 50, col 14, \'Bootstrap\' is not defined.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/mixins/deployment-controller-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/deployment-controller-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/deployment-controller-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/deployment-new-controller-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/deployment-new-controller-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/deployment-new-controller-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/deployment-new-satellite-route-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/deployment-new-satellite-route-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/deployment-new-satellite-route-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/deployment-route-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/deployment-route-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/deployment-route-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/disable-tab-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/disable-tab-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/disable-tab-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/meta.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/meta.js should pass jshint', function() { 
    ok(true, 'mixins/meta.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/satellite-controller-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/satellite-controller-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/satellite-controller-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/mixins/start-controller-mixin.jshint', function () {

  'use strict';

  module('JSHint - mixins');
  test('mixins/start-controller-mixin.js should pass jshint', function() { 
    ok(true, 'mixins/start-controller-mixin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/deployable.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/deployable.js should pass jshint', function() { 
    ok(true, 'models/deployable.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/deployment-host.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/deployment-host.js should pass jshint', function() { 
    ok(true, 'models/deployment-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/deployment.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/deployment.js should pass jshint', function() { 
    ok(true, 'models/deployment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/discovered-host.js should pass jshint', function() { 
    ok(true, 'models/discovered-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/environment.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/environment.js should pass jshint', function() { 
    ok(true, 'models/environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/host.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/host.js should pass jshint', function() { 
    ok(true, 'models/host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/hostgroup.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/hostgroup.js should pass jshint', function() { 
    ok(true, 'models/hostgroup.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/lifecycle-environment.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/lifecycle-environment.js should pass jshint', function() { 
    ok(true, 'models/lifecycle-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/location.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/location.js should pass jshint', function() { 
    ok(true, 'models/location.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/organization.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/organization.js should pass jshint', function() { 
    ok(true, 'models/organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/product.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/product.js should pass jshint', function() { 
    ok(true, 'models/product.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/subnet.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/subnet.js should pass jshint', function() { 
    ok(true, 'models/subnet.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/subscription.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/subscription.js should pass jshint', function() { 
    ok(true, 'models/subscription.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/traffic-type.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/traffic-type.js should pass jshint', function() { 
    ok(true, 'models/traffic-type.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/models/user.jshint', function () {

  'use strict';

  module('JSHint - models');
  test('models/user.js should pass jshint', function() { 
    ok(true, 'models/user.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/router.jshint', function () {

  'use strict';

  module('JSHint - .');
  test('router.js should pass jshint', function() { 
    ok(true, 'router.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/application.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/application.js should pass jshint', function() { 
    ok(false, 'routes/application.js should pass jshint.\nroutes/application.js: line 14, col 6, Unnecessary semicolon.\nroutes/application.js: line 26, col 40, Expected \'===\' and instead saw \'==\'.\nroutes/application.js: line 28, col 47, Expected \'===\' and instead saw \'==\'.\nroutes/application.js: line 62, col 7, \'Bootstrap\' is not defined.\nroutes/application.js: line 63, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 68, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 73, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 78, col 14, \'Bootstrap\' is not defined.\nroutes/application.js: line 7, col 25, \'transition\' is defined but never used.\n\n9 errors'); 
  });

});
define('fusor-ember-cli/tests/routes/cloudforms-storage-domain.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/cloudforms-storage-domain.js should pass jshint', function() { 
    ok(true, 'routes/cloudforms-storage-domain.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/cloudforms-vm.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/cloudforms-vm.js should pass jshint', function() { 
    ok(true, 'routes/cloudforms-vm.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/cloudforms/index.jshint', function () {

  'use strict';

  module('JSHint - routes/cloudforms');
  test('routes/cloudforms/index.js should pass jshint', function() { 
    ok(true, 'routes/cloudforms/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/configure-environment.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/configure-environment.js should pass jshint', function() { 
    ok(true, 'routes/configure-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/configure-organization.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/configure-organization.js should pass jshint', function() { 
    ok(true, 'routes/configure-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/deployment-new.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/index.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new');
  test('routes/deployment-new/index.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/satellite.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new');
  test('routes/deployment-new/satellite.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/satellite.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/satellite/configure-environment.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new/satellite');
  test('routes/deployment-new/satellite/configure-environment.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/satellite/configure-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/satellite/configure-organization.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new/satellite');
  test('routes/deployment-new/satellite/configure-organization.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/satellite/configure-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/satellite/index.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new/satellite');
  test('routes/deployment-new/satellite/index.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/satellite/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment-new/start.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment-new');
  test('routes/deployment-new/start.js should pass jshint', function() { 
    ok(true, 'routes/deployment-new/start.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/deployment.js should pass jshint', function() { 
    ok(true, 'routes/deployment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment/index.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment');
  test('routes/deployment/index.js should pass jshint', function() { 
    ok(true, 'routes/deployment/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment/review.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment');
  test('routes/deployment/review.js should pass jshint', function() { 
    ok(true, 'routes/deployment/review.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployment/start.jshint', function () {

  'use strict';

  module('JSHint - routes/deployment');
  test('routes/deployment/start.js should pass jshint', function() { 
    ok(true, 'routes/deployment/start.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/deployments.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/deployments.js should pass jshint', function() { 
    ok(true, 'routes/deployments.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/discovered-host.js should pass jshint', function() { 
    ok(true, 'routes/discovered-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/discovered-hosts.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/discovered-hosts.js should pass jshint', function() { 
    ok(true, 'routes/discovered-hosts.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/engine.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/engine.js should pass jshint', function() { 
    ok(true, 'routes/engine.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/engine/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - routes/engine');
  test('routes/engine/discovered-host.js should pass jshint', function() { 
    ok(true, 'routes/engine/discovered-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/engine/existing-host.jshint', function () {

  'use strict';

  module('JSHint - routes/engine');
  test('routes/engine/existing-host.js should pass jshint', function() { 
    ok(true, 'routes/engine/existing-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/engine/hypervisor.jshint', function () {

  'use strict';

  module('JSHint - routes/engine');
  test('routes/engine/hypervisor.js should pass jshint', function() { 
    ok(true, 'routes/engine/hypervisor.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/engine/new-host.jshint', function () {

  'use strict';

  module('JSHint - routes/engine');
  test('routes/engine/new-host.js should pass jshint', function() { 
    ok(true, 'routes/engine/new-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hostgroup.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/hostgroup.js should pass jshint', function() { 
    ok(true, 'routes/hostgroup.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hostgroup/edit.jshint', function () {

  'use strict';

  module('JSHint - routes/hostgroup');
  test('routes/hostgroup/edit.js should pass jshint', function() { 
    ok(true, 'routes/hostgroup/edit.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hostgroups.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/hostgroups.js should pass jshint', function() { 
    ok(true, 'routes/hostgroups.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hypervisor.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/hypervisor.js should pass jshint', function() { 
    ok(true, 'routes/hypervisor.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hypervisor/discovered-host.jshint', function () {

  'use strict';

  module('JSHint - routes/hypervisor');
  test('routes/hypervisor/discovered-host.js should pass jshint', function() { 
    ok(false, 'routes/hypervisor/discovered-host.js should pass jshint.\nroutes/hypervisor/discovered-host.js: line 14, col 44, Missing semicolon.\nroutes/hypervisor/discovered-host.js: line 14, col 9, \'model\' is defined but never used.\nroutes/hypervisor/discovered-host.js: line 20, col 11, \'self\' is defined but never used.\nroutes/hypervisor/discovered-host.js: line 21, col 11, \'dep\' is defined but never used.\n\n4 errors'); 
  });

});
define('fusor-ember-cli/tests/routes/hypervisor/existing-host.jshint', function () {

  'use strict';

  module('JSHint - routes/hypervisor');
  test('routes/hypervisor/existing-host.js should pass jshint', function() { 
    ok(true, 'routes/hypervisor/existing-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/hypervisor/new-host.jshint', function () {

  'use strict';

  module('JSHint - routes/hypervisor');
  test('routes/hypervisor/new-host.js should pass jshint', function() { 
    ok(true, 'routes/hypervisor/new-host.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/index.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/index.js should pass jshint', function() { 
    ok(true, 'routes/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/loggedin.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/loggedin.js should pass jshint', function() { 
    ok(true, 'routes/loggedin.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/login.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/login.js should pass jshint', function() { 
    ok(false, 'routes/login.js should pass jshint.\nroutes/login.js: line 10, col 6, Unnecessary semicolon.\nroutes/login.js: line 7, col 25, \'transition\' is defined but never used.\n\n2 errors'); 
  });

});
define('fusor-ember-cli/tests/routes/networking.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/networking.js should pass jshint', function() { 
    ok(true, 'routes/networking.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/new-environment.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/new-environment.js should pass jshint', function() { 
    ok(true, 'routes/new-environment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/new-organization.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/new-organization.js should pass jshint', function() { 
    ok(true, 'routes/new-organization.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/openstack/index.jshint', function () {

  'use strict';

  module('JSHint - routes/openstack');
  test('routes/openstack/index.js should pass jshint', function() { 
    ok(true, 'routes/openstack/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/osp-configuration.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/osp-configuration.js should pass jshint', function() { 
    ok(true, 'routes/osp-configuration.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/osp-network.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/osp-network.js should pass jshint', function() { 
    ok(true, 'routes/osp-network.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/osp-overview.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/osp-overview.js should pass jshint', function() { 
    ok(true, 'routes/osp-overview.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/osp-settings.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/osp-settings.js should pass jshint', function() { 
    ok(true, 'routes/osp-settings.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/products.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/products.js should pass jshint', function() { 
    ok(true, 'routes/products.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/review/index.jshint', function () {

  'use strict';

  module('JSHint - routes/review');
  test('routes/review/index.js should pass jshint', function() { 
    ok(true, 'routes/review/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/review/installation.jshint', function () {

  'use strict';

  module('JSHint - routes/review');
  test('routes/review/installation.js should pass jshint', function() { 
    ok(true, 'routes/review/installation.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/review/progress.jshint', function () {

  'use strict';

  module('JSHint - routes/review');
  test('routes/review/progress.js should pass jshint', function() { 
    ok(true, 'routes/review/progress.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/rhci.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/rhci.js should pass jshint', function() { 
    ok(true, 'routes/rhci.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/rhev-options.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/rhev-options.js should pass jshint', function() { 
    ok(true, 'routes/rhev-options.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/rhev-setup.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/rhev-setup.js should pass jshint', function() { 
    ok(true, 'routes/rhev-setup.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/rhev.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/rhev.js should pass jshint', function() { 
    ok(true, 'routes/rhev.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/rhev/index.jshint', function () {

  'use strict';

  module('JSHint - routes/rhev');
  test('routes/rhev/index.js should pass jshint', function() { 
    ok(true, 'routes/rhev/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/satellite.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/satellite.js should pass jshint', function() { 
    ok(true, 'routes/satellite.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/satellite/index.jshint', function () {

  'use strict';

  module('JSHint - routes/satellite');
  test('routes/satellite/index.js should pass jshint', function() { 
    ok(true, 'routes/satellite/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/setpassword.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/setpassword.js should pass jshint', function() { 
    ok(true, 'routes/setpassword.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/single-deployment.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/single-deployment.js should pass jshint', function() { 
    ok(true, 'routes/single-deployment.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/storage.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/storage.js should pass jshint', function() { 
    ok(true, 'routes/storage.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/subscriptions.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/subscriptions.js should pass jshint', function() { 
    ok(true, 'routes/subscriptions.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/subscriptions/credentials.jshint', function () {

  'use strict';

  module('JSHint - routes/subscriptions');
  test('routes/subscriptions/credentials.js should pass jshint', function() { 
    ok(true, 'routes/subscriptions/credentials.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/subscriptions/index.jshint', function () {

  'use strict';

  module('JSHint - routes/subscriptions');
  test('routes/subscriptions/index.js should pass jshint', function() { 
    ok(true, 'routes/subscriptions/index.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/subscriptions/select-subscriptions.jshint', function () {

  'use strict';

  module('JSHint - routes/subscriptions');
  test('routes/subscriptions/select-subscriptions.js should pass jshint', function() { 
    ok(true, 'routes/subscriptions/select-subscriptions.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/routes/where-install.jshint', function () {

  'use strict';

  module('JSHint - routes');
  test('routes/where-install.js should pass jshint', function() { 
    ok(true, 'routes/where-install.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/serializers/puppetclass.jshint', function () {

  'use strict';

  module('JSHint - serializers');
  test('serializers/puppetclass.js should pass jshint', function() { 
    ok(false, 'serializers/puppetclass.js should pass jshint.\nserializers/puppetclass.js: line 8, col 35, \'$\' is not defined.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/test-helper', ['./helpers/resolver', 'ember-qunit'], function (resolver, ember_qunit) {

	'use strict';

	ember_qunit.setResolver(resolver['default']);

	document.write("<div id=\"ember-testing-container\"><div id=\"ember-testing\"></div></div>");

	QUnit.config.urlConfig.push({ id: "nocontainer", label: "Hide container" });
	var containerVisibility = QUnit.urlParams.nocontainer ? "hidden" : "visible";
	document.getElementById("ember-testing-container").style.visibility = containerVisibility;

});
define('fusor-ember-cli/tests/torii-providers/foreman.jshint', function () {

  'use strict';

  module('JSHint - torii-providers');
  test('torii-providers/foreman.js should pass jshint', function() { 
    ok(false, 'torii-providers/foreman.js should pass jshint.\ntorii-providers/foreman.js: line 1, col 16, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 5, col 16, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 7, col 7, \'exampleAsyncLogin\' is not defined.\ntorii-providers/foreman.js: line 14, col 11, \'Ember\' is not defined.\ntorii-providers/foreman.js: line 5, col 53, \'reject\' is defined but never used.\n\n5 errors'); 
  });

});
define('fusor-ember-cli/tests/unit/adapters/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:application", "ApplicationAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('fusor-ember-cli/tests/unit/adapters/hostgroup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:hostgroup", "HostgroupAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('fusor-ember-cli/tests/unit/adapters/lifecycle-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:lifecycle-environment", "LifecycleEnvironmentAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('fusor-ember-cli/tests/unit/adapters/subscriptions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:subscriptions", "SubscriptionsAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('fusor-ember-cli/tests/unit/adapters/traffic-type-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("adapter:traffic-type", "TrafficTypeAdapter", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var adapter = this.subject();
    ok(adapter);
  });
  // Specify the other units that are required for this test.
  // needs: ['serializer:foo']

});
define('fusor-ember-cli/tests/unit/components/accordion-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("accordion-item", "AccordionItemComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/base-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("base-f", "BaseFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/env-path-list-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("env-path-list-item", "EnvPathListItemComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/modal-confirm-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("model-confirm", "ModelConfirmComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/radio-button-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("radio-button-f", "RadioButtonFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/rchi-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("rchi-item", "RchiItemComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/rhci-hover-text-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("rhci-hover-text", "RhciHoverTextComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/rhci-start-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("rhci-start", "RhciStartComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/rhci-wizard-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("rhci-wizard", "RhciWizardComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/select-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("select-f", "SelectFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/select-simple-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("select-simple-f", "SelectSimpleFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/step-number-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("step-number", "StepNumberComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/sub-menu-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("sub-menu", "SubMenuComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/subnet-drop-area-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("subnet-drop-area", "SubnetDropAreaComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/text-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("text-f", "TextFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/textarea-f-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("textarea-f", "TextareaFComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/tr-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("tr-organization", "TrOrganizationComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/traffic-type-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("traffic-type", "TrafficTypeComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/upstream-downstream-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("upstream-downstream", "UpstreamDownstreamComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/vertical-tab-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("vertical-tab", "VerticalTabComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/wizard-item-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("wizard-item", "WizardItemComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/components/wrap-in-container-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForComponent("wrap-in-container", "WrapInContainerComponent", {});

  ember_qunit.test("it renders", function () {
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
define('fusor-ember-cli/tests/unit/controllers/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:application", "ApplicationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/cancel-modal-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:settings-model", "SettingsModelController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/cloudforms-storage-domain-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:cloudforms-storage-domain", "CloudformsStorageDomainController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/cloudforms-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:cloudforms", "CloudformsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/cloudforms-vm-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:cloudforms-vm", "CloudformsVmController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/configure-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:configure-environment", "ConfigureEnvironmentController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/configure-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:configure-organization", "ConfigureOrganizationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/configure/new-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:configure/new-organization", "ConfigureNewOrganizationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new", "DeploymentNewController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new/satellite", "DeploymentNewSatelliteController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new/satellite/configure-environment", "DeploymentNewSatelliteConfigureEnvironmentController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/configure-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new/satellite/configure-organization", "DeploymentNewSatelliteConfigureOrganizationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new/satellite/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new/satellite/index", "DeploymentNewSatelliteIndexController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-new/start-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment-new/start", "DeploymentNewStartController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment", "DeploymentController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployment/start-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployment/start", "DeploymentStartController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/deployments-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:deployments", "DeploymentsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:discovered-host", "DiscoveredHostController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/engine-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:engine", "EngineController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/engine/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:engine/discovered-host", "EngineDiscoveredHostController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:host", "HostController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/hostgroup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:hostgroup", "HostgroupController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/hypervisor-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:hypervisor", "HypervisorController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/hypervisor/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:hypervisor/discovered-host", "HypervisorDiscoveredHostController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/lifecycle-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:environment", "EnvironmentController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/lifecycle-environments-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:environments", "EnvironmentsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/login-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:login", "LoginController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/logout-model-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:logout-model", "LogoutModelController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/networking-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:networking", "NetworkingController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/new-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:new-environment", "NewEnvironmentController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/new-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:new-organization", "NewOrganizationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/openstack-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:openstack", "OpenstackController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:organization", "OrganizationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/organizations-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:organizations", "OrganizationsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/osp-configuration-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:osp-configuration", "OspConfigurationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/osp-network-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:osp-network", "OspNetworkController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/osp-settings-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:osp-settings", "OspSettingsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/product-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:product", "ProductController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/products-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:products", "ProductsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/review-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:review", "ReviewController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/review/installation-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:review/installation", "ReviewInstallationController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/review/progress-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:review/progress", "ReviewProgressController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/rhci-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:rhci", "RhciController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/rhev-options-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:rhev-options", "RhevOptionsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/rhev-setup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:rhev-setup", "RhevSetupController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/rhev-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:rhev", "RhevController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/rhev/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:rhev/index", "RhevIndexController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/satellite-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:satellite", "SatelliteController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/satellite/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:satellite/index", "SatelliteIndexController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/side-menu-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:side-menu", "SideMenuController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/storage-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:storage", "StorageController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/subscription-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:subscription", "SubscriptionController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/subscriptions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:subscriptions", "SubscriptionsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/subscriptions/credentials-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:subscriptions/credentials", "SubscriptionsCredentialsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/subscriptions/select-subscriptions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:subscriptions/select-subscriptions", "SubscriptionsSelectSubscriptionsController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:user", "UserController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/user/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:user/edit", "UserEditController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/users-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:users", "UsersController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/users/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:users/new", "UsersNewController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/controllers/where-install-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("controller:where-install", "WhereInstallController", {});

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var controller = this.subject();
    ok(controller);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/helpers/raw-text-test', ['fusor-ember-cli/helpers/raw-text'], function (raw_text) {

  'use strict';

  module("RawTextHelper");

  // Replace this with your real tests.
  test("it works", function () {
    var result = raw_text.rawText(42);
    ok(result);
  });

});
define('fusor-ember-cli/tests/unit/mixins/config-environment-mixin-test', ['ember', 'fusor-ember-cli/mixins/config-environment-mixin'], function (Ember, ConfigEnvironmentMixinMixin) {

  'use strict';

  module("ConfigEnvironmentMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var ConfigEnvironmentMixinObject = Ember['default'].Object.extend(ConfigEnvironmentMixinMixin['default']);
    var subject = ConfigEnvironmentMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/configure-organization-mixin-test', ['ember', 'fusor-ember-cli/mixins/configure-organization-mixin'], function (Ember, ConfigureOrganizationMixinMixin) {

  'use strict';

  module("ConfigureOrganizationMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var ConfigureOrganizationMixinObject = Ember['default'].Object.extend(ConfigureOrganizationMixinMixin['default']);
    var subject = ConfigureOrganizationMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/deployment-controller-mixin-test', ['ember', 'fusor-ember-cli/mixins/deployment-controller-mixin'], function (Ember, DeploymentControllerMixinMixin) {

  'use strict';

  module("DeploymentControllerMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var DeploymentControllerMixinObject = Ember['default'].Object.extend(DeploymentControllerMixinMixin['default']);
    var subject = DeploymentControllerMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/deployment-new-satellite-route-mixin-test', ['ember', 'fusor-ember-cli/mixins/deployment-new-satellite-route-mixin'], function (Ember, DeploymentNewSatelliteRouteMixinMixin) {

  'use strict';

  module("DeploymentNewSatelliteRouteMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var DeploymentNewSatelliteRouteMixinObject = Ember['default'].Object.extend(DeploymentNewSatelliteRouteMixinMixin['default']);
    var subject = DeploymentNewSatelliteRouteMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/deployment-route-mixin-test', ['ember', 'fusor-ember-cli/mixins/deployment-route-mixin'], function (Ember, DeploymentRouteMixinMixin) {

  'use strict';

  module("DeploymentRouteMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var DeploymentRouteMixinObject = Ember['default'].Object.extend(DeploymentRouteMixinMixin['default']);
    var subject = DeploymentRouteMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/disable-tab-mixin-test', ['ember', 'fusor-ember-cli/mixins/disable-tab-mixin'], function (Ember, DisableTabMixinMixin) {

  'use strict';

  module("DisableTabMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var DisableTabMixinObject = Ember['default'].Object.extend(DisableTabMixinMixin['default']);
    var subject = DisableTabMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/satellite-controller-mixin-test', ['ember', 'fusor-ember-cli/mixins/satellite-controller-mixin'], function (Ember, SatelliteControllerMixinMixin) {

  'use strict';

  module("SatelliteControllerMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var SatelliteControllerMixinObject = Ember['default'].Object.extend(SatelliteControllerMixinMixin['default']);
    var subject = SatelliteControllerMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/mixins/start-controller-mixin-test', ['ember', 'fusor-ember-cli/mixins/start-controller-mixin'], function (Ember, StartControllerMixinMixin) {

  'use strict';

  module("StartControllerMixinMixin");

  // Replace this with your real tests.
  test("it works", function () {
    var StartControllerMixinObject = Ember['default'].Object.extend(StartControllerMixinMixin['default']);
    var subject = StartControllerMixinObject.create();
    ok(subject);
  });

});
define('fusor-ember-cli/tests/unit/models/deployment-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("deployment-host", "DeploymentHost", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/deployment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("deployment", "Deployment", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("discovered-host", "DiscoveredHost", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("environment", "Environment", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("host", "Host", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/hostgroup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("hostgroup", "Hostgroup", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/lifecycle-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("environment", "Environment", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/location-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("location", "Location", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("organization", "Organization", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/product-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("product", "Product", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/rhev-setup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("rhev-setup", "RhevSetup", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/subnet-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("subnet", "Subnet", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/subscription-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("subscription", "Subscription", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/traffic-type-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("traffic-type", "TrafficType", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/models/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleForModel("user", "User", {
    // Specify the other units that are required for this test.
    needs: []
  });

  ember_qunit.test("it exists", function () {
    var model = this.subject();
    // var store = this.store();
    ok(!!model);
  });

});
define('fusor-ember-cli/tests/unit/routes/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:application", "ApplicationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/cloudforms-storage-domain-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:cloudforms-storage-domain", "CloudformsStorageDomainRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/cloudforms-vm-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:cloudforms-vm", "CloudformsVmRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/cloudforms/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:cloudforms/index", "CloudformsIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/configure-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:configure-environment", "ConfigureEnvironmentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/configure-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:configure-organization", "ConfigureOrganizationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/configure/new-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:configure/new-organization", "ConfigureNewOrganizationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/content-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:content", "ContentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new", "DeploymentNewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/index", "DeploymentNewIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/satellite-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/satellite", "DeploymentNewSatelliteRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/satellite/configure-environment", "DeploymentNewSatelliteConfigureEnvironmentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/configure-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/satellite/configure-organization", "DeploymentNewSatelliteConfigureOrganizationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/satellite/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/satellite/index", "DeploymentNewSatelliteIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-new/start-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment-new/start", "DeploymentNewStartRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment", "DeploymentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment/index", "DeploymentIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment/new", "DeploymentNewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment/review-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment/review", "DeploymentReviewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment/satellite/configure/new-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment/satellite/configure/new-organization", "DeploymentSatelliteConfigureNewOrganizationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployment/start-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployment/start", "DeploymentStartRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/deployments-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:deployments", "DeploymentsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:discovered-host", "DiscoveredHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/discovered-hosts-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:discovered-hosts", "DiscoveredHostsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/engine-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:engine", "EngineRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/engine/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:engine/discovered-host", "EngineDiscoveredHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/engine/existing-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:engine/existing-host", "EngineExistingHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/engine/hypervisor-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:engine/hypervisor", "EngineHypervisorRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/engine/new-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:engine/new-host", "EngineNewHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hostgroup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hostgroup", "HostgroupRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hostgroup/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hostgroup/edit", "HostgroupEditRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hostgroups-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hostgroups", "HostgroupsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hypervisor-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hypervisor", "HypervisorRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hypervisor/discovered-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hypervisor/discovered-host", "HypervisorDiscoveredHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hypervisor/existing-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hypervisor/existing-host", "HypervisorExistingHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/hypervisor/new-host-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:hypervisor/new-host", "HypervisorNewHostRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:index", "IndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/loggedin-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:loggedin", "LoggedinRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/login-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:login", "LoginRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/networking-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:networking", "NetworkingRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/new-environment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:new-environment", "NewEnvironmentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/new-organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:new-organization", "NewOrganizationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/openstack/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:openstack/index", "OpenstackIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/osp-configuration-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:osp-configuration", "OspConfigurationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/osp-network-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:osp-network", "OspNetworkRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/osp-overview-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:osp-overview", "OspOverviewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/osp-settings-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:osp-settings", "OspSettingsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/review/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:review/index", "ReviewIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/review/installation-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:review/installation", "ReviewInstallationRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/review/progress-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:review/progress", "ReviewProgressRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhci-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhci", "RhciRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhev-options-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhev-options", "RhevOptionsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhev-setup-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhev-setup", "RhevSetupRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhev-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhev", "RhevRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhev/engine-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhev/engine", "RhevEngineRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/rhev/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:rhev/index", "RhevIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/satellite-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:satellite", "SatelliteRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/satellite/configure-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:satellite/configure", "SatelliteConfigureRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/satellite/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:satellite/index", "SatelliteIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/satellite/review-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:satellite/review", "SatelliteReviewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/satellite/subscriptions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:subscriptions", "SatelliteSubscriptionsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/setpassword-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:setpassword", "SetpasswordRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/single-deployment-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:single-deployment", "SingleDeploymentRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/storage-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:storage", "StorageRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/subscriptions/credentials-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:subscriptions/credentials", "SubscriptionsCredentialsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/subscriptions/index-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:subscriptions/index", "SubscriptionsIndexRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/subscriptions/select-subscriptions-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:subscriptions/select-subscriptions", "SubscriptionsSelectSubscriptionsRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/user-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:user", "UserRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/user/edit-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:user/edit", "UserEditRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/users-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:users", "UsersRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/users/new-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:users/new", "UsersNewRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/routes/where-install-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("route:where-install", "WhereInstallRoute", {});

  ember_qunit.test("it exists", function () {
    var route = this.subject();
    ok(route);
  });
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']

});
define('fusor-ember-cli/tests/unit/views/application-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("view:application", "ApplicationView");

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var view = this.subject();
    ok(view);
  });

});
define('fusor-ember-cli/tests/unit/views/configure-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("view:configure", "ConfigureView");

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var view = this.subject();
    ok(view);
  });

});
define('fusor-ember-cli/tests/unit/views/organization-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("view:organization", "OrganizationView");

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var view = this.subject();
    ok(view);
  });

});
define('fusor-ember-cli/tests/unit/views/rhci-test', ['ember-qunit'], function (ember_qunit) {

  'use strict';

  ember_qunit.moduleFor("view:rhci", "RhciView");

  // Replace this with your real tests.
  ember_qunit.test("it exists", function () {
    var view = this.subject();
    ok(view);
  });

});
define('fusor-ember-cli/tests/views/configure.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/configure.js should pass jshint', function() { 
    ok(true, 'views/configure.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/tests/views/organization.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/organization.js should pass jshint', function() { 
    ok(false, 'views/organization.js should pass jshint.\nviews/organization.js: line 18, col 25, \'event\' is defined but never used.\n\n1 error'); 
  });

});
define('fusor-ember-cli/tests/views/rhci.jshint', function () {

  'use strict';

  module('JSHint - views');
  test('views/rhci.js should pass jshint', function() { 
    ok(true, 'views/rhci.js should pass jshint.'); 
  });

});
define('fusor-ember-cli/torii-providers/foreman', ['exports'], function (exports) {

  'use strict';

  exports['default'] = Ember.Object.extend({

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
define('fusor-ember-cli/views/configure', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].View.extend({});

});
define('fusor-ember-cli/views/organization', ['exports', 'ember'], function (exports, Ember) {

  'use strict';

  exports['default'] = Ember['default'].View.extend({
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
define('fusor-ember-cli/views/rhci', ['exports', 'ember'], function (exports, Ember) {

	'use strict';

	exports['default'] = Ember['default'].View.extend(Ember['default'].ViewTargetActionSupport, {});


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