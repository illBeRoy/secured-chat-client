import {Action} from '../../../../framework/resource';
import {User} from '../models';


/**
 * Returns user by name.
 */
class GetByUsernameAction extends Action {

    static __name__ = 'getByUsername';

    static classMethod = true;

    static requirements = ['utils', 'session'];

    /**
     * @param username {string}
     * @returns {Promise.<User>}
     */
    static async onCall(username) {

        // first attempt to get the user from the local store
        let [user] = User.query((x) => x.username == username);

        // if couldn't, fetch from server
        if (!user) {

            user = new User(await this.utils.api.request(
                'get',
                '/users/friends',
                {params: {username}, credentials: this.session.credentials}
            ));

            user.save();
        }

        // return the requested user
        return user;
    }

}


export {GetByUsernameAction};
