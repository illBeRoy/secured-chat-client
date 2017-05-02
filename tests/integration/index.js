import {expect} from 'chai';
import bunyan from 'bunyan';
import bunyanPretty from 'bunyan-pretty-colors';

import fs from 'fs';
import path from 'path';
import childProcess from 'child_process';
import appPath from 'application-data-path';
import axios from 'axios';
import delay from 'delay';

import {ApplicationStore} from '../../bin/backend';
import {Cryptography} from '../../bin/utils/cryptography';


describe('integration tests', function() {

    const storagePath = appPath('woosh');
    const serverExecutablePath = process.env['SERVER_PATH'];
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
            {shell: true, cwd: serverExecutablePath}
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

        // create app instance
        this._logger.debug('Creating application instance');
        this._app = new ApplicationStore();

        // inject mocks
        this._app.augmentations.utils.cryptography.generateKeyPair = this._generateKeyPair;

        // set master key
        this._app.augmentations.session.masterKey = 'bananas';

        // ready
        this._logger.warn('Beginning test')
    });

    afterEach(function() {

        if (this.currentTest.state === 'failed') {

            this._logger.error('Test failed');
        }

        this._logger.warn('Tearing test down');

        // tear down server
        this._logger.debug('Killing server process');
        this._server.kill('SIGKILL');
    });

    it('checks registration', async function() {

        this._logger.info('Attempting to register user "roysom"');

        let user = await this._app.resources.User.register('roysom');
        expect(user.username).to.equal('roysom');
    })
});