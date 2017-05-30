import {ApplicationStore} from '../bin/backend';
import {Storage} from '../bin/utils/storage';
import {ArgumentParser} from 'argparse';


class FixtureInstallationStore extends ApplicationStore {

    static localStorage = new Storage('/tmp/woosh/fixture-installer');

}


let fixtures = [];

fixtures['register'] = async () => {

    let fixtureStore = new FixtureInstallationStore();

    console.log('Registering user roysom');
    await fixtureStore.resources.User.register('roysom', 'bananas');

    console.log('Registering user avivbh');
    await fixtureStore.resources.User.register('avivbh', 'bananas');

    console.log('Registering user banuni');
    await fixtureStore.resources.User.register('banuni', 'bananas');
};


fixtures['message'] = async () => {

    let fixtureStore = new FixtureInstallationStore();

    console.log('sending message as avivbh');
    await fixtureStore.resources.User.login('avivbh', 'bananas');

    let user = await fixtureStore.resources.User.getByUsername('roysom');
    await user.sendMessage('howdy, bitch!');

    console.log('sending message as banuni');
    await fixtureStore.resources.User.login('banuni', 'bananas');
    await user.sendMessage('yoyoyo');
};


const _runFixtures = async (fixtureList) => {

    for (let fixture of fixtureList) {

        await fixtures[fixture]();
    }
};


if (require.main == module) {

    let parser = new ArgumentParser();
    parser.addArgument(
        [
            '-f',
            '--fixtures'
        ],
        {
            help: 'list of fixtures to include',
            nargs: '+',
            default: Object.keys(fixtures)
        }
    );

    let args = parser.parseArgs();
    _runFixtures(args.fixtures);
}
