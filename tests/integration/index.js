import {expect} from 'chai';
import bunyan from 'bunyan';
import bunyanPretty from 'bunyan-pretty-colors';

import fs from 'fs';
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
        try { fs.rmdirSync(storagePath) } catch (err) {}

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
        this._createApp = createApp;

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

    function createApp() {

        this._logger.debug('Creating application instance');

        // create app instance
        let app = new (require('../../bin/backend').ApplicationStore)();

        // inject mocks
        app.augmentations.utils.cryptography.generateKeyPair = this._generateKeyPair;

        // set master key
        app.augmentations.session.masterKey = 'bananas';

        // clear application cache
        clearRequire.all();

        return app;
    }

    it('checks registration', async function() {

        this._logger.info('Registering user');
        let user = await this._app.resources.User.register('roysom');
        expect(user.username).to.equal('roysom');
    });

    it('checks getting own user', async function() {

        this._logger.info('Registering user');
        await this._app.resources.User.register('roysom');

        this._logger.info('Attempting to get own user');
        let user = await this._app.resources.User.me();

        expect(user.username).to.equal('roysom');
    });

    it('checks getting another user', async function() {

        let roysApp = this._createApp();
        let matansApp = this._createApp();

        this._logger.info('Registering users');
        await roysApp.resources.User.register('roysom');
        await matansApp.resources.User.register('chernima');

        this._logger.info('Attempting to get another user');
        let user = await matansApp.resources.User.getByUsername('roysom');

        expect(user.username).to.equal('roysom');
    });
});