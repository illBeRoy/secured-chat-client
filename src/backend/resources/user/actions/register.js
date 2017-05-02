import {Action} from '../../../../framework/resource';
import {User} from '../models';


/**
 * Registers and returns the user.
 */
class RegisterAction extends Action {

    static __name__ = 'register';

    static classMethod = true;

    static requirements = ['utils', 'session'];

    /**
     * @param username {string}
     * @returns {Promise.<User>}
     */
    static async onCall(username) {

        // fetch password from session
        let password = this.session.authKey;

        // generate key pair
        let keyPair = await this.utils.cryptography.generateKeyPair();
        let {privateKey, publicKey} = this.utils.cryptography.exportKeys(keyPair);

        // encrypt private key
        privateKey = this.utils.cryptography.encryptSym(this.session.encryptionKey, privateKey);

        // attempt to register user
        let user = new User(await this.utils.api.request(
            'post',
            '/users',
            {
                body: {
                    username: username,
                    password: password,
                    private_key: privateKey,
                    public_key: publicKey
                }
            }
        ));

        // if succeeded, update session and save into store
        this.session.username = user.username;
        user.save();

        // return the created user
        return user;
    }

}


export {RegisterAction};
