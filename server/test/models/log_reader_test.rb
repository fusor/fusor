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

class LogReaderTest < ActiveSupport::TestCase
  def setup
    @reader = Fusor::Logging::LogReader.new
    @log_path = "#{Rails.root}/test/fixtures/logs/log_reader_test_file.log"
  end

  # parse_entry
  test 'parse_entry should return a new entry for a blank log line' do
    entry = @reader.parse_entry('', 123)
    assert_equal 123, entry.line_number
    assert_equal '', entry.text
  end

  test 'parse_entry should return a new entry for a newline entry' do
    entry = @reader.parse_entry("\n", 123)
    assert_equal 123, entry.line_number
    assert_equal '', entry.text
  end

  test 'parse_entry should return a new entry for a complete log line' do
    entry = @reader.parse_entry('2015-01-02 03:04:05 [I] some log stuff', 123)
    assert_equal 123, entry.line_number
    assert_equal '2015-01-02 03:04:05 [I] some log stuff', entry.text
  end

  test 'parse_entry should return a new entry for a complete log line stripping last newline' do
    entry = @reader.parse_entry("2015-01-02 03:04:05 [I] some log stuff\n", 123)
    assert_equal '2015-01-02 03:04:05 [I] some log stuff', entry.text
  end

  # read_full_log
  test 'read_full_log reads all lines' do
    log = @reader.read_full_log @log_path
    assert_equal 7, log.entries.length

    assert_equal 1, log.entries[0].line_number
    assert_equal 'line 1', log.entries[0].text

    assert_equal 7, log.entries[log.entries.length - 1].line_number
    assert_equal 'line 7', log.entries[log.entries.length - 1].text
  end

  # tail_log_since
  test 'tail_log_since will return all lines if 0 lower boundary' do
    log = @reader.tail_log_since(@log_path, 0)
    assert_equal 7, log.entries.length

    assert_equal 1, log.entries[0].line_number
    assert_equal 'line 1', log.entries[0].text

    assert_equal 7, log.entries[log.entries.length - 1].line_number
    assert_equal 'line 7', log.entries[log.entries.length - 1].text
  end

  test 'tail_log_since returns all lines since the given lower boundary' do
    log = @reader.tail_log_since(@log_path, 2)
    assert_equal 5, log.entries.length

    assert_equal 3, log.entries[0].line_number
    assert_equal 'line 3', log.entries[0].text

    assert_equal 7, log.entries[log.entries.length - 1].line_number
    assert_equal 'line 7', log.entries[log.entries.length - 1].text
  end

  test 'tail_log_since includes no lines if the lower boundary is already at the last line' do
    log = @reader.tail_log_since(@log_path, 7)
    assert_equal 0, log.entries.length
  end

  test 'tail_log_since includes no lines if the lower boundary is at an ending newline' do
    log = @reader.tail_log_since(@log_path, 8)
    assert_equal 0, log.entries.length
  end

  test 'tail_log_since includes no lines if the lower boundary is past the last line' do
    log = @reader.tail_log_since(@log_path, 9)
    assert_equal 0, log.entries.length
  end
end
