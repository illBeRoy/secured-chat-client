import React, {Component} from 'react';
import {render} from 'react-dom';

import {Loader} from '../shared-components/loader';

import {Colors} from '../../theme';
import {Textbox} from './components/textbox';
import {Button} from './components/button';


class Page extends Component {

    constructor(props) {

        super(props);
        this.state = {};
        this.state.ready = false;
    }

    get interactable() {

        return !this.state.ready;
    }

    get headerComponent() {

        return (

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
        );
    }

    get loginButtonComponent() {

        return (

            <Button
                text="Login"
                enabled={this.interactable}
                onPress={()=>{this.setState({ready: true})}}
                style={{
                    position: 'absolute',
                    left: 44,
                    bottom: 10
                }}
            />
        );
    }

    get loaderComponent() {

        return (

            <div style={{position: 'absolute', left: 135.5, right: 135.5, bottom: 17.5}}>
                <Loader color={Colors.Secondary}/>
            </div>
        );
    }

    render() {

        return (
            <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}>

                {this.headerComponent}

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

                    <Textbox
                        placeholder="Username"
                        enabled={this.interactable}
                        style={{
                            position: 'absolute',
                            left: 44,
                            top: 67,
                            right: 44
                        }}
                    />

                    <Textbox
                        placeholder="Password"
                        type="password"
                        enabled={this.interactable}
                        style={{
                            position: 'absolute',
                            left: 44,
                            top: 121,
                            right: 44
                        }}
                    />

                    {this.state.ready? this.loaderComponent : this.loginButtonComponent}

                </div>

            </div>
        );
    }
}


render(<Page />, document.getElementById('root'));
