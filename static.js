let http = require('http');
let url = require('url');
let fs = require('fs');
let path = require('path');

http.createServer(function(req,res){
  // 得到用户路径
  let pathname = url.parse(req.url).pathname;
  // 真的读取这个文件
  fs.readFile('./static/'+pathname,function(err,data){
    if(err){
      fs.readFile('./static/404.html',function(err,data){
        res.writeHead(404,{'Content-type':'text/html;charset=utf-8'});
        res.end(data);
      })
      return;
    }
    res.end(data);
  });
}).listen(3000,'localhost');


function getMime(extname){
  switch(extname) {
    case '.html':
      return 'text/html';
    case '.jpg':
      return 'image/jpg'
  }
}