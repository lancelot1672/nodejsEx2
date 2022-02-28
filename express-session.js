var parseurl = require('parseurl');
var session = require('express-session');
var express = require('express');
var FileStore = require('session-file-store')(session);

var app = express()
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true,
    store:new FileStore()
}));

// app.use(function(request, response, next){
//     if(!request.session.views){
//         request.session.views = {}
//     }

//     // get the url pathname
//     var pathname = parseurl(request).pathname;

//     // count the views
//     request.session.views[pathname] = (request.session.views[pathname] || 0) + 1

//     next()
// });

// app.get('/foo', function(request, response, next){
//     response.send('you viewed this page' + request.session.views['/foo'] + ' times')
// });

app.get('/', function(request, response, next){
    console.log(request.session);
    if(request.session.num === undefined){
        request.session.num = 1;
    }else{
        request.session.num += 1;
    }
    response.send(`Views : ${request.session.num}`);
});

app.listen(3000, function(){
    console.log('3000!!!');
});
