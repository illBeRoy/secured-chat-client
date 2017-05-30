import {ApplicationStore} from '../bin/backend';
import {Storage} from '../bin/utils/storage';


class FixtureInstallationStore extends ApplicationStore {

    static localStorage = new Storage('/tmp/woosh/fixture-installer');

}


const _installFixtures = async () => {

    let fixtureStore = new FixtureInstallationStore();

    console.log('Registering user roysom');
    await fixtureStore.resources.User.register('roysom', 'bananas');

    console.log('Registering user avivbh');
    await fixtureStore.resources.User.register('avivbh', 'bananas');

    //console.log('Sending message to roysom');
    //fixtureStore.resources.Message.send('avivbh', 'bananas');
};


if (require.main == module) {

    _installFixtures();
}
