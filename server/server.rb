require 'sinatra'
require 'json'
#require '/Users/dustinsmith/Development/smokeit/json_test_factory.rb'
#require 'rubygems'
#gem "capybara", "1.1.4"
require 'capybara'
require 'capybara/dsl'
#gem "capybara-webkit"
require "capybara-webkit"
#gem "launchy"
require "launchy"
#gem 'json'
require 'json'
#require '/Users/dustinsmith/Development/smokeit/json_test_factory.rb'
#require 'capybara-screenshot'

get '/' do
  '<html>
	<body>
	<p>Sup yall</p>
	<input name="input-name" />
	<textarea name="text-name">Pre</textarea>

	</body>

	</html>'
end

post '/test/new2' do
	request.body.rewind  # in case someone already read it
  	data = JSON.parse request.body.read
  	"Hello #{data}!"
end

post '/test/run' do
	#JsonTestFactory.load_folder('/Users/dustinsmith/Development/smokeit/tests/')
	`ruby /Users/dustinsmith/Development/smokeit/test_runner.rb`
end

post '/test/new' do
	#request.body.rewind  # in case someone already read it
  	puts params
  	name = params[:name]
  	description = params[:description]
  	url = params[:url]
  	guid = params[:guid]
  	json = '{"name": "' + name + '",'
  	json += '"guid": "' + guid + '",'
  	json += '"url": "' + url + '",'
  	json += '"description": "' + description + '",'
  	json += '"steps": ['
  	#puts params[:steps]
  	#data = params[:steps].to_json
  	params[:steps].each_with_index do |step, index|
  		puts step[1]
  		json += '{"action": "' + step[1]['event'] + '",'
  		# might not want this
  		json += '"what": "' + step[1].fetch('on', 'body') + '"}'
  		
  		if index != params[:steps].size - 1
  			json += ','
  		end
  		
  	end
  	json += ']}' # close off the json
  	File.open(folder() + "test_#{guid}.json", 'w') { |file| file.write(json) }
  	puts json
  	json
end

post '/test/run/:name' do
	gem 'test-unit'
	require "test/unit"
	require 'test/unit/testsuite' 
	require 'test/unit/ui/console/testrunner'
	require '/Users/dustinsmith/Development/smokeit/test_runner.rb'
	require '/Users/dustinsmith/Development/smokeit/my_test_runner.rb'

	#create a new empty TestSuite, giving it a name
	my_tests = Test::Unit::TestSuite.new("My Special Tests")
	my_tests << JSONTests.new("test_#{params[:name]}")#calls MyTest#test_1
	
	#run the suite
	result = ReturnResultRunner.run(my_tests)
	passed = result.passed?
	#puts 'passed? :', output.passed?
	"#{passed}"
end

def folder
	# just a placeholder till we do programatically
	"/Users/dustinsmith/Development/smokeit/tests/"
end
