var dbserver = require('../dao/dbserver.js')

// 详情
exports.userDetail = function (req, res) {
    let data = req.body.id

    dbserver.userDetail(data, res)
}

// 信息修改
exports.userUpdate = function (req, res) {
    let data = req.body

    dbserver.userUpdate(data, res)
}

// 修改好友昵称
exports.updateFriendNickName = function (req, res) {
    let data = req.body

    dbserver.updateFriendNickName(data, res)
}

// 获取好友昵称
exports.getFriendNickName = function (req, res) {
    let data = req.body

    dbserver.getFriendNickName(data, res)
}