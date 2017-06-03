import {Page} from '../../router';


/**
 * Main chat window page.
 */
class ChatPage extends Page {

    static path = '/chat';
    static title = 'Chat';
    static accepts = ['user', 'password'];
    static src = Page.require('pages/chat/component.js');
    static headTags = ['<link rel="stylesheet" type="text/css" href="../../../../assets/opensans.css">'];
    static windowOptions = {
        titleBarStyle: 'hidden-inset',
        width: 1150,
        height: 786,
        minWidth: 930,
        minHeight: 340
    }

}


export {ChatPage};
