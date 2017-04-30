class Session {

    constructor({username, masterKey}, utils) {

        this.username = username || null;
        this.masterkey = masterKey | null;
        this._utils = utils;
    }

    get isLoggedIn() {

        return this.username && this.masterkey;
    }

    get authKey() {

        return this._utils.cryptography.hash(this.masterkey, 1);
    }

    get encryptionKey() {

        return this._utils.cryptography.hash(this.masterkey, 2);
    }

    get credentials() {

        return {username: this.username, password: this.authKey};
    }

}


export {Session};
