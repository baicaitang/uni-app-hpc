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
					<view class="reject btn">
						拒绝
					</view>
					<view class="header-img">
						<image :src="item.imgurl" mode=""></image>
					</view>
					<view class="agree btn">
						同意
					</view>
				</view>
				<view class="request-center">
					<view class="title">
						{{item.name}}
					</view>
					<view class="time">
						{{changeTime(item.time)}}
					</view>
				</view>
				<view class="notic">
					<text>留言:</text>
					{{item.news}}
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
				requesters: [], //请求好友数据

			};
		},
		onLoad() {
			this.getRequesters()
			this.changeTime()

		},
		methods: {
			backOne() { //返回上一页
				console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			getRequesters() { //获取请求好友数据
				this.requesters = datas.friends();
				this.requesters.forEach((item, i) => {
					this.requesters[i].imgurl = '../../static/images/img/' + item.imgurl
				})
				console.log(this.requesters);
			},
			changeTime(t) { //获取时间
				return myfun.dateTime(t)
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
				}

			}
		}

	}
</style>
