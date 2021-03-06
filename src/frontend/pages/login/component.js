import React, {Component} from 'react';
import {render} from 'react-dom';

import {ApplicationStore} from '../../../backend';

import {Loader} from '../shared-components/loader';
import {Textbox} from '../shared-components/textbox';
import {Button} from '../shared-components/button';

import {Colors} from '../../theme';


/**
 * Login Container Component.
 */
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

    /**
     * Whether the view is currently interactable to user.
     * @returns {boolean}
     */
    get interactable() {

        return !this.state.ready;
    }

    /**
     * XML for header component.
     * @returns {XML}
     */
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

    /**
     * XML for Login and Register buttons.
     * @returns {[XML,XML]}
     */
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
                enabled={this.interactable && this.state.username.length >= 3 && this.state.password.length >= 3}
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

    /**
     * XML for loader component.
     * @returns {XML}
     */
    get loaderComponent() {

        return (

            <div style={{position: 'absolute', left: 135.5, right: 135.5, bottom: 17.5}}>
                <Loader color={Colors.Secondary}/>
            </div>
        );
    }

    /**
     * XML for alert component.
     * @returns {XML}
     */
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

    /**
     * Sets the username.
     * @param username {string}
     */
    setUsername(username) {

        this.setState({username: username});
    }

    /**
     * Sets the password.
     * @param password {string}
     */
    setPassword(password) {

        this.setState({password: password});
    }

    /**
     * Initiates registration process by submitting the current username and password to the registration page.
     */
    register() {

        this._store.clear();
        router.navigate(`/register?user=${encodeURIComponent(this.state.username)}&password=${encodeURIComponent(this.state.password)}`);
    }

    /**
     * Attempts to log in with the given username and password.
     *
     * If failed, shows alert.
     */
    async login() {

        this.setState({ready: true, alert: ''});

        this._store.clear();

        try {

            let user = await this._store.resources.User.login(this.state.username, this.state.password);
            this._store.augmentations.utils.storage.setItem('PreviousLogin', user.username);
            router.navigate(`/chat?user=${encodeURIComponent(this.state.username)}&password=${encodeURIComponent(this.state.password)}`);
        } catch (err) {

            this.setState({ready: false, alert: 'Cannot log in'});
        }
    }

    /**
     * Upon mounting the component, attempts to find out whether the user is already logged in. If they are, routes
     * them automatically to the "resume session" page.
     */
    componentWillMount() {

        if (this._store.augmentations.utils.storage.getItem('PreviousLogin')) {

            router.navigate(`/resume?user=${encodeURIComponent(this._store.augmentations.utils.storage.getItem('PreviousLogin'))}`)
        }
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
