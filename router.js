var express = require('express')
var mysql = require('mysql');     //引入mysql模块
var DBConfig = require('./db/DBConfig')
var userSQL = require('./db/userSql')

router = express.Router()
var connection = mysql.createConnection(DBConfig.mysql)
connection.connect();
var responseJSON = function (res, ret) {
    if(typeof ret === 'undefined') {
        res.json({
                 code:'-200',
                 msg: '操作失败'
        });} else {res.json(ret);
}};

//实现登录
router.post('/login',function (req,res) {
    var account=req.body.account;
    var password=req.body.password
    var _res = res;
    connection.query(userSQL.queryAll, function (err, res, result) {
        var isTrue = false;
        if(res){ //获取用户列表，循环遍历判断当前用户是否存在
            for (var i=0;i<res.length;i++) {
                if(res[i].account == account && res[i].password == password) {
                        isTrue = true;
                }
            }
        }
        var data = {};
        data.isLogin = isTrue; //如果isTrue布尔值为true则登陆成功 有false则失败
        if(isTrue) {
            data.userInfo = {};
            data.userInfo.account = account;
            data.userInfo.password = password;
            data.result = {
                code: 200,
                msg: '登录成功'
            };
        } //登录成功返回用户信息
        if(!isTrue) {
            data.result = {
                code: 0,
                msg: '密码错误，请重新登陆'
            };
        }
        if(err) data.err = err;
        // 以json形式，把操作结果返回给前台页面
        responseJSON(_res, data);
    })
})
//实现注册
router.post('/register',function (req,res) {
    var  account=req.body.account;
    var  password=req.body.password;
    var _res = res;
    connection.query(userSQL.queryAll, function (err, res) {
        var isTrue = false;
        if(res){ //获取用户列表，循环遍历判断当前用户是否存在
            for (var i=0;i<res.length;i++) {
                if(res[i].account == account && res[i].password == password) {
                    isTrue = true;
                }
            }
        }
    
    var data = {};
    data.result={}    
    data.isreg = !isTrue;
        //如果isTrue布尔值为true则登陆成功 有false则失败
        if(isTrue) {
            data.result = {
                code: 1,
                msg: '用户已存在'
            };//登录成功返回用户信息
        } else {
            connection.query(userSQL.insert, [account,password], function (err, result) {
                if(result) {
                    data.result = {
                        code: 200,
                        msg: '注册成功'
                    };
                } 
                else {
                    data.result = {
                        code: -1,
                        msg: '注册失败'
                    };
                }
            });
        }
        
        if(err) data.err = err;
        setTimeout(function () {
            responseJSON(_res, data)
        },300);
        // responseJSON(_res, data);
        // 释放链接
    })







});
module.exports = router;