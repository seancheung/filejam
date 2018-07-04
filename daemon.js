/*eslint no-console: off*/

const net = require('net');
const path = require('./socket');

module.exports = (err, app, http) => {
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
                client.write(
                    JSON.stringify({ pid: process.pid, success: true })
                );
                process.exit(0);
                break;
            default:
                break;
            }
        });
    });

    server.on('error', error => {
        console.error(error);
        process.send(
            JSON.stringify({ pid: process.pid, success: false, error })
        );
        process.exit(1);
    });

    server.listen(path, () => {
        console.log('daemon started', server.address());
        if (err) {
            process.send(
                JSON.stringify({ pid: process.pid, success: false, error: err })
            );
            process.exit(1);
        } else {
            const address = http.address();
            process.send(
                JSON.stringify({
                    pid: process.pid,
                    success: true,
                    host: address.address,
                    port: address.port
                })
            );
            process.disconnect();
        }
    });
};
