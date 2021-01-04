<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<navigator :url="'../userhome/userhome?id='+uid" hover-class="none">
					<image :src="imgurl" mode=""></image>
				</navigator>
			</view>

			<view class="top-bar-center">
				<image src="" mode="" class="logo"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/search/search@3x.png" mode="" class="search-img"></image>
				</view>

				<view class="add" @tap="toBuildGroup">
					<image src="../../static/images/index/addgroup@3x.png" mode="" class="add-img"></image>
				</view>
			</view>
		</view>

		<view class="main">
			<view class="refresh" v-if="!refresh ">
				<image src="../../static/images/index/refresh.png" mode=""></image>
				<view class="res-title">
					下拉刷新
				</view>
			</view>
			<view class="no-friends" v-if="isnofriend">
				<image src="../../static/images/index/bg.png" mode="aspectFit"></image>
				<view class="no-title">
					还没有好友~
				</view>
				<view class="no-search" @tap="toSearch">
					搜索好友
				</view>
			</view>
			<view class="apply" v-if="requestCount>0">
				<view class="friends-list" @tap="toFriendsRequest">
					<view class="friends-list-l">
						<text class="tips">
							{{requestCount}}
						</text>
						<image src="../../static/images/index/nus.png" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="name">
							好友申请
						</view>
						<view class="time">
							{{changeTime(requestTime)}}
						</view>
						<view class="info">
							茫茫人海，相聚便是缘分
						</view>
					</view>
				</view>
			</view>
			<view class="friends" >
				<view class="friends-list" v-for="(item,index) in friends" :key="index" @tap="toChatRoom(item)">
					<view class="friends-list-l">
						<text class="tips" v-if="item.tip > 0">
							{{parseInt(item.tip)>100?'···':item.tip}}
						</text>
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="name">
							{{item.name}}
						</view>
						<view class="time">
							{{changeTime(item.lastTime)}}
						</view>
						<view class="info">
							{{item.message}}
						</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				friends: [],
				uid:'',//用户id
				imgurl:'',//用户头像
				token:'',//token
				requestCount:0,//好友申请数
				requestTime:'',//申请时间
				myname:'',
				refresh:false,//下拉刷新状态
				isnofriend:false,//是否有好友
				
			}
		},
		onLoad() {
			uni.startPullDownRefresh();
			this.getStorage()
			this.changeTime()
			this.getFriends()
			this.friendsRequest()
			this.join(this.uid)
			// this.socketTest()
			this.receiveSocketMsg()
		},
		onPullDownRefresh() {//停止下拉刷新
			this.friends = []
			this.getStorage()
		  this.getFriends()
		  this.friendsRequest()
		  setTimeout(function () {
		      uni.stopPullDownRefresh();
		  }, 1000);
		},
		methods: {
			changeTime(t) { //获取时间
				return myfun.dateTime(t)
			},
			friendsRequest(){ //获取好友申请数据
				uni.request({
					url:this.serverUrl + '/index/getfriend',
					data:{
						uid:this.uid,
						state:1,//1->申请中
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
							this.refresh = true
							let res = data.data.result
							// console.log(res)
							
							this.requestCount = res.length
							
							if(res.length>0 ){
								this.isnofriend = false
								this.requestTime = res[0].lastTime
								for(let i = 0; i<res.length ; i++){
									if(this.requestTime < res[i].lastTime){
										this.requestTime = res[i].lastTime
									}
								}
							}else if(res.length == 0){
								
								this.isnofriend = true
							}	
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
							console.log('aaa')
						}else if(status == 300){
							// console.log('首页')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			toSearch() {//跳转到搜索页面
				uni.navigateTo({
					url: '../search/search'
				})
			},
			toFriendsRequest() {//跳转到好友申请页面
				uni.navigateTo({
					url: '../friendsrequest/friendsrequest'
				})
			},
			toChatRoom(data) {//跳转到聊天页面
				//type: 0 -> 一对一聊天; 1 -> 群聊天
				uni.navigateTo({
					url: '../chatroom/chatroom?id='+data.id+'&name='+data.name+'&img='+data.imgurl+'&type='+data.type
				})
			},
			toBuildGroup(){//跳转到创建群聊页面
				uni.navigateTo({
					url: '../buildgroup/buildgroup'
				})
			},
			getStorage(){//获取缓存数据
				// 从本地缓存中同步获取指定 key 对应的内容
				try {
				    const value = uni.getStorageSync('user');
				    if (value) {
				        // console.log(value);
								
								this.uid = value.id
								this.imgurl = this.serverUrl + '/user/' + value.imgurl
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
			getFriends(){ //获取朋友数据
				uni.request({
					url:this.serverUrl + '/index/getfriend',
					data:{
						uid:this.uid,
						state:0,//0 --> 已为好友
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
							this.refresh = true
							let res = data.data.result
							// console.log(res)
							
							if(res.length>0){
								this.isnofriend = false
								for(let i = 0; i<res.length ; i++){						
									res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl
									if(res[i].nickname){
										res[i].name = res[i].nickname
									}
									this.friends.push(res[i])
								}
								//获取好友消息
								for(let i = 0; i<this.friends.length; i ++){
									this.getLastMsg(this.friends,i)
									this.getUnread(this.friends,i)
								}
							}else{
								this.isnofriend = true
							}
							this.getGroup()
							this.friends = myfun.sort(this.friends,'lastTime',0)
							// console.log(this.friends)	
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
							
						}else if(status == 300){
							// console.log('首页')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			getGroup(){ //获取群数据
				uni.request({
					url:this.serverUrl + '/index/getgroup',
					data:{
						uid:this.uid,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
						
							let res = data.data.result
							// console.log('群：'+res)
							
							if(res.length>0){
								for(let i = 0; i<res.length ; i++){
									
									res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl
									this.friends.push(res[i])
								}
							}
								
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('首页')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			getLastMsg(arr,i){//获取最后一条信息
				uni.request({
					url:this.serverUrl + '/index/getlastmsg',
					data:{
						uid:this.uid,
						fid:arr[i].id,
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
							if(res.types == 0){
								// 文字
							}else if(res.types == 1){
								//图片
								res.message = '[图片]'
							}else if(res.types == 2){
								// 音频
								res.message = '[音频]'
							}else if(res.types == 3){
								// 地图定位
								res.message = '[位置]'
							}
							
							let item = arr[i]
							item.message = res.message
							arr.splice(i,1,item)//替换
								
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('首页')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			getUnread(arr,i){//获取一对一消息未读数
				uni.request({
					url:this.serverUrl + '/index/unreadmsg',
					data:{
						uid:this.uid,
						fid:arr[i].id,
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
							
							let item = arr[i]
							item.tip = res
							arr.splice(i,1,item)//替换
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('首页')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			//socket模块
			join(uid){//用户登录socket注册
				this.socket.emit('login',uid)
			},
			receiveSocketMsg(){//Socket聊天数据处理
				this.socket.on('msg',(msg,fromId)=>{
					// console.log(msg)
					let nmsg = ''
					
					if(msg.types == 0){
						nmsg = msg.message	
					}else if(msg.types == 1){
						nmsg = '[图片]'
					}else if(msg.types == 2){
						nmsg = '[音频]'
					}else if(msg.types == 3){
						nmsg = '[位置]'
					}
					
					// 首页消息列对比到对应项修改
					for(let i=0;i<this.friends.length;i++){
						if(this.friends[i].id == fromId){
							
							let e = this.friends[i]
							// console.log(e)
							e.lastTime = new Date()
							e.message = nmsg
							e.tip++
							// 删除原来的数据
							this.friends.splice(i,1)
							// 新消息插入到最顶部
							this.friends.unshift(e)
						}
					}
				})
			},
			
			
			
			
			// socketTest(){//服务端消息接收测试
			// 	this.socket.on('msg',id=>{
			// 		console.log('服务端消息:'+id)
			// 	})
			// },
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding-bottom: 60rpx;
		
		.top-bar{
			display: flex;
			z-index: 999;
			
			.top-bar-left{
				width: 132rpx;
			}
			.top-bar-center{
				flex: auto;
				.logo{
					margin-left:88rpx;
				}
			}
		}

		.main {
			padding-top: 98rpx;
			width: 100%;
			
			
			.refresh{
				text-align: center;
				padding-top: 480rpx;
				
				image{
					width:32rpx;
					height:32rpx;
				}
				
				.ref-title{
					padding-top: 10rpx;
					font-size: $uni-font-size-base;
					font-weight: 400;
					color:rgba(39,40,50,0.4);
					line-height: 40rpx;
				}
				
			}
			
			.no-friends{
				text-align: center;
				padding-top: 400rpx;
				
				image{
					height: 250rpx;
					width: 158rpx;
				}
				
				.no-title{
					padding: 32rpx 0;
					font-size: $uni-font-size-base;
					color:rgba(39,40,50,0.4);
					line-height: 40rpx;
				}
				
				.no-search{
					display: inline-block;
					width: 240rpx;
					height: 96rpx;
					background: $uni-color-primary;
					box-shadow: 0px 52rpx 36rpx -32rpx rgba(255,228,49,0.4);
					border-radius: 48rpx;
					font-size: $uni-font-size-base;
					color:$uni-text-color;
					line-height: 96rpx;
				}
				
			}
			
			.friends-list {
				height: 96rpx;
				line-height: 96rpx;
				padding: 16rpx $uni-spacing-row-base;
				border-bottom: 1rpx solid rgba(0, 0, 0, .1);

				&:active {
					background-color: $uni-bg-color-grey;
				}

				.friends-list-l {
					position: relative;
					float: left;
					max-height: 96rpx;

					.tips {
						padding: 0 3rpx;
						color: $uni-text-color-inverse;
						text-align: center;
						font-size: 24rpx;
						min-width: 30rpx;
						height: 36rpx;
						line-height: 36rpx;
						background-color: $uni-color-warning;
						position: absolute;
						top: -12rpx;
						right: -12rpx;
						z-index: 1;
						border-radius: 18rpx;
					}

					image {
						width: 96rpx;
						height: 96rpx;
						border-radius: $uni-border-radius-base;
						background-color: $uni-color-primary;
					}
				}

				.friends-list-r {
					width: 79%;
					position: relative;
					float: left;
					max-height: 96rpx;
					height: 96rpx;
					padding-left: $uni-spacing-row-base;

					.name {
						float: left;
						font-size: 36rpx;
						height: 50rpx;
						line-height: 50rpx;
						color: $uni-text-color;
					}

					.time {
						font-size: $uni-font-size-sm;
						position: absolute;
						top: 0;
						right: 0;
						line-height: 50rpx;
						color: rgba(39, 40, 50, 0.40);
					}

					.info {
						position: absolute;
						bottom: 0;
						float: left;
						height: 40rpx;
						line-height: 40rpx;
						font-size: $uni-font-size-base;
						color: rgba(39, 40, 50, 0.60);
						// text-overflow:ellipsis;
						// white-space:nowrap;
						// overflow: hidden;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
				}
			}

		}
	}
</style>
