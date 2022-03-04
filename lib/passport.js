//lowdb
var db = require('./db');

module.exports = function(app){
    //session
    var session = require('express-session');
    var FileStore = require('session-file-store')(session);
    
    app.use(session({
        secret : 'keyboard cat',
        resave : false,
        saveUninitialized : false,
        store:new FileStore()
    }));

    var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

    //express 에 적용
    app.use(passport.initialize());
    app.use(passport.session());
    
    //딱 한번 호출됨
    passport.serializeUser(function(user, done){
        console.log('serializeUser', user);
        done(null, user.id);
    });
    // 세션 체크할 때 계속 호출
    passport.deserializeUser(function(id, done){
        var user = db.get('users').find({id:id}).value();
        console.log('deserializeUser', id, user);
        done(null, user);
    });
    //local
    passport.use(new LocalStrategy(
        {
            usernameField : 'email',
            passwordField : 'pw1'
        },
        //call back 함수 (실제 데이터와 비교해서 맞으면..)
        function(username, password, done){
            console.log('LocalStrategy');
            console.log('LocalStrategy', username, password);
            var authData = db.get('users').find({email:username}).value();
            if(username === authData.email){
                if(password === authData.password){
                    return done(null, authData);
                }else{
                    // password 오류
                    return done(null, false, {
                        message: 'Incorrect password.'
                    });
                }
            }else{
                //아이디 오류
                return done(null, false, {
                    message: 'Incorrect email.'
                });
            }
        }
    ));
    return passport;
}
