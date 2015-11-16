#!/usr/bin/env ruby

require 'rest_client'

CFME_IP = "192.168.152.15"
CFME_USER = "admin"
CFME_PASS = "smartvm"

request_url = "https://#{CFME_USER}:#{CFME_PASS}@#{CFME_IP}/api/providers"
puts "Will attempt request to: #{request_url}"
puts

client = RestClient::Resource.new(request_url, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)
response = client.get

puts "Status Code: #{response.code}"
puts response
