import {Model} from '../../framework/model';


/**
 * The Message Model represents messages in the system.
 */
class Message extends Model {

    static fields = [
        'from_user',
        'to_user',
        'contents',
        'sent_at'
    ];

}


export {Message};
