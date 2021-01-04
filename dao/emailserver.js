// 引入发送邮件插件
var nodemailer = require('nodemailer')
// 引入证书文件
var credentials = require('../config/credentials.js')

// 创建传输方式
var transporter = nodemailer.createTransport({
    service: 'qq',
    auth: {
        user: credentials.qq.user, // 发件人邮箱账号
        pass: credentials.qq.pass, //发件人邮箱的授权码 这里可以通过qq邮箱获取 并且不唯一
    }
})

// 注册发送邮件给用户
exports.emailSignUp = function (email, res) {
    // 发送信息内容
    let options = {
        from: '1973443353@qq.com',
        to: email, //用户对方邮箱
        subject: '欢迎使用hpc的app！',
        html: '<span>来，侠客请接刀</span><a href="http://localhost:8080/">点击</a><br/><br/><br/><p>开发作者:白菜汤里的胡萝卜</p><p><a href="https://baicaitang.github.io">https://baicaitang.github.io</a></p>'
    }

    // 发送邮件
    transporter.sendMail(options, function (err, msg) {
        if (err) {
            res.send(err)
            console.log(err)
        } else {
            res.send('邮箱发送成功！')
            console.log('邮箱发送成功！')
        }
    })
}