module FusorUi

  class PlaceholdersController < ApplicationController

    # Launch front-end EmberJS app, use fusor layout rather than foreman layout
    # because need <meta name="fusor-ember-cli/config/environment" ..>
    def index
      render :index, :layout => 'fusor_ui/layouts/application'
    end

    def new
      render :index, :layout => 'fusor_ui/layouts/application'
    end

    def r
      render :index, :layout => 'fusor_ui/layouts/application'
    end

  end
end
