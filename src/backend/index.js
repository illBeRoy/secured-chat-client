import appPath from 'application-data-path';

import {Store} from '../framework/store';

import {Storage} from '../utils/storage';
import {ApiClient} from '../utils/api-client';
import {Cryptography} from '../utils/cryptography';
import {Session} from './session';

import conf from '../../conf.json';

import resources from './resources';


let utils = {};
utils.api = new ApiClient(conf.serverUrl);
utils.cryptography = new Cryptography();

let session = new Session({});

class ApplicationStore extends Store {

    static resources = resources;
    static augmentations = {utils, session};
    static localStorage = new Storage(appPath('woosh'));

}


export {ApplicationStore};
