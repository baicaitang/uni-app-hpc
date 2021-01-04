var dbserver = require('../dao/dbserver.js')

var  email = require('../dao/emailserver.js')

//用户注册
exports.signUp = function (req, res) {
    let name = req.body.name
    let mail = req.body.mail
    let pwd = req.body.pwd
    // res.send({
    //     name,
    //     mail,
    //     pwd
    // })
    // 发送邮件
    email.emailSignUp(mail,res)

    //创建用户
    dbserver.buildUser(name, mail, pwd, res)

}

// 用户或邮箱是否占用判断
exports.judgeValue = function (req, res) {
    let data = req.body.data
    let type = req.body.type
    // res.send({
    //     data,
    //     type
    // })

    // 匹配用户表元素个数
    dbserver.countUserValue(data, type, res)
}