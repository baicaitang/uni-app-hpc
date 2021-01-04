var mongoose = require('mongoose')
var db = require('../config/db.js')
var Schema = mongoose.Schema

// 创建表

// 用户表
var UserSchema = new Schema({
    name: {
        type: String
    }, //用户名
    psw: {
        type: String
    }, //密码
    email: {
        type: String
    }, //邮箱
    sex: {
        type: String,
        default: 'asexual'
    }, //性别
    birth: {
        type: Date
    }, //生日
    phone: {
        type: Number
    }, //电话
    explain: {
        type: String
    }, //签名
    imgurl: {
        type: String,
        default: '/user/user.png'
    }, //头像
    time: {
        type: Date
    }, //注册时间
});

// 好友表
var FriendSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //用户id
    friendId: {
        type: Schema.Types.ObjectId,
        ref: 'User' //friendId 和 User 用户表建立联系
    }, //好友id
    nickname: {
        type: String
    }, //昵称
    state: {
        type: String
    }, //好友状态（0->已为好友，1->向对方申请中，2->对方发送申请，仍未同意）
    time: {
        type: Date
    }, //生成时间
    lastTime: {
        type: Date
    } //最后通讯时间
});

// 一对一信息表
var MessageSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //用户id
    friendId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //接收者id
    message: {
        type: String
    }, //发送内容
    types: {
        type: String
    }, //内容属性（0-> 文字，1->图片链接，2->音频链接，3->地图定位……）
    time: {
        type: Date
    }, //发送时间
    state: {
        type: Number
    }, //消息状态（0->已读，1->未读）
});

// 群表
var GroupSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //用户id
    name: {
        type: String
    }, //群名
    imgurl: {
        type: String,
        defalut: '/group/group.png'
    }, //群头像
    time: {
        type: Date
    }, //创建时间
    synopsis: {
        type: String
    }, //群简介
});

// 群成员表
var GroupMembersSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }, //群id
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //用户id
    name: {
        type: String
    }, //群内名称
    tip: {
        type: Number,
        defalut: 0
    }, //未读消息数
    time: {
        type: Date
    }, //加入时间
    lastTime: {
        type: Date
    }, //最后通讯时间
    shield: {
        type: String,
        default: 0
    }, //是否屏蔽群消息（0->默认不，1->屏蔽）
});

// 群消息表
var GroupMessageSchema = new Schema({
    groupId: {
        type: Schema.Types.ObjectId,
        ref: 'Group'
    }, //群id
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }, //用户id
    message: {
        type: String
    }, //发送内容
    types: {
        type: String
    }, //内容属性（0-> 文字，1->图片链接，2->音频链接，3->地图定位……）
    time: {
        type: Date
    }, //发送时间
});

module.exports = db.model('User', UserSchema);
module.exports = db.model('Friend', FriendSchema);
module.exports = db.model('Message', MessageSchema);
module.exports = db.model('Group', GroupSchema);
module.exports = db.model('GroupMembers', GroupMembersSchema);
module.exports = db.model('GroupMessage', GroupMessageSchema);