require 'net/ssh'
require 'nokogiri'
require 'rubyipmi'

module Utils
  module Fusor
    class DiscoverMacs
      def initialize(params)
        @params = params
      end

      def discover
        return kvm(@params) if @params[:driver] == 'pxe_ssh'
        return dell(@params) if @params[:driver] == 'pxe_ipmitool' && @params[:vendor] == 'dell'
        nil
      end

      private

      def kvm(params)
        begin
          client = ::Utils::Fusor::SSHConnection.new(params[:hostname], params[:username], params[:password])
          io = StringIO.new
          client.execute('virsh list --all --name', io)
          libvirt_domains = io.string.split("\r\n")
          io.close if io && !io.closed?
          libvirt_domains.map do |domain|
            io = StringIO.new
            client.execute("virsh dumpxml #{domain}", io)
            mac_addresses = Nokogiri::XML(io.string).xpath("//interface//mac//@address").map { |address| address.text }
            io.close if io && !io.closed?
            { hostname: domain, mac_addresses: mac_addresses }
          end
        rescue
          nil
        end
      end

      def dell(params)
        @options = Rubyipmi::ObservableHash.new
        @options["H"] = params[:hostname]
        @options["U"] = params[:username]
        @options["P"] = params[:password]
        @options['I'] = "lanplus"

        conn = Utils::Fusor::MacDiscovery::Dell.new(@options)
        macs = conn.getmacs.lines.reject { |line| line !~ /^[0-9]/ }
        return nil if macs.empty?
        [{ hostname: "host0", mac_addresses: macs.map { |mac| mac.match(/([0-9a-fA-F]{2}[:-]){5}[0-9a-fA-F]{2}/).to_s }}]
      end

    end
  end
end
