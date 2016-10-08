var express = require('express');
var datetime = require('node-datetime');
var app = express();
app.use(express.static(__dirname));

var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('origins', '*:*');



app.get('/', function(req, res){
	res.sendfile('test.html');
});



var nsp = io.of('/myLocation');
var i = 0;
nsp.on('connection', function(socket){
	i++;
	var currentTimeStamp = datetime.create().format('d/m/Y H:M:S');
	if (i % 2 == 0) {
		console.log('Room1');
		socket.join('Room1');
		socket.broadcast.to('Room2').emit('msg', "Joined Room 1 : " + currentTimeStamp);
	} else {
		console.log('Room2');
		socket.join('Room2');
		socket.broadcast.to('Room1').emit('msg', "Joined Room 2 : " + currentTimeStamp);
	}

	socket.on('disconnect', function () {
		console.log('A user disconnected');
	});
});

http.listen(3000, function(){
	console.log('listening on *:3000');
});
