var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var auth = require('./lib/auth.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');

//express
var express = require('express');
var app = express();

//session
var session = require('express-session');
var FileStore = require('session-file-store')(session);

app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : false,
    store:new FileStore()
}));

//body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended : false}));

// 모듈 만들어서 사용하기
app.use(function(request, response, next){
    fs.readdir('./data', function(error, filelist){
        request.list= filelist;
        next();
    });
});

//router
var topicRouter = require('./route/topic/topic.js');
app.use('/topic', topicRouter);

var authRouter = require('./route/auth/auth.js');
app.use('/auth', authRouter);




var passport = require('./lib/passport.js')(app);


app.post('/auth/login_process',
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/auth/login'
}));

app.get('/', function(request, response){
        console.log('/', request.user);
        
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var authStatusUi = auth.StatusUi(request, response);
    
        var list = template.list(request.list);
        var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/topic/create">createPage</a>`,
            authStatusUi
            );
            response.send(html);
    
});

app.listen(3000, function(){
    console.log('Example app listening on port 3000!');
})