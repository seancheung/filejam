/*eslint no-console: off*/

const args = process.argv.slice(2);
if (args.some(arg => arg === '-h' || arg === '--help')) {
    help();

    return;
}
const [command] = args.splice(0, 1);

switch (command) {
case 'start':
    start();
    break;
case 'stop':
    stop();
    break;
case 'status':
    status();
    break;
case 'restart':
    restart();
    break;
case 'reload':
    reload();
    break;
default:
    console.error('unknow command. run -h,--help for help');
    break;
}

function start() {
    const opts = {
        alias: {
            host: ['H'],
            port: ['P'],
            daemon: ['D']
        },
        boolean: ['daemon'],
        string: ['host'],
        number: ['port']
    };
    const argv = require('yargs-parser')(args, opts);
    const params = [__dirname, '--env', process.env.NODE_ENV];
    if (argv.host) {
        params.push('--host', argv.host);
    }
    if (argv.port) {
        params.push('--port', argv.port);
    }
    const { spawn } = require('child_process');
    if (argv.daemon === true) {
        params.push('--daemon', argv.daemon);
        const child = spawn(process.execPath, params, {
            detached: true,
            stdio: 'ignore'
        });
        child.unref();
        console.log('The application is running in the background now');
        process.exit(0);
    } else {
        const child = spawn(process.execPath, params);
        child.stdout.on('data', data => {
            console.log(data.toString());
        });
        child.stderr.on('data', data => {
            console.log(data.toString());
        });
    }
}

function connect(cb) {
    const net = require('net');
    const path = require('./socket');

    const client = net.createConnection({ path }, () => {
        if (typeof cb === 'function') {
            cb.call(null, client);
        }
    });
    client.setEncoding('utf8');
    client.on('error', err => {
        console.error(err);
    });
    client.on('data', data => {
        console.log(data);
        client.destroy();
    });

    return client;
}

function stop() {
    connect(client => {
        client.write('stop');
    });
}

function status() {
    connect(client => {
        client.write('status');
    });
}

function restart() {}

function reload() {}

function help() {
    console.log('\nUsage: filejamp <command> [options]\n');
    console.log('Commands:\n');
    console.log('  start');
    console.log('      -H, --host\thost name');
    console.log('      -P, --port\tport number');
    console.log('      -D, --daemon\trun in daemon mode');
    console.log('  stop');
    console.log('  status');
    console.log('  restart');
    console.log('  reload');
}
