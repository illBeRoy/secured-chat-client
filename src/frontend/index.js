import {Router} from './router';
import {LoginPage} from './pages/login';
import {RegisterPage} from './pages/register';
import {ChatPage} from './pages/chat';
import {ResumePage} from './pages/resume';


class ApplicationRouter extends Router {

    static initialPath = '/login';
    static pages = [LoginPage, RegisterPage, ResumePage, ChatPage];
    static headers = {};

}


export {ApplicationRouter};
