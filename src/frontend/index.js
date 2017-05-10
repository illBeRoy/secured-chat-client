import {Router} from './router';
import {LoginPage} from './pages/login';


class ApplicationRouter extends Router {

    static initialPath = '/login?a=5';
    static pages = [LoginPage];
    static headers = {a: 77};

}


let electron = require('electron');
electron.app.on('ready', () => new ApplicationRouter());
