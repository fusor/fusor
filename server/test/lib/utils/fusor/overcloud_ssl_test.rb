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

class GenCertsTest < ActiveSupport::TestCase
  def setup
    @ssl = Utils::Fusor::OvercloudSSL.new(fusor_deployments(:osp))
    @log_path = "#{Rails.root}/test/fixtures/logs/log_reader_test_file.log"
  end

  test 'gen_certs should return nil values if ca cert and key files do not exist' do
    File.stubs(:file?).returns(false)
    assert_equal(({'ca' => nil, 'cert' => nil, 'key' => nil}), @ssl.gen_certs)
  end

  test 'gen_certs should return nil if ca cert and key files are empty, cant be read, or have errors' do
    File.stubs(:file?).returns(true)
    File.stubs(:read).returns("bad file one", "bad file two")
    assert_equal(({'ca' => nil, 'cert' => nil, 'key' => nil}), @ssl.gen_certs)
  end

  test 'gen_certs should return certs and key if ca and cert files can be read' do
    File.stubs(:file?).returns(true)
    File.stubs(:read).returns("-----BEGIN CERTIFICATE-----\n"\
                              "MIIE5jCCA86gAwIBAgIJAIbJWKaNrpJiMA0GCSqGSIb3DQEBCwUAMIGAMQswCQYD\n"\
                              "VQQGEwJVUzEXMBUGA1UECBMOTm9ydGggQ2Fyb2xpbmExEDAOBgNVBAcTB1JhbGVp\n"\
                              "Z2gxEDAOBgNVBAoTB0thdGVsbG8xFDASBgNVBAsTC1NvbWVPcmdVbml0MR4wHAYD\n"\
                              "VQQDExVzYXQ2MmRldmcuZXhhbXBsZS5jb20wHhcNMTYwOTAxMTUzOTUxWhcNMzgw\n"\
                              "MTE3MTUzOTUxWjCBgDELMAkGA1UEBhMCVVMxFzAVBgNVBAgTDk5vcnRoIENhcm9s\n"\
                              "aW5hMRAwDgYDVQQHEwdSYWxlaWdoMRAwDgYDVQQKEwdLYXRlbGxvMRQwEgYDVQQL\n"\
                              "EwtTb21lT3JnVW5pdDEeMBwGA1UEAxMVc2F0NjJkZXZnLmV4YW1wbGUuY29tMIIB\n"\
                              "IjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzniuIhdZGdDiV3ELIm75++6n\n"\
                              "1AzKAtOedZebGGFBQpesmCKHp6y+j382dvDyoeOGdr26S7wMYbI+NoI1JylNe/bj\n"\
                              "1TATRv/r4MWqH0JhriTdIyv842w4458J38YMbZQQ25GBoYkj9jswoEkbp8W6edDk\n"\
                              "43NcuUyo/TYdIUgWOf65605+LibuIfElaFM6xJPL1WobegaY63cWiAj6xaSduhe9\n"\
                              "KkKrdh9mKnjbONd4Mlo3klyq1821wpwregG89Fp21p5Iqt44R2wc19iL8P2kt+VL\n"\
                              "QrbY2tArR8udAzBFNuYMcFXienl2Mvf4Yee9zlhZZaPVkTnPQQnpIQEivTQ1mwID\n"\
                              "AQABo4IBXzCCAVswDAYDVR0TBAUwAwEB/zALBgNVHQ8EBAMCAaYwHQYDVR0lBBYw\n"\
                              "FAYIKwYBBQUHAwEGCCsGAQUFBwMCMBEGCWCGSAGG+EIBAQQEAwICRDA1BglghkgB\n"\
                              "hvhCAQ0EKBYmS2F0ZWxsbyBTU0wgVG9vbCBHZW5lcmF0ZWQgQ2VydGlmaWNhdGUw\n"\
                              "HQYDVR0OBBYEFEVnJzUbfniZPevJ1gNnO3vXKGemMIG1BgNVHSMEga0wgaqAFEVn\n"\
                              "JzUbfniZPevJ1gNnO3vXKGemoYGGpIGDMIGAMQswCQYDVQQGEwJVUzEXMBUGA1UE\n"\
                              "CBMOTm9ydGggQ2Fyb2xpbmExEDAOBgNVBAcTB1JhbGVpZ2gxEDAOBgNVBAoTB0th\n"\
                              "dGVsbG8xFDASBgNVBAsTC1NvbWVPcmdVbml0MR4wHAYDVQQDExVzYXQ2MmRldmcu\n"\
                              "ZXhhbXBsZS5jb22CCQCGyVimja6SYjANBgkqhkiG9w0BAQsFAAOCAQEAu3JcaEgd\n"\
                              "pToXLQIAqInRHNgc44A/HQbIcgJsCUqHIIKTllEZqG/OznrnFNyB9SID+MInIayF\n"\
                              "hevbQiuKlpmHej6X90Mq1Hn7ONRCIlSXIfl7AHf88oxZ/e+LY5g9bT/0VbDPYJJE\n"\
                              "rrXc1N+Tct9B7x4zm58NsnbJ1Eo7fDK95N1aInLSWon8KZI0wsAd7INa74/YxONu\n"\
                              "TwwfZ96u5+2nvu+VbhRuKOHnn6Qo/lC8AZJYeDoeoLt6vKAQzcE0ecvPz7OnQ8qC\n"\
                              "XY7AQVM3RqpikJO3aqAMXWPh1gu+x2IfP7d2fb4FKcDAn4sI3KnDk3QwuewJoFNg\n"\
                              "ce2lIQ2wTziCmQ==\n"\
                              "-----END CERTIFICATE-----\n",
                              "-----BEGIN RSA PRIVATE KEY-----\n"\
                              "MIIEpAIBAAKCAQEAzniuIhdZGdDiV3ELIm75++6n1AzKAtOedZebGGFBQpesmCKH\n"\
                              "p6y+j382dvDyoeOGdr26S7wMYbI+NoI1JylNe/bj1TATRv/r4MWqH0JhriTdIyv8\n"\
                              "42w4458J38YMbZQQ25GBoYkj9jswoEkbp8W6edDk43NcuUyo/TYdIUgWOf65605+\n"\
                              "LibuIfElaFM6xJPL1WobegaY63cWiAj6xaSduhe9KkKrdh9mKnjbONd4Mlo3klyq\n"\
                              "1821wpwregG89Fp21p5Iqt44R2wc19iL8P2kt+VLQrbY2tArR8udAzBFNuYMcFXi\n"\
                              "enl2Mvf4Yee9zlhZZaPVkTnPQQnpIQEivTQ1mwIDAQABAoIBAD1Xr2yjgS5hWA3g\n"\
                              "oQ0+6XiHJEek8RO76bVIMKUip+/v/jBI+gLAGPGrOvRFi+C7J4T5w3Ki0Q7plQA+\n"\
                              "2SnkZIfzByecm+2ZNWxXbb7RyxGhFC5R8FVlHtXJt3ZLcf/QYN3LMjda9ls+pKjK\n"\
                              "b7P90/RDMu28pYzMEN0CCc+MikX6NnxAUO48CJCV3CMRBm4KqcEfkqW4r5uVuPwG\n"\
                              "9ycokcZ0lvK6j72eQK8heT5Xlb/1ygCadlEICI2+5E2hK7SP6aTgnOaAjWQbAwip\n"\
                              "IPbdCl+K7MK81ykoOkXc+ZdmY3OB0dp/s1eTuZoojyc2zeuXIlLsiLWNzR9To8Sn\n"\
                              "ml3dYwECgYEA6+uMeTIN8sEHv/lkqezCDeB+VkhkJvP01Dpdhi1Zrf5j+ESGQCUY\n"\
                              "tXOEQrtC20yniI5JKI75B7tAKP/A2saj2sqGnNwXI8+y7/Qtl4hBNXF9WJna3Y/M\n"\
                              "3YtXbgFaTFcPlZW02XBf9wB2iPia81RBlgZDk31aqNMELmTPCYhg8IECgYEA4At5\n"\
                              "o4ACb6mPhZSf1/i2ud7eLbOYg6j/zKkZlCXbuG70NtGMKSeVoPVnvSLCED+fHssC\n"\
                              "QpcboWxGl2HYUKLq3oMMzQR3lwrk4G0gHow8Jhz8l6sc4Vo+/SOiWkIkS5n3jWyu\n"\
                              "IfAKNCNljs+n49VwVwjGCiwVSKAa9jmRXekO2BsCgYBAnOF7K+9QBff2Zvpf45z+\n"\
                              "KfbP8MGlPXlXSqjkn7UJBzwf+bx/AunygDHACQN1hlf3+Wgl+IpRyMH4uJr8EB0+\n"\
                              "Ret6OHkJ8M+EEm8OKl4Zofx/cJvVxJWKM6h9U1eEwu9cu4StbK6Luo+8UcI2VGQm\n"\
                              "D48gbNuQk0J45lkhtj0+gQKBgQCRgKJUvtPWNOaSuD0/A7WX7NeaEqMgDmdiQQft\n"\
                              "oNCbbOOJnnlKWPzh9b6TpLkn2Em8s9cZ7Azzvt/xfIgBhmzGaZGsrBQGsfqGjhhn\n"\
                              "/mcp0XVyApzU9ckmmTfdKktsFeghns1QGRZnWf2gy9ebLYix3W7QOGTyL5iTBDwW\n"\
                              "Iz+StQKBgQCMqxunh/g1bhh5yuy0VQoDM4TnaxJsN/XLBDoQvduYFYbs6WI9RJtp\n"\
                              "th2b7oHmMJC8HLNJxSVyiT9ZIj8DvKCEQVUfsq18uIPbQI/lsvUgv871ZX0e6/zu\n"\
                              "ISlnZcqGLHXxoeMUyZFJvsNAq2kYxfi5XLY3XxDID9+4bOyj2OO7vw==\n"\
                              "-----END RSA PRIVATE KEY-----")
    certs = @ssl.gen_certs
    assert_match "-----BEGIN CERTIFICATE-----", certs["ca"]
    assert_match "-----BEGIN CERTIFICATE-----", certs["cert"]
    assert_match "-----BEGIN RSA PRIVATE KEY-----", certs["key"]
  end
end
