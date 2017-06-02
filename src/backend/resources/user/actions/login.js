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
            let user = new User(await this.utils.api.request('get', '/users/me', {credentials: this.session.credentials}));
            user.save();

            // return
            return user;
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

