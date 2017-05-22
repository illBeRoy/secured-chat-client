import React, {Component} from 'react';

import {Colors} from '../../../theme';


class TextInput extends Component {

    constructor(props) {

        super(props);

        this.state = {};
        this.state.message = '';
    }

    get canSendMessage() {

        return !!(this.state.message);
    }

    setMessage(message) {

        this.setState({message: message});
    }

    render() {

        return (

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    width: '100%',
                    height: 49,
                    borderTopStyle: 'solid',
                    borderTopWidth: 1,
                    borderTopColor: '#D9D9D9',
                    background: 'white'
                }}
            >

                <input
                    type="text"
                    placeholder="Write something..."
                    onInput={(e) => {this.setMessage(e.target.value)}}
                    style={{
                        flexGrow: 1,
                        border: 'none',
                        fontSize: 13,
                        outline: 'none',
                        paddingLeft: 16,
                        paddingRight: 16
                    }}
                />

                <div
                    style={{
                        width: 56,
                        height: '100%',
                        backgroundImage: this.canSendMessage? `url(../../../../assets/blue-paper-airplane.svg)` : `url(../../../../assets/gray-paper-airplane.svg)`,
                        backgroundSize: '24px 24px',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        cursor: this.canSendMessage? 'pointer' : 'default'
                    }}
                >

                </div>

            </div>
        );
    }

}


export {TextInput};
