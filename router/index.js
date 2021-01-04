const express = require('express')
var router = express.Router()
// 引入邮箱发送方法
var emailserver = require('../dao/emailserver.js')
//引入注册页面服务
var signup = require('../server/signup.js')
//引入登录页面服务
var signin = require('../server/signin.js')
// 引入搜索页面服务
var search = require('../server/search.js')
// 引入用户详情页面服务
var user = require('../server/userdetail.js')
// 引入申请好友页面服务
var friend = require('../server/friend.js')
// 主页
var index = require('../server/index.js')
// 聊天页面
var chat = require('../server/chat.js')


router.get('/test', function (req, res) {
    // 请求/test页面，点击登录后查找用户数据
    res.send('test!!!!!!!!!!')
})

// 邮箱测试
router.post('/mail', (req, res) => {
    // mail用户提交的邮箱
    let mail = req.body.mail
    emailserver.emailSignUp(mail, res)
})

//注册页面
router.post('/signup/add', (req, res) => {
    signup.signUp(req, res)
})

// 用户或邮箱是否占用判断
router.post('/signup/judge', (req, res) => {
    signup.judgeValue(req, res)
})

//登录页面
router.post('/signin/match', (req, res) => {
    signin.signIn(req, res)
})

// 搜素页面
// 搜素用户
router.post('/search/user', (req, res) => {
    search.searchUser(req, res)
})

//判断是否为好友
router.post('/search/isfriend', (req, res) => {
    search.isFriend(req, res)
})

//搜索群
router.post('/search/group', (req, res) => {
    search.searchGroup(req, res)
})

//判断是否在群内
router.post('/search/isingroup', (req, res) => {
    search.isInGroup(req, res)
})

// 用户详情
router.post('/user/detail', (req, res) => {
    user.userDetail(req, res)
})

// 用户信息修改
router.post('/user/update', (req, res) => {
    user.userUpdate(req, res)
})

// 好友昵称修改
router.post('/user/updatenickname', (req, res) => {
    user.updateFriendNickName(req, res)
})

//获取好友昵称
router.post('/user/getnickname', (req, res) => {
    user.getFriendNickName(req, res)
})

// 好友操作
// 好友申请
router.post('/friend/applyfriend', (req, res) => {
    friend.applyFriend(req, res)
})

// 更新好友状态
router.post('/friend/updateFriendState', (req, res) => {
    friend.updateFriendState(req, res)
})

// 拒绝或删除好友
router.post('/friend/deletefriend', (req, res) => {
    friend.deleteFriend(req, res)
})

// 主页
// 获取好友
router.post('/index/getfriend',(req,res)=>{
    index.getFriend(req,res)
})

// 获取最后一条信息
router.post('/index/getlastmsg',(req,res)=>{
    index.getLastMsg(req,res)
})

// 汇总一对一消息未读数
router.post('/index/unreadmsg',(req,res)=>{
    index.unreadMsg(req,res)
})

// 修改一对一消息未读数
router.post('/index/updatemsg',(req,res)=>{
    index.updateMsg(req,res)
})

// 获取群
router.post('/index/getgroup',(req,res)=>{
    index.getGroup(req,res)
})

// 获取群最后一条信息
router.post('/index/getlastgroupmsg',(req,res)=>{
    index.getOneGroupMsg(req,res)
})


// 修改群消息未读数
router.post('/index/updategroupmsg',(req,res)=>{
    index.updateGroupMsg(req,res)
})


//聊天页面
// 分页获取数据一对一聊天数据
router.post('/chat/msg',(req,res)=>{
    chat.msg(req,res)
})

// token测试
router.post('/signin/test', (req, res) => {
    // signin.test(req, res)
    res.send('token right!')
})

module.exports = router