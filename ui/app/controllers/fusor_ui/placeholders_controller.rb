module FusorUi

  class PlaceholdersController < ApplicationController

    # redirect /r/deployments to /r/#/deployments
    # since Sat6 would strip after # if referral link is a Katello/AngularJS page
    # redirect from "no hash" /r/ to "with hash" /r/# fixes this bug
    def index
      redirect_to "/r/#/deployments"
    end

    def new
      redirect_to "/r/#/deployments/new/start"
    end

    def index_with_hash
      render :index
    end

    def new_with_hash
      render :index
    end

    def r
      render :index
    end

  end
end
