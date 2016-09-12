Object.assign = require('object-assign')
var fs = require('fs'),
    path = require('path'),
    assert = require('assert'),
    mongodb = require('mongodb'),
    ejs = require('ejs'),
    express = require('express'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon');

// set routes
var index = require('./routes/index');

var app = express();

var ip = process.env.IP || 'localhost',
    port = process.env.PORT || 8080,
    db = null,
    dbName = 'testdb',
    dbUrl = 'mongodb://localhost:27017/' + dbName;

// init db
var mongo = mongodb.MongoClient;

// Use connect method to connect to the Server
var initDb = mongo.connect(dbUrl, function(err, conn) {
    if (err != null) {
        console.log('mongodb error. msg:\n' + err);
    } else {
        console.log('mongodb successfully connected!\nListening: ' + dbUrl);
    }

    db = conn;
});

// view engine setup
app.engine('html', ejs.renderFile);

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// make db accessible to router
app.use(function(req, res, next) {
    req.db = db;
    next();
});

// use routes
app.use('/', index);

// 404 not found error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// 500 server error handling
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log("error: " + err.status + " msg: " + err.message);
    res.render('error.html', {
        code: err.status,
        message: err.message
    });
});

// hide server-side technology information from browser
app.disable('x-powered-by');

// start server
app.set('ip', ip);
app.set('port', port);
var server = app.listen(app.get('port'), function() {
    console.log('Server is running and listening on http://%s:%s', app.get('ip'), app.get('port'));
});

//console.log("__dirname: " + __dirname);

module.exports = app;
