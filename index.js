var express = require('express');
var app = express();
var socket = require('socket.io');
var path = require('path');
var bodyParser = require('body-parser');
var {Connection} = require('./db/sql');
var basic_sql;

var http = require('http');

app.use(bodyParser.urlencoded({extended: true}));

try {
    basic_sql = new Connection('127.0.0.1:3306', 'root', '123', 'Attention');
    basic_sql.getConnection().Connect();
} catch(e) {
    basic_sql = null;
}

//basic_sql.addNewUser('Iftah', 'mashr05');


app.use(express.static(path.join(__dirname, 'public/')));

//Socket setup
var io = socket(server);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/welcome.html'));
    
});

app.post('/login',  (req, res) => {

    if (basic_sql) {

        basic_sql.checkUser(req.body.user, req.body.pass, (error, msg) => {
            if (error) {
                console.log(error);
                res.statusCode = 403;
                res.send("ERROR");
            } else {
                res.statusCode = 200;
            
            }
        });
    }

});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/dashboard.html'));
});

io.on('connection', async (socket) => {
    console.log(`made connection with ${socket.id}`);

    socket.on('understand', function(msg){
        io.emit('update-understand', msg);
      });
    
    socket.on('intresting', function(msg) {
        io.emit('update-intresting', msg);
    });

    socket.on('difficulty', function(msg){
        console.log('message: ' + msg);
    });

});

var server = app.listen(4000, () => {
    console.log(`listening on port ${4000}`);
});

