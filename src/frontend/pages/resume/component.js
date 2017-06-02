import React, {Component} from 'react';
import {render} from 'react-dom';

import {ApplicationStore} from '../../../backend';

import {Textbox} from '../shared-components/textbox';
import {Button} from '../shared-components/button';
import {Loader} from '../shared-components/loader';

import {Colors} from '../../theme';


class Page extends Component {

    constructor(props) {

        super(props);

        this._store = new ApplicationStore();

        this.state = {};
        this.state.loading = false;
        this.state.password = '';
        this.state.alert = '';
    }

    get isFormReady() {

        return !!(this.state.password)
    }

    setPassword(password) {

        this.setState({password: password});
    }

    setAlert(alert) {

        this.setState({alert: alert});
    }

    setLoading(loading) {

        this.setState({loading: loading});
    }

    async login() {

        this.setLoading(true);

        try {

            let user = await this._store.resources.User.login(params.user, this.state.password);
            router.navigate(`/chat?user=${encodeURIComponent(params.user)}&password=${encodeURIComponent(this.state.password)}`);
        } catch (err) {

            this.setAlert('Could not log in.');
        }

        this.setLoading(false);
    }

    async logout() {

        this._store.clear();
        router.navigate('/login');
    }

    renderButtons() {

        return (

            <div>

                <Button
                    text="Resume"
                    color="#FC6746"
                    enabled={this.isFormReady}
                    onPress={this.login.bind(this)}
                    style={{
                        position: 'absolute',
                        right: 44,
                        bottom: 10,
                        left: 44
                    }}
                />

                <div
                    style={{
                        position: 'absolute',
                        left: 12,
                        bottom: 10,
                        height: 55,
                        width: 24,
                        backgroundImage: 'url(../../../../assets/door-arrow.svg)',
                        backgroundPosition: 'center',
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        cursor: 'pointer',
                        pointerEvents: this.state.loading? 'none' : 'all'
                    }}
                    onClick={this.logout.bind(this)}
                >

                </div>

            </div>
        )
    }

    renderLoader() {

        return (

            <div style={{position: 'absolute', left: 135.5, right: 135.5, bottom: 17.5}}>
                <Loader color={Colors.Secondary}/>
            </div>
        )
    }

    render() {

        return (

            <div style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0, backgroundColor: '#292929'}}>

                <div
                    style={{
                        position: 'absolute',
                        left: 44,
                        right: 44,
                        top: 23,
                        fontSize: 13,
                        color: 'white'
                    }}
                >
                    {this.state.alert || `Welcome back, ${params.user}!`}
                </div>

                <Textbox
                    type="password"
                    placeholder="Password"
                    color="white"
                    inactiveColor="#8D8D8D"
                    onChange={this.setPassword.bind(this)}
                    style={{
                        position: 'absolute',
                        left: 44,
                        right: 44,
                        top: 72
                    }}
                />

                {this.state.loading? this.renderLoader() : this.renderButtons()}

            </div>
        );
    }
}


render(<Page />, document.getElementById('root'));
