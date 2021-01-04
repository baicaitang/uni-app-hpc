let dbserver = require('./dbserver')

module.exports = function (io) {

    // socket注册用户
    var users = {}

    io.on('connection', (socket) => {
        // console.log('a user connected');


        // 用户登录注册
        socket.on('login', (id) => {
            console.log(socket.id + '注册')
            // 回复客户端
            socket.emit('login', socket.id)

            socket.name = id

            users[id] = socket.id
            // console.log(users);

        });

        // 用户1对1消息发送
        socket.on('msg', (msg, fromId, toId) => {
            console.log(msg)

            // 修改好友最后通讯时间
            dbserver.friendMsgLastTime({
                uid: fromId,
                fid: toId
            })
            // 存储一对一消息
            dbserver.inserMsg(fromId, toId, msg.message, msg.types)

            // 发送给对方
            //  0 代表发给对方聊天页面渲染
            if (users[toId]) {
                socket.to(users[toId]).emit('msg', msg, fromId, 0)
            }

            // 发送给自己
            // 1 代表发给自己首页渲染
            socket.emit('msg', msg, toId, 1)

        });

        // 用户离开
        socket.on('disconnecting', () => {

            // hasOwnProperty() 方法返回一个布尔值， 判断对象是否包含特定的自身（ 非继承） 属性
            if (users.hasOwnProperty(socket.name)) {
                // 清空注册用户
                delete users[socket.name]
                // console.log(users);
            }

            console.log(socket.id + '离开')
        })
    })
}