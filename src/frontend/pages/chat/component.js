import React, {Component} from 'react';
import {render} from 'react-dom';

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
        this.state.loading = true;
    }

    async componentWillMount() {

        try {

            await window.headers.store.resources.User.login(window.params.user, window.params.password);
            this.setState({loading: false});
        } catch (err) {

            //todo: update ._.
            alert('can\'t login!');
        }
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

                <Contacts contacts={require('../../../../fixtures/contacts.json')} onSelect={logInMain}/>

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

        if (this.state.loading) {

            return this.renderLoading();
        } else {

            return this.renderChat();
        }
    }
}


function logInMain(t) {

    require('electron').remote.getGlobal('console').log(t);
}

render(<Page />, document.getElementById('root'));
