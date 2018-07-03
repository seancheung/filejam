/*eslint no-console: off*/

const net = require('net');
const path = require('./socket');

module.exports = (app, http) => {
    const server = net.createServer(client => {
        client.setEncoding('utf8');
        client.on('data', data => {
            switch (data) {
            case 'status':
                {
                    const address = http.address();
                    client.write(
                        JSON.stringify({
                            pid: process.pid,
                            host: address.address,
                            port: address.port
                        })
                    );
                }
                break;
            case 'stop':
                client.write(JSON.stringify({ success: true }));
                process.exit(0);
                break;
            default:
                break;
            }
        });
    });

    server.on('error', err => {
        console.error(err);
        process.exit(1);
    });

    server.listen(path, () => {
        console.log('daemon started', server.address());
    });
};
