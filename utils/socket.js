const socket = require('socket.io');
var io;
function setServer(server){
     io = socket(server);
io.sockets.on('connection', function (socket) {
        console.log('connection Created :', socket.id);
        
    });
}
module.exports = {io, setServer};

