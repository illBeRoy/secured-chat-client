import * as path from 'path';
import * as fs from 'fs';
import mkdirp from 'mkdirp'


class Storage {

    constructor(path) {

        this._path = path;
        this._ensureDirectoryExists();
    }

    setItem(key, value) {

        fs.writeFileSync(this._getFileForKey(key), value);
    }

    getItem(key) {

        try {

            return fs.readFileSync(this._getFileForKey(key), {encoding: 'utf8'});
        } catch (err) {

            return null;
        }
    }

    clearItem(key) {

        try {

            fs.unlinkSync(this._getFileForKey(key));
        } catch (err) {}
    }

    _ensureDirectoryExists() {

        mkdirp.sync(this._path);
    }

    _getFileForKey(key) {

        return path.join(this._path, key);
    }

}


export {Storage};
