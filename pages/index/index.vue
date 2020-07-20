<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<navigator url="../userhome/userhome?id=hpc" hover-class="none">
					<image src="../../static/images/img/8.png" mode=""></image>
				</navigator>
			</view>

			<view class="top-bar-center">
				<image src="" mode="" class="logo"></image>
			</view>
			<view class="top-bar-right">
				<view class="search" @tap="toSearch">
					<image src="../../static/images/search/search@3x.png" mode="" class="search-img"></image>
				</view>

				<view class="add">
					<image src="../../static/images/index/addgroup@3x.png" mode="" class="add-img"></image>
				</view>
			</view>
		</view>

		<view class="main">
			<view class="apply">
				<view class="friends-list" @tap="toFriendsRequest">
					<view class="friends-list-l">
						<text class="tips">
							1
						</text>
						<image src="../../static/images/index/nus.png" mode=""></image>
					</view>
					<view class="friends-list-r">
						<view class="name">
							好友申请
						</view>
						<view class="time">
							上午10:15
						</view>
						<view class="info">
							茫茫人海，相聚便是缘分
						</view>
					</view>
				</view>
			</view>
			<view class="friends">
				<view class="friends-list" v-for="(item,index) in friends" :key="index" @tap="toChatRoom">
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
							{{changeTime(item.time)}}
						</view>
						<view class="info">
							{{item.info}}
						</view>
					</view>
				</view>
			</view>
		</view>


	</view>
</template>

<script>
	import datas from '../../commons/js/datas.js';
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				friends: [],

			}
		},
		onLoad() {
			this.getFriends()
			this.changeTime()

		},
		methods: {
			changeTime(t) { //获取时间
				return myfun.dateTime(t)
			},
			getFriends() { //获取朋友数据
				this.friends = datas.friends();
				this.friends.forEach((item, i) => {
					this.friends[i].imgurl = '../../static/images/img/' + item.imgurl
				})
				console.log(this.friends);
			},
			toSearch() {
				uni.navigateTo({
					url: '../search/search'
				})
			},
			toFriendsRequest() {
				uni.navigateTo({
					url: '../friendsrequest/friendsrequest'
				})
			},
			toChatRoom() {
				uni.navigateTo({
					url: '../chatroom/chatroom'
				})
			},
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
