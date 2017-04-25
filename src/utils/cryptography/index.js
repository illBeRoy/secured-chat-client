import forge from 'node-forge';
import base64 from 'base-64';


/**
 * The Cryptography class takes care of cryptographic hashing, symmetric encryption via AES
 * and asymmetric encryption through RSA.
 */
class Cryptography {

    /**
     * Hashes a string using SHA-256 and returns a base-64 representation of the result.
     * @param str {string}
     */
    hash(str) {

        let sha256 = forge.sha256.create();
        sha256.update(str);
        return base64.encode(sha256.digest().bytes());
    }

    /**
     * Generates an RSA private\public key pair.
     * Does so asynchronously.
     * @return {Promise.<{privateKey:object, publicKey:object}>}
     */
    generateKeyPair() {

        return new Promise((resolve, reject) => {

            forge.rsa.generateKeyPair({bits: 4096, workers: -1}, (err, keypair) => {

                if (!err) {

                    resolve(keypair);
                } else {

                    reject(err);
                }
            });
        });
    }

    encryptAsym(encryptionKey, signingKey, str) {}

    decryptAsym(decryptionKey, verificationKey, str) {}

    /**
     * Encrypts a string symmetrically with a given key using AES.
     *
     * The given key is transformed into a 128bit representation using pbkdf2 password derivation, and then is used
     * as the AES secret, and also as its initial value.
     *
     * The result is returned as a base64 encoded string.
     *
     * @param key {string} the secret password used for the encryption
     * @param str {string} the value to encrypt
     */
    encryptSym(key, str) {

        let secret = forge.pkcs5.pbkdf2(key, '', 10000, 16);
        let aes = forge.cipher.createCipher('AES-CBC', secret);

        aes.start({iv: secret});
        aes.update(forge.util.createBuffer(str));
        aes.finish();

        return base64.encode(aes.output.bytes());
    }

    /**
     * Decrypts a string symmetrically with a given key using AES.
     *
     * The given key is transformed into a 128bit representation using pbkdf2 password derivation, and then is used
     * as the AES secret, and also as its initial value.
     *
     * @param key {string} the secret password used for the decryption
     * @param str {string} the encrypted value
     */
    decryptSym(key, str) {

        let secret = forge.pkcs5.pbkdf2(key, '', 10000, 16);
        let aes = forge.cipher.createDecipher('AES-CBC', secret);

        aes.start({iv: secret});
        aes.update(forge.util.createBuffer(str));
        aes.finish();

        return base64.encode(aes.output.bytes());
    }

}


export {Cryptography};
