var http = require("http");
var fs = require("fs");
var index = fs.readFileSync("./client/index.html");

var app = http.createServer(function(req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(index);
}).listen(3000);

var io = require('socket.io')(app, {
    allowEIO3: true
});

io.on('connection', function(socket) {
    console.log('Node is listening to port');
    io.emit("data", "Hahahahah");
});
console.log("listening to port 3000");