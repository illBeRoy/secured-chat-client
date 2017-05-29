import React, {Component} from 'react';
import {render} from 'react-dom';

import {RepeatingTask} from '../../../utils/repeating-task';
import * as itertools from '../../../utils/itertools';

import {Colors} from '../../theme';
import {Loader} from '../shared-components/loader';
import {Sidebar} from './components/sidebar';
import {Contacts} from './components/contacts';
import {ChatRoll} from './components/chat-roll';
import {TextInput} from './components/input';


class Page extends Component {

    constructor(props) {

        super(props);
        this.state = {};
        this.state.ready = false;
        this.state.user = null;
    }

    get contactList() {

        // get all users
        let users = window.headers.store.resources.User.query((x) => x.username != this.state.user.username);

        // for each user fetch all data needed for its contact entry
        let contacts = users.map((user) => {

            // fetch all messages sent to or from said user
            let messages = window.headers.store.resources.Messages.query((x) => {

                return x.fromUser == user.username || x.toUser == user.username
            });

            // get most recent message
            let mostRecentMessage = itertools.max(messages, (a, b) => a.id - b.id);

            // return contact representation
            return {
                name: user.name,
                message: mostRecentMessage.contents,
                time: mostRecentMessage.sentAt
            }
        });

        // sort by most recent message and return
        return contacts.sort((a, b) => a.time - b.time);
    }

    componentWillMount() {

        this.sync();
    }

    async sync() {

        // sync self
        await window.headers.store.resources.User.login(window.params.user, window.params.password);

        // sync messages
        await window.headers.store.resources.Message.poll();

        // update state
        this.setState({
            ready: true,
            user: await window.headers.store.resources.User.me()
        });
    }

    renderLoading() {

        return (

            <div
                style={{
                    position: 'absolute',
                    left: '50%',
                    top: '50%',
                    marginLeft: -Loader.size / 2,
                    marginTop: -Loader.size / 2
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
                <Sidebar
                    buttons={[
                        {title: 'settings', image: '../../../../assets/cog.svg', onPress: ()=>{}}
                    ]}
                />

                <Contacts contacts={this.contactList} onSelect={logInMain}/>

                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        flexGrow: 1,
                        height: '100%'
                    }}
                >
                    <ChatRoll messages={require('../../../../fixtures/chat.json')} />
                    <TextInput onSubmit={logInMain} />
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


function logInMain(t) {

    require('electron').remote.getGlobal('console').log(t);
}

render(<Page />, document.getElementById('root'));
