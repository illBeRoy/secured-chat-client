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

            privateKey = this.utils.cryptography.decryptSym(this.session.encryptionKey, this.privateKey);
        }

        // return keys
        return this.utils.cryptography.importKeys({publicKey, privateKey});
    }

}


export {KeysAction};
