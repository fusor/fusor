require 'test_plugin_helper'

module Actions::Fusor::Content
  class EnableRepositoriesTest < FusorActionTest
    EnableRepository = ::Actions::Katello::RepositorySet::EnableRepository

    class Content
      def name
      end
    end

    class ProductContent
      def content
        return Content.new
      end
    end

    class Find
      def find
        return ProductContent.new
      end
    end

    class Mapper
      def initialize(value)
        @value = value
      end

      def find_repository
        return @value
      end
    end

    def setup
      @deployment = fusor_deployments(:rhev)
      @product = katello_products(:redhat)
      @product.stubs(:productContent).returns(Find.new)
      @action = create_action EnableRepositories
      ::Katello::Product.stubs(:where).returns([@product])
    end

    test "plan should enable repo if it is not enabled" do
      EnableRepositories.any_instance.stubs(:repo_mapper).returns(Mapper.new(false))
      plan_action @action, @deployment.organization, SETTINGS[:fusor][:content][:cloudforms]
      assert_action_planed @action, EnableRepository
    end

    test "plan should not enable repo if already enabled" do
      EnableRepositories.any_instance.stubs(:repo_mapper).returns(Mapper.new(true))
      plan_action @action, @deployment.organization, SETTINGS[:fusor][:content][:cloudforms]
      refute_action_planed @action, EnableRepository
    end

    test "there is no run method for EnableRepositories Actions" do
      EnableRepositories.any_instance.stubs(:repo_mapper).returns(Mapper.new(false))
      plan = plan_action @action, @deployment.organization, SETTINGS[:fusor][:content][:cloudforms]
      assert_raises(NoMethodError) {
        silence_stream(STDOUT) do
          run_action plan
        end
      }
    end

  end
end
