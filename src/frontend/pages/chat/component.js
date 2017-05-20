import React, {Component} from 'react';
import {render} from 'react-dom';

import {Colors} from '../../theme';
import {Sidebar} from './components/sidebar';
import {Contacts} from './components/contacts';
import {ChatRoll} from './components/chat-roll';


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

                <Contacts contacts={require('../../../../fixtures/contacts.json')}/>

                <ChatRoll messages={require('../../../../fixtures/chat.json')} />

            </div>
        )
    }
}


render(<Page />, document.getElementById('root'));
