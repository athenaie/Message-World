var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

let int = 1;

let messages = [];
let clients = [];
let users = [];

app.use(express.static(path.resolve('./../build')));

app.get('/', function(req, res){
  res.sendFile(path.resolve(__dirname + './../build/index.html'));
});

io.on('connection', function(socket){
  console.log('a user connected');

  socket.on('disconnect', function(){
    if(clients.length !== 0 && users.length !== 0) {
      let index = clients.map((e) => { return e.socketid }).indexOf(socket.id);
      if (index !== -1) {
        let name = clients[index].name;
        clients.splice(index, 1);
        index = users.indexOf(name);
        users.splice(index,1);
        console.log(clients);
        console.log(users);
      }
    }
  });

  socket.on('first message', function(cookies){
    // console.log(cookies);
    let name = '';
    let color = '';
    if (cookies.hasOwnProperty('name')) {
      name = cookies.name;
    }
    else {
      name = 'user' + int;
      int = int + 1;
    }
    while (users.includes(name)) {
      name = 'user' + int;
      int = int + 1;
    }
    if (cookies.hasOwnProperty('color')) {
      color = cookies.color;
    }
    else {
      color = '#000000';
    }
    clients.push({socketid: socket.id, name: name})
    users.push(name);
    console.log(clients);
    console.log(users);
    let data = {name: name, color:color, messages:messages};
    socket.emit('first message', data);
    io.emit('user list', users);
  });

  socket.on('chat message', function(data){
    let msg = {};
    msg.msg = data.msg;
    msg.name = data.cookies.name;
    msg.color = data.cookies.color;
    msg.time = Date.now();
    messages.push(msg);
    io.emit('chat message', msg);
  });

  socket.on('name change', function(data){
    if (!users.includes(data.name)) {
      let socketindex = clients.map((e) => { return e.socketid}).indexOf(socket.id);
      if (socketindex !== -1) {
        let oldname = clients[socketindex].name;
        let nameindex = users.indexOf(oldname);
        if (nameindex !== -1) {
          clients[socketindex].name = data.name
          users[nameindex] = data.name;
          let msg = {name: data.name};
          socket.emit('name change', msg);
          io.emit('user list', users);
          console.log(clients);
          console.log(users)
        }
      }
    }
   });

});

http.listen(port, function(){
  console.log('listening on *:' + port);
});