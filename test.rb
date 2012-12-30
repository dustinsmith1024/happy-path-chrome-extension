class SmokeTest
  attr_reader :name, :steps, :description, :url

  def initialize(args={})
    @name = args[:name]
    @steps = args[:steps]
    @url = args[:url]
    @description = args.fetch(:description, nil)
  end

  def explanation
  	@name + ' ' + @description
  end

  def test_name
	@name.gsub(/-/,'_').gsub(/[^0-9A-Za-z_]/, '')
  end
end

require 'forwardable'
class Steps
	extend Forwardable
	def_delegators :@steps, :size, :each
	include Enumerable

	def initialize(steps)
		@steps = steps
	end

end

require 'ostruct'
module StepsFactory
	def self.build(config, steps_class=Steps)
		steps_class.new(
			config.collect {|step_config|
					create_step(step_config)
				}
		)
	end

	def self.create_step(step_config)
		#puts 'Step Config', step_config['action']
		OpenStruct.new(
			action: step_config['action'],
			what:  step_config.fetch('what', nil),
			with: step_config.fetch('with', nil),
			x: step_config.fetch('x', nil),
			y: step_config.fetch('y', nil)
		)
	end
end



# Not using this right now, using open struct to see how it goes
class Step
	attr_reader :action, :what, :with, :status

	def initialize(arg={})
		@action = args[:action]
		@what = args[:what]
		@with = args.fetch(:with, nil)
		@status = args.fetch(:stauts, nil)
	end

end
