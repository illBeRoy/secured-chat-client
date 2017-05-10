import {Page} from '../../router';


class LoginPage extends Page {

    static path = '/login';
    static title = 'Login';
    static src = Page.require('pages/login/component.js')
    static windowOptions = {
        width: 622,
        height: 576,
        frame: false
    }

}


export {LoginPage};
