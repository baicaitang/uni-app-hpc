<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					详细
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
					<view class="content head">
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload" class="user-img"></image>
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('修改签名',dataArr.sign,false)">
					<view class="title">
						签名
					</view>
					<view class="content">
						{{dataArr.sign}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						注册
					</view>
					<view class="content">
						{{timeChange(dataArr.time)}}
					</view>
				</view>
				<view class="row" @tap="modify('修改昵称',dataArr.name,false)">
					<view class="title">
						昵称
					</view>
					<view class="content">
						{{dataArr.name}}
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
							<picker @change="bindPickerChange" :value="index" :range="array">
								<view class="uni-input">{{array[index]}}</view>
							</picker>
						</view>
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row">
					<view class="title">
						生日
					</view>
					<view class="content">
						<picker mode="date" :value="date" :start="startDate" :end="endDate" @change="bindDateChange">
							<view class="uni-input">{{date}}</view>
						</picker>
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('修改电话',dataArr.tell,false)">
					<view class="title">
						电话
					</view>
					<view class="content">
						{{dataArr.tell}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('修改邮箱',dataArr.mail,false)">
					<view class="title">
						邮箱
					</view>
					<view class="content">
						{{dataArr.mail}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
				<view class="row" @tap="modify('修改密码',pwd,true)">
					<view class="title">
						密码
					</view>
					<view class="content">
						{{pwd}}
					</view>
					<view class="more">
						<image :src="rightImg" mode="aspectFill"></image>
					</view>
				</view>
			</view>
		</view>

		<view class="btn2" @tap="toLogin">
			退出登录
		</view>

		<view class="modify" v-show="isModify" :style="{bottom:-height+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="cancel" @tap="modify">
					取消
				</view>
				<view class="title">
					{{modifyTitle}}
				</view>
				<view class="define" @tap="modify">
					确定
				</view>
			</view>
			<view class="modify-main">
				<input v-if="ispwd" type="text" v-model="pwd" class="modify-pwd" placeholder="请输入原密码" placeholder-style="color:#aaa;font-weight:400;" />
				<textarea v-if="!ispwd" v-model="data" class="modify-content" />
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
				dataArr:{
					name:'hpc',
					sign:'床前明月光，疑是地上霜.举头望明月,低头思故乡.',
					time:new Date(),
					sex:'男',
					birthday:'1998-12-09',
					tell:'123241531465',
					mail:'hpc@qq.com'
				},
				array: ['男', '女', '未知'],
				index: 0,
				date: currentDate,
				tempFilePath: '',
				cropFilePath: '../../static/images/img/1.png',
				headimg:'',//头像
				data:'修改的内容',
				ispwd:false,//是否显示密码
				pwd:'******',//原密码
				animationData:{},//动画
				isModify:false,//动画开关
				height:0,//页面高
				modifyTitle:'',//修改标题
				rightImg:"../../static/images/userdetail/左去@3x.png",
			};
		},
		onReady(){
			this.getElementStyle()//获取页面高度
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
			toLogin(){
				uni.navigateTo({
					url:'../login/login'
				});
			},
			timeChange(t){//时间处理
				return myfun.detailTime(t)
			},
			bindPickerChange: function(e) { //修改性别
				this.index = e.target.value
			},
			bindDateChange: function(e) { //修改日期
				this.date = e.target.value
			},
			getDate(type) {
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
			},
			confirm(e) {
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				uni.uploadFile({
					url: '后端地址上传图片接口地址',
					filePath: this.headimg,
					name: 'file',
					fileType: 'image',
					//formData:{},传递参数
					success: (uploadFileRes) => {
						var backstr = uploadFileRes.data;
						//自定义操作
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
			modify(title,data,ispwd){//修改弹框弹出动画
				this.ispwd = ispwd
				this.isModify = !this.isModify
				this.modifyTitle = title
				this.data = data
				
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
				
			}
		},
		

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
