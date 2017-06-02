import React, {Component} from 'react';

import {Colors} from '../../../theme';


class Sidebar extends Component {

    static propTypes = {
        backgroundColor: React.PropTypes.string,
        buttonColor: React.PropTypes.string,
        buttons: React.PropTypes.array
    };

    static defaultProps = {
        backgroundColor: Colors.Primary,
        buttonColor: Colors.PrimaryDark,
        buttons: []
    };

    get buttonHeight() {

        return 57;
    }

    renderButton({title, image, onPress}, index) {

        return (

            <div
                key={index}
                onClick={onPress}
                style={{
                    position: 'absolute',
                    left: 0,
                    width: '100%',
                    height: this.buttonHeight,
                    bottom: this.buttonHeight * index,
                    backgroundColor: this.props.buttonColor,
                    cursor: 'pointer'
                }}
            >
                <div style={{
                    position: 'absolute',
                    left: 9,
                    top: 10,
                    right: 9,
                    bottom: 10,
                    backgroundImage: `url(${image})`,
                    backgroundPosition: 'center',
                    backgroundSize: '32px 32px',
                    backgroundRepeat: 'no-repeat'
                }}></div>
            </div>
        );
    }

    render() {

        return (

            <div style={{
                position: 'relative',
                height: '100%',
                width: 76,
                webkitAppRegion: 'drag',
                backgroundColor: this.props.backgroundColor
            }}>

                {this.props.buttons.map(this.renderButton.bind(this))}

            </div>
        )
    }

}


export {Sidebar};
