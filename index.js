/*eslint no-console: off*/

const http = require('http');
const app = require('./app');

const argv = require('yargs-parser')(process.argv.slice(2), {
    string: ['host'],
    number: ['port'],
    boolean: ['daemon']
});

const server = http.createServer(app);
server.on('error', err => {
    if (err.syscall !== 'listen') {
        console.error(err);

        return;
    }

    let fatal;
    switch (err.code) {
    case 'EACCES':
    case 'EADDRINUSE':
        fatal = true;
        break;
    default:
        console.error(err);
        break;
    }
    if (fatal) {
        if (argv.daemon === true) {
            require('./daemon')(err);
        } else {
            console.error(err);
            process.exit(1);
        }
    }
});
server.on('listening', () => {
    console.log('http started', server.address());
    if (argv.daemon === true) {
        require('./daemon')(null, app, server, argv);
    }
});
server.listen(argv.port || 8000, argv.host || 'localhost');
