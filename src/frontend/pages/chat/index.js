import {Page} from '../../router';


class ChatPage extends Page {

    static path = '/chat';
    static title = 'Chat';
    static src = Page.require('pages/chat/component.js');
    static headTags = ['<link rel="stylesheet" type="text/css" href="../../../../assets/opensans.css">'];
    static windowOptions = {
        titleBarStyle: 'hidden-inset'
    }

}


export {ChatPage};
