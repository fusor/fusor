require 'hammer_cli_foreman'

HammerCLI::MainCommand.lazy_subcommand 'deployment',
                                       _("Manipulate deployments."),
                                       'HammerCLIFusor::Deployment',
                                       'hammer_cli_fusor/deployment'
