## 1.git推送到远程仓库

```shell
1.设置用户名和邮箱(--global 为全局参数，表明本地所有Git仓库都会使用这个配置)

git config --global user.name "yourname"

git config --global user.email "your_email@youremail.com"

2.生成密钥(SSH key)

ssh-keygen -t rsa -C "your_email@youremail.com"

3.添加密钥(SSH key)，并验证是否成功

添加密钥：将上一步骤生成的密钥即.ssh/id_rsa.pub中内容全部复制。在github的 Settings-->SSH and GPG keys-->New SSH key，key中粘贴复制的内容(Title自定义)。

验证：github输入第一条的命令，码云输入第二条

a.ssh -T git@github.com

b.ssh -T git@gitee.com

4.创建项目工程远程仓库：在github中New repository
 
5.命令初始化仓库
git init
 
6.连接远程仓库(下面两种方式都可以)

git remote add origin git@github.com:yourName/repositoryname.git

git remote add origin https://github.com/yourName/repositoryname.git

7.从远程仓库pull文件(若远程仓库没有文件，直接执行步骤六)

git pull -u origin master (初次上传需要添加 -u 参数 ,执行过之后，会让输入账户名和密码 然后本地仓库的代码就会上传到远程仓库了)

8.将本地文件push到远程仓库(若没有文件则手动创建)

git status　　　　　　　　　　查看工作目录的状态

git add <file>　　　　　　　　将文件添加到暂存区

git commit -m "commnet" 　　提交更改,添加备注信息(此时将暂存区的信息提交到本地仓库)

git push -u origin master 　　 将本地仓库的文件push到远程仓库(若 push 不成功，可加 -f 进行强推操作)

9. 打tag
git add .   将所有文件提交到缓存区

git commit -m "练习打tag"    提交一下

git tag  01_知识点1练习打tag    打tag

git  tag  (查看当前打的所有tag) 

git log (查看一下所有的提交)

git push --tags     （将这两个tag 推送到远程  不是git push origin  master）

10.版本回退到最初版本
git reset --hard 黄色的版本号     （--hard 参数是 强制回退到指定版本）
```

