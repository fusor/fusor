# fuser-ember-cli / RHCI demo

This is an online demo of [Fusor](https://github.com/fusor/fusor/) using the [EmberJS](http://emberjs.com/) and [ember-cli](http://ember-cli.com/) frameworks.

Fusor normally runs inside Satellite 6 as a plugin, but this demo only shows the UI and is NOT connected to Satellite 6.

## Differences between Fusor/RHCI UI Demo and working Satellite 6 / Fusor environment

**Menu**

* The real Satellite 6 main nav bar is shown below and the "RHCI Installer" menu is added by fusor. This demo only shows a dummy nav bar wit the two links "All Deployments" and "New Deployment"

![Satelitte 6 nav bar](https://raw.githubusercontent.com/isratrade/fusor/readme/fusor-ember-cli/public/assets/sat6-menu.png "RHCI Installer menu added to Satelitte 6 nav bar")

**Data persistance**

* No data is persisted is the demo, so a browser refresh will return the user to the start screen
* All button actions in demo will always generate the exact same API response
* Delete deployment is not working in demo

**Satellite**
* Add new environment path is not working in demo


**RHEV**
* No differences


**RHELOSP**
* Subscription and Review tabs may be (incorrectly) disabled because the undercloud password is not persisted
* Detect Undercloud - enter any values for Undercloud IP, SSH User, SSH Password
* Tabs (Register Nodes, Assign Nodes, Configure Overcloud) may be (incorrectly) disabled in demo because the undercloud password is not persisted
* Register Nodes is not working in demo.
* Assign Nodes - after you assign a role, all five roles will be assigned in the demo rather then only the selected role .
* Erors in demo only (Cannot read property '_internalModel' of undefined)

**CFME**
* No differences

**Subscriptions**
* Adding New Subscription Management Application not working in demo
* Upload manifest does not show success message and enable "Next" in demo


**Review**
* Deploy button does not generate foreman task ID
* Progress bar of deployment does not show any progress