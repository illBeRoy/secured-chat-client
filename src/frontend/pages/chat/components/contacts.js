import React, {Component} from 'react';
import moment from 'moment';

import {Colors} from '../../../theme';


/**
 * Contact list component which displays a view with a list of contacts, most recent message in their respective
 * conversations, time, and accepts two operations:
 *
 * 1. Contact selection from list
 * 2. Contact search (textual)
 */
class Contacts extends Component {

    static propTypes = {
        contacts: React.PropTypes.array,
        onSelect: React.PropTypes.func,
        onSubmitForm: React.PropTypes.func,
        selected: React.PropTypes.string
    };

    static defaultProps = {
        contacts: [],
        onSelect: (name) => {},
        onSubmitForm: (name) => {},
        selected: null
    };

    constructor(props) {

        super(props);
        this.state = {};
        this.state.showOverlay = false;
    }

    get isSearchBoxEmpty() {

        return this.refs.searchBoxInput? this.refs.searchBoxInput.value == '' : true;
    }

    showOverlay() {

        this.refs.searchBoxInput.value = ''; // anti-pattern, shame on me
        this.refs.searchBoxInput.focus();
        this.setState({showOverlay: true});
    }

    hideOverlay() {

        this.setState({showOverlay: false});
    }

    renderOptionsButton() {

        return (

            <div
                style={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    width: 24,
                    height: 24,
                    backgroundImage: 'url(../../../../assets/plus.svg)',
                    backgroundPosition: 'center',
                    backgroundSize: 'contain',
                    backgroundRepeat: 'no-repeat',
                    cursor: 'pointer'
                }}
                onClickCapture={this.showOverlay.bind(this)}
            ></div>
        );
    }

    renderOverlay() {

        return (

            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: this.state.showOverlay? 'all': 'none',
                    backgroundColor: this.state.showOverlay? 'rgba(0, 0, 0, .65)': 'rgba(0, 0, 0, 0)',
                    transition: 'ease .4s',
                    overflow: 'hidden'
                }}
                onClick={this.hideOverlay.bind(this)}
            >

                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '100%',
                        height: 32,
                        border: 0,
                        borderBottom: '1px solid rgb(100, 100, 100)',
                        outline: 'none',
                        transition: 'ease .4s',
                        transform: `translate3d(0, ${this.state.showOverlay? 0: -35}px, 0)`,
                        backgroundColor: 'white',
                        backgroundImage: 'url(../../../../assets/magnifying-glass.svg)',
                        backgroundPosition: '4px center',
                        backgroundSize: '18px 18px',
                        backgroundRepeat: 'no-repeat'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <input
                        type="text"
                        style={{
                            position: 'absolute',
                            left: 30,
                            top: 0,
                            width: 'calc(100% - 30px)',
                            height: 32,
                            border: 0,
                            outline: 'none',
                            cursor: 'text',
                            fontSize: 14
                        }}
                        ref="searchBoxInput"
                        onKeyUp={(e) => {

                            if (e.keyCode == 13) {

                                this.props.onSubmitForm(e.target.value);
                                e.target.value = '';
                                this.hideOverlay();
                            }

                            // a line i'm not proud of
                            this.forceUpdate();
                        }}
                    />

                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate3d(-50%, -50%, 0)',
                        width: 64,
                        height: 64,
                        backgroundImage: 'url(../../../../assets/enter-key.svg)',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center',
                        display: this.isSearchBoxEmpty? 'none' : 'block',
                        opacity: .7
                    }}
                ></div>

            </div>
        )
    }

    renderContact({name, message, time}, index) {

        return (

            <Contact
                key={index}
                name={name}
                message={message}
                time={time}
                onPress={this.props.onSelect}
                highlighted={name == this.props.selected}
            />
        );
    }

    render() {

        return (

            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    overflowX: 'hidden',
                    overflowY: 'scroll',
                    height: '100%',
                    width: 240,
                    backgroundColor: '#F8F8F8',
                    borderRightColor: '#D9D9D9',
                    borderRightWidth: 1,
                    borderRightStyle: 'solid',
                    position: 'relative'
                }}
            >

                {this.props.contacts.map(this.renderContact.bind(this))}

                {this.renderOptionsButton()}

                {this.renderOverlay()}

            </div>
        );
    }

}


class Contact extends Component {

    static propTypes = {
        name: React.PropTypes.string,
        message: React.PropTypes.string,
        time: React.PropTypes.number,
        onPress: React.PropTypes.func,
        highlighted: React.PropTypes.boolean
    };

    static defaultProps = {
        onPress: (val) => {},
        highlighted: false
    };

    constructor(props) {

        super(props);
        this.state = {};
        this.state.hover = false;
    }

    get backgroundColor() {

        if (this.props.highlighted) {

            return 'rgba(0, 0, 0, .1)';
        } else if (this.state.hover) {

            return 'rgba(0, 0, 0, .025)';
        } else {

            return 'rgba(0, 0, 0, 0)';
        }
    }

    setHovering(isHovering) {

        this.setState({hover: isHovering});
    }

    onClick() {

        this.props.onPress(this.props.name);
    }

    render() {

        return (

            <div
                style={{
                    position: 'relative',
                    width: '100%',
                    height: 68,
                    cursor: 'default',
                    backgroundColor: this.backgroundColor
                }}
                onMouseEnter={this.setHovering.bind(this, true)}
                onMouseLeave={this.setHovering.bind(this, false)}
                onClick={this.onClick.bind(this)}
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
