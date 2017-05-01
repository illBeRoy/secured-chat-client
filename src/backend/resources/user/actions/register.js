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
     * @param password {string}
     * @param privateKey {string}
     * @param publicKey {string}
     * @returns {Promise.<User>}
     */
    static async onCall(username, password, privateKey, publicKey) {

        // encrypt private key
        privateKey = this.utils.cryptography.encryptSym(this.session.encryptionKey, privateKey);

        // attempt to register user
        let user = new User(await this.utils.api.request(
            'post',
            '/user',
            {body: {username, password, privateKey, publicKey}}
        ));

        // if succeeded, update session and save into store
        this.session.username = user.username;
        user.save();

        // return the created user
        return user;
    }

}


export {RegisterAction};
