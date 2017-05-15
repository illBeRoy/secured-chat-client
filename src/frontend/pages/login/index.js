import {Page} from '../../router';


class LoginPage extends Page {

    static path = '/login';
    static title = 'Login';
    static src = Page.require('pages/login/component.js');
    static headTags = ['<link rel="stylesheet" type="text/css" href="../../../../assets/opensans.css">'];
    static windowOptions = {
        width: 311,
        height: 288,
        frame: false,
        transparent: true
    }

}


export {LoginPage};
