import React, {Component} from 'react';
import {render} from 'react-dom';

import {Colors} from '../../theme';
import {Textbox} from './components/textbox';


class Page extends Component {

    render() {

        return (
            <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>

                <div style={{
                    position: 'absolute',
                    left: 109,
                    top: 0,
                    width: 93,
                    height: 93,
                    borderRadius: '50%',
                    backgroundColor: Colors.Primary,
                    zIndex: 2
                }}>
                    <img
                        src="../../../../assets/profile.svg"
                        style={{
                            position: 'absolute',
                            left: 6,
                            top: 6,
                            right: 6,
                            bottom: 6
                        }}
                    />
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        right: 0,
                        bottom: 0,
                        top: 46,
                        background: 'white',
                        borderRadius: 8,
                        zIndex: 1
                    }}
                >

                    <Textbox placeholder="Username"/>

                </div>

            </div>
        );
    }
}


render(<Page />, document.getElementById('root'));
