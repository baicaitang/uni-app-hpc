<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/friendsrequest/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-center">
				<view class="title">
					好友请求
				</view>
			</view>
			<view class="top-bar-right pice">
				
			</view>
		</view>

		<view class="main">
			<view class="requester" v-for="(item,i) in requesters" :key="i">
				<view class="request-top">
					<view class="reject btn" @tap="refuse(item.id)">
						拒绝
					</view>
					<view class="header-img">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="agree btn" @tap="agree(item.id)">
						同意
					</view>
				</view>
				<view class="request-center">
					<view class="title">
						{{item.name}}
					</view>
					<view class="time">
						{{changeTime(item.lastTime)}}
					</view>
				</view>
				<view class="notic">
					<text>留言:</text>
						{{item.message}}
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
				requesters: [], //请求好友数据
				uid:'',
				myname:'',
				token:'',
			};
		},
		onLoad() {
			this.getStorage()
			this.friendsRequest()
			this.changeTime()

		},
		methods: {
			backOne() { //返回上一页
				// console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			changeTime(t) { //获取时间
				return myfun.dateTime(t)
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
							
							let res = data.data.result
								
							for(let i = 0; i<res.length ; i++){
								
								res[i].imgurl = this.serverUrl + '/user/' + res[i].imgurl
								this.getRequestMsg(res,i)
								
							}
							
							this.requesters = res
							
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('好友申请')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			getRequestMsg(arr,i){ //获取好友申请留言
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
							// console.log('好友申请')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			refuse(fid){//拒绝
				uni.request({
					url:this.serverUrl + '/friend/deletefriend',
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
							
							for(let i = 0; i< this.requesters.length; i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1)
								}
							}
							// console.log('拒绝')
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('好友申请')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			agree(fid){//同意
				uni.request({
					url:this.serverUrl + '/friend/updateFriendState',
					data:{
						uid:this.uid,
						fid:fid,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						// console.log(data)
						let status = data.data.status
						
						// 访问后端成功
						if(status == 200){
							
							for(let i = 0; i< this.requesters.length; i++){
								if(this.requesters[i].id == fid){
									this.requesters.splice(i,1)
								}
							}
							// console.log('同意')
						}else if (status == 500){
							uni.showToast({
							    title: '服务器出错了！',
									icon:'none',
							    duration: 2000
							});
						}else if(status == 300){
							console.log('好友申请')
							uni.navigateTo({
								url:'../login/login?name='+this.myname
							})
						}
					}
				})
			},
			
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		.top-bar {
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
			background: #fff;	
			display: flex;
			
			.top-bar-center{
				flex: auto;	
			}
		}

		.main {
			padding: 88rpx $uni-spacing-col-base;

			.requester {
				margin-top: 112rpx;
				background: rgba(255, 255, 255, 1);
				box-shadow: 0px 24rpx 64rpx -6rpx rgba(0, 0, 0, 0.1);
				border-radius: $uni-border-radius-base;
				border: 1rpx solid #eee;
				padding: $uni-spacing-col-base;

				.request-top {
					display: flex;
					flex-direction: row;

					.btn {
						flex: none;
						width: 140rpx;
						height: 64rpx;
						line-height: 64rpx;
						text-align: center;
						background: rgba(255, 93, 91, 0.1);
						border-radius: 40rpx;
						font-size: $uni-font-size-lg;
					}

					.reject {
						color: $uni-color-warning;
						background-color: rgba(255, 93, 91, 0.1);
					}

					.header-img {
						flex: auto;
						margin-top: -94rpx;
						text-align: center;

						image {
							width: 144rpx;
							height: 144rpx;
							border-radius: 50%;
							background-color: $uni-color-primary;
						}
					}

					.agree {
						color: $uni-text-color;
						background-color: $uni-color-primary;
					}
				}

				.request-center {
					text-align: center;
					padding: 20rpx 0;

					.title {
						font-size: 36rpx;
						font-weight: 500;
						line-height: 50rpx;
						color: $uni-text-color;
					}

					.time {
						line-height: 34rpx;
						font-size: $uni-font-size-sm;
						color: $uni-text-color-disable;
					}

				}

				.notic {
					padding: $uni-spacing-row-sm $uni-spacing-col-base;
					font-size: $uni-font-size-base;
					color: $uni-text-color;
					line-height: 40rpx;
					text-align: left;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
					
					text{
						margin-right:20rpx;
					}
				
				}

			}
		}

	}
</style>
