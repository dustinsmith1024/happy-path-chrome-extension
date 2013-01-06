
class Tester
	@queue = :web_tests

	def self.perform(name, suite_name='My Tests')
		gem 'test-unit'
		require "test/unit"
		require 'test/unit/testsuite' 
		require 'test/unit/ui/console/testrunner'
		require '/Users/dustinsmith/Development/smokeit/test_runner.rb'
		require '/Users/dustinsmith/Development/smokeit/my_test_runner.rb'

		# create a new empty TestSuite, giving it a name
		my_tests = Test::Unit::TestSuite.new(suite_name)
		my_tests << JSONTests.new("test_#{name}")  # calls MyTest#test_1

		#run the suite
		result = ReturnResultRunner.run(my_tests)
		passed = result.passed?
		#puts 'passed? :', output.passed?
		"#{passed}"
	end
end