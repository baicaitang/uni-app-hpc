var dbserver = require('../dao/dbserver')

//用户搜索
exports.searchUser = function (req, res) {
    let data = req.body.data

    dbserver.searchUser(data, res)
}

//判断是否为好友
exports.isFriend = function (req, res) {
    let uid = req.body.uid
    let fid = req.body.fid

    dbserver.isFriend(uid, fid, res)
}

//用户群
exports.searchGroup = function (req, res) {
    let data = req.body.data

    dbserver.searcGroup(data, res)
}

//判断是否在群内
exports.isInGroup = function (req, res) {
    let uid = req.bofy.uid
    let gid = req.body.gid

    dbserver.isInGroup(uid, gid, res)
}