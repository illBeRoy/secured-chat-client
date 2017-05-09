import {Cryptography} from '../../utils/cryptography';


class Session {

    constructor({username, masterKey}) {

        this.username = username || null;
        this.masterKey = masterKey || null;
        this._cryptography = new Cryptography();
    }

    get isLoggedIn() {

        return this.username && this.masterKey;
    }

    get authKey() {

        return this._cryptography.hash(this.masterKey, 1);
    }

    get encryptionKey() {

        return this._cryptography.hash(this.masterKey, 2);
    }

    get credentials() {

        return {username: this.username, password: this.authKey};
    }

}


export {Session};
