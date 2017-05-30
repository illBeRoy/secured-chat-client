import electron from 'electron';
import {ApplicationRouter} from './frontend';


electron.app.on('ready', async () => {

    let router = new ApplicationRouter();
});
