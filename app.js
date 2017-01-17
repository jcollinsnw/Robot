var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var index = require('./routes/index');
var users = require('./routes/users');

var _serialPort = "/dev/cu.usbserial-A9007K9O";
var SerialPort = require("serialport").SerialPort;
/*var sp = new SerialPort(_serialPort, {
  parser: SerialPort.parsers.readline('\n')
});*/

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);

app.engine('html', require('ejs').renderFile);
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, '/node_modules')));
app.use(express.static(path.join(__dirname, '/node_modules/jade-bootstrap')));

app.use('/', index);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
io.on('connection', function (socket) {
    console.log("Connected succesfully to the socket ...");

    var news = [
        { title: 'The cure of the Sadness is to play Videogames',date:'04.10.2016'},
        { title: 'Batman saves Racoon City, the Joker is infected once again',date:'05.10.2016'},
        { title: "Deadpool doesn't want to do a third part of the franchise",date:'05.10.2016'},
        { title: 'Quicksilver demand Warner Bros. due to plagiarism with Speedy Gonzales',date:'04.10.2016'},
    ];

    // Send news on the socket
    /*sp.on('data', function(data){
      console.log(data);
      socket.emit('output', data);
    });
    sp.on('open', function() {
      console.log('serial connected');
    });

    socket.on('command', function (data) {
        sp.write(data+"\r\n", function(err) {
          if( err ) {
            console.log(err);
          }
        });
    });*/

    socket.on('command', function(data) {
      socket.emit('output', "R " + data);
      console.log(data);
    });
});
module.exports = {app: app, server: server};