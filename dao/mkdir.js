// 新建目录
const fs = require('fs')
const path = require('path')

exports.mkdirs = (pathname, callback) => {
    //需要判断是否是绝对路径（避免不必要的bug）
    // Node.js 中，__dirname 总是指向被执行 js 文件的绝对路径
    pathname = path.isAbsolute(pathname) ? pathname : path.join(__dirname, pathname);
    // 获取相对路径
    // path.relative() 方法根据当前工作目录返回 from 到 to 的相对路径
    pathname = path.relative(__dirname, pathname)
    //(path.sep) 将特定文字分隔符 ‘\\' 或 ‘/' 的字符串转换成数组对象
    // windows 系统下的例子 : 'foo\\bar\\baz'.split(path.sep) --return-->   ['foo', 'bar', 'baz'] 
    //path.sep避免平台差异带来的bug
    let floders = pathname.split(path.sep) 

    let pre = ''

    floders.forEach(floder => {
        // try 测试代码块的错误，catch 语句处理错误，throw 创建并跑出错误。
        // try {//在这里运行代码，抛出错误}  catch(err) {//在这里处理错误}
        try {
            //没有异常，文件已经创建，提示用户更改文件已经创建
            // 获取文件信息：
            // 异步版的fs.stat(path, callback) 方法返回一个stat数组对象
            // 同步版 fs.statSync(path)
            // path.join 将路径片段使用特定的分隔符（window：\）连接起来形成路径，并规范化生成的路径
            let _stat = fs.statSync(path.join(__dirname, pre, floder)) 
            // fs.stats有以下方法:
            // stats.isFile()
            // stats.isDirectory()
            // stats.isBlockDevice()
            // stats.isCharacterDevice()
            // stats.isSymbolicLink() (only valid with fs.lstat())
            // stats.isFIFO()
            // stats.isSocket()
            let hasMkdir = _stat && _stat.isDirectory()
            if (hasMkdir) {
                callback //&&callback(`文件${floder}已经存在，不能重复创建，请重新创建`)
            }
        } catch (error) {
            //抛出异常，文件不存在则创建文件
            try {
                //避免父文件还没创建的时候先创建子文件所出现的意外bug，这里选择同步创建文件
                fs.mkdirSync(path.join(__dirname, pre, floder))
                callback && callback(null)
            } catch (error) {
                callback && callback(error)
            }
        }
        pre = path.join(pre, floder) //路径合并
    })
}
