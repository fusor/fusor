require 'openssl'

module Utils
  module Fusor
    class OvercloudSSL

      def initialize(deployment)
        @deployment = deployment
      end

      def gen_certs
        if !File.file?('/etc/pki/katello/certs/katello-default-ca.crt') || !File.file?('/etc/pki/katello/private/katello-default-ca.key')
          {"ca" => nil, "cert" => nil, "key" => nil}
        else
          hostname_prefix = @deployment.label.tr('_', '-')
          domain = Domain.find(Hostgroup.find_by_name('Fusor Base').domain_id)
          name = "#{hostname_prefix}-overcloud.#{domain}"
          cafile = '/etc/pki/katello/certs/katello-default-ca.crt'
          keyfile = '/etc/pki/katello/private/katello-default-ca.key'
          ca = OpenSSL::X509::Certificate.new(File.read(cafile))
          ca_key = OpenSSL::PKey::RSA.new(File.read(keyfile))

          keypair = OpenSSL::PKey::RSA.new(4096)

          req = OpenSSL::X509::Request.new
          req.version = 0
          req.subject = OpenSSL::X509::Name.parse(
            "C=US/ST=North Carolina/L=Raleigh/O=Katello/OU=SomeOrgUnit/CN=#{name}"
          )
          req.public_key = keypair.public_key
          req.sign(keypair, OpenSSL::Digest::SHA1.new)

          cert = OpenSSL::X509::Certificate.new
          cert.version = 2
          cert.serial = rand(999_999)
          cert.not_before = Time.new.getlocal
          cert.not_after = cert.not_before + (60 * 60 * 24 * 1825)
          cert.public_key = req.public_key
          cert.subject = req.subject
          cert.issuer = ca.subject

          ef = OpenSSL::X509::ExtensionFactory.new
          ef.subject_certificate = ef.issuer_certificate = cert
          ef.issuer_certificate = ca

          cert.extensions = [
            ef.create_extension('basicConstraints', 'CA:FALSE', true),
            ef.create_extension('extendedKeyUsage', 'serverAuth', false),
            ef.create_extension('subjectKeyIdentifier', 'hash'),
            ef.create_extension('authorityKeyIdentifier', 'keyid:always,issuer:always'),
            ef.create_extension('subjectAltName', "DNS: #{name}"),
            ef.create_extension('keyUsage',
              %w(nonRepudiation digitalSignature
                 keyEncipherment dataEncipherment).join(","),
                 true)
          ]
          cert.sign(ca_key, OpenSSL::Digest::SHA1.new)

          {"ca" => ca.to_s, "cert" => cert.to_s, "key" => keypair.to_s}
        end
      rescue
        {"ca" => nil, "cert" => nil, "key" => nil}
      end
    end
  end
end
