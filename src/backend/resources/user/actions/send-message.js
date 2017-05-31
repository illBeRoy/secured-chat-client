import {Action} from '../../../../framework/resource';
import {User} from '../models';
import {Message} from '../../message/models';


/**
 * Send a message to the given user.
 */
class SendMessageAction extends Action {

    static __name__ = 'sendMessage';

    static requirements = ['utils', 'session'];

    /**
     * @param message {string}
     * @returns {Promise.<Message>}
     */
    static async onCall(message) {

        // get me
        let me = await User.me();

        // prepare encrypted payload
        let encryptedMessage = this.utils.cryptography.encryptAsym(
            this.keys().publicKey,
            me.keys().privateKey,
            message
        );

        // send message
        let sentMessage = new Message(await this.utils.api.request(
            'post',
            '/messages',
            {
                credentials: this.session.credentials,
                body: {
                    recipient: this.username,
                    contents: encryptedMessage
                }
            }
        ));

        // now override the message's payload with the decrypted one
        sentMessage.contents = message;

        // and adjust its timestamp
        sentMessage.sentAt *= 1000;

        // save it
        sentMessage.save();

        // return the created message
        return sentMessage;
    }

}


export {SendMessageAction};
