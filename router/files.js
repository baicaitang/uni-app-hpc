const express = require('express')
var router = express.Router()
// 引入附件上传插件
var multer = require('multer')
// 引入创建文件目录
var mkdir = require('../dao/mkdir')

// 控制文件存储
var storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //前端提供给后端文件存储路径
        let url = req.body.url
        // console.log('url:' + url)

        mkdir.mkdirs('../data/' + url, err => {
            console.log(err)
        })

        // '/data/test'后端文件路径
        cb(null, './data/' + url)
    },
    filename: function (req, file, cb) { //上传文件名

        let name = req.body.name
        // 正则匹配后缀名
        let type = file.originalname.replace(/.+\./, ".")
        // console.log(name)
        cb(null, name + type)
    }
})

var upload = multer({
    storage: storage
})



// 前端文件上传
router.post('/files/upload', upload.array('file', 10), function (req, res, next) {
    // req.files 是 `file` 文件数组的信息
    // req.body 将具有文本域数据，如果存在的话
    // 获取文件名
    let name = req.files[0].filename
    // console.log(req.files[0]);
    // 返回给前端
    res.send(name)
})


module.exports = router