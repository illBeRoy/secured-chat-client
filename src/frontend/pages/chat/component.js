import React, {Component} from 'react';
import {render} from 'react-dom';

import {ApplicationStore} from '../../../backend';
import {RepeatingTask} from '../../../utils/repeating-task';
import * as itertools from '../../../utils/itertools';
import * as functools from '../../../utils/functools';

import {Colors} from '../../theme';
import {Loader} from '../shared-components/loader';
import {Sidebar} from './components/sidebar';
import {Contacts} from './components/contacts';
import {ChatRoll} from './components/chat-roll';
import {TextInput} from './components/input';
import {Alert} from './components/alert';


/**
 * Chat Container Component.
 */
class Page extends Component {

    constructor(props) {

        super(props);

        this._store = new ApplicationStore();
        this._syncTask = null;

        this.state = {};
        this.state.ready = false;
        this.state.interactable = true;
        this.state.me = null;
        this.state.contact = null;
        this.state.alert = '';
    }

    /**
     * Generates the contact list from cached User instances with whom the user has conversations.
     *
     * In depth, after fetching the list of cached users, it then filters out those with whom you have no message
     * history (there are multiple reasons why one would have them cached otherwise). When done, it generates a list
     * of contacts which includes their name, the latest message in the conversation, and the time on which it was sent.
     *
     * @returns {Array.<{name:string, message:string, time:number}>}
     */
    get contactList() {

        // get all users
        let users = this._store.resources.User.query((x) => x.username != this.state.me.username);

        // for each user fetch all data needed for its contact entry
        let contacts = users.map((user) => {

            // fetch all messages sent to or from said user
            let messages = this._store.resources.Message.query((x) => {

                return x.fromUser == user.username || x.toUser == user.username
            });

            // if no messages, return null
            if (messages.length == 0) {

                return null;
            }

            // get most recent message
            let mostRecentMessage = itertools.max(messages, (a, b) => a.sentAt - b.sentAt);

            // return contact representation
            return {
                name: user.username,
                message: mostRecentMessage.contents,
                time: mostRecentMessage.sentAt
            }
        });

        // sort by most recent message and return
        return contacts.filter((x) => x != null).sort((a, b) => b.time - a.time);
    }

    /**
     * Make the view interactable to the user.
     */
    enableInteraction() {

        this.setState({interactable: true})
    }

    /**
     * Make the view not-interactable to the user.
     */
    disableInteraction() {

        this.setState({interactable: false});
    }

    /**
     * Pops an alert window with the given text.
     * @param text {string}
     */
    showAlert(text) {

        this.setState({alert: text});
    }

    /**
     * Hides the alert window.
     */
    hideAlert() {

        this.setState({alert: ''});
    }

    /**
     * Performs full sync against the server and re-renders the view if needed.
     */
    async sync() {

        try {

            // sync messages
            let hasNewData = await this._store.resources.Message.poll();

            // if new data arrived, re-render
            if (hasNewData) {

                this.forceUpdate();
            }
        } catch (err) {

            // in case of an error, display it in the alert window
            this.showAlert(err.message);
        }
    }

    /**
     * Select a contact to hold the conversation with.
     * @param contactName {string}
     */
    selectContact(contactName) {

        if (contactName != this.state.me.username) {

            this.setState({contact: contactName});
        } else {

            this.showAlert('Cannot chat with self');
            throw new Error('Cannot chat with self');
        }
    }

    /**
     * Search a contact by name,
     * @param contactName
     */
    async searchContact(contactName) {

        this.disableInteraction();

        try {

            let user = await this._store.resources.User.getByUsername(contactName);
            this.enableInteraction();
            return user.username;
        } catch (err) {

            this.showAlert(`Could not find user ${contactName}`);
            throw err;
        }
    }

    /**
     * Gets message history for a given contact, ordered chronologically.
     * @param contactName {string}
     * @returns {[{incoming: boolean, contents: string, time: number}]}
     */
    getConversationForContact(contactName) {

        // fetch all messages sent to or from said user
        let messages = this._store.resources.Message.query((x) => {

            return x.fromUser == contactName|| x.toUser == contactName
        });

        // return messages in ascending order
        return messages.sort((a, b) => a.sentAt - b.sentAt).map((message) => {

            return {
                incoming: message.toUser == this.state.me.username,
                contents: message.contents,
                time: message.sentAt
            }
        });
    }

    /**
     * Sends message to given contact.
     *
     * The invariant is that this function can only be called one at a time - that's why the interface is locked to
     * the user once it is invoked, and control is restored once the message was successfully sent.
     *
     * @param contactName
     * @param message
     * @returns {Promise.<void>}
     */
    async sendMessage(contactName, message) {

        this.disableInteraction();

        try {

            let user = await this._store.resources.User.getByUsername(contactName);

            await user.sendMessage(message);
        } catch (err) {

            this.showAlert(err.message);
        }

        this.enableInteraction();

        this.forceUpdate();
    }

    /**
     * Logs out the current user and transfers to login page.
     */
    logout() {

        this._store.clear();
        router.navigate('/login');
    }

    /**
     * Upon mounting the component, does the following:
     *
     * 1. identifies self against server
     * 2. syncs once
     * 3. selects the contact with whom the most recent conversation was held (if exists)
     * 4. sets the component state to ready
     * 5. starts the repeating sync task
     */
    async componentWillMount() {

        // identify against server
        await this._store.resources.User.login(params.user, params.password);

        // assign me
        this.setState({me: await this._store.resources.User.me()});

        // sync one time
        await this.sync();

        // select most recent contact, if there is
        if (this.contactList.length > 0) {

            this.selectContact(this.contactList[0].name);
        }

        // let user know that we're ready
        this.setState({ready: true});

        // start the syncing task
        this._syncTask = new RepeatingTask(this.sync.bind(this));
        this._syncTask.start(5000, false);
    }

    /**
     * Upon dismount, stops the repeating sync task.
     */
    componentWillUnmount() {

        this._syncTask.stop();
    }

    /**
     * Renders the loading state of the page.
     * @returns {XML}
     */
    renderLoading() {

        return (

            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: -Loader.size / 2,
                    marginTop: -Loader.size / 2,
                    background: 'rgba(255, 255, 255, .7)'
                }}
            >
                <Loader color={Colors.Primary} />
            </div>
        )
    }

    /**
     * Renders the active state of the page (full chat ui).
     * @returns {XML}
     */
    renderChat() {

        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}
            >

                <Alert
                    visible={!!(this.state.alert)}
                    text={this.state.alert}
                    onClick={this.hideAlert.bind(this)}
                />

                <Sidebar
                    buttons={[
                        {title: 'logout', image: '../../../../assets/door-arrow.svg', onPress: this.logout.bind(this)}
                    ]}
                />

                <Contacts
                    contacts={this.contactList}
                    selected={this.state.contact}
                    onSelect={this.selectContact.bind(this)}
                    onSubmitForm={functools.chain(this.searchContact.bind(this), this.selectContact.bind(this))}
                />

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        height: '100%'
                    }}
                >

                    <ChatRoll
                        title={this.state.contact? `Chat with ${this.state.contact}` : ''}
                        messages={this.state.contact? this.getConversationForContact(this.state.contact) : []}
                    />

                    <TextInput
                        enabled={!!(this.state.contact)}
                        busy={!this.state.interactable}
                        onSubmit={this.sendMessage.bind(this, this.state.contact)}
                    />

                </div>

            </div>
        )
    }

    render() {

        if (this.state.ready) {

            return this.renderChat();
        } else {

            return this.renderLoading();
        }
    }

}


render(<Page />, document.getElementById('root'));
