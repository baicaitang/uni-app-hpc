// DAO(Data Access Object) 数据访问对象是一个面向对象的数据库接口
// 引入加密文件
var bcrypt = require('../dao/bcrypt.js')
//引入token
var jwt = require('../dao/jwt.js')
var dbmodel = require('../model/dbmodel.js')
const {
    hash
} = require('bcryptjs')

// 用户数据
var User = dbmodel.model('User')
// 好友
var Friend = dbmodel.model('Friend')
// 群
var Group = dbmodel.model('Group')
// 群成员
var GroupMembers = dbmodel.model('GroupMembers')
// 引入消息表
var Message = dbmodel.model('Message')
// 群消息
var GroupMessage = dbmodel.model('GroupMessage')

// 新建用户
exports.buildUser = function (name, mail, pwd, res) {
    // 密码加密
    let password = bcrypt.encryption(pwd)

    let data = {
        name: name,
        email: mail,
        psw: password,
        time: new Date(),
    }

    let user = new User(data)

    user.save(function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200
            })
        }
    })
}

// 匹配用户表元素个数
exports.countUserValue = function (data, type, res) {

    let wherestr = {}

    //wherestr = {'type':data}
    wherestr[type] = data

    User.countDocuments(wherestr, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200,
                result
            })
        }
    })
}

// 用户验证
exports.userMatch = function (data, pwd, res) {

    let wherestr = {
        $or: [{
            'name': data
        }, {
            'email': data
        }]
    }

    let out = {
        'name': 1,
        'imgurl': 1,
        'psw': 1
    }

    //findOne()
    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({
                status: 500,
                result: '服务器出错啦！'
            })
        } else {
            if (result == '') {
                // 匹配用户失败
                res.send({
                    status: 400,
                    result: '该用户未注册！'
                })
            }

            //找到对应的用户数据
            // map() 方法返回一个新数组， 数组中的元素为原始数组元素调用函数处理的后值,arr.map(function(currentValue，index，arr),thisValue)
            result.map(function (e) {
                // 判断输入密码与存储的密码
                // e.psw -> hash
                const pwdMatch = bcrypt.verification(pwd, e.psw)

                if (pwdMatch) {

                    let token = jwt.generateToken(e._id)

                    let back = {
                        id: e._id,
                        name: e.name,
                        imgurl: e.imgurl,
                        token: token,
                    }

                    res.send({
                        status: 200,
                        back
                    })
                } else {
                    // 密码不正确

                    res.send({
                        status: 400,
                        result: '密码不正确！'
                    })
                }
            })

        }
    })
}

//搜索用户
exports.searchUser = function (data, res) {
    let wherestr

    if (data == 'hpc') {
        wherestr = {}
    } else {
        wherestr = {
            $or: [{
                'name': {
                    // $regex为模糊查询的字符串提供正则表达式功能
                    $regex: data
                }
            }, {
                'email': {
                    $regex: data
                }
            }]
        }

    }

    let out = {
        'name': 1,
        'email': 1,
        'imgurl': 1,
    }

    User.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200,
                result
            })
        }
    })
}

// 判断是否为好友
exports.isFriend = function (uid, fid, res) {

    let wherestr = {
        'userId': uid,
        'friendId': fid,
        'state': 0
    }

    Friend.findOne(wherestr, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            if (result) {
                // 为好友
                res.send({
                    status: 200
                })
            } else {
                // 不是好友
                res.send({
                    status: 400
                })
            }
        }
    })
}

// 搜索群
exports.searchGroup = function (data, res) {

    let wherestr

    if (data == 'hpc') {
        wherestr = {}
    } else {
        wherestr = {
            'name': {
                $regex: data
            }
        }
    }

    let out = {
        'name': 1,
        'imgurl': 1,
    }

    Group.find(wherestr, out, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200,
                result
            })
        }
    })
}

//判断是否在群里
exports.isInGroup = function (uid, gid, res) {

    let wherestr = {
        'userId': uid,
        'groupId': gid
    }

    GroupMembers.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            if (result) {
                // 在群内
                res.send({
                    status: 200
                })
            } else {
                // 不在群内
                res.send({
                    status: 400
                })
            }
        }
    })
}

// 用户详情
exports.userDetail = function (id, res) {
    let wherestr = {
        '_id': id
    }
    let out = {
        'psw': 0
    }

    User.findOne(wherestr, out, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200,
                result
            })
        }
    })
}

// 用户信息修改
// 修改数据库
function userUpdate(data, update, res) {

    User.findByIdAndUpdate(data, update, function (err, result) {
        if (err) {
            // 修改失败
            res.send({
                status: 500
            })
        } else {
            // 修改成功
            res.send({
                status: 200,
                result
            })
        }
    })
}

exports.userUpdate = function (data, res) {

    let updatestr = {}


    // 1.判断是否有修改密码
    if (typeof (data.pwd) != 'undefined') {
        // 有密码进行匹配
        User.find({
            '_id': data.id
        }, {
            'psw': 1
        }, function (err, result) {
            if (err) {
                res.send({
                    status: 500
                })
            } else {
                if (result == '') {
                    res.send({
                        status: 400
                    })
                }

                //找到对应的数据
                // map() 方法返回一个新数组， 数组中的元素为原始数组元素调用函数处理的后值,arr.map(function(currentValue，index，arr),thisValue)
                result.map(function (e) {
                    // 判断密码与原存储的密码
                    // e.psw -> hash
                    // console.log(data.pwd)
                    const pwdMatch = bcrypt.verification(data.pwd, e.psw)

                    if (pwdMatch) {
                        // 密码验证成功
                        console.log('密码匹配成功！')

                        //如果为修改密码，先加密
                        if (data.type == 'psw') {
                            //    console.log(data.data);
                            // 密码加密
                            let password = bcrypt.encryption(data.data)

                            updatestr[data.type] = password

                            userUpdate(data.id, updatestr, res)

                        } else {
                            //邮箱匹配

                            updatestr[data.type] = data.data

                            //更新的项目与数据库匹配是否存在相同，返回一个数字
                            User.countDocuments(updatestr, function (err, result) {
                                if (err) {
                                    res.send({
                                        status: 500
                                    })
                                } else {
                                    //没有匹配项，可以修改
                                    if (result == 0) {
                                        userUpdate(data.id, updatestr, res)
                                    } else {
                                        //邮箱已存在
                                        res.send({
                                            status: 600
                                        })
                                    }
                                }
                            })
                        }

                    } else {
                        // 密码匹配失败
                        res.send({
                            status: 400
                        })
                    }
                })

            }
        })
    } else if (data.type == 'name') {
        //2.如果是用户名先进行匹配

        updatestr[data.type] = data.data

        // 更新的用户名与原数据库匹配是否存在相同的用户名，返回一个数字
        User.countDocuments(updatestr, function (err, result) {
            if (err) {
                res.send({
                    status: 500
                })
            } else {
                //没有匹配项，可以修改
                if (result == 0) {
                    userUpdate(data.id, updatestr, res)
                } else {
                    //已存在
                    res.send({
                        status: 501
                    })
                }
            }
        })
    } else {
        // 3.一般项目修改
        // typeof (data.pwd) == 'undefined'
        // 没有密码进行匹配，直接修改
        // console.log('一般项');
        updatestr[data.type] = data.data

        userUpdate(data.id, updatestr, res)
    }

}

// 获取好友昵称
exports.getFriendNickName = function (data, res) {
    let wherestr = {
        'userId': data.uid,
        'friendId': data.fid
    }
    let out = {
        'nickname': 1,
    }

    Friend.findOne(wherestr, out, function (err, result) {
        if (err) {

            res.send({
                status: 500
            })
        } else {

            res.send({
                status: 200,
                result
            })
        }
    })
}

// 修改好友昵称
exports.updateFriendNickName = function (data, res) {
    let wherestr = {
        'userId': data.uid,
        'friendId': data.fid
    }
    let updatestr = {
        'nickname': data.name,
    }

    Friend.updateOne(wherestr, updatestr, function (err, result) {
        if (err) {
            // 修改失败
            res.send({
                status: 500
            })
        } else {
            // 修改成功
            res.send({
                status: 200,
                result: result
            })
        }
    })
}

// 新建好友表
exports.buildFriend = function (uid, fid, state, res) {

    let data = {
        userId: uid,
        friendId: fid,
        state: state, //好友状态（0->已为好友，1->申请中，2->申请发送对方，仍未同意）
        time: new Date(),
        lastTime: new Date()
    }

    let friend = new Friend(data)

    friend.save(function (err, result) {
        if (err) {
            // res.send({
            //     status: 500
            // })
            console.log('申请好友表出错！')
        } else {
            // res.send({
            //     status: 200
            // })
        }
    })
}

// 添加一对一消息
exports.inserMsg = function (uid, fid, msg, type, res) {

    let data = {
        userId: uid, //用户id
        friendId: fid, //接收者id
        message: msg, //发送内容
        types: type, //内容属性（0-> 文字，1->图片链接，2->音频链接，3->地图定位……）
        time: new Date(), //发送时间
        state: 1, //消息状态（0->已读，1->未读）
    }

    let message = new Message(data)

    message.save(function (err, result) {
        if (err) {
            if (res) {
                res.send({
                    status: 500
                })
            }
        } else {
            if (res) {
                res.send({
                    status: 200
                })
            }
        }
    })

}

// 好友最后通讯时间
exports.friendMsgLastTime = function (data) {
    let wherestr = {
        $or: [{
            'userId': data.uid,
            'friendId': data.fid
        }, {
            'userId': data.fid,
            'friendId': data.uid
        }]
    }

    let updatestr = {
        'lastTime': new Date()
    }

    Friend.updateMany(wherestr, updatestr, function (err, result) {
        if (err) {
            // res.send({
            //     status: 500
            // })
            console.log('好友最后通讯时间更新出错！')
        } else {
            // res.send({
            //     status: 200
            // })
        }
    })
}

// 申请好友
exports.applyFriend = function (data, res) {

    // 判断是否已经申请过
    let wherestr = {
        'userId': data.uid,
        'friendId': data.fid
    }

    // 匹配好友表
    Friend.countDocuments(wherestr, (err, result) => {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            // 如果result = 0 为初次申请，创建新的好友表
            if (result == 0) {
                // console.log(data)
                //好友状态（0->已为好友，1->申请中，2->申请发送对方，对方仍未同意）
                this.buildFriend(data.uid, data.fid, 2)
                this.buildFriend(data.fid, data.uid, 1)

            } else {
                // 已经申请过好友
                this.friendMsgLastTime(data.uid, data.fid)

            }

            // 添加一对一消息
            this.inserMsg(data.uid, data.fid, data.msg, 0, res)
        }
    })
}

// 更新好友状态
exports.updateFriendState = function (data, res) {

    let wherestr = {
        $or: [{
            'userId': data.uid,
            'friendId': data.fid
        }, {
            'userId': data.fid,
            'friendId': data.uid
        }]
    }

    Friend.updateMany(wherestr, {
        'state': 0
    }, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })

        } else {
            res.send({
                status: 200
            })
        }
    })

}

// 拒绝或删除好友
exports.deleteFriend = function (data, res) {

    let wherestr = {
        $or: [{
            'userId': data.uid,
            'friendId': data.fid
        }, {
            'userId': data.fid,
            'friendId': data.uid
        }]
    }

    Friend.deleteMany(wherestr, {
        'state': 0
    }, function (err, result) {
        if (err) {
            res.send({
                status: 500
            })

        } else {
            res.send({
                status: 200
            })
        }
    })

}

//按要求获取用户列表
exports.getUsers = function (data, res) {

    let query = Friend.find({})

    // 查询条件
    query.where({
        'userId': data.uid,
        'state': data.state
    })

    // 查找friendId关联的user对象
    // MongoDB是非关联数据库。但是有时候我们还是想引用其它的文档。这就是population的用武之地
    // 因为MongoDB是文档型数据库，所以它没有关系型数据库[joins](http://zh.wikipedia.org/wiki/连接_(SQL)(数据库的两张表通过"外键"，建立连接关系。) 特性。也就是在建立数据的关联时会比较麻烦。为了解决这个问题，Mongoose封装了一个Population功能。使用Population可以实现在一个 document 中填充其他 collection(s) 的 document(s)。
    // https://blog.csdn.net/qfxlw/article/details/84991715
    query.populate('friendId')

    // 排序方式 通讯时间倒叙排列
    // db.COLLECTION_NAME.find().sort({KEY:1,key2:-1});
    //  其中 1 为升序排列，而-1是用于降序排列.
    query.sort({
        'lastTime': -1
    })

    // 查询结果
    query.exec().then(function (e) {
        // map() 方法返回一个新数组，数组中的元素为原始数组元素调用函数处理后的值
        let result = e.map(function (ver) {
            return {
                id: ver.friendId._id,
                name: ver.friendId.name,
                nickname: ver.nickname,
                imgurl: ver.friendId.imgurl,
                lastTime: ver.lastTime,
                type: 0, // 0 -> 一对一聊天; 1 -> 群聊天
            }
        })

        res.send({
            status: 200,
            result
        })

    }).catch(function (err) {
        res.send({
            status: 500
        })
    })
}

//按要求获取一对一消息
exports.getOneMsg = function (data, res) {

    let query = Message.findOne({})

    // 查询条件
    query.where({
        $or: [{
            'userId': data.uid,
            'friendId': data.fid
        }, {
            'userId': data.fid,
            'friendId': data.uid
        }]
    })

    // 排序方式 通讯时间倒叙排列
    query.sort({
        'time': -1
    })

    // 查询结果
    query.exec().then(function (ver) {

        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types,
        }

        res.send({
            status: 200,
            result
        })

    }).catch(function (err) {
        res.send({
            status: 500
        })
    })
}

//汇总一对一消息未读数
exports.unreadMsg = function (data, res) {
    // 汇总条件
    let wherestr = {
        'userId': data.fid,
        'friendId': data.uid,
        'state': 1
    }

    // 匹配信息表
    Message.countDocuments(wherestr, (err, result) => {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200,
                result
            })
        }
    })
}

//一对一消息状态修改
exports.updateMsg = function (data, res) {

    let wherestr = {
        'userId': data.uid,
        'friendId': data.fid,
        'state': 1 //未读
    }

    let updatestr = {
        'state': 0 //已读
    }

    Message.updateMany(wherestr, updatestr, (err, result) => {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200
            })
        }
    })
}

// 按要求获取群列表
exports.getGroup = function (uid, res) {
    // id为用户，此用户所在群
    let query = GroupMembers.find({})

    // 查询条件
    query.where({
        'userId': uid
    })

    // 查找groupId关联
    query.populate('groupId')

    // 排序方式 通讯时间倒叙排列
    query.sort({
        'lastTime': -1
    })

    // 查询结果
    query.exec().then(function (e) {

        let result = e.map(function (ver) {
            return {
                id: ver.groupId._id,
                name: ver.groupId.name,
                nickname: ver.nickname,
                imgurl: ver.groupId.imgurl,
                lastTime: ver.lastTime,
                tip: ver.tip,
                type: 1, // 0 -> 一对一聊天; 1 -> 群聊天
            }
        })

        res.send({
            status: 200,
            result
        })

    }).catch(function (err) {
        res.send({
            status: 500
        })
    })
}

//按要求获取群最后一条消息
exports.getOneGroupMsg = function (gid, res) {

    let query = GroupMessage.findOne({})

    // 查询条件
    query.where({
        'groupId': gid,
    })

    // 查找groupId关联的user对象
    query.populate('userId')

    // 排序方式 通讯时间倒叙排列
    query.sort({
        'time': -1
    })

    // 查询结果
    query.exec().then(function (ver) {

        let result = {
            message: ver.message,
            time: ver.time,
            types: ver.types,
            name: ver.userId.name,
        }

        res.send({
            status: 200,
            result
        })

    }).catch(function (err) {
        res.send({
            status: 500
        })
    })
}

//群消息状态修改
exports.updateGroupMsg = function (data, res) {

    let wherestr = {
        'userId': data.uid,
        'groupId': data.fid,
    }

    let updatestr = {
        'tip': 0
    }

    Message.updateOne(wherestr, updatestr, (err, result) => {
        if (err) {
            res.send({
                status: 500
            })
        } else {
            res.send({
                status: 200
            })
        }
    })
}

// 消息操作
// 分页获取数据一对一聊天数据
exports.msg = function (data, res) {

    // 跳过的条数
    var skipNum = data.nowPage * data.pageSize

    // id为用户，此用户所在群
    let query = Message.find({})

    // 查询条件
    query.where({
        $or: [{
            'userId': data.uid,
            'friendId': data.fid
        }, {
            'userId': data.fid,
            'friendId': data.uid
        }]
    })

    // 排序方式 通讯时间倒叙排列
    query.sort({
        'time': -1
    })

    // 查找关联
    query.populate('userId')

    // 跳过条数
    query.skip(skipNum)

    // 一页条数
    query.limit(data.pageSize)

    // 查询结果
    query.exec().then(function (e) {

        let result = e.map(function (ver) {
            return {
                id: ver._id, //数据独有的id
                message: ver.message, //信息
                types: ver.types, //信息属性//信息属性
                time: ver.time, //信息时间
                fromId: ver.userId._id, //信息来自哪里,信息来源者
                imgurl: ver.userId.imgurl, //发送者头像链接
            }
        })

        res.send({
            status: 200,
            result
        })

    }).catch(function (err) {
        res.send({
            status: 500
        })
    })
}