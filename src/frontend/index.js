import {Router} from './router';
import {LoginPage} from './pages/login';
import {ChatPage} from './pages/chat';


class ApplicationRouter extends Router {

    static initialPath = '/chat?user=roysom&password=bananas';
    static pages = [LoginPage, ChatPage];
    static headers = {};

}


let electron = require('electron');
electron.app.on('ready', () => new ApplicationRouter());