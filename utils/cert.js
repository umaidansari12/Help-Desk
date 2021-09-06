const fs= require('fs');
const path = require('path');
const rootDir = path.normalize(__dirname+"/..");
const keyFile = path.join(rootDir,'/cert/key.pem');
const certFile = path.join(rootDir,'/cert/cert.pem');
module.exports = {
    key:fs.readFileSync(keyFile),
    cert:fs.readFileSync(certFile)
}