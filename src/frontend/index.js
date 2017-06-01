import {Router} from './router';
import {LoginPage} from './pages/login';
import {RegisterPage} from './pages/register';
import {ChatPage} from './pages/chat';


class ApplicationRouter extends Router {

    static initialPath = '/login';
    static pages = [LoginPage, RegisterPage, ChatPage];
    static headers = {};

}


export {ApplicationRouter};
