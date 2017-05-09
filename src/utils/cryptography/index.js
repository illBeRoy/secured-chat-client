import forge from 'node-forge';
import base64 from 'base-64';
import secureRandom from 'secure-random';
import {range} from 'range';


/**
 * The Cryptography class takes care of cryptographic hashing, symmetric encryption via AES
 * and asymmetric encryption through RSA.
 */
class Cryptography {

    random(length=16) {

        return secureRandom.randomBuffer(16);
    }

    /**
     * Hashes a string using SHA-256 and returns a base-64 representation of the result.
     * @param str {string}
     * @param iterations {number} how many times to apply hash digestion
     */
    hash(str, iterations=1) {

        for (let i of range(iterations)) {

            let sha256 = forge.sha256.create();
            sha256.update(str);

            str = sha256.digest().bytes();
        }

        return base64.encode(str);
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

    /**
     * Encrypts a string asymmetrically.
     *
     * For the encryption to take place, the sender's private key and the receiver's public key are needed.
     *
     * First, the message is hashed and signed using the sender's private key.
     * Then, an AES key is generated in a cryptographically random fashion, and is used to encrypt the message.
     * After that is done, the key is encrypted using the receiver's public key.
     * Finally, the three are concatenated and encoded in base64.
     *
     * @param encryptionKey {object} the receiver's public key
     * @param signingKey {object} the sender's private key
     * @param message {string} the message to encrypt
     */
    encryptAsym(encryptionKey, signingKey, message) {

        // create mac with sha1 and sign it with signing key
        let signature = signingKey.sign(forge.sha1.create().update(message));

        // create aes cipher
        let cipher = this.random(16);

        // encrypt message
        let encryptedMessage = this.encryptSym(cipher, message);

        // encrypt cipher
        let encryptedCipher = encryptionKey.encrypt(cipher.toString('binary'), 'RSA-OAEP');

        // create whole message
        let composedMessage = signature + encryptedCipher + encryptedMessage;

        // return base64 representation
        return base64.encode(composedMessage);
    }

    /**
     * Decrypts a string asymmetrically.
     *
     * For the decryption to take place, the sender's public key and the receiver's private key are needed.
     *
     * First, the message is decoded from base64.
     * Then, the receiver's public key is used to decrypt the cipher, which is in the first 512 bytes of the payload.
     * This is followed by the decryption of the full message using the cipher.
     * Finally, the decrypted message is hashed and checked against the signature using the sender's public key.
     *
     * @param decryptionKey {object} the receiver's private key
     * @param verificationKey {object} the sender's public key
     * @param encryptedMessage {string} the payload to decrypt, which is a base64 hashed message
     */
    decryptAsym(decryptionKey, verificationKey, encryptedMessage) {

        // decode base64
        let decodedStr = base64.decode(encryptedMessage);

        // fetch and decrypt cipher
        let cipher = decryptionKey.decrypt(decodedStr.substr(512, 512), 'RSA-OAEP');

        // decrpyt message
        let message = this.decryptSym(cipher, decodedStr.substr(1024));

        // confirm signature and mac
        if (!verificationKey.verify(forge.sha1.create().update(message).digest().bytes(), decodedStr.substr(0, 512))) {

            throw new Error('Failed to verify signature');
        }

        // return
        return message;
    }

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
        aes.update(forge.util.createBuffer(base64.decode(str)));
        aes.finish();

        return aes.output.data;
    }

    /**
     * Exports a pair of keys in pem format.
     * @param publicKey {object} public key to export (optional)
     * @param privateKey {object} private key to export (optional)
     * @returns {{publicKey: {object}, privateKey: {object}}}
     */
    exportKeys({publicKey, privateKey}) {

        let publicKeyPem, privateKeyPem;
        try { publicKeyPem = forge.pki.publicKeyToPem(publicKey) } catch (err) {}
        try { privateKeyPem = forge.pki.privateKeyToPem(privateKey) } catch (err) {}

        return {
            publicKey: publicKeyPem,
            privateKey: privateKeyPem
        }
    }

    /**
     * Imports a pair of keys from pem format.
     * @param publicKey {object} public key to import (optional)
     * @param privateKey {object} private key to import (optional)
     * @returns {{publicKey: {object}, privateKey: {object}}}
     */
    importKeys({publicKey, privateKey}) {

        let importedPublicKey, importedPrivateKey;

        try { importedPublicKey = forge.pki.publicKeyFromPem(publicKey) } catch (err) {}
        try { importedPrivateKey = forge.pki.privateKeyFromPem(privateKey) } catch (err) {}

        return {
            publicKey: importedPublicKey,
            privateKey: importedPrivateKey
        }
    }

}


export {Cryptography};
