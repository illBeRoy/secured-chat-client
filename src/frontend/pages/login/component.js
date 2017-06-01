import React, {Component} from 'react';
import {render} from 'react-dom';

import {ApplicationStore} from '../../../backend';

import {Loader} from '../shared-components/loader';

import {Colors} from '../../theme';
import {Textbox} from './components/textbox';
import {Button} from './components/button';


class Page extends Component {

    constructor(props) {

        super(props);

        this._store = new ApplicationStore();

        this.state = {};
        this.state.ready = false;
        this.state.username = '';
        this.state.password = '';
        this.state.alert = '';
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

        return [

            <Button
                text="Login"
                enabled={this.interactable}
                onPress={this.login.bind(this)}
                style={{
                    position: 'absolute',
                    right: 44,
                    bottom: 10,
                    width: 101
                }}
            />,
            <Button
                text="Register"
                color={Colors.Primary}
                enabled={this.interactable}
                onPress={this.register.bind(this)}
                style={{
                    position: 'absolute',
                    left: 44,
                    bottom: 10,
                    width: 101
                }}
            />
        ]
    }

    get loaderComponent() {

        return (

            <div style={{position: 'absolute', left: 135.5, right: 135.5, bottom: 17.5}}>
                <Loader color={Colors.Secondary}/>
            </div>
        );
    }

    get alertComponent() {

        return (

            <div
                style={{
                    position: 'absolute',
                    left: 0,
                    top: 95,
                    right: 0,
                    height: 12,
                    fontSize: 12,
                    textAlign: 'center',
                    zIndex: 5
                }}
            >
                {this.state.alert}
            </div>
        );
    }

    setUsername(username) {

        this.setState({username: username});
    }

    setPassword(password) {

        this.setState({password: password});
    }

    register() {

        this._store.clear();
        router.navigate(`/register?user=${decodeURIComponent(this.state.username)}&password=${decodeURIComponent(this.state.password)}`);
    }

    async login() {

        this.setState({ready: true, alert: ''});

        this._store.clear();

        try {

            let user = await this._store.resources.User.login(this.state.username, this.state.password);
            router.navigate(`/chat?user=${decodeURIComponent(this.state.username)}&password=${decodeURIComponent(this.state.password)}`);
        } catch (err) {

            this.setState({ready: false, alert: 'Cannot log in'});
        }
    }

    register() {

        router.navigate(`/register?user=${decodeURIComponent(this.state.username)}&password=${decodeURIComponent(this.state.password)}`);
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
                        onChange={this.setUsername.bind(this)}
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
                        onChange={this.setPassword.bind(this)}
                        style={{
                            position: 'absolute',
                            left: 44,
                            top: 121,
                            right: 44
                        }}
                    />

                    {this.state.ready? this.loaderComponent : this.loginButtonComponent}

                </div>

                {this.alertComponent}

            </div>
        );
    }
}


render(<Page />, document.getElementById('root'));
