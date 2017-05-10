import {Page} from '../../router';


class LoginPage extends Page {

    static path = '/login';
    static title = 'Login';
    static src = Page.require('pages/login/component.js');
    static windowOptions = {
        width: 311,
        height: 288,
        frame: false,
        transparent: true
    }

}


export {LoginPage};
