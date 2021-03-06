import {Model} from '../../../framework/resource';


/**
 * The User Model represents users in the system.
 */
class User extends Model {

    static fields = [
        'username',
        'privateKey',
        'publicKey',
        'info'
    ];

}


export {User};
