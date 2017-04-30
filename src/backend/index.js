import {ApiClient} from '../utils/api-client';
import {Cryptography} from '../utils/cryptography';


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

    async getMe() {}
    async getUser(username) {}
    async getIncomingMessagse() {}
    async sendMessage(recipientName, message) {}
    async _sendAuthenticatedRequest(method, url, )

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
