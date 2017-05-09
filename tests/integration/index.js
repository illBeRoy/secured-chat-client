import {expect} from 'chai';
import bunyan from 'bunyan';
import bunyanPretty from 'bunyan-pretty-colors';

import fs from 'fs';
import rimraf from 'rimraf';
import path from 'path';
import childProcess from 'child_process';
import appPath from 'application-data-path';
import axios from 'axios';
import delay from 'delay';
import clearRequire from 'clear-require';

import {Cryptography} from '../../bin/utils/cryptography';
import {killTree} from '../../bin/utils/killtree';


describe('integration tests', function() {

    const storagePath = appPath('woosh');
    const serverExecutablePath = process.env['SERVER_PATH'] || '../secured-chat-server';
    const stdout = new bunyanPretty();

    stdout.pipe(process.stdout);

    before(async function() {

        // create logger
        this._logger = bunyan.createLogger({name: 'test', stream: process.stdout, level: 'debug', stream: stdout});

        // fetch cached rsa key pair
        this._keypair = await new Cryptography().importKeys(
            JSON.parse(
                fs.readFileSync(
                    path.join(__dirname, 'rsa_keypair')
        )));
        this._generateKeyPair = async () => this._keypair;
    });

    beforeEach(async function() {

        // clear persistent data
        this._logger.debug('Clearing persistent data');
        try { rimraf.sync(storagePath) } catch (err) {this._logger.warn(err);}

        // lift server
        this._logger.debug('Starting server instance');
        this._server = childProcess.spawn(
            '/usr/local/bin/python',
            ['scripts/integration_start.py'],
            {cwd: serverExecutablePath, shell: true}
        );

        // wait for server to be ready
        this._logger.debug('Awaiting server readiness');
        while (true) {

            try {

                await axios.get('http://localhost:3000', {validateStatus: null});
                await delay(1000);
                this._logger.debug('Server is ready');
                break;
            } catch (err) {

                await delay(1000);
                continue;
            }
        }

        // attach app creation method
        this._createApp = _createApp;

        // create one app
        this._app = this._createApp();

        // ready
        this._logger.warn('Beginning test')
    });

    afterEach(function() {

        if (this.currentTest.state === 'failed') {

            this._logger.error('Test failed');
        }

        this._logger.warn('Tearing test down');

        // clear application cache
        this._logger.debug('Clearing application cache');
        clearRequire.all();

        // tear down server
        this._logger.debug('Killing server process');
        killTree(this._server.pid);
    });

    function _createApp() {

        this._logger.debug('Creating application instance');

        // create app instance
        let {ApplicationStore} = require('../../src/backend');

        // inject localstorage location
        ApplicationStore.localStorage._path = path.join(
            ApplicationStore.localStorage._path,
            Math.random().toString().split('.')[1]
        );

        // create instance
        let app = new ApplicationStore();
        //
        // inject keypair mock
        app.augmentations.utils.cryptography.generateKeyPair = this._generateKeyPair;

        // clear application cache
        clearRequire.all();

        return app;
    }

    /**
     * Registers a user and asserts the resulting model.
     */
    it('checks registration', async function() {

        this._logger.info('Registering user');
        let user = await this._app.resources.User.register('roysom', 'bananas');
        expect(user.username).to.equal('roysom');
    });

    /**
     * Registers a user, fetches it from same app instance and asserts the resulting model.
     */
    it('checks getting own user', async function() {

        this._logger.info('Registering user');
        await this._app.resources.User.register('roysom', 'bananas');

        this._logger.info('Attempting to get own user');
        let user = await this._app.resources.User.me();

        expect(user.username).to.equal('roysom');
    });

    /**
     * Registers a user and logs in as the user from a new app instance.
     */
    it('checks logging in', async function() {

        this._logger.info('Registering user');
        await this._app.resources.User.register('roysom', 'bananas');

        this._logger.info('Attempting to login with another app instance');
        let anotherAppInstance = this._createApp();
        let user = await anotherAppInstance.resources.User.login('roysom', 'bananas');

        expect(user.username).to.equal('roysom');
    });

    /**
     * Registers two users and attempts to get one from the other's app.
     */
    it('checks getting another user', async function() {

        let roysApp = this._createApp();
        let matansApp = this._createApp();

        this._logger.info('Registering users');
        await roysApp.resources.User.register('roysom', 'bananas');
        await matansApp.resources.User.register('chernima', 'bananas');

        this._logger.info('Attempting to get another user');
        let user = await matansApp.resources.User.getByUsername('roysom');

        expect(user.username).to.equal('roysom');
    });

    /**
     * Registers two users and attempts to send a message from one to the other.
     */
    it('checks sending message', async function() {

        let roysApp = this._createApp();
        let matansApp = this._createApp();

        this._logger.info('Registering users');
        await roysApp.resources.User.register('roysom', 'bananas');
        await matansApp.resources.User.register('chernima', 'bananas');

        this._logger.info('Sending message from chernima to roysom');
        let recipient = await matansApp.resources.User.getByUsername('roysom');
        await recipient.sendMessage('hello, world!');

        this._logger.info('Polling server for message');
        let newMessagesArrived = await roysApp.resources.Message.poll();
        expect(newMessagesArrived).to.equal(true);

        this._logger.info('Confirming message integrity');
        let [message] = roysApp.resources.Message.query((x) => x.fromUser == 'chernima');
        expect(message.contents).to.equal('hello, world!');
    });
});