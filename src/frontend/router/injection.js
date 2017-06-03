/**
 * This script is being injected into windows by the router (@see Router class), and is in charge of requiring
 * the router, headers and parameters from the main process into the respective window's renderer process.
 */
(() => {

    var remote = require('electron').remote;
    window.router = remote.getGlobal('__router__injected__reference');
    window.headers = remote.getGlobal('__router__injected__headers');
    window.params = remote.getGlobal('__router__injected__params');
})();
