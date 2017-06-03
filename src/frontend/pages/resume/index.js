import {Page} from '../../router';


/**
 * Session resume page.
 */
class ResumePage extends Page {

    static path = '/resume';
    static title = 'Resume';
    static src = Page.require('pages/resume/component.js');
    static headTags = ['<link rel="stylesheet" type="text/css" href="../../../../assets/opensans.css">'];
    static windowOptions = {
        width: 311,
        height: 193,
        frame: false
    }

}


export {ResumePage};
