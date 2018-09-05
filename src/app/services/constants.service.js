angular
.module('KrakenDesigner')
.service("Constants", function () {
    return {
        "jose_algorithms": {
           "EdDSA": "EdDSA",
           "HS256": "HS256 - HMAC using SHA-256",
           "HS384": "HS384 - HMAC using SHA-384",
           "HS512": "HS512 - HMAC using SHA-512",
           "RS256": "RS256 - RSASSA-PKCS-v1.5 using SHA-256",
           "RS384": "RS384 - RSASSA-PKCS-v1.5 using SHA-384",
           "RS512": "RS512 - RSASSA-PKCS-v1.5 using SHA-512",
           "ES256": "ES256 - ECDSA using P-256 and SHA-256",
           "ES384": "ES384 - ECDSA using P-384 and SHA-384",
           "ES512": "ES512 - ECDSA using P-521 and SHA-512",
           "PS256": "PS256 - RSASSA-PSS using SHA256 and MGF1-SHA256",
           "PS384": "PS384 - RSASSA-PSS using SHA384 and MGF1-SHA384",
           "PS512": "PS512 - RSASSA-PSS using SHA512 and MGF1-SHA512"
       },
       "jose_cipher_suites": {
        5: "TLS_RSA_WITH_RC4_128_SHA",
        10: "TLS_RSA_WITH_3DES_EDE_CBC_SHA",
        47: "TLS_RSA_WITH_AES_128_CBC_SHA",
        53: "TLS_RSA_WITH_AES_256_CBC_SHA",
        60: "TLS_RSA_WITH_AES_128_CBC_SHA256",
        156: "TLS_RSA_WITH_AES_128_GCM_SHA256",
        157: "TLS_RSA_WITH_AES_256_GCM_SHA384",
        49159: "TLS_ECDHE_ECDSA_WITH_RC4_128_SHA",
        49161: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA",
        49162: "TLS_ECDHE_ECDSA_WITH_AES_256_CBC_SHA",
        49169: "TLS_ECDHE_RSA_WITH_RC4_128_SHA",
        49170: "TLS_ECDHE_RSA_WITH_3DES_EDE_CBC_SHA",
        49171: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA",
        49172: "TLS_ECDHE_RSA_WITH_AES_256_CBC_SHA",
        49187: "TLS_ECDHE_ECDSA_WITH_AES_128_CBC_SHA256",
        49191: "TLS_ECDHE_RSA_WITH_AES_128_CBC_SHA256",
        // Default suites:
        49199: "TLS_ECDHE_RSA_WITH_AES_128_GCM_SHA256",
        49195: "TLS_ECDHE_ECDSA_WITH_AES_128_GCM_SHA256",
        49200: "TLS_ECDHE_RSA_WITH_AES_256_GCM_SHA384",
        49196: "TLS_ECDHE_ECDSA_WITH_AES_256_GCM_SHA384",
        52392: "TLS_ECDHE_RSA_WITH_CHACHA20_POLY1305",
        52393: "TLS_ECDHE_ECDSA_WITH_CHACHA20_POLY1305"
        }
    };
});