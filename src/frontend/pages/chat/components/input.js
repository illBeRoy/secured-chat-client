import React, {Component} from 'react';

import {Colors} from '../../../theme';


class TextInput extends Component {

    static propTypes = {
        onSubmit: React.PropTypes.func,
        enabled: React.PropTypes.bool
    };

    static defaultProps = {
        onSubmit: (val) => {},
        enabled: true
    };

    constructor(props) {

        super(props);

        this.state = {};
        this.state.message = '';
    }

    get canSendMessage() {

        return !!(this.state.message) && this.props.enabled;
    }

    submit() {

        if (this.canSendMessage) {

            this.props.onSubmit(this.state.message);
            this.setMessage('');
        }
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
                    value={this.state.message}
                    style={{
                        flexGrow: 1,
                        border: 'none',
                        fontSize: 13,
                        outline: 'none',
                        paddingLeft: 16,
                        paddingRight: 16
                    }}
                    onKeyDown={(e) => {if (e.keyCode == 13) this.submit()}}
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
                    onClick={this.submit.bind(this)}
                >

                </div>

            </div>
        );
    }

}


export {TextInput};
