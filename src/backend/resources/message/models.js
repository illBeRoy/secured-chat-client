import {Model} from '../../../framework/resource';


/**
 * The Message Model represents messages in the system.
 */
class Message extends Model {

    static fields = [
        'fromUser',
        'toUser',
        'contents',
        'sentAt'
    ];

}


export {Message};
