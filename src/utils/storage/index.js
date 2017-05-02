import * as path from 'path';
import * as fs from 'fs';
import mkdirp from 'mkdirp'
import glob from 'glob';


/**
 * Persistent storage module.
 *
 * Exports a key\value persistent storage by creating a file per key.
 */
class Storage {

    /**
     * @param path {string} directory in which files shall be created
     */
    constructor(path) {

        this._path = path;
        this._ensureDirectoryExists();
    }

    /**
     * Set item.
     * @param key {string}
     * @param value {string}
     */
    setItem(key, value) {

        this._ensureDirectoryExists();
        fs.writeFileSync(this._getFileForKey(key), value);
    }

    /**
     * Get item.
     * @param key {string}
     */
    getItem(key) {

        try {

            return fs.readFileSync(this._getFileForKey(key), {encoding: 'utf8'});
        } catch (err) {

            return null;
        }
    }

    /**
     * Remove item completely.
     * @param key {string}
     */
    removeItem(key) {

        try {

            fs.unlinkSync(this._getFileForKey(key));
        } catch (err) {}
    }

    /**
     * Clear everything in storage.
     */
    clear() {

        for (let file of glob.sync(path.join(this._path, '*'))) {

            // try to remove file
            try {

                fs.unlinkSync(file);
            } catch (err) {

                // might not be file, try to remove dir
                try {

                    fs.rmdirSync(file);
                } catch (err) {}
            }
        }
    }

    _ensureDirectoryExists() {

        mkdirp.sync(this._path);
    }

    _getFileForKey(key) {

        return path.join(this._path, key);
    }

}


export {Storage};
