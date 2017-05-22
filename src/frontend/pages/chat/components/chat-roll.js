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
            position: 'relative',
            display: 'inline-block',
            left: 15,
            maxWidth: '55%',
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
            position: 'relative',
            display: 'inline-block',
            right: 15,
            maxWidth: '50%',
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
                    minHeight: 63
                }}
            >

                <table
                    style={{
                        width: '100%',
                        border: 'none',
                        borderSpacing: 0,
                        textAlign: incoming? 'left' : 'right'
                    }}
                >

                    <tr style={{height: 5}}><td></td></tr>

                    <tr>
                       <td>
                           <div style={incoming? this.incomingMessageStyle : this.outgoingMessageStyle}>
                               {content}
                           </div>
                       </td>
                    </tr>

                    <tr>
                        <td>
                            <div
                                style={{
                                    position: 'relative',
                                    marginLeft: 15,
                                    marginRight: 15,
                                    height: 14,
                                    color: '#999999',
                                    fontSize: 10,
                                    textAlign: incoming? 'left' : 'right'
                                }}
                            >
                                {moment(time).format('h:mm A')}
                            </div>
                        </td>
                    </tr>

                </table>

            </div>
        );
    }

    render() {

        return (

            <div
                style={{
                    flexGrow: 1,
                    position: 'relative',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    height: '100%'
                }}
            >
                <div
                    style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column-reverse',
                        paddingTop: 5,
                        paddingBottom: 15
                    }}
                >

                    {this.props.messages.reverse().map(this.renderChatBubble.bind(this))}

                </div>
            </div>
        );
    }

}


export {ChatRoll};
