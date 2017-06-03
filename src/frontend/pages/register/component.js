import React, {Component} from 'react';
import {render} from 'react-dom';

import delay from 'delay';
import {ApplicationStore} from '../../../backend';

import {Loader} from '../shared-components/loader';


/**
 * Registration container component.
 */
class Page extends Component {

    constructor(props) {

        super(props);

        this._store = new ApplicationStore();

        this.state = {};
        this.state.status = '';
    }

    /**
     * Displays a textual status message to the user.
     * @param statusText {string}
     */
    setStatus(statusText) {

        this.setState({status: statusText});
    }

    /**
     * Upon mounting the component, does the following:
     *
     * 1. Fires off a registration request in the backend.
     * 2. Lets user know that keys are being generated.
     * 3. Waits on the request to be either accepted or rejected.
     * 4. If the request was successful, takes user to '/chat' page.
     * 5. Otherwise, lets the user know that it had failed, and takes him back to '/login' page.
     */
    async componentDidMount() {

        this.setStatus('Getting ready...');
        await delay(1000);

        let registrationPromise = this._store.resources.User.register(params.user, params.password);

        this.setStatus('Generating cryptographic keys...');
        await delay(5000);

        try {

            this.setStatus('Will be done in a moment...');
            await registrationPromise;
        } catch (err) {

            this.setStatus('Failed to register!');
            await delay(1500);

            router.navigate('/login');
            return;
        }

        this.setStatus('Done. Welcome!');
        await delay(1500);

        this._store.augmentations.utils.storage.setItem('PreviousLogin', params.user);
        router.navigate(`/chat?user=${encodeURIComponent(params.user)}&password=${encodeURIComponent(params.password)}`);
    }

    render() {

        return (

            <div
                style={{position: 'absolute', left: 0, top: 0, right: 0, bottom: 0}}
            >

                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        marginLeft: -Loader.size / 2,
                        marginTop: -Loader.size / 2,
                        background: 'rgba(255, 255, 255, .7)'
                    }}
                >
                    <Loader color="black" />
                </div>

                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        bottom: 10,
                        width: '100%',
                        textAlign: 'center',
                        fontSize: 12
                    }}
                >
                    {this.state.status}
                </div>

            </div>
        );
    }
}


render(<Page />, document.getElementById('root'));
