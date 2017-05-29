import electron from 'electron';
import {ApplicationStore} from './backend';
import {ApplicationRouter} from './frontend';


electron.app.on('ready', async () => {

    let store = new ApplicationStore();

    console.log('logging in with roysom');
    await store.resources.User.login('roysom', 'bananas');

    let router = new ApplicationRouter({store});
});
