import React, {Component} from 'react';
import moment from 'moment';

import {Colors} from '../../../theme';


/**
 * A Chat Roll (history) component which displays conversation history from bottom to top.
 */
class ChatRoll extends Component {

    static propTypes = {
        title: React.PropTypes.string,
        messages: React.PropTypes.array
    };

    static defaultProps = {
        title: '',
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
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTopRightRadius: 8,
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
            borderBottomRightRadius: 8,
            borderBottomLeftRadius: 8,
            borderTopRightRadius: 0,
            borderTopLeftRadius: 8,
            color: 'white',
            fontSize: 13
        };
    }

    renderChatBubble({incoming, contents, time}, index) {

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
                               {contents}
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
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column-reverse',
                    paddingTop: 5,
                    paddingBottom: 15,
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    flexGrow: 1
                }}
            >

                {this.props.messages.reverse().map(this.renderChatBubble.bind(this))}

                <div
                    style={{
                        cursor: 'default',
                        color: 'rgb(150, 150, 150)',
                        fontSize: 12,
                        textAlign: 'center',
                        width: '100%'
                    }}
                >
                    {this.props.title}
                </div>

            </div>
        );
    }

}


export {ChatRoll};
