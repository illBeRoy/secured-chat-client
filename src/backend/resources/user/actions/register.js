import {Action} from '../../../../framework/resource';
import {User} from '../models';


class RegisterAction extends Action {

    static __name__ = 'register';

    static classMethod = true;

    static async onCall(self, username, password, encryptedPrivateKey, publicKey) {

        console.log(self.utils);
    }

}


export {RegisterAction};
