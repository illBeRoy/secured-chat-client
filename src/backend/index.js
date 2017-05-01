import appPath from 'application-data-path';

import {Store} from '../framework/store';

import {Storage} from '../utils/storage';
import {ApiClient} from '../utils/api-client';
import {Cryptography} from '../utils/cryptography';

import resources from './resources';


let utils = {};
utils.api = new ApiClient();
utils.cryptography = new Cryptography();

class ApplicationStore extends Store {

    static resources = resources;
    static augmentations = {utils};
    static localStorage = new Storage(appPath('woosh'));

}


export {ApplicationStore};
