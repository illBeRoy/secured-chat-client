import React, {Component} from 'react';
import {Colors} from '../../../theme';


/**
 * Button component which supports graceful click animation.
 */
class Button extends Component {

    static propTypes = {
        text: React.PropTypes.string,
        color: React.PropTypes.string,
        inactiveColor: React.PropTypes.string,
        enabled: React.PropTypes.bool,
        onPress: React.PropTypes.func
    };

    static defaultProps = {
        text: '',
        color: Colors.Secondary,
        inactiveColor: 'rgb(200,200,200)',
        enabled: true,
        onPress: () => {}
    };

    constructor(props) {

        super(props);
        this.state = {};
        this.state.pressed = false;
    }

    get textColor() {

        return this.props.enabled? this.props.color: this.props.inactiveColor;
    }

    get background() {

        return this.state.pressed? 'rgba(0,0,0,.05)' : 'rgba(0,0,0,0)'
    }

    get transition() {

        return this.state.pressed? '': '0.4s ease background';
    }

    onTouchStart() {

        if (this.props.enabled) {

            this.setState({pressed: true});
        }
    }

    onTouchEnd() {

        this.setState({pressed: false});
    }

    onPress(e) {

        this.props.onPress();
    }

    render() {

        return (
            <div
                style={
                    Object.assign(
                        {
                            position: 'relative',
                            width: 223,
                            height: 55,
                            lineHeight: '55px',
                            textAlign: 'center',
                            fontSize: 16,
                            overflow: 'hidden',
                            cursor: this.props.enabled? 'pointer': 'default',
                            color: this.textColor,
                            background: this.background,
                            transition: this.transition
                        },
                        this.props.style
                    )
                }
                onMouseDownCapture={this.onTouchStart.bind(this)}
                onMouseUpCapture={this.onTouchEnd.bind(this)}
                onMouseLeave={this.onTouchEnd.bind(this)}
                onClickCapture={this.onPress.bind(this)}
            >

                {this.props.text}

            </div>
        );
    }


}


export {Button};
