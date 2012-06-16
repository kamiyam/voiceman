
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http');

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3333);
  app.set('views', __dirname + '/views');

  // app.set('view engine', 'ejs');

  //テンプレートエンジンをejsのまま拡張子htmlを使う
  app.engine('.html', require('ejs').__express);
  app.set('view engine', 'html');

  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

http = http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});


var online = 0;

var io = require('socket.io');
io = io.listen(http);

io.sockets.on('connection', function (socket) {

    ++online;

    io.sockets.emit('status', { 'online' : online } );
    socket.emit('message', { 'message' : "Hello" } );

    socket.on('sendMsg', function (data) {
        io.sockets.emit("message",data);
    });

   socket.on( "disconnect", function(){
       --online;
       io.sockets.emit('status', { 'online' : online } );

   });
});