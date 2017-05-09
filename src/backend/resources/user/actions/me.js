import {Action} from '../../../../framework/resource';
import {User} from '../models';


/**
 * Returns the logged in user.
 */
class GetMeAction extends Action {

    static __name__ = 'me';

    static classMethod = true;

    static requirements = ['utils', 'session'];

    /**
     * @returns {Promise.<User>}
     */
    static async onCall() {

        // try to get user from local store
        let [user] = User.query((x) => x.username == this.session.username);

        // if couldn't, fetch from server
        if (!user) {

            user = new User(await this.utils.api.request('get', '/users/me', {credentials: this.session.credentials}));
            user.save();
        }

        // return the user
        return user;
    }

}


export {GetMeAction};
