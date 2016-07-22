#!/usr/bin/env ruby

require 'rbovirt'

USER = "admin@internal"
PASS = "dog8code"

# For 3.6 URL is just IP/api
# For 4.0 URL is IP/ovirt/api/v3
URL = "https://192.168.155.11/api"


client = OVIRT::Client.new(USER, PASS, URL, {:ca_no_verify => true})
puts "API Version: #{client.api_version}"

vm_ids = client.vms.map { |v| v.id }
puts "vm_ids = #{vm_ids}"

vm_ids.each do |vid|
  volume_data = client.vm_volumes vid
  puts "Volume info for #{vid}:"
  puts "#{volume_data}"
end
