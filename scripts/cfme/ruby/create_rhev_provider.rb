#!/usr/bin/env ruby

require 'json'
require 'rest_client'

CFME_IP = "192.168.152.15"
CFME_USER = "admin"
CFME_PASS = "smartvm"
RHEV_IP = "192.168.152.13"
RHEV_ADMIN_NAME = "admin@internal"
RHEV_ADMIN_PASS = "changeme"
DATE = `date +"%s"`

puts "	CFME_IP         : #{CFME_IP}"
puts "	RHEV_IP         : #{RHEV_IP}"
puts "	RHEV_ADMIN_NAME : #{RHEV_ADMIN_NAME}"
puts "	RHEV_ADMIN_PASS : #{RHEV_ADMIN_PASS}"
puts "	DATE            : #{DATE}"

data = {
  :action => "create",
  :resources => [
    {
      :name => "RHEV_#{DATE}",
      :type => "ManageIQ::Providers::Redhat::InfraManager",
      :hostname => RHEV_IP,
      :port => "443",
      :zone_id => "1000000000001",
      :credentials => {
        :userid => RHEV_ADMIN_NAME,
        :password => RHEV_ADMIN_PASS
      }
    }
  ]
}

request_url = "https://#{CFME_USER}:#{CFME_PASS}@#{CFME_IP}/api/providers"
client = RestClient::Resource.new(request_url, :verify_ssl => OpenSSL::SSL::VERIFY_NONE)

begin
  response = client.post data.to_json
  puts "Status Code: #{response.code}"
  puts response
rescue RestClient::Exception => e
  puts e
  puts e.response
end
