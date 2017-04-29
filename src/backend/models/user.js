import {Cryptography} from '../../utils/cryptography';
import {Model} from '../../framework/model';


let cryptography = new Cryptography();

/**
 * The User Model represents users in the system.
 */
class User extends Model {

    static fields = ['username', 'privateKey', 'publicKey', 'info'];

    static masterKey = null;
    static me = null;

    /**
     * When saving user to persistent memory, make sure to encrypt any relevant data you might have.
     */
    onSave() {

        if (User.masterKey && this.privateKey) {

            this.privateKey = cryptography.encryptSym(User.encryptionKey, this.privateKey);
        }
    }

    /**
     * When loading user from persistent memory, make sure to decrypt any relevant data you might have.
     */
    onLoad() {

        if (User.masterKey && this.privateKey) {

            this.privateKey = cryptography.decryptSym(User.encryptionKey, this.privateKey);
        }
    }

    /**
     * The server authentication key that's derived from the master key.
     * @returns {string}
     */
    static get authKey() {

        if (User.masterKey) {

            return cryptography.hash(User.masterKey, 1);
        } else {

            throw new Error('Master key not set');
        }
    }

    /**
     * The content encryption key that's derived from the master key.
     * @returns {string}
     */
    static get encryptionKey() {

        if (User.masterKey) {

            return cryptography.hash(User.masterKey, 2);
        } else {

            throw new Error('Master key not set');
        }
    }

    static get credentials() {

        return {username: User.me, password: User.authKey};
    }

    /**
     * Sets the master key.
     * @param masterKey {string}
     */
    static setMasterKey(masterKey) {

        User.masterKey = masterKey;
    }

    /**
     * Sets the logged in user's name.
     * @param username {string}
     */
    static setMe(username) {

        User.me = username;
    }

}


export {User};
