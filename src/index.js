import electron from 'electron';
import {ApplicationStore} from './backend';
import {ApplicationRouter} from './frontend';


electron.app.on('ready', async () => {

    let store = new ApplicationStore();

    let router = new ApplicationRouter({store});
});
