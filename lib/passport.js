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

    //나중에 이부분은 mysql로 변환
    var authData = {
        email:'lancelot1672@naver.com',
        password: '1111',
        nickname:'lancelot'
    }

    var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
    
    //express 에 적용
    app.use(passport.initialize());
    app.use(passport.session());
    
    //딱 한번 호출됨
    passport.serializeUser(function(user, done){
        console.log('serializeUser', user);
        done(null, user.email);
    });
    // 세션 체크할 때 계속 호출
    passport.deserializeUser(function(id, done){
        console.log('deserializeUser', id);
        done(null, authData);
    });
    //local
    passport.use(new LocalStrategy(
        {
            usernameField : 'email',
            passwordField : 'pw'
        },
        //call back 함수 (실제 데이터와 비교해서 맞으면..)
        function(username, password, done){
            console.log('LocalStrategy', username, password);
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
