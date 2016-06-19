export default function(server) {

  // Seed your development database using your factories. This
  // data will not be loaded in your tests.

  server.loadFixtures();

  var org = server.create('organization', {name: 'Default Organization'});
  var env = server.create('lifecycle_environment', {name: 'Library',
                                                    label: 'Library',
                                                    library: true});

  var engine = server.create('discovered_host', {is_virtual: true});
  var hypervisor1 = server.create('discovered_host', {is_virtual: false, memory_human_size: '21.8 GB'});
  var hypervisor2 = server.create('discovered_host', {is_virtual: true, memory_human_size: '21.8 GB'});

  server.createList('discovered_host', 2, {is_virtual: true});
  server.createList('discovered_host', 2, {is_virtual: false});

  var domain = server.create('domain', {name: 'example.com'});
  var hostgroup = server.create('hostgroup', {name: 'Fusor Base', domain_id: domain.id});

  server.create('deployment', {name: 'rhev_only',
                                      deploy_rhev: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      discovered_host_id: engine.id,
                                      discovered_host_ids: [hypervisor1.id, hypervisor2.id]
                                     });

  var osp_d1 = server.create('openstack_deployment');

  server.create('deployment', {name: 'osp_only',
                                      deploy_openstack: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      openstack_deployment_id: osp_d1.id
                                     });

  server.create('deployment', {name: 'rhev_and_cfme_deployment',
                                      deploy_rhev: true,
                                      deploy_cfme: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      discovered_host_id: engine.id,
                                      discovered_host_ids: [hypervisor2.id]
                                     });

  var osp_d2 = server.create('openstack_deployment');

  server.create('deployment', {
    name: 'osp_and_cfme_deployment',
    deploy_openstack: true,
    deploy_cfme: true,
    organization_id: org.id,
    lifecycle_environment_id: env.id,
    openstack_deployment_id: osp_d2.id
  });

  server.create('deployment', {name: 'rhev_and_openshift_deployment',
                                      deploy_rhev: true,
                                      deploy_openshift: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      discovered_host_id: engine.id,
                                      discovered_host_ids: [hypervisor1.id, hypervisor2.id]
                                     });

  server.create('deployment', {name: 'rhev_openshift_cfme_deployment',
                                      deploy_rhev: true,
                                      deploy_openshift: true,
                                      deploy_cfme: true,
                                      organization_id: org.id,
                                      lifecycle_environment_id: env.id,
                                      discovered_host_id: engine.id,
                                      discovered_host_ids: [hypervisor1.id, hypervisor2.id]
                                     });

}
