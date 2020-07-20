<template>
	<view class="content">
		<view class="top-bar">
			<view class="search-box">
				<input :value="searchText" @input="handleSearch" class="search" type="search" placeholder="搜索用户/群"
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
					<navigator url="../userhome/userhome?id=hpc">
						<image :src="item.imgurl" mode="" class="photo"></image>
					</navigator>
					<view class="user-info">
						<view class="name" v-html="item.name">
						</view>
						<view class="email" v-html="item.email">
						</view>
					</view>
					<view class="right-btn send" v-if="item.isFriend==1">
						发消息
					</view>
					<view class="right-btn add" v-if="item.isFriend==0">
						加好友
					</view>
				</view>

			</view>
		</view>
	</view>
</template>

<script>
	import datas from "../../commons/js/datas.js";
	export default {
		data() {
			return {
				searchText: '',
				userArr: [],
			};
		},
		methods: {
			handleSearch(e) { //获取关键词
				this.userArr = []
				this.searchText = e.detail.value
				if (this.searchText.length > 0) {
					this.searchUser(this.searchText)
				}
			},
			searchUser(text) { //搜索关键词匹配的用户
				let arr = datas.friends()
				//替换所有含有text的字符串
				let exp = eval("/" + text + "/g")
				arr.forEach((item, i) => {
					// search() 方法用于检索字符串中指定的子字符串，或检索与正则表达式相匹配的子字符串。
					// 如果没有找到任何匹配的子串，则返回 -1
					if (item.name.search(text) != -1 || item.email.search(text) != -1) {
						item.imgurl = '../../static/images/img/' + item.imgurl
						item.name = item.name.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")
						item.email = item.email.replace(exp, "<span style='color:#4AAAFF;'>" + text + "</span>")
						this.isFriend(item)
						this.userArr.push(item)
					}
				})
				// console.log(this.userArr)
			},
			// cancel() { //取消
			// 	this.searchText = ''
			// 	this.userArr = []
			// },
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			isFriend(user) { //判断是否为好友
				let isFriend = 0;
				let arr = datas.isFriend()
				arr.forEach((item, i) => {
					if (item.friendid == user.id) {
						isFriend = 1
					}
				})
				user.isFriend = isFriend
			}
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
	}
</style>
