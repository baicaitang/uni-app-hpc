<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-box">
				<input  @input="handleSearch" class="search" type="search" placeholder="搜索用户/群"
				 placeholder-style="color:#aaa;font-weight:400;" />
				<image class="search-img" src="../../static/images/search/search@3x.png" mode=""></image>
			</view>

			<view class="top-bar-right">
				<text class="text" @tap="backOne">取消</text>
			</view>
		</view>

		<view class="main">
			<view class="search-user result">
				<view class="title" v-if="userArr.length>0">
					用户
				</view>
				<view class="user list" v-for="(item,i) in userArr" :key="i">
					<navigator :url="'../userhome/userhome?id='+item._id">
						<image :src="item.imgurl" mode="" class="photo"></image>
					</navigator>
					<view class="user-info">
						<view class="name" v-html="item.name">
						</view>
						<view class="email" v-html="item.email">
						</view>
					</view>
					<view class="right-btn send" v-if="item.tip==1">
						发消息
					</view>
					<view class="right-btn add" v-if="item.tip==0" @tap="addFriendBtn(item._id)">
						加好友
					</view>
				</view>

			</view>
		</view>
		<!-- 添加好友弹出层 -->
		<view class="modify" v-show="isModify" :style="{bottom:-height+'px'}" :animation="animationData">
			<view class="modify-header">
				<view class="cancel" @tap="modify">
					取消
				</view>
				<view class="title">
					{{modifyTitle}}
				</view>
				<view class="define" @tap="addSubmit">
					确定
				</view>
			</view>
			<view class="modify-main">
				<textarea  v-model="msg" class="modify-content" />
				</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js";
	import myfun from "../../commons/js/myfun.js"
	export default {
		data() {
			return {
				userArr: [],
				uid:'',
				fid:'',
				myname:'',//用户名
				token:'',
				animationData:{},//动画
				isModify:false,//动画开关
				height:0,//页面高度
				msg:'',//申请添加好友信息
				modifyTitle:'添加好友',//修改标题
			};
		},
		onReady(){
			this.getElementStyle()//获取页面高度
		},
		onLoad() {
			this.getStorage()
		},
		methods: {
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
			handleSearch:myfun.debounce(function(e){//获取关键词	//函数防抖
				
				this.userArr = [] //清除之前的搜索词
				let searchText = e.detail.value
				
				if (searchText.length > 0) {
					// console.log(searchText)
					this.searchUser(searchText)
				}
			},500),
			searchUser(text) { //搜索关键词匹配的用户
				
				uni.request({
					url:this.serverUrl + '/search/user',
					data:{
						data:text,
						token:this.token,
					},
					method:'POST',
					success:(data) => {
						
						let status = data.data.status
						// console.log(status)
						// 访问后端成功
						if(status == 200){
							
							let arr = data.data.result
							// console.log(arr)
							
							//替换所有含有text的字符串
							// let exp = eval("/" + text + "/g")
							arr.forEach((item, i) => {
								this.isFriend(item,text)//判断是否为好友
								// search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。
								// 如果没有找到任何匹配的子串，则返回 -1
								// if (item.name.search(text) != -1 || item.email.search(text) != -1) {
									
								// 	this.isFriend(item,text)//判断是否为好友
								// 	// item.imgurl = this.serverUrl + '/user/' + item.imgurl
								// 	// item.name = item.name.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")
								// 	// item.email = item.email.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")			
								// 	// this.userArr.push(item)
								// }
							})
							// console.log(this.userArr)
							
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
				
			},
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			isFriend(user,text) { //判断是否为好友
				//替换所有含有text的字符串
				let exp = eval("/" + text + "/g")
				let tip = 0
				if(user._id == this.uid){
					tip = 2
					user.tip = tip
					user.imgurl = this.serverUrl + '/user/' + user.imgurl
					user.name = user.name.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")
					user.email = user.email.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")	
					this.userArr.push(user)
				}else{
					uni.request({
						url:this.serverUrl + '/search/isfriend',
						data:{
							uid:this.uid,
							fid:user._id,
							token:this.token,
						},
						method:'POST',
						success:(data) => {
							
							let status = data.data.status
							// console.log(status)
							// 访问后端成功
							if(status == 200){
								// 好友
								tip = 1
								
							}else if(status == 400){
								// 陌生人
								tip = 0
							}else if(status == 500){
								uni.showToast({
								    title: '服务器出错了！',
										icon:'none',
								    duration: 2000
								});
							}
							
							user.tip = tip
							user.imgurl = this.serverUrl + '/user/' + user.imgurl
							user.name = user.name.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")
							user.email = user.email.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")	
							this.userArr.push(user)
						}
					})
				}
				
			},
			modify(){//修改弹框弹出动画

				this.isModify = !this.isModify
				
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
			addSubmit(){//确定添加好友
				
				if(this.msg.length > 0){
					
					this.modify()//弹框弹出动画
					
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
								// console.log(this.uid+'----'+this.fid)
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
			addFriendBtn(fid){//添加好友按钮
				this.fid = fid
				this.msg = this.myname + '	请求添加好友~'
				this.modify()//弹框弹出动画
			},
			getElementStyle(){//获取页面高度
				const query = uni.createSelectorQuery().in(this);
				query.select('.modify').boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
					this.height = data.height
			
				}).exec();
			},
			
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		// padding-top: var(--status-bar-height);
		
		.top-bar {
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0);
			// position: relative;

			.search-box {
				box-sizing: border-box;
				padding: 14rpx 14rpx 14rpx $uni-spacing-col-base;
				// position: absolute;
				height: 60rpx;
				float: left;
				top: 0;
				left: 0;
				z-index: -1;

				.search {
					box-sizing: border-box;
					padding: 0 60rpx 0 12rpx;
					width: 600rpx;
					height: 60rpx;
					background: $uni-bg-color-grey;
					border-radius: 10rpx;
				}

				.search-img {
					// position: absolute;
					float: right;
					top: -50rpx;
					right: 12rpx;
					width: 40rpx;
					height: 40rpx;
				}
			}
		}

		.main {
			margin-top: 88rpx;
			padding: 28rpx $uni-spacing-col-base;

			.result {
				// padding-top: 34rpx;

				.title {
					font-size: 44rpx;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 60rpx;
				}

				.list {
					width: 100%;
					height: 80rpx;
					padding: 20rpx 0;

					image {
						float: left;
						width: 80rpx;
						height: 80rpx;
						border-radius: $uni-border-radius-base;
					}

					.user-info {
						float: left;
						padding-left: $uni-spacing-col-base;

						.name {
							font-size: 36rpx;
							color: $uni-text-color;
							line-height: 50rpx;
						}

						.email {
							font-size: $uni-font-size-sm;
							color: rgba(53, 53, 53, .6);
							line-height: 28rpx;
						}
					}

					.right-btn {
						float: right;
						width: 120rpx;
						height: 48rpx;
						border-radius: 24rpx;
						font-size: $uni-font-size-sm;
						line-height: 48rpx;
						text-align: center;
						margin-top: 16rpx;

					}

					.send {
						background: $uni-color-primary;
						color: $uni-text-color;
					}

					.add {
						background: rgba(74, 170, 255, 0.10);
						color: $uni-color-success;
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
