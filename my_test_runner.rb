require 'test/unit'
require 'test/unit/ui/console/testrunner'

class ReturnResultRunner < Test::Unit::UI::Console::TestRunner
  def add_fault(fault)
    @faults << fault
    nl
    output("%3d) %s" % [@faults.length, fault.long_display])
    output("--")
    @already_outputted = true
  end

  def finished(elapsed_time)
    #nl
    #output("Finished in #{elapsed_time} seconds.")
    nl
    output(@result)
    #output(@result.passed?)
    @result
  end

  #def test_suite_finished(suite)
    #puts suite.methods
  #end
end

Test::Unit::AutoRunner::RUNNERS[:fastfail] = proc do |r|
  FastFailRunner
end