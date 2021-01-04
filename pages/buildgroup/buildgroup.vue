<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<view class="text">
					取消
				</view>
			</view>
			<view class="top-bar-center">
					<view class="title">
						创建群聊
					</view>
				</view>
				<view class="top-bar-right pice">
				</view>
			</view>
			
			<view class="main">
				<view class="top">
					<view class="group-img" >
						<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
						<image :src="cropFilePath" @tap="upload"  class="img"></image>
						<image @tap="upload" src="../../static/images/group/change.png" class="pan" mode=""></image>
					</view>
					<view class="group-name">
						<input class="group-name-input" type="text" placeholder="为群取个名字吧~" placeholder-style="color:#aaa;" v-model="name" />
					</view>
					<view class="title">
						用户
					</view>
				</view>
				
				<view class="friends">
					
					<view class="user" v-for="(item,i) in user" :key="i" @tap="selectFriend(i)">
						<view class="selected" :class="{isselected:item.selected}">
							<image class="selected-img" src="../../static/images/group/choose.png" v-if="item.selected" mode=""></image>
						</view>
						<image :src="item.imgurl" class="user-img" mode=""></image>
						<view class="user-name">
							{{item.name}}
						</view>
					</view>
				</view>
				
			</view>
			
			<view class="bottom-bar">
				<view class="bottom-btn btn1" :class="{noselecte:selectedUser && name.length > 0}">
					创建({{selectedCount}})
				</view>
			</view>
			
		</view>
	</view>
</template>

<script>
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	
	export default {
		data() {
			return {
				tempFilePath: '',
				cropFilePath: '../../static/images/group/group.png',
				headimg:'',//头像
				user:[
					{selected:false,
					imgurl:'../../static/images/img/1.png',
					name:'九尾狐',
					},
					{selected:true,
					imgurl:'../../static/images/img/2.png',
					name:'清运白菜汤里的胡萝卜我爱吃的就是这个',
					},
					{selected:false,
					imgurl:'../../static/images/img/3.png',
					name:'知否',
					},
					{selected:true,
					imgurl:'../../static/images/img/4.png',
					name:'五月天',
					},
					{selected:false,
					imgurl:'../../static/images/img/1.png',
					name:'九尾狐',
					},
					{selected:true,
					imgurl:'../../static/images/img/2.png',
					name:'清运白菜汤里的胡萝卜我爱吃的就是这个',
					},
					{selected:false,
					imgurl:'../../static/images/img/3.png',
					name:'知否',
					},
					{selected:true,
					imgurl:'../../static/images/img/4.png',
					name:'五月天',
					},
					{selected:false,
					imgurl:'../../static/images/img/1.png',
					name:'九尾狐',
					},
					{selected:true,
					imgurl:'../../static/images/img/2.png',
					name:'清运白菜汤里的胡萝卜我爱吃的就是这个',
					},
					{selected:false,
					imgurl:'../../static/images/img/3.png',
					name:'知否',
					},
					{selected:true,
					imgurl:'../../static/images/img/4.png',
					name:'五月天',
					},
				],
				selectedCount:0,
				name:'',
			}
		},
		components: {
			ImageCropper //图片裁剪插件
		},
		computed:{
			selectedUser(){//是否选择用户
				if(this.selectedCount > 0){
					return true
				}else{
					return false
				}
			}
		},
		onReady(){
			
		},
		onLoad(){
			this.getSelectedCount()
		},
		methods: {
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
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
				// console.log(123)
			},
			confirm(e) {//图片确定
				this.tempFilePath = '';
				this.cropFilePath = e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;

			},
			cancel() {
				console.log('canceled');
				this.tempFilePath = "";
			},
			isconfirm(){//图片上传后端
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
			selectFriend(i){ //动态选择用户
				if(this.user[i].selected){
					this.user[i].selected = false
					this.selectedCount--
				}else{
					this.user[i].selected = true
					this.selectedCount++
					
				}
			},
			getSelectedCount(){//获取已经选择用户数
				for(let i = 0;i <this.user.length;i++){
					if (this.user[i].selected){
						this.selectedCount++
					}
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
			
			.top-bar-left {
				.text{
					width:88rpx;
					font-size: 34rpx;
					padding:22rpx 0;
					text-align: center;
				}
			}
			
			.top-bar-center{
				flex: auto;	
			}
		}
		
		.main{
			padding-top: 88rpx;
			display: flex;
			flex-direction: column;
			
			.top{
				padding-top:60rpx;
				position:fixed;
				background-color: #fff;
				width: 100%;
				z-index: 100;
				
				.group-img{
					margin:0 auto;
					width:196rpx;
					height:196rpx;
					background: $uni-color-primary;
					box-shadow:0px 36rpx 40rpx 0px rgba(39,40,50,0.1);
					border-radius:40rpx;
					overflow: hidden;
					position:relative;
					
					.img{
						width:196rpx;
						height:196rpx;
					}
					
					.pan{
						position:absolute;
						left:0;
						top:0;
						right:0;
						bottom:0;
						width:56rpx;
						height:56rpx;
						margin:auto;
						z-index: 100;
					}
				}
				
				.group-name{
					padding:62rpx $uni-spacing-col-base 0;
					
					.group-name-input{	
						width:686rpx;
						height:92rpx;
						background: $uni-bg-color-grey;
						border-radius: 46rpx;
						text-align: center;
						font-size:32rpx;
						font-weight: 400;
						color:$uni-text-color;
						line-height:88rpx;
					}
					
					
				}
				
				.title{
					padding:$uni-spacing-col-base $uni-spacing-row-base;
					font-size:44rpx;
					font-weight: 600;
					color:$uni-text-color;
					line-height:60rpx;
				}
				
			}
			
			
			
			.friends{
				padding:532rpx $uni-spacing-row-base 100rpx;

				.user{
					display:flex;
					flex-direction:row;
					align-items: center;
					height:120rpx;
					
					.selected{
						width:48rpx;
						height: 48rpx;
						margin-right: 30rpx;
						background: rgba(255,228,49,0.5);
						border-radius: 24rpx;
						flex:none;
						position: relative;
						
						.selected-img{
							width:30rpx;
							height:20rpx;
							position: absolute;
							left:10rpx;
							top:15rpx;
						}
						
					}
					.isselected{
						background: rgba(255,228,49,1);
					}
					
					.user-img{
						width:80rpx;
						height: 80rpx;
						flex:none;
						border-radius: $uni-border-radius-base;
					}
					
					.user-name{
						padding-left: 32rpx;
						font-size:36rpx;
						color:$uni-text-color;
						display: -webkit-box;
						-webkit-box-orient: vertical;
						-webkit-line-clamp: 1;
						overflow: hidden;
					}
				}
			}

		}
		
		.bottom-bar{
			background: rgba(250,250,250,0.9);
			box-shadow:0px  2rpx 0px 0px rgba(0,0,0,0.25);
			
			.bottom-btn{
				margin:0 $uni-spacing-col-base;
				background-color: $uni-bg-color-grey;
			}
			
			.noselecte{
				background-color: $uni-color-primary;
			}
			
		}
		
	}
</style>
