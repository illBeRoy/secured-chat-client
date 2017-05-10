import path from 'path';
import ScriptWindow from 'electron-script-window';


class Router {

    /**
     * The initial path to use when initializing the router.
     * @type {string}
     */
    static initialPath = '/';

    /**
     * The pages to use with the router.
     * @type {[Page]}
     */
    static pages = [];

    /**
     * Persistent parameters which are passed to all pages on initialization.
     * @type {object}
     */
    static headers = {};

    constructor() {

        this._pages = {};
        this._stack = [];

        for (let page of this.constructor.pages) {

            this._pages[page.path] = page;
        }

        this.navigate(this.constructor.initialPath);
    }

    /**
     * Navigates to
     * @param path
     */
    navigate(path) {}

    back() {}

    close() {}

}
