var mongoose = require('mongoose')

// 连接数据库
var db = mongoose.createConnection('mongodb://localhost:27017/xuexi', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('数据库打开成功！')
});

module.exports = db