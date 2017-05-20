import React, {Component} from 'react';
import moment from 'moment';

import {Colors} from '../../../theme';


class Contacts extends Component {

    static propTypes = {
        contacts: React.PropTypes.array
    };

    static defaultProps = {
        contacts: []
    };

    renderContact({name, message, time}, index) {

        return (

            <Contact key={index} name={name} message={message} time={time} />
        );
    }

    render() {

        return (

            <div
                style={{
                    position: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    height: '100%',
                    width: 240,
                    backgroundColor: '#F8F8F8',
                    borderRightColor: '#D9D9D9',
                    borderRightWidth: 1,
                    borderRightStyle: 'solid'
                }}
            >

                {this.props.contacts.map(this.renderContact.bind(this))}

            </div>
        );
    }

}


class Contact extends Component {

    static propTypes = {
        name: React.PropTypes.string,
        message: React.PropTypes.string,
        time: React.PropTypes.number
    };

    constructor(props) {

        super(props);
        this.state = {};
        this.state.hover = false;
    }

    setHovering(isHovering) {

        this.setState({hover: isHovering});
    }

    render() {

        return (

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: 68,
                    backgroundColor: this.state.hover? 'rgba(0,0,0,.025)' : 'rgba(0,0,0,0)'
                }}
                onMouseEnter={this.setHovering.bind(this, true)}
                onMouseLeave={this.setHovering.bind(this, false)}
            >
                <div
                    style={{
                        position: 'absolute',
                        left: 11,
                        top: 11,
                        width: 160,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: 14,
                        color: '#333333'
                    }}
                >
                    {this.props.name}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        right: 11,
                        top: 11,
                        width: 60,
                        textAlign: 'right',
                        fontSize: 12,
                        color: '#999999'
                    }}
                >
                    {moment(this.props.time).format('h:mm A')}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: 11,
                        bottom: 20,
                        right: 11,
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        fontSize: 13,
                        color: '#AA9999'
                    }}
                >
                    {this.props.message}
                </div>

                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        bottom: 0,
                        left: 11,
                        height: 1,
                        backgroundColor: '#EAEAEA'
                    }}
                ></div>

            </div>
        )
    }

}


export {Contacts};
