/*
var fs = require("fs");


var index = fs.readFileSync("index.html");

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
console.log("listening to port 3000");*/

const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

server.listen(3000, () => {
    allowEIO3: true
    console.log('listening on port 3000');
});

app.use(express.static(__dirname + '/public'));
//app.use(express.static("node_modules"))


io.on('connection', function(socket) {
    console.log('Node is listening to port')
    setInterval(function () {
        socket.emit("temp-reading", Math.round(((Math.random()*100)*7)/10));
    }, 1000);
})
