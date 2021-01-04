var dbserver = require('../dao/dbserver.js')
//引入token
// var jwt = require('../dao/jwt.js')

//登录
exports.signIn = function (req, res) {
    let data = req.body.data
    let pwd = req.body.pwd

    dbserver.userMatch(data, pwd, res)
}

