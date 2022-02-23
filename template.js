module.exports = {
    HTML:function(title, list, body, control){
        return `
        <!doctype html>
        <html>
        <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">
        </head>
        <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
        </body>
        </html>
        `;
    },
    list:function(topics){
        var list = '<ul>';
        var i = 0;
        while(i < topics.length){
            list = list + `<li><a href="/topic/${topics[i]}">${topics[i]}</a></li>`
            i = i + 1;
        }
        list = list + `</ul>`;
        return list;
    }
}
// function templateHTML(title, list, description, control){
//     return `
//     <!doctype html>
//     <html>
//     <head>
//     <title>WEB1 - ${title}</title>
//     <meta charset="utf-8">
//     </head>
//     <body>
//     <a href="/auth/login">login</a>
//     <h1><a href="/">WEB</a></h1>
//     ${list}
//     ${control}
//     ${description}
//     </body>
//     </html>
//     `;
// }
// function templateList(filelist){
//     var list = '<ul>';
//     var i = 0;

//     // 파일이 새로 생성되도 알아서 생성해줌.
//     while(i < filelist.length){
//         list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
//         i = i + 1;
//     }
//     list = list + '</ul>';
    
//     return list;
// }