angular
.module('KrakenDesigner')
.service("Constants", function () {
    return {
        "cipher_suites": {
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