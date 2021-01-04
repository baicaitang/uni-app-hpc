<template>
	<view class="content">
		<view class="top-bar" >
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>
		
			<view class="top-bar-right">
				<view class="more-img">
					<image src="../../static/images/userhome/more@3x.png" mode=""></image>
				</view>
			</view>
		</view>
		<view class="top-bar top-bar-change" :animation="animationData1">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>
		
			<view class="top-bar-right">
				<view class="more-img">
					<image src="../../static/images/userhome/more@3x.png" mode=""></image>
				</view>
			</view>
		</view>
		
		<view class="bg">
			<image :src="gimg" class="bg-img" mode="aspectFill"></image>
		</view>
		
		<view class="main">
			<view class="main-inner">
				<view class="inf">
					<view class="name">
						白菜汤天梯图
					</view>
					<view class="time">
						2020/12/02
					</view>
					<view class="notice">
						床前明月光，疑是地上霜，举头望明月，低头思故乡。	床前明月光，疑是地上霜，举头望明月，低头思故乡。	床前明月光，疑是地上霜，举头望明月，低头思故乡。
					</view>
				</view>
			
				<view class="member">
					<view class="top">
						<view class="title">
							群成员
						</view>
						<view class="more">
							管理群成员
						</view>
						<image src="../../static/images/grouphome/more.png" mode="aspectFill"s class="more-img"></image>
					</view>
				
					<view class="member-list">
						<view class="member-li" v-for='(item,index) in groupmember' :key="index">
							<view class="imgs">
								<image src="../../static/images/group/delete.png" mode="aspectFill" class="delete"></image>
								<image :src="item.imgurl" mode="aspectFit" class="user-img"></image>
							</view>
							<view class="name">
								{{item.name}}
							</view>
						</view>
						<view class="member-li">
							<view class="imgs">
								<image src="../../static/images/group/add.png" mode="aspectFit" class="user-add"></image>
							</view>
							<view class="name">
								邀请
							</view>
						</view>
					</view>
					
					<view class="clear"></view>
					
				</view>
			
				<view class="modify-project">
					<view class="row" @tap="modify('gname','群名称','夕阳红刚才劲舞团',true)">
						<view class="title">
							群名称
						</view>
						<view class="cont">
							夕阳红刚才劲舞团
						</view>
						<view class="more">
							<image src="../../static/images/grouphome/more.png" mode="aspectFit"s class="more-img"></image>
						</view>
					</view>
					<view class="row" >
						<view class="title">
							群头像
						</view>
						<view class="cont">
							<view class="content head">
								<image-cropper :src="tempFilePath" @confirm="confirm" @cancel="cancel"></image-cropper>
								<image :src="gimg" @tap="upload" class="group-img"></image>
							</view>
						</view>
						<view class="more">
							<image src="../../static/images/grouphome/more.png" mode="aspectFit"s class="more-img"></image>
						</view>
					</view>
					<view class="row" @tap="modify('gnotice','群公告','床前明月光，疑是地上霜，举头望明月，低头思故乡。',true)">
						<view class="title">
							群公告
						</view>
						<view class="cont">
							床前明月光，疑是地上霜，举头望明月，低头思故乡。	
						</view>
						<view class="more">
							<image src="../../static/images/grouphome/more.png" mode="aspectFit"s class="more-img"></image>
						</view>
					</view>
					<view class="row" @tap="modify('ginsiden','群内名','夕阳红',true)">
						<view class="title">
							群内名
						</view>
						<view class="cont">
							夕阳红
						</view>
						<view class="more">
							<image src="../../static/images/grouphome/more.png" mode="aspectFit"s class="more-img"></image>
						</view>
					</view>
					<view class="row">
						<view class="title">
							消息免打扰
						</view>
						<view class="cont">
						
						</view>
						<view class="more">
							 <switch color="rgba(255,228,49,1)" :checked="swit" @change="switchChange" class="switch"/>
						</view>
					</view>
				</view>
			
			</view>
			
			<view class="dissolution" @tap="" >
				解散群
			</view>
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
				<textarea :style="{display:istext}" v-model="data" class="modify-content" />
				</view>
		</view>
	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js'
	import ImageCropper from "@/components/ling-imgcropper/ling-imgcropper.vue";
	export default {
		data() {
			return {
				gid:'',
				gimg:'',
				swit:false,
				toph:0,
				groupmember:[],
				animationData1:{},
				tempFilePath: '',
				headimg:'',//头像
				data:'',//修改的内容
				oldData:'',//原始内容
				type:'',//修改项
				istext:'block',
				animationData:{},//动画
				isModify:false,//动画开关
				height:0,//页面高
				modifyTitle:'',//修改标题
				
			}
		},
		components: {
			ImageCropper //图片裁剪插件
		},
		onLoad:function(e){
			this.gid = e.gid
			this.gimg = e.gimg
			this.getMember()
			
		},
		onReady(){
			this.getHeight()
		},
		methods: {
			backOne() { //返回上一页
				// console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			getMember(){//获取群成员
				let members = datas.friends()	
				
				for(let i = 0;i<members.length;i++){
					members[i].imgurl = '../../static/images/img/'+members[i].imgurl
					this.groupmember.push(members[i])
				}
				
				
				console.log(members)
			},
			switchChange(e) {//滑块监听
			  console.log('switch发生 change 事件，携带值为', e.target.value)
			},
			getHeight(){//获取距离顶部高度
				// console.log(this.toph)
				const query = uni.createSelectorQuery().in(this);
				query.select('.main-inner').boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
					this.toph = data.top
					// console.log(this.toph)
				}).exec();
			
			},
			addAnimation1(){
				var animation = uni.createAnimation({
					duration:300,
					timingFunction:'linear',
				})
				
				if(this.toph < 60){
					animation.opacity(1).step()
				}else{
					animation.opacity(0).step()
				}
				this.animationData1 = animation.export()
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
				this.gimg= e.detail.tempFilePath;
				this.headimg = e.detail.tempFilePath;
				
			// 	uni.uploadFile({
			// 		url: this.serverUrl + '/files/upload',
			// 		filePath: this.headimg,
			// 		name: 'file',
			// 		fileType: 'image',
			// 		formData:{//传递参数
			// 			url:'user',//存放文件夹
			// 			name:this.uid,//存储图片名字
			// 			token:this.token,
			// 		},
			// 		success: (uploadFileRes) => {
			// 			var backstr = uploadFileRes.data;
			// 			// console.log(backstr)
			// 			// 1.修改本地用户头像缓存
			// 			try{
			// 				uni.setStorageSync('user',{
			// 					'id':this.uid,
			// 					'name':this.myname,
			// 					'imgurl':backstr,
			// 					'token':this.token,
			// 				})
			// 			}catch(err){
			// 				console.log('数据缓存出错！')
			// 			}
			// 			//2.修改数据库
						
			// 			this.update(backstr,'imgurl',undefined)
						
			// 		},
			// 		complete() {
			// 			//console.log("this is headimg"+this.headimg)   
			// 		},
			// 		fail(e) {
			// 			console.log("this is errormes " + e.message)
			// 		}
			
			// 	});
			
			},
			cancel() {
				console.log('canceled');
				this.tempFilePath = "";
			},
			modify(type,title,data){//修改弹框弹出动画
				
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
				
				// console.log( this.type)
				// 提交修改
				if(this.data.length > 0 && this.data != this.oldData){
							
						if(this.type == 'nickname'){
								//修改好友昵称
								this.updateFriendName()
								this.nickname = this.data
								
						}else{
							// console.log('1')
							// this.update(this.data,this.type)
							console.log(this.data +'-----'+this.oldData)
						}
									
				}else{
					// 修改为空时或相同时
					// console.log('2')
					// this.update(this.data,this.type)
				}
			
				// 前端替换修改
				// this.user[this.type] = this.data
				this.modify()
				
			},
			
		},
		onPageScroll:function(){//页面滚动
			this.getHeight()
			this.addAnimation1()
		},
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.content {
		.top-bar {
			// opacity: 1;
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
			background: rgba(0,0,0,0);
			border-bottom: none;
		}
		
		.top-bar-change{
			opacity: 0;
			background-color: hsla(0,0,100%, 95%);
			z-index: 100;
		}
		
		.clear{
			clear: both;
		}
	
		.bg{
			width: 100%;
			height:100%;
			background-color: #fff;
			position:fixed;
			top:0;
			left:0;
			z-index:-1;
			
			.bg-img{
				width: 100%;
				height:750rpx;
				
			}
			
		}
		
		.main{
			padding-top:360rpx;

			.main-inner{
				width: 100%;
				min-height: 720rpx;
				background-color: #fff;
				border-radius: 40rpx 40rpx 0 0;
				
				.inf{
					padding:$uni-spacing-row-base $uni-spacing-col-base 0;
					padding-bottom: 40rpx;
					box-sizing: border-box;
					border-bottom: 1rpx solid #eee;
					
					.name{
						float: left;
						font-size: 48rpx;
						font-weight: 600;
						color: #272832;
						line-height: 66rpx;
					}
					
					.time{
						float: right;
						font-size: 28rpx;
						color: rgba(39,40,50,0.5);
						line-height: 66rpx;
					}
					
					.notice{
						padding-top:20rpx;
						font-size: 28rpx;
						color: #272832;
						line-height: 40rpx;
						clear: both;
						display: -webkit-box;
						-webkit-box-orient:vertical;
						-webkit-line-clamp:2;
						overflow: hidden;
						
					}
				}
			
				.member{
					border:1rpx solid #eee;
					
					.top{
						padding:$uni-spacing-row-base $uni-spacing-col-base 0;
						box-sizing: border-box;
						height: 100rpx;
						width: 100%;
						display: flex;
						align-items: center;
						justify-content: flex-end;
						
						.title{
							flex: 1;
							font-size: 36rpx;
							font-weight: 680;
							color: #272832;
						}
						
						.more{
							float: right;
							padding-right: 20rpx;
							font-size: 32rpx;
							font-weight: 400;
							color: rgba(39,40,50,0.6);
						}
						
						.more-img{
							width: 16rpx;
							height: 28rpx;
						}
					}
				
					.member-list{
						width: 100%;
						padding: 20rpx 16rpx;
						box-sizing: border-box;
						
						.member-li{
							padding-bottom: 32rpx;
							width: 20%;
							float: left;
							text-align: center;
							
							.imgs{
								display: inline-block;
								position: relative;
								width: 104rpx;
								height: 104rpx;
								border-radius: 20rpx;
								background-color: $uni-color-primary;
								
								.user-img{
									width: 104rpx;
									height: 104rpx;
									border-radius: 20rpx;
								}
								
								.user-add{
									width: 104rpx;
									height: 104rpx;
									padding: 32rpx;
									box-sizing: border-box;
								}
								
								.delete{
									width: 40rpx;
									height: 40rpx;
									position: absolute;
									top: -16rpx;
									right: -16rpx;
									z-index: 10;
								}
							}
							
							.name{
								padding:0 8rpx;
								font-size: 28rpx;
								color: #272832;
								line-height: 48rpx;
								display: -webkit-box;
								-webkit-box-orient:vertical;
								-webkit-line-clamp:1;
								overflow: hidden;
							}
						}
						
					}
				
				}
			
				.modify-project{
					display: flex;
					flex-direction: column;
					padding-top:22rpx;
					width: 100%;
					border-bottom: 1rpx soild #eee;
					
					.row{
						display: flex;
						flex-direction: row;
						
						.title {
							flex: none;
							padding: 0 $uni-spacing-col-base;
							font-size: $uni-font-size-lg;
							color: $uni-text-color;
							line-height: 112rpx;
							height: 112rpx;
							letter-spacing: -0.55px;
						}
						
						.cont {
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
							
							.group-img{
								width: 80rpx;
								height: 80rpx;
								border-radius: 20rpx;
								margin-top: 16rpx;
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
						
						.switch{
							position: absolute;
							right: 16px;
						}
						
					}
				}
				
			}
			
			.dissolution{
				margin-top:80rpx;
				text-align: center;
				font-size: $uni-font-size-lg;
				color: $uni-color-warning;
				line-height: 88rpx;
				padding-bottom: evn(safe-area-inset-bottom);
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
