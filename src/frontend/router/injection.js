(() => {

    var remote = require('electron').remote;
    window.router = remote.getGlobal('__router__injected__reference');
    window.headers = remote.getGlobal('__router__injected__headers');
    window.params = remote.getGlobal('__router__injected__params');
})();
