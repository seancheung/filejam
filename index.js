/*eslint no-console: off*/

const express = require('express');
const argv = require('yargs-parser')(process.argv.slice(2), {
    string: ['host'],
    number: ['port'],
    boolean: ['daemon']
});

const app = express();

const server = app.listen(argv.port || 8000, argv.host || 'localhost', () => {
    console.log('http started', server.address());
});
server.on('error', err => {
    if (err.syscall !== 'listen') {
        console.error(err);

        return;
    }

    // handle specific listen errors with friendly messages
    switch (err.code) {
    case 'EACCES':
        console.error('port requires elevated privileges', err);
        process.exit(1);
        break;
    case 'EADDRINUSE':
        console.error('port is already in use', err);
        process.exit(1);
        break;
    default:
        console.error(err);
        break;
    }
});

if (argv.daemon === true) {
    require('./daemon')(app, server, argv);
}
