import functools from '../utils/functools';

import {Store} from '../framework/store';

import {ApiClient} from '../utils/api-client';
import {Cryptography} from '../utils/cryptography';

import {Session} from './session';


class ApplicationStore extends Store {

    constructor(config, ...args) {

        super(...args);

        // save config
        this._config = config;

        // create utils
        this._api = new ApiClient();
        this._cryptography = new Cryptography();

        // create session
        this._session = this.createSession();
    }

    get builtinAugmentations() {

        return Object.assign({}, super.builtinAugmentations, {utils: this.utils, session: this.session});
    }

    get utils() {

        return {
            api: this._api,
            cryptography: this._cryptography,
            localStorage: this._localStorage
        }
    }

    get session() {

        return {
            username: null,
            masterKey: null
        };
    }

    createSession() {

        // create session from localStorage or fallback to empty state.
        let session;
        try {

            session = Session(JSON.parse(this._localStorage.getItem('_session') || '{}'), this.utils);
        } catch (err) {

            session = Session({}, this.utils);
        }

        // assign the save function
        assign(session, 'save', functools.partial(this.saveSession.bind(this), session));

        // return session
        return session;
    }

    saveSession(session) {

        try {

            this._localStorage.setItem('_session', JSON.stringify(session));
        } finally {}
    }


}


export {ApplicationStore};
