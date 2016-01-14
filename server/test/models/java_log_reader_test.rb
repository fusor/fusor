#
# Copyright 2015 Red Hat, Inc.
#
# This software is licensed to you under the GNU General Public
# License as published by the Free Software Foundation; either version
# 2 of the License (GPLv2) or (at your option) any later version.
# There is NO WARRANTY for this software, express or implied,
# including the implied warranties of MERCHANTABILITY,
# NON-INFRINGEMENT, or FITNESS FOR A PARTICULAR PURPOSE. You should
# have received a copy of GPLv2 along with this software; if not, see
# http://www.gnu.org/licenses/old-licenses/gpl-2.0.txt.

require 'test_helper'

class JavaLogReaderTest < ActiveSupport::TestCase
  def setup
    @reader = Fusor::Logging::JavaLogReader.new
  end

  # parse_log_level
  test 'parse_log_level should return :debug log level for debug' do
    assert_equal :debug, @reader.parse_log_level('should match DEBUG to :debug')
    assert_equal :debug, @reader.parse_log_level('should match FINE to :debug')
    assert_equal :debug, @reader.parse_log_level('should match FINER to :debug')
    assert_equal :debug, @reader.parse_log_level('should match FINEST to :debug')
    assert_equal :debug, @reader.parse_log_level('should match TRACE to :debug')
  end

  test 'parse_log_level should return :info log level for info lines' do
    assert_equal :info, @reader.parse_log_level('should match INFO to :info')
  end

  test 'parse_log_level should return :warn log level for warnings' do
    assert_equal :warn, @reader.parse_log_level('should match WARN to :warn')
  end

  test 'parse_log_level should return :error log level for errors' do
    assert_equal :error, @reader.parse_log_level('should match ERROR to :error')
  end

  test 'parse_log_level should return :error log level for stacktrace lines' do
    assert_equal :error, @reader.parse_log_level('Caused by: a previous error and should match to :error')
    assert_nil @reader.parse_log_level('should not match caused by since it\'s not at the beginning')
    assert_equal :error, @reader.parse_log_level('             at com.hello.world')
    assert_nil @reader.parse_log_level('should not match at com.hello.world since it\'s not at the beginning')
  end

  test 'parse_log_level should return nil for no log level matched' do
    assert_nil @reader.parse_log_level ''
    assert_nil @reader.parse_log_level '       '
    assert_nil @reader.parse_log_level "\n"
    assert_nil @reader.parse_log_level 'lowercase error no match'
  end

  #parse entry
  test 'parse_entry should set the entry log_level' do
    entry = @reader.parse_entry('2016-01-05 17:00:00,099 [job=blah] INFO log stuff', 123)
    assert_equal :info, entry.level
  end
end
