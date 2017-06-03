import URL from 'url';
import ScriptWindow from 'electron-script-window';
import {debug} from '../../utils/debug';


/**
 * The Router class manages a global routing stack, spanning over multiple windows and supporting dynamic argument
 * passing.
 *
 * Windows are represented as "Pages" (@see Page class), and each page has the global router injected as a
 * variable in its own scope, along with "headers" (objects which are always injected to pages) and "params" (values
 * passed to pages by the ones which called them).
 *
 * Each page is being referred to with its own "url", and params are passed as query strings.
 */
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

    constructor(headers={}) {

        this._headers = Object.assign({}, this.constructor.headers, headers);
        this._pages = {};
        this._stack = [];
        this._window = null;

        for (let page of this.constructor.pages) {

            this._pages[page.path] = page;
        }

        this.navigate(this.constructor.initialPath);
    }

    /**
     * Navigates to a page
     * @param url {string}
     */
    navigate(url) {

        this._stack.push(url);
        this._initializePage(url);
    }

    /**
     * Removes the topmost page in the stack and moves back to the previous path.
     *
     * If there is only one page in the stack, does nothing.
     */
    back() {

        if (this._stack.length > 1) {

            this._stack.pop();
            this._initializePage(this._stack[this._stack.length - 1])
        }
    }

    /**
     * Terminates the application.
     */
    close() {

        process.exit(0);
    }

    /**
     * Initializes a ScriptWindow instance for a given route (url) and injects global variables to it.
     * @param url {string} page url
     * @private
     */
    _initializePage(url) {

        // get path and query parameters from url
        let {pathname, query} = URL.parse(url, true);

        // get page class
        let page = this._pages[pathname];

        // if no such class found, throw
        if (!page) {

            throw new Error(`Router error: path not found (${pathname})`);
        }

        // set global injections
        global.__router__injected__reference = this;
        global.__router__injected__headers = this._headers;
        global.__router__injected__params = query || {};

        // set window options, including title and injection withdrawal script
        let windowOptions = {};
        windowOptions['title'] = page.title;
        windowOptions['webPreferences'] = {preload: `${__dirname}/injection.js`};

        // add window options from page class
        Object.assign(windowOptions, page.windowOptions);

        // instantiate new window
        let nextWindow = new ScriptWindow(windowOptions);
        page.headTags.forEach((tag) => nextWindow.addHeadTag(tag));
        nextWindow.loadURL(page.src);

        // if debug, show inspector
        if (debug()) {

            nextWindow.browserWindow.webContents.openDevTools();
        }

        // unload previous window
        if (this._window) {

            this._window.browserWindow.destroy();
        }

        // store new window
        this._window = nextWindow;
    }

}


export {Router};
