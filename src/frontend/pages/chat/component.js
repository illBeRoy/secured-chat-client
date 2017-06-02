import React, {Component} from 'react';
import {render} from 'react-dom';

import {ApplicationStore} from '../../../backend';
import {RepeatingTask} from '../../../utils/repeating-task';
import * as itertools from '../../../utils/itertools';

import {Colors} from '../../theme';
import {Loader} from '../shared-components/loader';
import {Sidebar} from './components/sidebar';
import {Contacts} from './components/contacts';
import {ChatRoll} from './components/chat-roll';
import {TextInput} from './components/input';
import {Alert} from './components/alert';


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

    async componentWillMount() {

        // sync one time
        await this.sync();

        // select most recent contact, if there is
        if (this.contactList.length > 0) {

            this.selectContact(this.contactList[0].name);
        }

        this.setState({ready: true});

        this._syncTask = new RepeatingTask(this.sync.bind(this));
        this._syncTask.start(5000, false);
    }

    componentWillUnmount() {

        this._syncTask.stop();
    }

    enableInteraction() {

        this.setState({interactable: true})
    }

    disableInteraction() {

        this.setState({interactable: false});
    }

    showAlert(text) {

        this.setState({alert: text});
    }

    hideAlert() {

        this.setState({alert: ''});
    }

    async sync() {

        // sync self
        await this._store.resources.User.login(window.params.user, window.params.password);

        // sync messages
        await this._store.resources.Message.poll();

        // update state
        this.setState({
            me: await this._store.resources.User.me()
        });
    }

    selectContact(contactName) {

        if (contactName != this.state.me.username) {

            this.setState({contact: contactName});
        } else {

            this.showAlert('Cannot chat with self');
        }
    }

    async searchContact(contactName) {

        this.disableInteraction();

        try {

            let user = await this._store.resources.User.getByUsername(contactName);
            this.selectContact(user.username);
        } catch (err) {

            this.showAlert(`Could not find user ${contactName}`);
        }

        this.enableInteraction();
    }

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

    async sendMessage(contactName, message) {

        this.disableInteraction();

        let user = await this._store.resources.User.getByUsername(contactName);

        await user.sendMessage(message);

        this.enableInteraction();

        this.forceUpdate();
    }

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
                        {title: 'settings', image: '../../../../assets/cog.svg', onPress: ()=>{}}
                    ]}
                />

                <Contacts
                    contacts={this.contactList}
                    selected={this.state.contact}
                    onSelect={this.selectContact.bind(this)}
                    onSubmitForm={this.searchContact.bind(this)}
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
