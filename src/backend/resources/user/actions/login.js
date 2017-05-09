import {Action} from '../../../../framework/resource';
import {User} from '../models';


/**
 * Sets credentials and attempts to login.
 */
class LoginAction extends Action {

    static __name__ = 'login';

    static classMethod = true;

    static requirements = ['utils', 'session'];

    /**
     * @param username {string}
     * @param password {string}
     * @returns {Promise.<User>}
     */
    static async onCall(username, password) {

        try {

            // set session
            this.session.username = username;
            this.session.masterKey = password;

            // try to get me
            return await User.me();
        } catch (err) {

            // could not login, cancel mutations to session
            this.session.username = null;
            this.session.masterKey = null;

            // rethrow
            throw err;
        }
    }

}


export {LoginAction};

