import {Cryptography} from '../../utils/cryptography';


class Session {

    constructor({username, masterKey}) {

        this.username = username || null;
        this.masterkey = masterKey | null;
        this._cryptography = new Cryptography();
    }

    get isLoggedIn() {

        return this.username && this.masterkey;
    }

    get authKey() {

        return this._cryptography.hash(this.masterkey, 1);
    }

    get encryptionKey() {

        return this._cryptography.hash(this.masterkey, 2);
    }

    get credentials() {

        return {username: this.username, password: this.authKey};
    }

    static getSession() {


    }

}


export {Session};
