// 引入解析req.body插件
var bodyParser = require('body-parser')
//引入token
var jwt = require('./dao/jwt')
const express = require('express')
const app = express()
// 引入操作文件路径
const path = require('path');
const port = 3000


// Socket.io 
var server = app.listen(8082)
var io = require('socket.io').listen(server)
require('./dao/socket')(io)

//设置跨域访问
app.all('*', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    //或 res.header("Access-Control-Allow-Origin", "http://localhost:8080");
    res.header("Access-Control-Allow-Headers", "Origin,X-Requested-With,Content-Type,Accept");
    res.header("Access-Control-Allow-Credentials", true);
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By", ' 3.2.1')
    res.header("Content-Type", "application/json;charset=utf-8");
    if (req.method == 'OPTIONS') {
        res.sendStatus(200)
    } else {
        next();
    }

});


// 解析前端数据
// 限制文件上传大小
app.use(bodyParser.urlencoded({limit:'50mb',extended:true}))
app.use(bodyParser.json({limit:'50mb'}))

// 获取静态路径
// app.use(express.static(__driname + '/data'))
app.use(express.static(path.join(__dirname,'data')))

// token判断
app.use(function (req, res, next) {
    if (typeof (req.body.token) != 'undefined') {
        //处理token匹配
        let token = req.body.token

        let tokenMatch = jwt.verifyToken(token)

        // res.send({
        //     result: tokenMatch
        // })

        if (tokenMatch == 1) {
            // 通过验证
            next()
        } else {
            // 验证不通过
            res.send({
                status: 300
            })
        }

    } else {
        next()
    }
})


const router = require('./router/index');
const multer = require('./router/files');
const { Socket } = require('dgram');

// 把路由挂载到 app 中
app.use(router)
// 引入附件上传插件
app.use(multer)

// 404
app.use((req, res, next) => {
    let err = new Error('Not Found')
    err.status = 404
    next(err)
})

// 出现错误处理
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    res.send(err.message)
})

app.listen(port, () => console.log(`监听端口： ${port}`))