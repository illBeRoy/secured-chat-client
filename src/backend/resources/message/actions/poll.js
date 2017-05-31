import {Action} from '../../../../framework/resource';
import {Message} from '../models';
import {User} from '../../user/models';


/**
 * Polls all pending messages from server
 */
class PollAction extends Action {

    static __name__ = 'poll';

    static classMethod = true;

    static requirements = ['utils', 'session'];

    /**
     * @param clearHistory {bool} if true, will remove downloaded messages from server (optional)
     * @returns {Promise.<bool>} whether or not new messages were fetched
     */
    static async onCall(clearHistory=true) {

        let {queryTime, messages} = await this.utils.api.request('get', '/messages', {credentials: this.session.credentials});

        // get myself
        let me = await User.me();

        // handle all message parsing in parallel
        messages = await Promise.all(messages.map(async (message) => {

            try {

                // create message instance
                message = new Message(message);

                // fetch message sender
                let sender = await User.getByUsername(message.fromUser);

                // fetch required asym keys
                let {publicKey} = sender.keys();
                let {privateKey} = me.keys();

                // decrypt message
                message.contents = this.utils.cryptography.decryptAsym(privateKey, publicKey, message.contents);

                // adjust timestamp to match that of javascript (ms instead of seconds)
                message.sentAt *= 1000;

                // save
                message.save();

                // return
                return message;
            } catch (err) {

                console.log(err);
                return null;
            }

        }));

        // now clear history if needed
        if (clearHistory && messages.length > 0) {

            await this.utils.api.request(
                'delete',
                '/messages',
                {
                    credentials: this.session.credentials,
                    params: {until: queryTime}
                }
            );
        }

        // by calculating how many new messages were fetched, we can tell whether or not there were any
        return messages.filter((x) => x !== null).length > 0;
    }

}


export {PollAction};

