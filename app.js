
var express = require('express');   //引入express模块
var app = express();  
var router = require('./router.js')      //创建express的实例
app.use('/api/*', function (req, res, next) {
	// 设置请求头为允许跨域
    res.header("Access-Control-Allow-Origin", "*");
    // 设置服务器支持的所有头信息字段
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    // 设置服务器支持的所有跨域请求的方法
    res.header("Access-Control-Allow-Methods", "POST,GET");
    // next()方法表示进入下一个路由
    next();
});
var bodyParser=require('body-parser');
app.use(bodyParser.urlencoded({
    extended: false,                 //扩展模式
     limit:    2*1024*1024           //限制-2M
 }));
 app.use(bodyParser.json());
app.use(router)

/*
app.get('/',function (req,res) {
    var sql = 'SELECT * FROM user';
var str = '';
connection.query(sql, function (err,result) {
    if(err){
        console.log('[SELECT ERROR]:',err.message);
    }
    str = JSON.stringify(result);
      //数据库查询结果返回到result中
    });
    res.send(str);  ////服务器响应请求
});
*/
app.listen(3000,function () {    ////监听3000端口
    console.log('Server running at 3000 port');
});