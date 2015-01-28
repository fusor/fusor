module Fusor
  class Api::V2::DeploymentsController < Api::V2::BaseController

   before_filter :find_deployment, :only => [:destroy, :show, :update]

    def index
      puts "XXX index called"
      Rails.logger.info("XXX index called")
      @deployments = Deployment.all
    end

    def show
      puts "XXX show called"
      @deployment
    end

    def create
      Rails.logger.info("XXX create")
      puts "XXX create"
      puts "XXX " + params[:deployment].to_s
      @deployment = Deployment.new(params[:deployment])
      process_response @deployment.save
    end

    def update
      puts "XXX update"
      process_response @deployment.update_attributes(params[:deployment])
    end

    def destroy
      puts "XXX destroy"
      process_response @deployment.destroy
    end

    def find_deployment
        not_found and return false if params[:id].blank?
        @deployment = Deployment.find(params[:id])
    end

  end
end
