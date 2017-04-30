import {Action} from '../../../../framework/resource';


class RegisterAction extends Action {

    static __name__ = 'register';

    static classMethod = true;

    static async onCall(cls, username, password) {

        console.log(cls, username, password);
    }

}


export {RegisterAction};
