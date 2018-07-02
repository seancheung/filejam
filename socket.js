const path = require('path');
const os = require('os');

let conn;
if (process.platform === 'win32') {
    conn = path.join('\\\\?\\pipe', os.tmpdir(), 'filejam.sock');
} else {
    conn = path.join(os.tmpdir(), 'filejam.sock');
}

module.exports = conn;
