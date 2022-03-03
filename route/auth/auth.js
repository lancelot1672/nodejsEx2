const express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');
var template = require('../../lib/template.js');
/*
router.get('/create', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<form action = "/topic/create_process" method="post">
            <p><input type="text" name="title" placeholder="title"></p>
            <p>
                <textarea name="description" placeholder="description"></textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>`);
    response.send(html);

});
router.post('/create_process', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;

    // file Write
    fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
        // Redirection
        response.redirect(`/topic/${title}`);
    });
});
router.post(`/delete_process`, function(request, response){
    var post = request.body;
    var id = post.id;
    fs.unlink(`data/${id}`, function(error){
        response.redirect(`/`);
    });
});
router.post('/update_process', function(request, response){
    var post = request.body;
    var id = post.id;       // 기존 파일명
    var title = post.title; // 새 파일 명
    var description = post.description; // 파일 내용
    //파일 수정
    fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
            response.redirect(`/topic/${title}`);
        });
    });
});
router.get('/update/:pageId', function(request, response){
    var filename = path.parse(request.params.pageId).base;

    fs.readFile(`data/${filename}`, function(error, description){
        if(error){
            next(error);
        }else{
            var title = request.params.pageId;
            var list = template.list(request.list);
            var html = template.HTML(title, list,
                `<form action = "/topic/update_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <p><input type="text" name="title" placeholder="title" value="${title}">
                    <p>
                        <textarea name="description" placeholder="description">${description}</textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
                `,
                `<a href="/page/create">createPage</a> 
                <br> 
                <a href="/page/update/${title}">update</a>`
                );
            response.send(html);
        }
    });
});

router.get(`/:pageId`, function(request, response, next){
    //id값이 있는 경우 코드 //코드 순서 되게 중요!!!
    var fileReadId = path.parse(request.params.pageId).base;

    fs.readFile(`data/${fileReadId}`, function(error, description){
        if(error){
            next(error);
        }else{
            var title = request.params.pageId;
            var list = template.list(request.list);
            var html = template.HTML(title, list,
                `<h2>${title}</h2>${description}`,
                `
                <a href="/topic/create">createPage</a>
                <a href="/topic/update/${title}">update</a>
                <form action="/topic/delete_process" method="post">
                    <input type="hidden" name="id" value="${title}">
                    <input type="submit" value="delete">
                </form>
                `);
            response.send(html);
        }
    });
});
*/
router.get('/login', function(request, response){
    var title = 'WEB - create';
    var list = template.list(request.list);
    var html = template.HTML(title, list,
        `<form action = "/auth/login_process" method="post">
            <p><input type="text" name="email" placeholder="example@example.com"></p>
            <p>
                <input type="password" name="pw" placeholder="password">
            </p>
            <p>
                <input type="submit" value="login">
            </p>
        </form>`);
    response.send(html);

});

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

router.get('/logout', function(request, response){
    request.logout;
    request.session.destroy(function(err){
        response.redirect('/');
    });
});
module.exports = router;