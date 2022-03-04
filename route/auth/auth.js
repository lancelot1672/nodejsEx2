const express = require('express');
var router = express.Router();
var template = require('../../lib/template.js');
var auth = require('../../lib/auth.js');

//lowdb
var db = require('../../lib/db');

//shortID
var shortid = require('shortid');

router.get('/login', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<form action = "/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="example@example.com"></p>
            <p>
                <input type="password" name="pw1" placeholder="password">
            </p>
            <p>
                <input type="submit" value="login">
            </p>
        </form>`,
        `Login`);
    response.send(html);

});
router.get('/register', function(request, response){
    var registerForm = `
    <form action="/auth/register_process" method="post"></p>
        <p><input type="text" name="email" placeholder="email"></p>
        <p><input type="password" name="pw1" placeholder="password"></p>
        <p><input type="password" name="pw2" placeholder="password"></p>
        <p><input type="text" name="displayName" placeholder="displayName"></p>
        <p><input type="submit" value="Register"></p>
    </form>
    `;
    var list = template.list(request.list);
    var authStatusUi = auth.StatusUi(request, response);
    var html = template.HTML(``, list, registerForm, `<h2>Sign Up</h2>`, authStatusUi);

    response.send(html);
})
router.post('/register_process', function(request, response){
    var data = request.body;
    var email = data.email;
    var pw1 = data.pw1;
    var pw2 = data.pw2;
    var displayName = data.displayName;
    if(pw1 === pw2){
        var user = {
            id:shortid.generate(),
            email:email,
            password:pw1,
            displayName:displayName
        };

        db.get('users').push(user).write();
        response.redirect('/');
    }else{
        response.send(`
        <script>
        alert('두 비밀번호 확인!!');
        history.back();
         </script>
        `)
    }

});

router.get('/logout', function(request, response){
    request.session.destroy(function(err){
        response.redirect('/');
    });
    //console.log(request.session);
    // if(request.session.user){
    //     console.log('로그아웃합니다.');
    //     request.session = null;
    //     response.redirect('/');
    // }

});
module.exports = router;

// router.post('/login_process', function(request, response){
//     var post = request.body;
//     var email = post.email;
//     var password=  post.pw;
    
//     if(email === authData.email){
//         if(password === authData.password){
//             console.log(authData.nickname);
//             request.session.is_logined = true;
//             request.session.nickname = authData.nickname;
//             request.session.save(function(){
//                 response.redirect('/');
//             });
//         }
//     }else{
//         response.send('Who??');
//     }
// });
