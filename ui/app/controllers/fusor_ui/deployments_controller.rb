module FusorUi

  class DeploymentsController < ApplicationController

    def index
#      render :text => 'herere'
      render :new, :layout => 'fusor_ui/layouts/application'
    end

    # Launch front-end EmberJS app for new fusor deployment, use fusor layout rather than foreman layout
    def new
#      render :text => 'herere'
      render :new, :layout => 'fusor_ui/layouts/application'
    end

  end
end
