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

class AnsibleLogReaderTest < ActiveSupport::TestCase
  def setup
    @reader = Fusor::Logging::AnsibleLogReader.new
  end

  # parse_log_level
  test 'parse_log_level should return :error log level for errors' do
    assert_equal :error, @reader.parse_log_level('should match  ERROR: to :error')
    assert_equal :error, @reader.parse_log_level('should match  fatal: to :error')
  end

  test 'parse_log_level should return :info for no log level matched' do
    assert_equal :info, @reader.parse_log_level('lowercase error no match')
  end

  test 'parse_log_level should return nil for blank lines' do
    assert_nil @reader.parse_log_level ''
    assert_nil @reader.parse_log_level '       '
    assert_nil @reader.parse_log_level "\n"
  end

  #parse entry uses parse_level
  test 'parse_entry should set the entry log_level' do
    entry = @reader.parse_entry('2016-06-07 17:12:54,266 p=29982 u=vagrant |  ERROR: the playbook: Demo/ansible.hosts could not be found', 123)
    assert_equal :error, entry.level
  end
end
