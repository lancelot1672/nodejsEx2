var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'ehdfbf8749',
    database : 'opentutorials'
});

connection.connect();


var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var title = queryData.id;
    var pathName = url.parse(_url, true).pathname;

    console.log(url.parse(_url, true));

    //
    if(pathName === '/'){
        //undefined
        if(queryData.id === undefined){

            connection.query(`select * from topic`, function(error,topics){
                console.log(topics);
                if(error){
                    console.log(error);
                }
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var list = template.list(topics);
                var html = template.HTML(title, list,
                    `<h2>${title}</h2>${description}`,
                    `<a href="/create">create</a>`);
                
                response.writeHead(200);
                response.end(html);
            });

        }else{
            // id값이 있는경우 코드
            fs.readdir('./data', function(error, filelist){
                fs.readFile(`data/${queryData.id}`, function(error, description){
                    var title = queryData.id;
                    var list = template.list(filelist);
                    var html = template.HTML(title, list,
                         `<h2>${title}</h2>${description}`,
                         `
                            <a href="/create">createPage</a>
                            <a href="/update?id=${title}">update</a>
                            <form action="delete_process" method="post">
                                <input type="hidden" name="id" value="${title}">
                                <input type="submit" value="delete">
                            </form>
                         `
                    );
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }else if(pathName === '/create'){
        // create Page
        fs.readdir('./data', function(error, filelist){
            console.log(filelist);
            
            var title = 'WEB - create';
            var list = template.list(filelist);

            var html = template.HTML(title, list, `
                <form action = "http://localhost:3000/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"></p>
                    <p>
                        <textarea name="description" placeholder="description"></textarea>
                    </p>
                    <p>
                        <input type="submit">
                    </p>
                </form>
            `);
            response.writeHead(200);
            response.end(html);
        });       
    }else if(pathName === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body += data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;

            // console.log(post);
            // console.log(post.title);

            //file Write
            fs.writeFile(`data/${title}`,description, 'utf-8', function(err){
                // 302 - redirection
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });

    }else if(pathName === '/update'){
        fs.readdir('./data', function(error, filelist){
            fs.readFile(`data/${queryData.id}`, function(error, description){
                var title = queryData.id;
                var list = template.list(filelist);
                var html = template.HTML(title, list,
                     `
                    <form action = "/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                     <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                     <p>
                         <textarea name="description" placeholder="description">${description}</textarea>
                     </p>
                     <p>
                         <input type="submit">
                     </p>
                    </form>
                     `,
                     `<a href="/create">createPage</a><a href="/update?id=${title}">update</a>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    }
    else if(pathName === '/update_process'){
        var body = '';
        request.on('data', function(data){  // 데이터를 받아와서 body에 계속 저장
            body = body + data;
        });
        request.on('end', function(){       //데이터의 끝일 때
            var post = qs.parse(body);
            var id= post.id;        // 기존 제목
            var title = post.title; //새 제목
            var description = post.description; // 내용

            // 파일 수정
            fs.rename(`data/${id}`, `data/${title}`, function(error){
                fs.writeFile(`data/${title}`,description, 'utf-8', function(err){
                    // 302 - redirection
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            })
        });
    }else if(pathName === '/delete_process'){
        var body = '';
        request.on('data', function(data){  // 데이터를 받아와서 body에 계속 저장
            body = body + data;
        });
        request.on('end', function(){       //데이터의 끝일 때
            var post = qs.parse(body);
            var id= post.id;        // 기존 제목
            fs.unlink(`data/${id}`, function(error){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    }         
    else{
        response.writeHead(404);
        response.end('Not Found');
    }  
    
});
app.listen(3000);