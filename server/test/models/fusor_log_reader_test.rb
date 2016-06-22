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

class FusorLogReaderTest < ActiveSupport::TestCase
  def setup
    @reader = Fusor::Logging::FusorLogReader.new
  end

  # parse_log_level
  test 'parse_log_level should return :debug log level for debug' do
    assert_equal :debug, @reader.parse_log_level('D, should match to :debug')
  end

  test 'parse_log_level should return :info log level for info lines' do
    assert_equal :info, @reader.parse_log_level('I, should match to :info')
  end

  test 'parse_log_level should return :warn log level for warnings' do
    assert_equal :warn, @reader.parse_log_level('W, should match to :warn')
  end

  test 'parse_log_level should return :error log level for errors' do
    assert_equal :error, @reader.parse_log_level('E, should match to :error')
  end

  test 'parse_log_level should return nil for no log level matched' do
    assert_nil @reader.parse_log_level ''
    assert_nil @reader.parse_log_level '       '
    assert_nil @reader.parse_log_level "\n"
    assert_nil @reader.parse_log_level 'I'
    assert_nil @reader.parse_log_level 'i,'
    assert_nil @reader.parse_log_level ' ,'
  end

  #parse entry uses parse_level
  test 'parse_entry should set the entry log_level' do
    entry = @reader.parse_entry('I, 2015-01-02 03:04:05 some log stuff', 123)
    assert_equal :info, entry.level
  end

  test 'FusorLogReader should understand continuation log lines' do
    @log_path = "#{Rails.root}/test/fixtures/logs/fusor_log_reader_test_file.log"
    log = @reader.read_full_log @log_path
    assert_nil log.entries[0].level
    assert_equal :warn, log.entries[1].level
    assert_equal :warn, log.entries[2].level
    assert_equal :warn, log.entries[3].level
    assert_nil log.entries[4].level
    assert_equal :error, log.entries[5].level
    assert_equal :error, log.entries[6].level
    assert_equal :info, log.entries[7].level
  end
end
