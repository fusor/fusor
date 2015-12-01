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
    @log_path = "#{Rails.root}/test/fixtures/log_reader_test_file.log"
  end

  # parse_date
  test 'parse_date should return a valid date for a valid string' do
    assert_equal @reader.parse_date('test 2015-11-17 04:00:10 string'), DateTime.new(2015, 11, 17, 4, 0, 10).utc
  end

  test 'parse_date should return nil for empty matches' do
    assert_nil @reader.parse_date '2015-11- test no matches 04:00:10'
  end

  test 'parse_date should return nil for an invalid date string' do
    assert_nil @reader.parse_date 'invalid date 5-111-177 04:00:10'
  end

  # parse_log_level
  test 'parse_log_level should return valid warning level for a valid string' do
    assert_equal @reader.parse_log_level('should match [I] to I'), 'I'
  end

  test 'parse_log_level should return the first valid warning level for multiple matches' do
    assert_equal @reader.parse_log_level('[I][W][E] should only return I'), 'I'
  end

  test 'parse_log_level should return nil for no log level matched' do
    assert_nil @reader.parse_log_level 'I'
    assert_nil @reader.parse_log_level '[i]'
    assert_nil @reader.parse_log_level '[]'
    assert_nil @reader.parse_log_level '[9]'
  end

  # parse_entry
  test 'parse_entry should return a new entry for a blank log line' do
    entry = @reader.parse_entry('')
    assert_nil entry.date_time
    assert_nil entry.level
    assert_equal entry.text, ''
  end

  test 'parse_entry should return a new entry for a newline entry' do
    entry = @reader.parse_entry("\n")
    assert_nil entry.date_time
    assert_nil entry.level
    assert_equal entry.text, ''
  end

  test 'parse_entry should return a new entry for a complete log line' do
    entry = @reader.parse_entry('2015-01-02 03:04:05 [I] some log stuff')
    assert_equal entry.date_time, DateTime.new(2015, 1, 2, 3, 4, 5).utc
    assert_equal entry.level, 'I'
    assert_equal entry.text, '2015-01-02 03:04:05 [I] some log stuff'
  end

  test 'parse_entry should return a new entry for a complete log line stripping last newline' do
    entry = @reader.parse_entry("2015-01-02 03:04:05 [I] some log stuff\n")
    assert_equal entry.text, '2015-01-02 03:04:05 [I] some log stuff'
  end

  # read_full_log
  test 'read_full_log reads all lines' do
    log = @reader.read_full_log @log_path
    assert_equal log.entries.length, 9
    assert_equal log.entries[0].text, 'line 0'
  end

  # tail_log_since
  test 'tail_log_since will return the correct log if the first tail amount is enough' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 6), 4, 10).utc
    assert_equal log.entries.length, 3
    assert_equal log.entries[0].text, '2015-01-02 03:04:06 [I] line 6'
  end

  test 'tail_log_since will return the correct log if the first tail amount is not enough' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 6), 2, 10).utc
    assert_equal log.entries.length, 3
    assert_equal log.entries[0].text, '2015-01-02 03:04:06 [I] line 6'
  end

  test 'tail_log_since will return the limit if the num_lines_limit is not enough' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 1), 3, 4).utc
    assert_equal log.entries.length, 4
    assert_equal log.entries[0].text, '2015-01-02 03:04:05 [W] line 5'
  end

  test 'tail_log_since will return the all dated portions of the log is shorter than the max' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 1), 2, 100).utc
    assert_equal log.entries.length, 8
    assert_equal log.entries[0].text, '2015-01-02 03:04:01 [E] line 1'
  end

  test 'tail_log_since returns all lines since the given date_time' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 6)).utc
    assert_equal log.entries.length, 3
    assert_equal log.entries[0].text, '2015-01-02 03:04:06 [I] line 6'
  end

  test 'tail_log_since omits undated lines before since_date' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 5)).utc
    assert_equal log.entries.length, 4
    assert_equal log.entries[0].text, '2015-01-02 03:04:05 [W] line 5'
  end

  test 'tail_log_since includes undated lines after since_date' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 1)).utc
    assert_equal log.entries.length, 8
    assert_equal log.entries[0].text, '2015-01-02 03:04:01 [E] line 1'
  end

  test 'tail_log_since includes lines from the earliest dated log line if since_date is before log started' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 1, 1, 1, 1)).utc
    assert_equal log.entries.length, 8
    assert_equal log.entries[0].text, '2015-01-02 03:04:01 [E] line 1'
  end

  test 'tail_log_since includes no lines if the since_date is later than the last entry' do
    log = @reader.tail_log_since(@log_path, DateTime.new(2015, 1, 2, 3, 4, 10)).utc
    assert_equal log.entries.length, 0
  end
end
