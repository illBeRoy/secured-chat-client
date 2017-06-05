import {Action} from '../../../../framework/resource';


/**
 * Gets the public\private key pair of user.
 *
 * If the user is not the logged in user, will return {null} as private key.
 */
class KeysAction extends Action {

    static __name__ = 'keys';

    static requirements = ['utils', 'session'];

    /**
     * @returns {{publicKey, privateKey}}
     */
    static onCall() {

        // fetch public key
        let publicKey = this.publicKey;

        // if the user is me, fetch private key as well
        let privateKey = null;
        if (this.username == this.session.username) {

            // extract hmac and private key encryption
            let hmac = this.privateKey.substr(-44);
            privateKey = this.privateKey.substr(0, this.privateKey.length - 44);

            // attempt to recreate hmac locally
            let hmacRecreation = this.utils.cryptography.hash(
                this.utils.cryptography.encryptSym(
                    this.session.integrityKey,
                    privateKey
                )
            );

            // test recreation against hmac. if failed, throw
            if (hmacRecreation != hmac) {

                throw new Error('Fatal data integrity error! Cannot validate own private key!');
            }

            // decrypt own private key with data encryption key
            privateKey = this.utils.cryptography.decryptSym(this.session.encryptionKey, privateKey);
        }

        // return keys
        return this.utils.cryptography.importKeys({publicKey, privateKey});
    }

}


export {KeysAction};
