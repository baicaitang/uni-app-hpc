<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/friendsrequest/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					{{f_name}}
				</view>
			</view>
			<view class="top-bar-right">
				<!-- 群头像 1隐藏 0显示 -->
				<view class="group-img" v-if="type == 0" >
					<image :src="f_imgurl" mode="" @tap="toGroupHome"></image>
				</view>
			</view>
		</view>

		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView"
		 @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom: pdb+'px'}">
				<!-- loding -->
				<view class="boxLoading" v-if="isloading">

				</view>
				<view class="chat-ls" v-for="(item,i) in msgs" :key="i" :id="'msg-'+ item.id">
					<view class="chat-time" v-if="item.time != ''">
						{{changeTime(item.time)}}
					</view>
					<view class="msg msg-left" v-if="item.fromId != uid">
						<image class="user-img" :src="item.imgurl" mode=""></image>
						<!-- 文字 -->
						<view class="msg-con" v-if="item.types == 0">
							<view class="msg-text">
								{{item.message}}
							</view>
						</view>
						<!-- 图片 -->
						<view class="msg-con" v-if="item.types == 1">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						<!-- 音频 -->
						<view class="msg-con" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time*4 +'px'}" @tap="playVioce(item.message.voice)">
								{{item.message.time}}"
								<image class="voice-img clearfix" src="../../static/images/chatroom/yuyin.png" mode=""></image>
							</view>
						</view>
						<!-- 位置 -->
						<view class="msg-con" v-if="item.types == 3">
							<view class="msg-text map-con" @tap="openLocation(item.message)">
								<view class="map-name">
									{{item.message.name}}
								</view>
								<view class="map-address">
									{{item.message.address}}
								</view>
								<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFit"></image>
								<!-- <map class="map" :latitude="item.message.latitude" :longitude="item.message.longitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
					<view class="msg msg-right" v-if="item.fromId == uid && item.message.time != 0">
						<image class="user-img" :src="item.imgurl" mode=""></image>
						<view class="msg-con" v-if="item.types == 0">
							<view class="msg-text">
								{{item.message}}
							</view>
						</view>
						<view class="msg-con" v-if="item.types == 1">
							<image @tap="previewImg(item.message)" class="msg-img" :src="item.message" mode="widthFix"></image>
						</view>
						<view class="msg-con" v-if="item.types == 2">
							<view class="msg-text voice" :style="{width:item.message.time*4 +'px'}" @tap="playVioce(item.message.voice)">
								<image class="voice-img clearfix" src="../../static/images/chatroom/yuyin.png" mode=""></image>
								{{item.message.time}}"
							</view>
						</view>
						<view class="msg-con" v-if="item.types == 3">
							<view class="msg-text map-con" @tap="openLocation(item.message)">
								<view class="map-name">
									{{item.message.name}}
								</view>
								<view class="map-address">
									{{item.message.address}}
								</view>
								<image class="map-img" src="../../static/images/chatroom/map.png" mode="aspectFit"></image>
								<!-- <map class="map" :latitude="item.message.latitude" :longitude="item.message.longitude" :markers="covers(item.message)"></map> -->
							</view>
						</view>
					</view>
				</view>

			</view>
			<view class="pad">
			</view>
		</scroll-view>

		<submit @inputs="enterMsg" @subH="subH"></submit>

	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import myfun from '../../commons/js/myfun.js'
	import submit from '../../components/submit/submit.vue'
	// 音频播放
	const innerAudioContext = uni.createInnerAudioContext();
	export default {
		data() {
			return {
				scrollToView: '',
				msgs: [],
				imgMsg: [],
				oldTime: 0,
				pdb: 15,
				nowPage: 0, //页码
				pageSize: 5, //一页条数
				isloading: false,
				timer: '',
				scrollAnimation: true,
				beginLoading: true,
				uid: '',
				u_imgurl: '',
				token: '',
				u_name: '',
				fid: '',
				f_name: '',
				f_imgurl: '',
				type: '', //0好友，1群

			};
		},
		onLoad(e) {
			this.fid = e.id
			this.f_name = e.name
			this.f_imgurl = e.img
			this.type = e.type
			// console.log(e)
			this.getStorage()
			this.getMsg()
			this.changeTime()
			this.nextPage()
			this.receiveSocketMsg()
		},
		components: {
			submit
		},
		methods: {
			getStorage() { //获取缓存数据
				// 从本地缓存中同步获取指定 key 对应的内容
				try {
					const value = uni.getStorageSync('user');
					if (value) {
						// console.log(value);

						this.uid = value.id
						this.u_imgurl = this.serverUrl + '/user/' + value.imgurl
						this.token = value.token
						this.u_name = value.name

					} else {
						// 如果没有用户缓存，就跳转到登录页
						uni.navigateTo({
							url: '../login/login',
						});
					}
				} catch (e) {
					// error
					uni.showToast({
						title: '获取数据失败！',
						icon: 'none',
						duration: 2000
					});
				}
			},
			backOne() { //返回上一页
				// console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			toGroupHome() { //跳转到群详情
				uni.navigateTo({
					url: '../grouphome/grouphome?gid=' + this.fid + '&gimg=' + this.f_imgurl
				})
			},
			changeTime(t) {
				return myfun.dateTime2(t)
			},
			previewImg(imgmsg) { // 预览图片
				let index = 0
				this.imgMsg.forEach((item, i) => {
					if (this.imgMsg[i] == imgmsg) {
						index = i
					}
				})
				uni.previewImage({
					current: index, //当前图片位置
					urls: this.imgMsg,
					longPressActions: {
						itemList: ['发送给朋友', '保存图片', '收藏'],
						success: function(data) {
							console.log('选中了第' + (data.tapIndex + 1) + '个按钮,第' + (data.index + 1) + '张图片');
						},
						fail: function(err) {
							console.log(err.errMsg);
						}
					}
				});
			},
			receiveMsg(msg, id, img, tip) { //接收输入信息			
				//tip == 0 表示自己发的，tip == 1

				// socket提交
				// 提交文字,地理位置
				if (msg.types == 0 || msg.types == 3) {
					//发送给后端
					this.sendSocket(msg)
				}
				
				// 提交图片
				//正序插入图片
				if (msg.types == 1 ) {
					this.imgMsg.push(msg.message)
					
					// 当前日期文件夹
					let url = myfun.fileName(new Date())
					
					
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: msg.message,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random()*10),//文件名字
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							let data = {
								message:uploadFileRes.data,
								types:msg.types,
							}
							
							this.sendSocket(data)
							
						}
					});
				
					uploadTask.onProgressUpdate((res) => {
						console.log('上传进度' + res.progress);
						// console.log('已经上传的数据长度' + res.totalBytesSent);
						// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				
						// 测试条件，取消上传任务。
						// if (res.progress > 50) {
						//     uploadTask.abort();
						// }
					});
				}
				
				// 提交音频
				if (msg.types == 2) {
							
					// 当前日期文件夹
					let url = myfun.fileName(new Date())
					
					const uploadTask = uni.uploadFile({
						url: this.serverUrl + '/files/upload',
						filePath: msg.message.voice,
						name: 'file',
						formData: {
							url: url,
							name: new Date().getTime() + this.uid + Math.ceil(Math.random()*10),//文件名字
						},
						success: (uploadFileRes) => {
							console.log(uploadFileRes);
							let data = {
								message:uploadFileResda.data,
								types:msg.types,
							}
							
							this.sendSocket(data)
							
						}
					});
				
					uploadTask.onProgressUpdate((res) => {
						console.log('上传进度' + res.progress);
						// console.log('已经上传的数据长度' + res.totalBytesSent);
						// console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
				
						// 测试条件，取消上传任务。
						// if (res.progress > 50) {
						//     uploadTask.abort();
						// }
					});
				}
				
				// 渲染
				this.scrollAnimation = true
				let len = this.msgs.length

				let nowTime = new Date()
				// 时间间隔
				let time = myfun.spaceTime(this.oldTime, nowTime)
				if (time) {
					this.oldTime = time
				}
				nowTime = time
				
				// json字符串还原
				if(msg.types == 3){
					msg.message = JSON.parse(msg.message)
				}

				let data = {
					fromId: id, //发送者id
					imgurl: img,
					message: msg.message,
					types: msg.types, //(0:文字，1:图片，2:音频，3:地图)
					time: nowTime, //发送时间
					id: len,
				}

				this.msgs.push(data)

				// 定位到最新更新信息
				this.$nextTick(function() {
					this.scrollAnimation = false
					this.scrollToView = 'msg-' + len
				})

				

			},
			enterMsg(msg) { //处理接收的输入信息
				this.receiveMsg(msg, this.uid, this.u_imgurl, 0)

			},
			subH(h) { //获取底部submit高度
				this.pdb = h + 6
				this.goBottom()
				// console.log(this.pdb)
			},
			goBottom() { //滚动到底部最新信息
				this.scrollAnimation = true
				this.scrollToView = ''
				this.$nextTick(function() {
					let len = this.msgs.length - 1
					this.scrollToView = 'msg-' + this.msgs[len].id
				})
				// console.log('go-bottom!')
			},
			playVioce(v) { //音频播放
				// innerAudioContext.autoplay = true;//自动播放
				innerAudioContext.src = v;
				innerAudioContext.play();

			},
			covers(msg) { //地图定位
				let map = [{
					latitude: msg.latitude,
					longitude: msg.longitude,
					iconPath: '../../static/images/chatroom/dw.png'
				}]
				return map
			},
			openLocation(msg) { //查看位置
				uni.openLocation({
					latitude: msg.latitude,
					longitude: msg.longitude,
					name: msg.name,
					address: msg.address,
					success: function() {
						console.log('success');
					}
				});

			},
			getMsg() { //获取聊天数据

				uni.request({
					url: this.serverUrl + '/chat/msg',
					data: {
						uid: this.uid,
						fid: this.fid,
						nowPage: this.nowPage,
						pageSize: this.pageSize,
						token: this.token,
					},
					method: 'POST',
					success: (data) => {
						// console.log(data)
						let status = data.data.status

						// 访问后端成功
						if (status == 200) {
							this.refresh = true
							let msg = data.data.result
							// 数组倒序
							msg.reverse()
							// console.log(msg)

							if (msg.length > 0) {

								let oldTime = msg[0].time
								
								let imgarr = []

								for (let i = 1; i < msg.length; i++) {
									msg[i].imgurl = this.serverUrl + '/user/' + msg[i].imgurl

									// 时间间隔5分钟内不显示
									if (i < msg.length - 1) { //最后一条信息显示时间，其余执行时间间隔方法
										let time = myfun.spaceTime(oldTime, msg[i].time)
										if (time) {
											oldTime = time
										}
										msg[i].time = time
									}

									// 匹配最大时间，第一次取
									if (this.nowPage == 0) {
										if (msg[i].time > this.oldTime) {
											this.oldTime = msg[i].time
										}
									}

									// 补充图片地址
									if (msg[i].types == 1) {
										msg[i].message = this.serverUrl + '/' + msg[i].message
										imgarr.push(msg[i].message)

									}
									
									// json字符串还原
									if (msg[i].types ==3) {
										msg[i].message = JSON.parse(msg[i].message)
									
									}

								}
								// 连接两个数组
								this.msgs = msg.concat(this.msgs)
								this.imgMsg = imgarr.concat(this.imgMsg)

							}


							// 判断当前页
							if (msg.length == 10) {

								this.nowPage++
							} else {
								// 数据获取完毕
								this.nowPage = -1
							}

							// 定位到最新更新信息
							this.$nextTick(function() {
								this.scrollAnimation = false
								this.scrollToView = 'msg-' + this.msgs[msg.length - 1].id
							})

							clearInterval(this.timer)
							this.isloading = false
							// 开启加载
							this.beginLoading = true
							// console.log(this.msgs)
							// console.log(this.nowPage + '---' + this.beginLoading)

						} else if (status == 500) {
							uni.showToast({
								title: '服务器出错了！',
								icon: 'none',
								duration: 2000
							});
							console.log('aaa')
						} else if (status == 300) {

							uni.navigateTo({
								url: '../login/login?name=' + this.myname
							})
						}
					}
				})

			},
			nextPage() { //滚动到顶部加载下一页
				if (this.nowPage > 0 && this.nowPage) {
					this.isloading = true
					// 禁止重复加载
					this.beginLoading = false
					this.timer = setTimeout(() => {
						this.getMsg(this.nowpage)
						console.log('nextpage!')
					}, 1500)

				}
			},
			sendSocket(e) { // 聊天数据发送后端
				if (this.type == 0) { //0好友，1群
					// 1对1聊天

					this.socket.emit('msg', e, this.uid, this.fid)
				} else {
					//群消息
					this.socket.emit('groupMsg', e, this.uid, this.fid)
				}
			},
			receiveSocketMsg(){//Socket聊天数据接收
				this.socket.on('msg',(msg,fromId,tip)=>{
					
					if(fromId == this.fid && tip == 0){
						// 当前日期文件夹
						let url = myfun.fileName(new Date())
						
						this.scrollAnimation = true
						let len = this.msgs.length
						
						let nowTime = new Date()
						// 时间间隔
						let time = myfun.spaceTime(this.oldTime, nowTime)
						if (time) {
							this.oldTime = time
						}
						nowTime = time
						
						// console.log(msg)
						// 判断是否需要补充IP地址
						if(msg.types == 1 || msg.types == 2){
							msg.message = this.serverUrl + '/' + url + '/' + msg.message
						}
						
						let data = {
							fromId: fromId, //发送者id
							imgurl: this.f_imgurl,
							message: msg.message,
							types: msg.types, //(0:文字，1:图片，2:音频，3:地图)
							time: nowTime, //发送时间
							id: len,
						}
						
						this.msgs.push(data)
						
						if(msg.types == 1){
							// console.log(msg.message)
							this.imgMsg.push(msg.message)
						}
						
						// 定位到最新更新信息
						this.$nextTick(function() {
							this.scrollAnimation = false
							this.scrollToView = 'msg-' + len
						})
						this.goBottom()
					}
					
					// console.log(msg+'来自:'+fromId)
					
				})
			},
				

		},

	}
</script>

<style lang="scss" scoped>
	@import "../../commons/css/mycss.scss";

	page {
		height: 100%;
		background: #F4F4F4;
	}

	.clearfix:after,
	.clearfix:before {
		content: "";
		display: table;
	}

	.clearfix:after {
		clear: both;
	}

	.clearfix {
		*zoom: 1;
	}

	.content {
		background: #F4F4F4;

		.top-bar {
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
			background: rgba(244, 244, 244, 0.96);

			.top-bar-center {
				text-align: left;
				width: 540rpx;
				display: -webkit-box;
				-webkit-box-orient: vertical;
				-webkit-line-clamp: 1;
				overflow: hidden;
			}

			.top-bar-right {
				.group-img {
					padding-right: $uni-spacing-col-base;
					position: absolute;
					right: 0;
					bottom: 10rpx;
					width: 68rpx;
					height: 68rpx;

					image {
						padding: 0;
						width: 68rpx;
						height: 68rpx;
						border-radius: $uni-border-radius-base;
					}

				}

			}
		}

		.chat {
			// scroll-view 的高度就直接设置height:100%是无效的，此时可以设置为height:100vh代替。
			height: 100vh;

			.pad {
				height: env(safe-area-inset-bottom);
				width: 100%;
				padding: 48rpx 0;
				margin-top: 20rpx;
			}

			.chat-main {
				padding-left: $uni-spacing-col-base;
				padding-right: $uni-spacing-col-base;
				padding-top: 100rpx;
				overflow: hidden;
				// padding-bottom: 40rpx;

				.chat-ls {
					.chat-time {
						padding: 20rpx 0;
						text-align: center;
						font-size: $uni-font-size-sm;
						color: rgba(39, 40, 50, 0.3);
						line-height: 34rpx;
					}

					.msg {
						display: flex;
						padding: 20rpx 0;

						.user-img {
							flex: none;
							width: $uni-img-size-sm;
							height: $uni-img-size-sm;
							border-radius: $uni-border-radius-base;

						}

						.msg-con {
							max-width: 480rpx;
							flex: none;

							.msg-text {
								padding: 18rpx 24rpx;
								font-size: $uni-font-size-lg;
								color: $uni-text-color;
								line-height: 44rpx;
								letter-spacing: -0.55px;
							}

							.msg-img {
								border-radius: $uni-border-radius-base;
								max-width: 400rpx;
							}

							.voice {
								width: 300rpx;
								min-width: 86rpx;
								max-width: 400rpx;

								.voice-img {
									width: 36rpx;
									height: 36rpx;
								}

							}

							.map-con {
								background-color: #fff;
								width: 464rpx;
								height: 284rpx;
								overflow: hidden;
								padding: 0;

								.map-name {
									font-size: $uni-font-size-lg;
									color: $uni-text-color;
									line-height: 44rpx;
									padding: 18rpx 24rpx 0 24rpx;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1;
									overflow: hidden;
								}

								.map-address {
									font-size: $uni-font-size-sm;
									color: $uni-text-color-disable;
									padding: 0rpx 24rpx;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1;
									overflow: hidden;
								}

								.map-img {
									padding-top: 8rpx;
									width: 464rpx;
									height: 190rpx;
								}

							}

						}

					}

					.msg-left {
						flex-direction: row;

						.voice {
							text-align: right;

							.voice-img {
								float: left;
								padding-bottom: 4rpx;
								transform: rotate(180deg);
								background-color: rgba(255, 255, 255, 0);
							}

							&:active {
								background-color: rgba(255, 255, 255, 0.5);
							}
						}

						.msg-text {
							margin-left: 16rpx;
							background: #fff;
							border-radius: 0px 20rpx 20rpx 20rpx;
						}

						.map-con {}

						.msg-img {
							margin-left: 16rpx;
						}
					}

					.msg-right {
						flex-direction: row-reverse;

						.msg-text {
							margin-right: 16rpx;
							background-color: rgba(255, 288, 49, 0.8);
							border-radius: 20px 0px 20rpx 20rpx;
						}

						.map-con {}

						.msg-img {
							margin-right: 16rpx;
						}

						.voice {

							.voice-img {
								padding-top: 4rpx;
								float: right;
								background-color: rgba(255, 288, 49, 0.8);
							}

							&:active {
								background-color: rgba(255, 288, 49, 0.5);
							}
						}
					}

				}

				.boxLoading {
					// z-index: 1000;
					width: 100rpx;
					height: 100rpx;
					margin: auto;
					padding-bottom: 18rpx;
					position: relative;
					// left: 0;
					// right: 0;
					// top: 100rpx;
					// bottom: 0;
				}

				.boxLoading:before {
					content: '';
					width: 100rpx;
					height: 10rpx;
					background: #000;
					opacity: 0.1;
					position: absolute;
					top: 80rpx;
					left: 0;
					border-radius: 50%;
					animation: shadow 0.5s linear infinite;
				}

				.boxLoading:after {
					content: '';
					width: 60rpx;
					height: 60rpx;
					background: rgba(239, 239, 6, 90%);
					animation: animate 0.5s linear infinite;
					position: absolute;
					top: 0;
					left: 20rpx;
					border-radius: 6rpx;
				}

				@keyframes animate {
					17% {
						border-bottom-right-radius: 3px;
					}

					25% {
						transform: translateY(9px) rotate(22.5deg);
					}

					50% {
						transform: translateY(18px) scale(1, 0.9) rotate(45deg);
						border-bottom-right-radius: 40px;
					}

					75% {
						transform: translateY(9px) rotate(67.5deg);
					}

					100% {
						transform: translateY(0) rotate(90deg);
					}
				}

				@keyframes shadow {

					0%,
					100% {
						transform: scale(1, 1);
					}

					50% {
						transform: scale(1.2, 1);
					}
				}
			}
		}
	}
</style>
