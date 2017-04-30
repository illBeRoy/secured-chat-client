import {Action} from '../../../../framework/resource';
import {User} from '../models';


class RegisterAction extends Action {

    static __name__ = 'register';

    static classMethod = true;

    static async onCall(cls, username, password) {

        return await User.utils.api.request('get', '/users');
    }

}


export {RegisterAction};
