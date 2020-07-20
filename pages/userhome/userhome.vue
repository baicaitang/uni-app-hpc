<template>
	<view class="content">
		<view class="top-bar">
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
			<view class="bg-cover" :animation="animationData5">
			</view>
			<image class="bg-img" src="../../static/images/img/1.png" mode="aspectFill"></image>
		</view>

		<view class="main">
			
				<view class="user-header" @tap="toUserDetail">
					<view class="sex" :animation="animationData4" :style="{background:sexBg}">
						<image src="../../static/images/userhome/female.png" mode=""></image>
					</view>
					<image :animation="animationData3" class="user-img" src="../../static/images/img/1.png" mode=""></image>
				</view>
			
			<view class="user-info">
				<view class="name">
					{{user.name}}
				</view>
				<view class="nickname">
					昵称：{{user.nickname}}
				</view>
				<view class="bio">
					{{user.bio}}
				</view>
			</view>

			<view class="bottom-bar">
				<view class="bottom-btn btn1" @tap="addFriendAnimate">
					加为好友
				</view>
			</view>

			<view class="add-msg" :animation="animationData" :style="{height:addHeight+'px',bottom:-addHeight+'px'}">
				<view class="name">
					{{user.name}}
				</view>
				<textarea class="add-main" :value="myname+'请求加为好友~'" maxlength="120" placeholder="" />
				</view>
			
			<view class="add-btn bottom-bar" :animation="animationData2">
				<view class="cancel btn1" @tap="addFriendAnimate">
					取消
				</view>
				<view class="send btn1">
					发送
				</view>
			</view>
			
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				sexBg:'rgba(255,93,91,1)',//性别背景颜色
				myname:'abcde',
				user:{
					name:'hpc',
					nickname:'白菜汤里的胡萝卜',
					bio:'很多人的梦想和计划受挫，是有两个小问题导致的：早上起不来床，晚上下不了线'
				},
				addHeight:0,//add-msg板块高
				addWidth:0,//页面宽
				animationData:{},//动画
				animationData2:{},
				animationData3:{},
				animationData4:{},
				animationData5:{},
				isAdd:false,//动画开关
			};
		},
		methods:{
			backOne() { //返回上一页
				console.log('back!')
				uni.navigateBack({
					delta: 1
				});
			},
			toUserDetail(){//跳转到注册页面
				uni.navigateTo({
					url:'../userdetail/userdetail',
				})
			},
			getElementStyle(){//获取页面高度
				const query = uni.createSelectorQuery().in(this);
				query.select('.bg').boundingClientRect(data => {
				  // console.log("得到布局位置信息" + JSON.stringify(data));
					this.addHeight = data.height - 186
					this.addWidth = data.width
				}).exec();
			},
			addFriendAnimate(){//添加好友动画
				
				this.isAdd = !this.isAdd
			
				var animation = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation2 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation3 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation4 = uni.createAnimation({
				  duration: 0,
				  timingFunction: "ease",
				  delay: 0
				})
				var animation5 = uni.createAnimation({
				  duration: 300,
				  timingFunction: "ease",
				  delay: 0
				})
				
				// 调用动画操作方法后要调用 step() 来表示一组动画完成		
				if(this.isAdd){
					animation.bottom(0).step()
					animation2.bottom(0).step()
					animation3.width(120).height(120).top(40).left(-(this.addWidth-120-6-60)/2).step()
					animation4.opacity(0).step()
					animation5.backgroundColor('rgba(255,228,49,0.6)').step()
				}else{
					animation.bottom(-this.addHeight).step()
					animation2.bottom(-100).step()
					animation3.width().height().top(0).left(0).step()
					animation4.opacity(1).step()
					animation5.backgroundColor('rgba(255,228,49,0)').step()
				}
				this.animationData = animation.export()
				this.animationData2 = animation2.export()
				this.animationData3 = animation3.export()
				this.animationData4 = animation4.export()
				this.animationData5 = animation5.export()
			},
			
			
		},
		onReady(){
			this.getElementStyle()
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";

	.content {
		.top-bar {
			box-shadow: 0px 0px 0px 0px rgba(0, 0, 0, 0);
			background: rgba(0,0,0,0);
			border-bottom: none;
		}

		.bg {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;

			.bg-cover {
				width: 110%;
				height: 110%;
			}

			.bg-img {
				opacity: 0.4;
				position: absolute;
				top: -10rpx;
				left: -10rpx;
				width: 110%;
				height: 110%;
				filter: blur(12px);
				z-index: -1;
			}
		}

		.main {
			text-align: center;
			
			.user-header {
				padding-top: 148rpx;
				position: relative;
				margin: 0 auto;
				width: 412rpx;
				height: 412rpx;

				.sex {
					position: absolute;
					bottom: 22rpx;
					right: 22rpx;
					width: 64rpx;
					height: 64rpx;
					line-height: 64rpx;
					border-radius: $uni-border-radius-circle;
					z-index: 4;
					
					image{
						padding: 16rpx;
						width: 32rpx;
						height: 32rpx;
					}
				}

				.user-img {
					top:0;
					z-index: 3;
					width: 400rpx;
					height: 400rpx;
					border-radius: 48rpx;
					border: 6rpx solid rgba(255,255,255,1);
					box-shadow: 0px 36rpx 40rpx 0px rgba(39,40,50,0.1);
				}
			}
			
			.bottom-bar{
				.bottom-btn{
					margin:0 $uni-spacing-col-base;
					background-color: $uni-color-primary;
				}
			}
			
			.user-info{
				padding-top: 42rpx;
				
				.name{
					font-family: PingFangSC-Regular;
					font-size: 52rpx;
					line-height: 74rpx;
					color: $uni-text-color;
					letter-spacing: -0.89px;
				}
				
				.nickname{
					font-family: PingFangSC-Regular;
					font-size:  $uni-font-size-base;
					color: $uni-text-color;
					line-height:40rpx;
					letter-spacing: -0.48px;
				}
				
				.bio{
					padding: 20rpx 100rpx;
					font-family: PingFangSC-Light;
					font-size: $uni-font-size-base;
					color: $uni-text-color;
					text-align: left;
					letter-spacing: -0.48px;
					line-height: 48rpx;
				}
			}
			
			.add-msg{
				padding: 0 56rpx;
				box-sizing: border-box;
				position: fixed;
				left: 0;
				width: 100%;
				background-color: rgba(255,255,255,1);
				border-radius: 40rpx 40rpx 0px 0px;
				text-align: left;
				
				.name{
					padding: 168rpx 0 40rpx;
					font-size: 52rpx;
					color: $uni-text-color;
					line-height:74rpx;
					
				}
				
				.add-main{
					box-sizing: border-box;
					padding: 18rpx 22rpx;
					font-size: $uni-font-size-lg;
					color: $uni-text-color;
					line-height: 44rpx;
					height: 40%;
					width: 100%;
					background: $uni-bg-color-grey;
					border-radius: $uni-border-radius-base;
				}
			}
			
			.add-btn{
				bottom: -204rpx;
				z-index: 100;
				display: flex;
				
				.cancel{
					flex:auto;
					width: 172rpx;
					background-color: $uni-bg-color-hover;
					margin-left: $uni-spacing-col-base;
				}
				
				.send{
					flex:auto;
					margin:0 $uni-spacing-col-base;
					background-color: $uni-color-primary;
				}
			}
				
		}
	}
</style>
