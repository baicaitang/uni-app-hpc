<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/friendsrequest/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					hpc
				</view>
			</view>
			<view class="top-bar-right">
				<view class="group-img">
					<image src="../../static/images/img/1.png" mode=""></image>
				</view>
			</view>
		</view>

		<scroll-view class="chat" scroll-y="true" :scroll-with-animation="scrollAnimation" :scroll-into-view="scrollToView" @scrolltoupper="nextPage">
			<view class="chat-main" :style="{paddingBottom: pdb+'px'}">
				<!-- loding -->
				<view class="boxLoading" v-if="isloading" >
					
				</view>
				<view class="chat-ls" v-for="(item,i) in msgs" :key="i" :id="'msg-'+ item.tip">
					<view class="chat-time" v-if="item.time != ''">
						{{changeTime(item.time)}}
					</view>
					<view class="msg msg-left" v-if="item.id != 'b'">
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
					<view class="msg msg-right" v-if="item.id == 'b' && item.message.time != 0">
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
				oldTime: new Date(),
				pdb: 15,
				nowpage:0,//页码
				isloading:false,
				timer:'',
				scrollAnimation:true,
				beginLoading:true,
			};
		},
		onLoad() {
			this.getMsg(this.nowpage)
			this.changeTime()
			// this.nextPage()
		},
		components: {
			submit
		},
		methods: {
			backOne() { //返回上一页
				console.log('back!')
				uni.navigateBack({
					delta: 1
				});
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
			enterMsg(msg) { //处理接收的输入信息
				console.log(msg)
				
				this.scrollAnimation = true
				let len = this.msgs.length

				// 时间间隔
				let nowTime = new Date() 
				let time = myfun.spaceTime(this.oldTime, nowTime)
				if (time) {
					this.oldTime = time
				}
				nowTime = time


				let data = {
					id: 'b',
					imgurl: '../../static/images/img/7.png',
					message: msg.message,
					types: msg.types, //(0:文字，1:图片，2:音频，4:地图)
					time: nowTime,
					tip: len + 1
				}

				if (msg.types == 1) { //正序插入图片
					this.imgMsg.push(msg.message)
				}

				this.msgs.push(data)
				this.goBottom()

			},
			subH(h) { //获取底部submit高度
				this.pdb = h
				this.goBottom()
				console.log(this.pdb)
			},
			goBottom() { //滚动到底部最新信息
				this.scrollAnimation = true
				this.scrollToView = ''
				this.$nextTick(function() {
					let len = this.msgs.length - 1
					this.scrollToView = 'msg-' + this.msgs[len].tip.toString()
				})
				// console.log('go-bottom!')
			},
			playVioce(v) { //音频播放
				// innerAudioContext.autoplay = true;//自动播放
				innerAudioContext.src = v;
				innerAudioContext.play();

			},
			covers(msg){//地图定位
				let map = [
					{
						latitude: msg.latitude,
					  longitude: msg.longitude,
					  iconPath: '../../static/images/chatroom/dw.png'
					}
				] 
				return map
			},
			openLocation(msg){//查看位置
				uni.openLocation({
				    latitude: msg.latitude,
				    longitude: msg.longitude,
						name:msg.name,
						address:msg.address,
				    success: function () {
				        console.log('success');
				    }
				});
				
			},
			getMsg(page) { //获取聊天数据
			
				let msgs = datas.message()
				let maxpages = msgs.length
				
				if(msgs.length>(page+1)*10){
					maxpages = (page+1)*10
					this.nowpage++
				}else{
					// 数据获取完毕
					this.nowpage = -1
				}
				
				for(let i = page*10;i < maxpages; i++){
					msgs[i].imgurl = '../../static/images/img/' + msgs[i].imgurl
					
					// 时间间隔5分钟内不显示
					if (i < msgs.length - 1) { //最后一条信息显示时间，其余执行时间间隔方法
						let time = myfun.spaceTime(this.oldTime, msgs[i].time)
						if (time) {
							this.oldTime = time
						}
						msgs[i].time = time
					}
					
					if (msgs[i].types === 1) {
						msgs[i].message = '../../static/images/chatroom/' + msgs[i].message
						this.imgMsg.unshift(msgs[i].message)
					}
					//倒叙插入数组，时间越远的先渲染
					this.msgs.unshift(msgs[i])		
					
				}
				
				// 定位到最新更新信息
				this.$nextTick(function() {
					this.scrollAnimation = false
					this.scrollToView = 'msg-' + this.msgs[maxpages-page*10-1].tip.toString()
				})
				
				clearTimeout(this.timer)
				this.isloading = false
				// 开启加载
				this.beginLoading = true
				
			},
			nextPage(){//滚动到顶部加载下一页
				if(this.nowpage>0 && this.beginLoading){
					this.isloading = true
					// 禁止重复加载
					this.beginLoading = false
					this.timer = setTimeout(()=>{
						this.getMsg(this.nowpage)
						// console.log('nextpage!')
					},1500)
					
				}
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
							
							.map-con{
								background-color: #fff;
								width: 464rpx;
								height: 284rpx;
								overflow: hidden;
								padding: 0;
								
								.map-name{
									font-size: $uni-font-size-lg;
									color: $uni-text-color;
									line-height: 44rpx;
									padding: 18rpx 24rpx 0 24rpx;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1;
									overflow: hidden;
								}
								
								.map-address{
									font-size: $uni-font-size-sm;
									color: $uni-text-color-disable;
									padding: 0rpx 24rpx;
									display: -webkit-box;
									-webkit-box-orient: vertical;
									-webkit-line-clamp: 1;
									overflow: hidden;
								}
								
								.map-img{
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
						
						.map-con{
							
						}
						
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
						
						.map-con{
							
						}

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
				  background: rgba(239,239,6,90%);
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
