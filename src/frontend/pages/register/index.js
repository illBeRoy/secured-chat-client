import {Page} from '../../router';


class RegisterPage extends Page {

    static path = '/register';
    static title = 'Register';
    static src = Page.require('pages/register/component.js');
    static headTags = ['<link rel="stylesheet" type="text/css" href="../../../../assets/opensans.css">'];
    static windowOptions = {
        width: 300,
        height: 200,
        frame: false
    }

}


export {RegisterPage};
