  require "test/unit"

   DynamicTest = Struct.new :name, :expected, :actual

   DYNAMIC_TESTS = [
     DynamicTest.new( "test_one", 123, 123 ),
     DynamicTest.new( "test_two", 125, 123 ),
     DynamicTest.new( "test_three", 127, 127 ),
   ]

   Class.new Test::Unit::TestCase do
     DYNAMIC_TESTS.each do |t|
       define_method t.name do
         assert_equal t.expected, t.actual
       end
     end
   end