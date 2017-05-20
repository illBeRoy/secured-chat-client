import React, {Component} from 'react';
import moment from 'moment';

import {Colors} from '../../../theme';


class ChatRoll extends Component {

    static propTypes = {
        messages: React.PropTypes.array
    };

    static defaultProps = {
        messages: []
    };

    get incomingMessageStyle() {

        return {
            position: 'absolute',
            display: 'inline-block',
            left: 15,
            top: 0,
            maxWidth: 320,
            padding: 13,
            backgroundColor: Colors.SecondaryLight,
            borderRadius: 8,
            borderTopLeftRadius: 0,
            color: 'white',
            fontSize: 13

        };
    }

    get outgoingMessageStyle() {

        return {
            position: 'absolute',
            display: 'inline-block',
            right: 15,
            top: 0,
            maxWidth: 320,
            padding: 13,
            backgroundColor: Colors.PrimaryLight,
            borderRadius: 8,
            borderTopRightRadius: 0,
            color: 'white',
            fontSize: 13
        };
    }

    renderChatBubble({incoming, content, time}, index) {

        return (

            <div
                key={index}
                style={{
                    position: 'relative',
                    width: '100%',
                    height: 63
                }}
            >

                <div style={incoming? this.incomingMessageStyle : this.outgoingMessageStyle}>
                    {content}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        bottom: 5,
                        left: 15,
                        right: 15,
                        height: 14,
                        color: '#999999',
                        fontSize: 10,
                        textAlign: incoming? 'left' : 'right'
                    }}
                >
                    {moment(time).format('h:mm A')}
                </div>

            </div>
        );
    }

    render() {

        return (

            <div
                style={{
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    flexGrow: 1,
                    height: '100%',
                    overflowX: 'hidden',
                    overflowY: 'scroll'
                }}
            >

                {this.props.messages.reverse().map(this.renderChatBubble.bind(this))}

            </div>
        );
    }

}


export {ChatRoll};
