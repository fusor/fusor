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

    end
  end
end
