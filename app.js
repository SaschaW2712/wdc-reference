var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// var {body, }

//routers

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//database stuff
var mysql = require('mysql');

var connectionPool = mysql.createPool({
    host: 'localhost',
    user: 'express',
    password: 'password',
    database: 'project'
});

app.use(function(req, res, next){
    req.pool = connectionPool;
    next();
});


app.use(session({
	secret: 'quacken the duck kraken',
	resave: false,
	saveUninitialized: true,
	cookie: { secure: false}
}));

// var VueGapi = require('vue-gapi');

// app.use(VueGapi, {
//   apiKey: 'AIzaSyCqNAgFjHCBahcJx5qs6TnlkxOMtIjdLFc',
//   clientId: '627269652978-d02jdtbae1mpqgr3dbr1k2rlqo63tnsv.apps.googleusercontent.com',
//https://project2207-code50-104963485-4j9pp75pg3v96-3000.githubpreview.dev// })


//modules outside of express
app.use(logger('dev')); //morgan
app.use(cookieParser()); //cookie-parser
app.use(express.static(path.join(__dirname, 'node_modules/ics'))); //path

//modules included in express
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//app routers
app.use('/', indexRouter);
app.use('/users', usersRouter);


app.createICS = function createICS(event) {
  ics.createEvent(event, (error, value) => {
    if (error) {
        console.log(error)
        return
    }

    console.log(value)
    })
}

module.exports = app;