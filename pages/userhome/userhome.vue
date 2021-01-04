<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>

			<view class="top-bar-right">
				<view class="more-img" v-if="relation == 0 || relation == 1" @tap="userDetail">
					<image src="../../static/images/userhome/more@3x.png" mode=""></image>
				</view>
			</view>
		</view>

		<view class="bg">
			<view class="bg-cover" :animation="animationData5">
			</view>
			<image class="bg-img" :src="user.imgurl" mode="aspectFill"></image>
		</view>

		<view class="main">
			
				<view class="user-header" @tap="userDetail">
					<view class="sex" :animation="animationData4" :style="{background:sexBg}">
						<image :src="seximg" mode=""></image>
					</view>
					<image :animation="animationData3" class="user-img" :src="user.imgurl" mode=""></image>
				</view>
			
			<view class="user-info">
				<view class="name">
					{{nickname}}
				</view>
				<view class="nickname">
					昵称：{{user.name}}
				</view>
				<view class="bio">
					{{user.explain}}
				</view>
			</view>

			<view class="bottom-bar">
				<view class="bottom-btn btn1" @tap="addFriendBtn" v-if="relation == 2">
					加为好友
				</view>
				<view class="bottom-btn btn1" v-if="relation == 1">
					发送消息
				</view>
			</view>

			<view class="add-msg" :animation="animationData" :style="{height:addHeight+'px',bottom:-addHeight+'px'}">
				<view class="name">
					{{user.name}}
				</view>
				<textarea class="add-main" v-model="msg" maxlength="120" placeholder="" />
				</view>
			
			<view class="add-btn bottom-bar" :animation="animationData2">
				<view class="cancel btn1" @tap="addFriendAnimate">
					取消
				</view>
				<view class="send btn1" @tap="addSubmit">
					发送申请
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexBg:'rgba(39,40,51,1)',//性别背景颜色
				myname:'',
				nickname:'',
				seximg:'../../static/images/userhome/asexual.png',//性别
				user:{},//用户信息
				addHeight:0,//add-msg板块高
				addWidth:0,//页面宽
				animationData:{},//动画
				animationData2:{},
				animationData3:{},
				animationData4:{},
				animationData5:{},
				isAdd:false,//动画开关
				id:'',//查看的用户对象id
				uid:'',//用户id
				relation:'',//用户关系：0 表示自己，1 好友，2 陌生人 
				token:'',
				msg:'',//添加好友信息
			};
		},
		onReady(){
			this.getElementStyle()
		},
		onLoad(e) {
			this.id = e.id
			this.getStorage()
			this.getUser()
			this.judgeFriend()
		},
		methods:{
			backOne() { //返回上一页
				// console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			userDetail(){//跳转到用户详情页
				uni.navigateTo({
					url:'../userdetail/userdetail?id='+this.id
				});
			},
			toUserDetail(){//跳转到注册页面
				uni.navigateTo({
					url:'../userdetail/userdetail',
				})
			},
			getElementStyle(){//获取页面高度
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
					this.addHeight = data.height - 186
					this.addWidth = data.width
				}).exec();
			},
			addFriendAnimate(){//添加好友动画
				
				this.isAdd = !this.isAdd
			
				var animation = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation2 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation3 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation4 = uni.createAnimation({
				  duration: 0,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation5 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				
				// 调用动画操作方法后要调用 step() 来表示一组动画完成		
				if(this.isAdd){
					animation.bottom(0).step()
					animation2.bottom(0).step()
					animation3.width(120).height(120).top(40).left(-(this.addWidth-120-6-60)/2).step()
					animation4.opacity(0).step()
					animation5.backgroundColor('rgba(255,228,49,0.6)').step()
				}else{
					animation.bottom(-this.addHeight).step()
					animation2.bottom(-100).step()
					animation3.width().height().top(0).left(0).step()
					animation4.opacity(1).step()
					animation5.backgroundColor('rgba(255,228,49,0)').step()
				}
				this.animationData = animation.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()
				this.animationData5 = animation5.export()
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
							res.imgurl = this.serverUrl + '/user/' + res.imgurl
							// 处理简介
							if(res.explain == undefined){
								res.explain = '这个人很懒，什么都没有留下~'
							}
							// 处理昵称
							if(this.nickname.length == 0){
								this.nickname = res.name
							}
							
							this.sexJudge(res.sex)
							
							this.user = res
							
						}else if(status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							// token过期了，跳回登录页
							uni.navigateTo({
								url:'../login/login?name=' + this.myname,
							});
						}
					}
				})
			},
			sexJudge(e){// 性别判断
				if(e == 'male'){
					this.seximg = '../../static/images/userhome/male.png'
					this.sexBg = 'rgba(87,153,255,1)'
				}else if(e == 'female'){
					this.seximg = '../../static/images/userhome/female.png'
					this.sexBg = 'rgba(255,93,91,1)'
				}else{// 性别未知
					this.seximg = '../../static/images/userhome/asexual.png'
					this.sexBg = 'rgba(39,40,51,1)'
				}
			
			},
			judgeFriend(){// 判断用户关系
				if(this.id == this.uid){
					this.relation = 0
					// console.log('我自己！')
					
				}else{
					
					// 如果不是自己,进行后端验证，判断是否为好友

					uni.request({
						url:this.serverUrl + '/search/isfriend',
						data:{
							uid:this.uid,
							fid:this.id,
							token:this.token,
						},
						method:'POST',
						success:(data) => {
							// console.log(data)
							let status = data.data.status
							
							// 访问后端成功
							if(status == 200){
								// 好友
								this.relation = 1
								this.getNickName()
								// console.log('你的好友！')
								
							}else if(status == 400){
								// 陌生人
								this.relation = 2
								
							}else if (status == 500){
								uni.showToast({
								    title: '服务器出错了！',
										icon:'none',
								    duration: 2000
								});
							}else if(status == 300){
								uni.navigateTo({
									url:'../login/login?name='+this.myname
								})
							}
						}
					})
					
				}
			},
			getNickName(){//获取好友昵称
				uni.request({
					url:this.serverUrl + '/user/getnickname',
					data:{
						uid:this.uid,
						fid:this.id,
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
							
							if(res.nickname != undefined){
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
								// token过期了，跳回登录页
								uni.navigateTo({
									url:'../login/login?name=' + this.myname,
								});
								
							}
					}
				})
			},
			addSubmit(){//添加好友
				if(this.msg.length > 0){
					
					this.addFriendAnimate()
					
					uni.request({
						url:this.serverUrl + '/friend/applyfriend',
						data:{
							uid:this.uid,
							fid:this.fid,
							token:this.token,
							msg:this.msg,
						},
						method:'POST',
						success:(data) => {
							
							let status = data.data.status
							// console.log(status)
							// 访问后端成功
							if(status == 200){
								uni.showToast({
								    title: '好友请求发送成功！',
										icon:'none',
								    duration: 2000
								});
								
							}else if(status == 300){
								// token过期了，跳回登录页
								uni.navigateTo({
									url:'../login/login?name=' + this.myname,
								});
								
							}else if(status == 500){
								uni.showToast({
								    title: '服务器出错了！',
										icon:'none',
								    duration: 2000
								});
							}
							
						}
					})
				}
			},
			addFriendBtn(){//添加好友按钮
				this.fid = this.id
				this.msg = this.myname + '	请求添加好友~'
				this.addFriendAnimate()
			},
		},
		
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		.top-bar {
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
			background: rgba(0,0,0,0);
			border-bottom: none;
		}

		.bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			.bg-cover {
				width: 110%;
				height: 110%;
			}

			.bg-img {
				opacity: 0.4;
				position: absolute;
				top: -10rpx;
				left: -10rpx;
				width: 110%;
				height: 110%;
				filter: blur(12px);
				z-index: -1;
			}
		}

		.main {
			text-align: center;
			
			.user-header {
				padding-top: 148rpx;
				position: relative;
				margin: 0 auto;
				width: 412rpx;
				height: 412rpx;

				.sex {
					position: absolute;
					bottom: 22rpx;
					right: 22rpx;
					width: 64rpx;
					height: 64rpx;
					line-height: 64rpx;
					border-radius: $uni-border-radius-circle;
					z-index: 4;
					
					image{
						padding: 16rpx;
						width: 32rpx;
						height: 32rpx;
					}
				}

				.user-img {
					top:0;
					z-index: 3;
					width: 400rpx;
					height: 400rpx;
					border-radius: 48rpx;
					border: 6rpx solid rgba(255,255,255,1);
					box-shadow: 0px 36rpx 40rpx 0px rgba(39,40,50,0.1);
				}
			}
			
			.bottom-bar{
				.bottom-btn{
					margin:0 $uni-spacing-col-base;
					background-color: $uni-color-primary;
				}
			}
			
			.user-info{
				padding-top: 42rpx;
				
				.name{
					font-family: PingFangSC-Regular;
					font-size: 52rpx;
					line-height: 74rpx;
					color: $uni-text-color;
					letter-spacing: -0.89px;
				}
				
				.nickname{
					font-family: PingFangSC-Regular;
					font-size:  $uni-font-size-base;
					color: $uni-text-color;
					line-height:40rpx;
					letter-spacing: -0.48px;
				}
				
				.bio{
					padding: 20rpx 100rpx;
					font-family: PingFangSC-Light;
					font-size: $uni-font-size-base;
					color: $uni-text-color;
					text-align: center;
					letter-spacing: -0.48px;
					line-height: 48rpx;
				}
			}
			
			.add-msg{
				padding: 0 56rpx;
				box-sizing: border-box;
				position: fixed;
				left: 0;
				width: 100%;
				background-color: rgba(255,255,255,1);
				border-radius: 40rpx 40rpx 0px 0px;
				text-align: left;
				
				.name{
					padding: 168rpx 0 40rpx;
					font-size: 52rpx;
					color: $uni-text-color;
					line-height:74rpx;
					
				}
				
				.add-main{
					box-sizing: border-box;
					padding: 18rpx 22rpx;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					height: 40%;
					width: 100%;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
				}
			}
			
			.add-btn{
				bottom: -204rpx;
				z-index: 100;
				display: flex;
				
				.cancel{
					flex:auto;
					width: 172rpx;
					background-color: $uni-bg-color-hover;
					margin-left: $uni-spacing-col-base;
				}
				
				.send{
					flex:auto;
					margin:0 $uni-spacing-col-base;
					background-color: $uni-color-primary;
				}
			}
				
		}
	}
</style>
