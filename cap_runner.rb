require 'rubygems'
gem "capybara", "1.1.4"
require 'capybara'
require 'capybara/dsl'
gem "capybara-webkit"
require "capybara-webkit"
gem "launchy"
require "launchy"
gem 'json'
require 'json'

Capybara.run_server = false
#Capybara.current_driver = :selenium
#If you switch google to headless it sends different pages...
Capybara.current_driver = :webkit
Capybara.javascript_driver = :webkit

Capybara.app_host = 'http://smith1024.com/'
#require 'capybara/poltergeist'
#Capybara.javascript_driver = :poltergeist

#steps << {:action => 'visit', :what => '/'}
      #steps << {:action => 'fill_in', :what => 'gbqfq', :with => 'Dustin Smith'}
      #steps << {:action => 'click_on', :what => 'gbqfb'}
      #steps << {:action => 'check', :what => 'Dustin Smith Ministries'}
# Run the tests
require '/Users/dustinsmith/Development/smokeit/json_test_factory.rb'


require 'capybara-screenshot'
require "test/unit"

module MyCapybaraTest
  class Test < Test::Unit::TestCase
    include Capybara::DSL
    def test_google
      tests = JsonTestFactory.load_folder('/Users/dustinsmith/Development/smokeit/tests/')
      tests.each do |test|
        puts test.explanation
        #puts test.description
        test.steps.each do |step|
        	if step.action == 'visit'
            puts 'Visiting: '
        		visit(step.what)
        	end
        	if step.action == 'fill_in'
            puts 'Filling in'
        		fill_in step.what, :with => step.with
        	end
        	if step.action == 'click'
            puts 'Clicking'
        		click_on(step.what)
        	end
        	if step.action == 'check'
            puts 'Checking'
            assert(page.has_content?(step.what))
        	end
          if step.action == 'screenshot'
            #page.driver.resize_window(300, 500)
            screenshot_and_open_image
          end
          if step.action == 'resize'
            page.driver.resize_window(step.x, step.y)
          end
        end
      end
    end
  end
end

#t = MyCapybaraTest::Test.new
#t.test_google