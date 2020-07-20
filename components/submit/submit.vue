<template>
	<view class="content">
		<view class="submit">
			<view class="submit-chat">
				<view class="btn-img" @tap="isVoice">
					<image :src="voiceImg" mode=""></image>
				</view>
				<textarea @input="inputs" v-model="msg" v-if="!isvoice" class="chat-send btn" auto-height="true"></textarea>
				<view class="voice btn" v-if="isvoice" @touchstart="touchStart" @touchend="touchEnd" @touchmove="touchMove">
					按住说话
				</view>
				<view class="btn-img" @tap="emoji">
					<image src="../../static/images/submit/bq.png" mode=""></image>
				</view>
				<view v-if="!msg" class="btn-img" @tap="media">
					<image src="../../static/images/submit/tj.png" mode=""></image>
				</view>
				<view v-if="msg" class="btn-img send" @tap="send">
					发送
				</view>
			</view>
			
			<view class="more">
				
				<view class="emoji" v-if="isemoji">
					<view class="emoji-send">
						<view class="emoji-send-del" @tap="emojiBack">
							<image src="../../static/images/submit/closew.png" mode=""></image>
						</view>
						<!-- <view class="emoji-send-btn" @tap="emojiSend">
							发送
						</view> -->
					</view>
					<emoji @emotion="emotion" :hegiht="300"></emoji>
				</view>
				
				<view class="media" v-if="ismedia">
					<view class="media-list" @tap="chooseImage('album')">
						<image src="../../static/images/submit/tp.png" mode=""></image>
						<view class="media-list-title">
							图片
						</view>
					</view>
					<view class="media-list">
						<image src="../../static/images/submit/wj.png" mode=""></image>
						<view class="media-list-title">
							文件
						</view>
					</view>
					<view class="media-list" @tap="chooseLocation">
						<image src="../../static/images/submit/wz.png" mode=""></image>
						<view class="media-list-title">
							定位
						</view>
					</view>
					<view class="media-list" @tap="chooseImage('camera')">
						<image src="../../static/images/submit/pz.png" mode=""></image>
						<view class="media-list-title">
							拍照
						</view>
					</view>
					<view class="media-list">
						<image src="../../static/images/submit/sp.png" mode=""></image>
						<view class="media-list-title">
							视频
						</view>
					</view>
				</view>
				
			</view>
			
		</view>
		
		<view class="recording" v-if="isrecording">
			<view class="recording-time-bg">
				<view class="recording-time" :style="{width:voiceTime/0.6+'%'}">
					{{voiceTime}}"
				</view>
			</view>
			<view class="recording-cancel">
				上滑取消录音
			</view>
		</view>
		
	</view>
</template>

<script>
	import emoji from '../emoji/emoji.vue'
	//录音
	const recorderManager = uni.getRecorderManager();
	
	export default {
		data() {
			return {
				isvoice: false, //是否录音
				isemoji: false, //是否显示表情块
				ismedia: false, //是否显示媒体块
				voiceImg: '../../static/images/submit/yy.png',
				msg: '', //输入信息
				subH: 0,//submit高度
				subChatH: 0,//submit-chat高度
				timer:0,//计时器
				voiceTime:0,//音频时长
				isrecording:false,//是否显示录音中
				startY:0,
				flag:false,
			};
		},
		props: [],
		onLoad() {},
		components: {
			emoji
		},
		computed: {},
		methods: {
			getSubmitHeight() { //获取submit高度		
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit').boundingClientRect(data => {
					this.subH = data.height
					// console.log(this.subH)
				}).exec();
			},
			getSubChatHeight() { //获取subChat高度
				const query = uni.createSelectorQuery().in(this);
				query.select('.submit-chat').boundingClientRect(data => {
					this.subChatH = data.height
					// console.log(this.subChatH)
				}).exec();
			},
			getSubHeight() { //获取pdb高度
				this.getSubmitHeight()
				this.getSubChatHeight()
				let height = this.subH - this.subChatH
				// console.log('height:'+ height)
				//传入到父组件
				this.$emit('subH', height)
			},
			isVoice() { //是否点击录音
				
				if (this.isvoice) {//取消录音
					this.isvoice = false
					this.voiceImg = "../../static/images/submit/yy.png"
				} else {//点击录音后
					this.isvoice = true
					this.voiceImg = "../../static/images/submit/jp.png"
					// 关闭其他
					this.ismedia = false
					this.isemoji = false
					setTimeout(() => {
						this.getSubHeight()
					}, 30)
				}
			},
			emoji() { //点击表情按钮
				
					this.isemoji = !this.isemoji
					if(this.isemoji){
						this.isvoice = false
					}
					if (this.ismedia) {
						this.ismedia = !this.ismedia
					}
					setTimeout(() => {
						this.getSubHeight()
					}, 30)
				
			},
			inputs(e) { //输入信息时
				// 显示发送按钮
				this.isSend = true

				this.msg = e.detail.value
				//监听回车
				let chatmsg = e.detail.value
				var pos = chatmsg.indexOf('\n')
				if (pos != -1 && chatmsg.length > 1) { //按回车时发送
					this.handleSendMsg(this.msg, 0)
				}

			},
			emotion(e) { //接收表情
				// console.log(e)
				this.msg = this.msg + e
			},
			emojiBack() { //表情退格
				if (this.msg.length > 0) {
					this.msg = this.msg.substring(0, this.msg.length - 1)
				}
			},
			send() { //点击发送

				if (this.msg.length > 0) {
					this.handleSendMsg(this.msg, 0)
				}

			},
			handleSendMsg(msg, type) { //处理发送的信息
				let data = {
					message: msg,
					types: type
				}
				//返回父组件
				this.$emit('inputs', data)
				setTimeout(() => {
					this.msg = ''
				}, 0)
				console.log(data)
			},
			media() { //点击媒体按钮
			
					this.ismedia = !this.ismedia
					if (this.isemoji) {
						this.isemoji = !this.isemoji
					}
					if(this.ismedia){
						this.isvoice = false
					}
					setTimeout(() => {
						this.getSubHeight()
					}, 30)
				
		
			},
			chooseImage(e){//选择图片
				let count = 9
				if(e == 'album'){
					count = 9
				}else{
					count = 1
				}
			
				uni.chooseImage({
				    count: count, //默认9
				    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				    sourceType: [e], //从相册选择
				    success: (res)=> {
				        // console.log(JSON.stringify(res.tempFilePaths));
								res.tempFilePaths.forEach((item,i)=>{
									// console.log(item)
									this.handleSendMsg(item,1)
								})
				    }
				});
			},
			touchStart(e){//开始录音
				console.log('start!')
				this.isrecording = true
				this.startY = e.changedTouches[0].pageY
				
				let i = 1
				//计时
				this.timer = setInterval(()=>{
					
					this.voiceTime = i
					i++
					
					// console.log(i)
					if(i>60){
						clearInterval(this.timer)
						//60s后把语言发送到父组件,录音时长最大60s
						this.touchEnd()
					}
				},1000)
				 
				recorderManager.start();
				
			},
			touchEnd(){//结束录音
				console.log('end!')
				this.isrecording = false
				clearInterval(this.timer)
				
				recorderManager.stop();
				
				recorderManager.onStop((res) => {
				    // console.log('recorder stop' + JSON.stringify(res));
				    let data = {
							voice: res.tempFilePath,
							time: this.voiceTime
						}
						//上滑动取消发送录音音频
						//录音时长需大于1s
						if(!this.flag && this.voiceTime > 0){
							this.handleSendMsg(data,2)
							//时长归位
							this.voiceTime = 0	
							
						}	
						//时长归位
						this.voiceTime = 0	
				});
			},
			touchMove(e){//向上滑动停止录音
				let changeY = this.startY - e.changedTouches[0].pageY
				if(changeY > 50){
					console.log('move!')
					this.isrecording = false
				}
				this.flag = false
			},
			chooseLocation(e){//选择定位
				uni.chooseLocation({
				    success: (res) => {
							let data = {
								name:res.name,
								address:res.address,
								latitude:res.latitude,
								longitude:res.longitude
							}
							this.handleSendMsg(data,3)
				        // console.log('位置名称：' + res.name);
				        // console.log('详细地址：' + res.address);
				        // console.log('纬度：' + res.latitude);
				        // console.log('经度：' + res.longitude);
				    }
				});
			},
			
			// focus(){//输入框聚焦
			// 	this.isemoji = !this.emoji
			// 	setTimeout(() => {
			// 		this.getSubHeight()
			// 	}, 10)
			// },
			// emojiSend(){
			// 	if (this.msg.length > 1) {
			// 		//传入到父组件
			// 		this.$emit('inputs', this.msg)
			// 		setTimeout(() => {
			// 			this.msg = ''
			// 		}, 0)
			// 	}
			// },

		},
	}
</script>

<style lang="scss"> 
	.submit {
		background: rgba(244, 244, 244, 0.96);
		border-top: 1px solid $uni-border-color;
		width: 100%;
		position: fixed;
		left: 0;
		bottom: 0;
		z-index: 100;
		padding-bottom: env(safe-area-inset-bottom);

		.submit-chat {
			width: 100%;
			display: flex;
			align-items: fllex-end;
			box-sizing: border-box;
			padding: 8rpx 14rpx;


			.btn {
				flex: auto;
				background-color: #fff;
				border-radius: 10rpx;
				padding: 20rpx;
				max-height: 160rpx;
				line-height: 40rpx;
			}

			.voice {
				text-align: center;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-lg;
			}

			.send {
				background-color: rgba(255, 255, 49, 0.5);
				margin: 6rpx 12rpx;
				padding: 12rpx 0;
				width: 112rpx;
				height: 44rpx !important;
				line-height: 44rpx;
				color: $uni-text-color-grey;
				font-size: $uni-font-size-lg;
				text-align: center;
				border-radius: 10rpx;

				&:active {
					color: $uni-text-color;
					background-color: rgba(255, 255, 49, 0.8);
				}
			}

			.btn-img {
				height: 56rpx;

				image {
					height: 56rpx;
					width: 56rpx;
					margin: 12rpx 10rpx;
					flex: auto;
				}
			}

		}

		.more {
			max-height: 540rpx;

			.emoji {
				width: 100%;
				height: 460rpx;
				padding-bottom: 120rpx;
				background-color: rgba(236, 237, 238, 1);
				box-shadow: 0px -1rpx 0px rgba(0, 0, 0, 0.1);

				.emoji-send {
					width: 140rpx;
					height: 80rpx;
					background-color: rgba(236, 237, 238, 0.8);
					position: fixed;
					bottom: env(safe-area-inset-bottom);
					right: 0;
					display: flex;

					.emoji-send-btn {
						flex: 1;
						margin: 0 32rpx 0 20rpx;
						height: 68rpx;
						color: $uni-text-color-grey;
						background-color: rgba(255, 255, 49, 0.5);
						font-size: 32rpx;
						text-align: center;
						line-height: 70rpx;
						border-radius: 12rpx;

						&:active {
							color: $uni-text-color;
							background-color: rgba(255, 255, 49, 0.8);
						}
					}

					.emoji-send-del {
						flex: 1;
						margin-right: 24rpx;
						height: 68rpx;
						background-color: rgba(0, 0, 0, .2);
						font-size: 32rpx;
						text-align: center;
						line-height: 70rpx;
						border-radius: 12rpx;

						image {
							width: 44rpx;
							height: 44rpx;
							padding: 12rpx 0;
						}

						&:active {
							background-color: rgba(255, 255, 127, 0.6);
						}
					}

				}

			}

			.media {
				width: 100%;
				height: 540rpx;
				padding-bottom: 110rpx;
				background-color: rgba(236, 237, 238, 1);
				box-shadow: 0px -1rpx 0px rgba(0, 0, 0, 0.1);
				bottom: env(safe-area-inset-bottom);
				padding: 20rpx;
				box-sizing: border-box;

				.media-list {
					width: 25%;
					float: left;
					padding-top: 32rpx;
					text-align: center;

					image {
						width: 68rpx;
						height: 68rpx;
						padding: 30rpx;
						background-color: rgba(255, 255, 255, 1);
						border-radius: 24rpx;
					}

					.media-list-title {
						line-height: 34rpx;
						font-size: 24rpx;
						color: $uni-text-color;

					}

				}

			}
		}

	}
	
	.recording{
		height: 100%;
		width: 100%;
		background-color: rgba(0,0,0,0.3);
		position: fixed;
		top: 0;
		bottom: 0;
		z-index: 99;
		
		.recording-time-bg{
			height: 84rpx;
			width: 600rpx;
			position: absolute;
			left: 0;
			right: 0;
			top: 0;
			bottom: 0;
			margin: auto;
			background-color: rgba(255,255,255,0.2);
			border-radius: 42rpx;
			text-align: center;
			
			.recording-time{
				min-width:120rpx;
				display: inline-block;
				line-height: 84rpx;
				background-color: $uni-color-primary;
				border-radius: 42rpx;
			}
			
		}
		
		.recording-cancel{
			margin-bottom: env(safe-area-inset-bottom);
			position: absolute;
			bottom: 150rpx;
			width: 100%;
			text-align: center;
			color: #fff;
			font-size: $uni-font-size-base;
		}
	}
</style>
