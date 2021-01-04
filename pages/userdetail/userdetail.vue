<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					详请
				</view>
			</view>
			<view class="top-bar-right pice">
			</view>
		</view>

		<view class="main">
			<view class="column">
				<view class="row">
					<view class="title">
						头像
					</view>
					<view class="content head"  v-if="id == uid">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more" v-if="id == uid">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
					<image :src="cropFilePath"class="user-img" v-if="id != uid"></image>
				</view>
				<view class="row" @tap="modify('explain','修改签名',user.explain,false)" v-if="id == uid">
					<view class="title">
						签名
					</view>
					<view class="content">
						{{user.explain}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">
						签名
					</view>
					<view class="content">
						{{user.explain}}
					</view>
				</view>
				<view class="row">
					<view class="title">
						注册
					</view>
					<view class="content">
						{{timeChange(user.time)}}
					</view>
				</view>
				<view class="row" @tap="modify('name','修改昵称',user.name,false)" v-if="id == uid">
					<view class="title">
						昵称
					</view>
					<view class="content">
						{{user.name}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('nickname','修改昵称',nickname,false)" v-if="id != uid">
					<view class="title">
						昵称
					</view>
					<view class="content">
						{{nickname}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						性别
					</view>
					<view class="content">
						<view class="uni-list-cell-db">
							<picker v-if="id == uid" @change="bindPickerChange" :value="index" :range="array">
								<view class="uni-input">{{array[index]}}</view>
							</picker>
							<view class="uni-input" v-if="id != uid">{{array[index]}}</view>
						</view>
					</view>
					<view class="more" v-if="id == uid">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						生日
					</view>
					<view class="content">
						<picker v-if="id == uid" mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
						<view class="uni-input" v-if="id != uid">{{date}}</view>
					</view>
					<view class="more" v-if="id == uid">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('phone','修改电话',user.phone,false)" v-if="id == uid">
					<view class="title">
						电话
					</view>
					<view class="content">
						{{user.phone}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" v-if="id != uid">
					<view class="title">
						电话
					</view>
					<view class="content" >
						{{user.phone}}
					</view>
				</view>
				<view class="row" @tap="modify('email','修改邮箱',user.email,true)" v-if="id == uid">
					<view class="title">
						邮箱
					</view>
					<view class="content">
						{{user.email}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row"v-if="id != uid">
					<view class="title">
						邮箱
					</view>
					<view class="content">
						{{user.email}}
					</view>
				</view>
				<view class="row" @tap="modify('psw','修改密码',pwd,true)" v-if="id == uid">
					<view class="title">
						密码
					</view>
					<view class="content">
						******
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="btn2" @tap="quit" v-if="id == uid">
			退出登录
		</view>
		<view class="btn2" @tap="deleteFriend" v-if="id != uid">
			删除好友
		</view>

		<view class="modify" v-show="isModify" :style="{bottom:-height+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="cancel" @tap="modify">
					取消
				</view>
				<view class="title">
					{{modifyTitle}}
				</view>
				<view class="define" @tap="modifySubmit">
					确定
				</view>
			</view>
			<view class="modify-main">
				<input v-if="ispwd" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;" />
				<textarea :style="{display:istext}" v-model="data" class="modify-content" />
				</view>
		</view>

	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	import myfun from "../../commons/js/myfun.js"
	export default {
		data() {
			const currentDate = this.getDate({
				format: true
			})
			return {
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				cropFilePath: '',
				headimg:'',//头像
				data:'',//修改的内容
				oldData:'',//原始内容
				type:'',//修改项
				pwd:undefined,//原密码
				oldPwd:'',
				ispwd:false,//是否显示修改密码框
				istext:'block',
				animationData:{},//动画
				isModify:false,//动画开关
				height:0,//页面高
				modifyTitle:'',//修改标题
				rightImg:"../../static/images/userdetail/左去@3x.png",
				uid:'',
				myname:'',
				token:'',
				id:'',
				user:'',
				nickname:'',
			};
		},
		onReady(){
			this.getElementStyle()//获取页面高度
		},
		onLoad(e) {
			this.id = e.id
			this.getStorage()
			this.getUser()
			this.getNickName()
		},
		computed: {
			startDate() {
				return this.getDate('start');
			},
			endDate() {
				return this.getDate('end');
			},

		},
		components: {
			ImageCropper //图片裁剪插件
		},
		methods: {
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			quit(){//退出登录
				uni.removeStorage({
					key:'user',
					success:function(res){
						console.log('success!')
					}
				})
				uni.navigateTo({
					url:'../login/login'
				});
			},
			deleteFriend(){//删除好友
				uni.showModal({
				    title: '提示',
				    content: '确定删除该好友吗？',
				    success: (res) => {
				        if (res.confirm) {
				            uni.request({
				            	url:this.serverUrl + '/friend/deletefriend',
				            	data:{
				            		uid:this.uid,
				            		fid:this.id,
				            		token:this.token,
				            	},
				            	method:'POST',
				            	success:(data) => {
				            		console.log(data.data.status)
				            		let status = data.data.status
				            		
				            		// 访问后端成功
				            		if(status == 200){
													// 跳到首页
				            			uni.navigateTo({
				            				url:'../index/index',
				            			});
				            				
				            		}else if(status == 500){
				            			uni.showToast({
				            			    title: '服务器出错了！',
				            					icon:'none',
				            			    duration: 2000
				            			});
				            		}else if(status == 300){
													// token过期
				            				uni.navigateTo({
				            					url:'../login/login?name='+this.myname,
				            				});
				            		}
				            	}
				            })
				        } else if (res.cancel) {
				            console.log('用户点击取消');
				        }
				    }
				});
			},
			timeChange(t){//时间处理
				return myfun.detailTime(t)
			},
			bindPickerChange(e) { //修改性别
			
				let oldIndex = this.index
				this.index = e.target.value
				// console.log("old:"+this.oldIndex +"----"+"index:"+this.index)
				
				if(this.index != oldIndex){
					let sex = 'asexual'
					if(this.index == 0){
						sex = 'male'
					}else if(this.index == 1){
						sex = 'female'
					}
					// 修改数据
					this.update(sex,'sex',undefined)
				}
				
			},
			bindDateChange(e) { //修改日期
			  let oldDate = this.date 
				this.date = e.target.value
				
				if(this.date != oldDate){
					this.update(this.date,'birth',undefined)
					console.log(this.date)
				}
			},
			getDate(type) {//获取日期
				const date = new Date();
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();

				if (type === 'start') {
					year = year - 60;
				} else if (type === 'end') {
					year = year + 2;
				}
				month = month > 9 ? month : '0' + month;;
				day = day > 9 ? day : '0' + day;
				return `${year}-${month}-${day}`;
			},
			upload() {//图片裁剪
				uni.chooseImage({
					count: 1, //默认9
					sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album', 'camera'], //从相册相机选择
					success: (res) => {
						this.tempFilePath = res.tempFilePaths.shift()
					}
				});
				// console.log('图片裁剪')
			},
			confirm(e) {//选完头像后确认
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				
				uni.uploadFile({
					url: this.serverUrl + '/files/upload',
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					formData:{//传递参数
						url:'user',//存放文件夹
						name:this.uid,//存储图片名字
						token:this.token,
					},
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						// console.log(backstr)
						// 1.修改本地用户头像缓存
						try{
							uni.setStorageSync('user',{
								'id':this.uid,
								'name':this.myname,
								'imgurl':backstr,
								'token':this.token,
							})
						}catch(err){
							console.log('数据缓存出错！')
						}
						//2.修改数据库
						
						this.update(backstr,'imgurl',undefined)
						
					},
					complete() {
						//console.log("this is headimg"+this.headimg)   
					},
					fail(e) {
						console.log("this is errormes " + e.message)
					}

				});

			},
			cancel() {
				console.log('canceled');
				this.tempFilePath = "";
			},
			getElementStyle(){//获取页面高度
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
					this.height = data.height

				}).exec();
			},
			modify(type,title,data,ispwd){//修改弹框弹出动画
				
				if(ispwd){//true
				// 显示修改密码框
					this.ispwd = true
					this.istext = 'none'
					
				}else{//false
				// 显示修改文本域
					this.ispwd = false
					this.pwd = undefined
				}
				this.isModify = !this.isModify
				this.modifyTitle = title
				this.oldData = data//临时保存之前的内容
				this.data = data//之前的内容
				this.type = type
				
				
				var animation = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				
				if(this.isModify){
					animation.bottom(0).step();
				}else{
					animation.bottom(-this.height).step();
				}
				
				this.animationData = animation.export()
				
			},
			modifySubmit(){//弹框修改确定
				if(this.pwd == undefined && this.ispwd){
					uni.showToast({
					    title: '请输入原密码！',
							icon:'none',
					    duration: 2000
					});
					return false
				}else if (this.pwd && this.ispwd){
					this.oldPwd = this.pwd
					if(this.type == 'psw'){
						this.data = this.pwd
					}
					// console.log('6')
					// console.log( this.data)
					this.update(this.data,this.type,this.pwd)
					return false
				}
				
				if(this.pwd && this.type == 'psw'){
					this.oldData = this.pwd
				}
				// console.log( this.type)
				// 提交修改
				if(this.data.length > 0 && this.data != this.oldData){
							
						if(this.type == 'nickname'){
								//修改好友昵称
								this.updateFriendName()
								this.nickname = this.data
								
						}else if(this.type == 'email'){
								let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
								// console.log(this.data +'-----'+this.oldData)
								if (reg.test(this.data)) { //验证邮箱是否合格
									// console.log('邮箱合格')
									this.update(this.data,this.type,this.pwd)

								}else{
									uni.showToast({
									    title: '邮箱格式错误！',
											icon:'none',
									    duration: 2000
									});
									return false
								}
						}else if(this.type == 'psw'){
							
							if(this.data.length < 6){
								uni.showToast({
								    title: '密码长度过短！',
										icon:'none',
								    duration: 2000
								});
								return false
							}else{
								this.update(this.data,this.type,this.pwd)
							}
							console.log(this.data +'-----'+this.oldData)
							
						}else{
							// console.log('1')
							this.update(this.data,this.type,this.pwd)
								
						}
									
				}else{
					// 修改为空时或相同时
					// console.log('2')
					this.update(this.data,this.type,this.pwd)
				}

				// 前端替换修改
				// this.user[this.type] = this.data
				this.modify()
				
			},
			getStorage(){//获取缓存数据
				// 从本地缓存中同步获取指定 key 对应的内容
				try {
				    const value = uni.getStorageSync('user');
				    if (value) {
				        // console.log(value);
								
								this.uid = value.id	
								this.token = value.token			
								this.myname = value.name
								
				    }else{
							// 如果没有用户缓存，就跳转到登录页
							uni.navigateTo({
								url:'../login/login',
							});
						}
				} catch (e) {
				    // error
						uni.showToast({
						    title: '获取数据失败！',
								icon:'none',
						    duration: 2000
						});
				}
			},
			getUser(){//获取用户信息
				uni.request({
					url:this.serverUrl + '/user/detail',
					data:{
						id:this.id,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
							
							let res = data.data.result
							// console.log(res)
							
							// 处理头像链接
							this.cropFilePath = this.serverUrl + '/user/' + res.imgurl
							// 处理简介
							if(res.explain == undefined || res.explain == '' ){
								res.explain = '这个人很懒，什么都没有留下~'
							}
							// 处理生日
							if(res.birth== undefined){
								this.date = '0000-00-00'
							}else{
								let birth = myfun.detailTime2(res.birth)
								this.date = birth 
							}
							// 处理昵称
							if(this.nickname.length == 0){
								this.nickname = res.name
							}
							// 处理电话
							if(res.phone == undefined || res.phone == ' '){
								res.phone = '000'
							}
							
							this.sexJudge(res.sex)
							this.user = res
							// console.log(this.user)
							
						}else if(status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
								uni.showToast({
								    title: 'token过期！',
										icon:'none',
								    duration: 2000
								});
						}
					}
				})
			},
			getNickName(){//获取好友昵称
				if(this.id != this.uid){
					uni.request({
						url:this.serverUrl + '/user/getnickname',
						data:{
							uid:this.uid,
							fid:this.id,
							token:this.token,
						},
						method:'POST',
						success:(data) => {
							// console.log(data.data)
							let status = data.data.status
							
							// 访问后端成功
							if(status == 200){
								
								let res = data.data.result
								// console.log(res)
								if(res.nickname){
									// 如果昵称存在
									this.nickname = res.nickname
								}
								
							}else if(status == 500){
								uni.showToast({
								    title: '服务器出错了！',
										icon:'none',
								    duration: 2000
								});
							}else if(status == 300){
								uni.showToast({
								    title: 'token过期！',
										icon:'none',
								    duration: 2000
								});
						}
						}
					})
				}
				
			},
			sexJudge(e){// 性别判断
				if(e == 'male'){

					this.index = 0
				}else if(e == 'female'){

					this.index = 1
				}else{// 性别未知

					this.index = 2
				}
			
			},
			update(d,type,pwd){//修改数据库
			
				uni.request({
					url:this.serverUrl + '/user/update',
					data:{
						id:this.uid,
						data:d,//修改内容
						type:type,//修改项
						pwd:this.oldPwd?this.oldPwd:pwd,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						console.log(data.data.status)
						let status = data.data.status
						
						if(status != 400){
							this.ispwd = false
							this.istext = 'block'
							
						}
						
						// 访问后端成功
						if(status == 200){
							
							this.user[type]=d
							console.log('成功')
							
							if(type == 'psw' && d != this.oldPwd ){
								// 用户需要重新登录
								// 清除缓存
								uni.removeStorage({
									key:'user',
									success:function(res){
										console.log(' 更改密码success!')
									}
								})
								
								uni.navigateTo({
									url:'../login/login?relogin='+this.myname,
								});
							}
							
						}else if(status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 400){
							uni.showToast({
							    title: '输入原始密码错误！',
									icon:'none',
							    duration: 2000
							});
						}
						else if(status == 600){
							
								uni.showToast({
								    title: '邮箱已被占用！',
										icon:'none',
								    duration: 2000
								});
							
							
						}else if(status == 501){
								uni.showToast({
								    title: '昵称已存在！',
										icon:'none',
								    duration: 2000
								});
						}else if(status == 300){
								uni.showToast({
								    title: 'token过期！',
										icon:'none',
								    duration: 2000
								});
						}
					}
				})
			},
			updateFriendName(){//好友昵称修改
				if(this.data.length > 0 && this.data != this.oldData){
					uni.request({
						url:this.serverUrl + '/user/updatenickname',
						data:{
							uid:this.uid,
							fid:this.id,
							name:this.data,
							token:this.token,
						},
						method:'POST',
						success:(data) => {
							// console.log(data)
							let status = data.data.status
							
							// 访问后端成功
							if(status == 200){
								// this.modify()
								// console.log('昵称修改成功！')
								
							}else if(status == 500){
								uni.showToast({
								    title: '服务器出错了！',
										icon:'none',
								    duration: 2000
								});
							}else if(status == 300){
								uni.showToast({
								    title: 'token过期！',
										icon:'none',
								    duration: 2000
								});
						}
						}
					})
				}
				
		
			},
			
			
		}	
		
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		.top-bar {
			border-bottom: 1rpx solid $uni-border-color;
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0);
			display: flex;
			
			.top-bar-center{
				flex: auto;	
			}
		}

		.main {
			padding-top: 118rpx;
			display: flex;
			flex-direction: column;

			.column {
				display: flex;
				flex-direction: column;
				padding-top: 12rpx;
				width: 100%;
				border-bottom: 1rpx solid $uni-border-color;

				.row {
					display: flex;
					flex-direction: row;

					.head {
						height: 112rpx;
						display: flex;
						align-items: center;
					}

					.title {
						flex: none;
						padding: 0 $uni-spacing-col-base;
						font-size: $uni-font-size-lg;
						color: $uni-text-color;
						line-height: 112rpx;
						height: 112rpx;
						letter-spacing: -0.55px;
					}

					.content {
						flex: auto;
						padding-top: 0;
						padding-left: $uni-spacing-col-base;
						font-size: $uni-font-size-lg;
						color: $uni-text-color-grey;
						line-height: 112rpx;
						height: 112rpx;
						overflow: hidden;
						text-overflow: ellipsis;
						white-space: nowrap;
						
						.user-img {
							width: $uni-img-size-lg;
							height: $uni-img-size-lg;
							border-radius: $uni-border-radius-base;
						}
					}

					.more {
						flex: none;
						width: 80rpx;
						height: 112rpx;
						display: flex;
						align-items: center;

						image {
							width: 28rpx;
							height: 28rpx;
						}
					}
					
					.user-img {
						width: $uni-img-size-lg;
						height: $uni-img-size-lg;
						border-radius: $uni-border-radius-base;
					}
				}
			}
		}
		
		// 修改弹框
		.modify{
			position:fixed;
			left: 0;
			z-index: 100;
			height: 100%;
			width: 100%;
			background-color: #fff;
			
			.modify-header{
				width: 100%;
				height: 88rpx;
				padding-top: var(--status-bar-height);
				display: flex;
				flex-direction: row;
				border-bottom: 1rpx solid $uni-border-color;
				
				.cancel{
					padding-left: 32rpx;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 88rpx;
				}
				
				.title{
					flex: auto;
					text-align: center;
					font-size: 40rpx;
					color: $uni-text-color;
					line-height: 88rpx;
				}
				
				.define{
					padding-right: 32rpx;
					font-size: $uni-font-size-lg;
					color: $uni-color-success;
					line-height: 88rpx;
				}
				
			}
			
			.modify-main{
				display: flex;
				flex-direction: column;
				padding: 30rpx $uni-spacing-col-base;
				
				.modify-content{
					flex: auto;
					width: 100%;
					box-sizing: border-box;
					height: 386rpx;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					padding: 16rpx 20rpx;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
				}
				
				.modify-pwd{
					flex: auto;
					height: 88rpx;
					padding: 0 20rpx;
					margin-bottom: $uni-spacing-col-base;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 88rpx;
				}
				
			}
			
		}

	}
</style>
