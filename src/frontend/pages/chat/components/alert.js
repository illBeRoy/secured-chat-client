import React, {Component} from 'react';

import {Colors} from '../../../theme';


/**
 * An Alert component which displays a disposable message at the top right area of its container.
 */
class Alert extends Component {

    static propTypes = {
        text: React.PropTypes.string,
        visible: React.PropTypes.boolean,
        color: React.PropTypes.string,
        onClick: React.PropTypes.func
    };

    static defaultProps = {
        text: '',
        visible: false,
        color: Colors.Secondary,
        onClick: () => {}
    };

    render() {

        return (

            <div
                style={{
                    position: 'absolute',
                    right: 10,
                    top: 10,
                    height: 18,
                    display: this.props.visible? 'inline-block' : 'none',
                    flexDirection: 'row',
                    backgroundColor: this.props.color,
                    borderRadius: 8,
                    padding: 16,
                    color: 'white',
                    fontSize: 13,
                    cursor: 'pointer',
                    zIndex: 10
                }}
                onClick={this.props.onClick}
            >

                <img
                    src="../../../../assets/x.svg"
                    style={{
                        width: 18,
                        height: 18,
                        marginRight: 8,
                        cursor: 'pointer'
                    }}
                />

                <span style={{position: 'relative', bottom: 4, cursor: 'pointer'}}>{this.props.text}</span>

            </div>
        );
    }

}


export {Alert};
