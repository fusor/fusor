module Utils
  module Fusor
    class MacAddresses

      def self.generate_mac_address
        options = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        l = [[options.sample, '2'].join('')]
        5.times do
          l << (options.sample 2).join('')
        end
        l.join(':')
      end

      def self.generate_unique_mac_address
        loop do
          random_mac = generate_mac_address.downcase
          return random_mac unless ::Nic::Interface.where(mac: random_mac).count > 0
        end
      end

    end
  end
end
