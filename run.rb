# Run the tests
#require '/Users/dustinsmith/Development/smokeit/json_test_factory.rb'
#JsonTestFactory.load_folder('/Users/dustinsmith/Development/smokeit/tests/')
gem 'test-unit'
require "test/unit"
require 'test/unit/testsuite' 
require 'test/unit/ui/console/testrunner'
require '/Users/dustinsmith/Development/smokeit/my_test_runner.rb'
require '/Users/dustinsmith/Development/smokeit/test_runner.rb'
#create a new empty TestSuite, giving it a name
my_tests = Test::Unit::TestSuite.new("My Special Tests")
my_tests << JSONTests.new('test_smithtest')#calls MyTest#test_1
#my_tests << JSONTests.new('test_smith1024com')#calls MyTest#test_1
#run the suite
#my_tests.run(nil)
output = ReturnResultRunner.run(my_tests)
puts 'output:', output