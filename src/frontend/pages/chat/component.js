import React, {Component} from 'react';
import {render} from 'react-dom';

import {Colors} from '../../theme';
import {Sidebar} from './components/sidebar';
import {Contacts} from './components/contacts';
import {ChatRoll} from './components/chat-roll';
import {TextInput} from './components/input';


class Page extends Component {

    constructor(props) {

        super(props);
        this.state = {};
        this.state.loading = false;
    }

    render() {

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
}


function logInMain(t) {

    require('electron').remote.getGlobal('console').log(t);
}

render(<Page />, document.getElementById('root'));
