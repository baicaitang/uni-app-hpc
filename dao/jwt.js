//引入token
var jwt = require('jsonwebtoken')

// 这是加密的key(密匙)
let secret = 'hpc'

//生成token
exports.generateToken = function (id, res) {
    // 要生成token的主体信息
    let payload = {
        id: id,
        time: new Date()
    }

    let token = jwt.sign(payload, secret, {
        expiresIn: 60 * 60 * 24 * 120
    }) //时间过期

    return token
}

// 解码token
exports.verifyToken = function (e) {
    let payload
    jwt.verify(e, secret, function (err, result) {
        if (err) {
            payload = 0
        } else {
            payload = 1
        }
    })

    return payload
}