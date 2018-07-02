/*eslint no-console: off*/

const net = require('net');
const path = require('./socket');

const server = net.createServer(client => {
    client.setEncoding('utf8');
    client.on('data', data => {
        switch (data) {
        case 'status':
            client.write(
                `pid: ${process.pid}, port: ${server.address().port}`
            );
            break;
        case 'stop':
            client.write('closing');
            process.exit(0);
            break;
        default:
            break;
        }
    });
});

server.listen(path, () => {
    console.log('daemon started', server.address());
});
