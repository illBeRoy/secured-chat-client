import React, {Component} from 'react';
import {render} from 'react-dom';

import {Colors} from '../../theme';


class Page extends Component {

    render() {

        return (
            <div style={{
                position: 'absolute',
                left: 109,
                top: 0,
                width: 93,
                height: 93,
                borderRadius: '50%',
                backgroundColor: Colors.Primary
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
        );
    }
}


render(document.getElementbyId('root'), <Page />);
