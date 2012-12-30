require 'rubygems'
gem 'json'
require 'json'
require '/Users/dustinsmith/Development/smokeit/test.rb'

module JsonTestFactory
	def self.build(json_file_path, test_class=SmokeTest)
		json = File.read(json_file_path)
		json = JSON.parse(json)
		test_class.new(
			name: json['name'],
			steps: StepsFactory.build(json['steps']),
			description: json['description']
		)
	end

	def self.load_folder(folder_path, test_class=SmokeTest)
		tests = []
		Dir.glob(folder_path + "*.json") do |file|
			tests << JsonTestFactory.build(file, test_class)
		end
		tests
	end

	def self.write_to_file(test)
		#might want to make a method to take a test and 
		# output it to a json file
	end
end