#test_runner.py
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
require '/Users/dustinsmith/Development/smokeit/json_test_factory.rb'
require 'capybara-screenshot'
require "test/unit"
Capybara.run_server = false
#Capybara.current_driver = :selenium
#If you switch google to headless it sends different pages...
Capybara.current_driver = :webkit
Capybara.javascript_driver = :webkit
Capybara.app_host = 'http://smith1024.com/'

# Load the tests from command line?

class JSONTests < Test::Unit::TestCase
	include Capybara::DSL
	tests = JsonTestFactory.load_folder('/Users/dustinsmith/Development/smokeit/tests/')
	tests.each do |t|
		# Define methods for the test
		# Must start with _test for testRunner to pick em up
  	define_method "test_#{t.test_name}" do
  		puts t.explanation
  		puts t.test_name
			  t.steps.each do |step|
        	if step.action == 'visit'
        		visit(step.what)
        	end
        	if step.action == 'fill_in'
        		fill_in step.what, :with => step.with
        	end
        	if step.action == 'click'
        		click_on(step.what)
        	end
        	if step.action == 'check'
            assert(page.has_content?(step.what))
        	end
          if step.action == 'screenshot'
          	info = screenshot_and_save_page
          	#puts info[:image]
            #screenshot_and_open_image
          end
          if step.action == 'resize'
            page.driver.resize_window(step.x, step.y)
          end
        end
  	end
	end
end
