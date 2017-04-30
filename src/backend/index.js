import {ApiClient} from '../utils/api-client';
import {Cryptography} from '../utils/cryptography';
import {User, Message} from './models';
import {Store} from '../framework/store';


class Application {

    /**
     * @param username {string} name of the logged in user
     * @param masterKey {string} master key used for deriving auth and encryption keys
     */
    constructor({username, masterKey}) {

        if (!username || !masterKey) {

            throw new Error('Cannot start application without credentials.');
        }

        this._username = username;
        this._masterKey = masterKey;

        this._api = new ApiClient(); // todo: accept api url from configuration
        this._cryptography = new Cryptography();
        this._store = new Store([User, Message]);
    }

    /**
     * Get the necessary credentials for api requests.
     * @returns {object} credentials for use with apiClient
     */
    get credentials() {

        return {
            username: username,
            password: this.authKey
        };
    }

    /**
     * Get the derivation of the masterKey used for authentication.
     * @returns {string}
     */
    get authKey() {

        return this._cryptography.hash(this._masterKey, 1);
    }

    /**
     * Get the derivation of the masterKey used for encryption.
     * @returns {string}
     */
    get encryptionKey() {

        return this._cryptography.hash(this._masterKey, 2);
    }

    async getMe() {

        return await this.getUser(this._username);
    }

    async getUser(username) {

        // attempt to get user from local db
        let [user] = User.query((user) => user.username == username);

        // if doesn't exist, get from server
        if (!user) {

            let user = new User(await this._api.request('get', '/users/me', {credentials: this.credentials}));
            user.save();
        }

        // return user
        return user;
    }

    async getIncomingMessagse(clearServerCache=true) {

        let {query_time, messages} = await this._api.request('get', '/messages', {credentials: this.credentials});
        messages = messages.map((x) => new Message(x));

        for (let message of messages) {

            message.save();
        }

        if (clearServerCache) {

            await this._api.request(
                'delete',
                '/messages',
                {params: {until: query_time}, credentials: this.credentials}
            );
        }
    }

    async sendMessage(recipientName, message) {}

    /**
     * Creates the necessary configuration from the given parameters.
     * @param username {string} name of the logged in user
     * @param masterKey {string} master key used for deriving auth and encryption keys
     * @returns {{username: string, masterKey: string}}
     */
    static createConfiguration(username, masterKey) {

        return {username, masterKey};
    }

}


export {Application};
