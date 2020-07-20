<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left">
				<view class="cancel">
					<image src="../../static/images/sign/关闭@3x.png" mode="" class="close" @tap="backOne"></image>
				</view>
			</view>
			<view class="top-bar-right" @tap="toRegister">
				<view class="text">
					注册
				</view>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/sign/logob.png" mode=""></image>
		</view>
		<view class="main">
			<view class="title">
				登录
			</view>
			<view class="slogan">
				您好，欢迎来到yikes！
			</view>
			<view class="form">
				<view class="input">
					<input type="text" @blur="handleUser" @focus="handleUserFocus" placeholder="用户名/邮箱" class="user" placeholder-style="color:#aaa;font-weight:400;" />
					<input type="password" @blur="handlePwd" @focus="handlePwdFocus" placeholder="密码" class="pwd" placeholder-style="color:#aaa;font-weight:400;" />
				</view>
				<view class="tips" v-if="err">
					输入用户或密码错误！
				</view>
				<view class="empty" v-if="u_empty">
					用户名/邮箱不能为空！
				</view>
				<view class="empty" v-if="pwd_empty">
					密码不能为空！
				</view>
				<button type="submit" class="submit" @tap="login">登录</button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				user: '',
				pwd: '',
				u_empty: false,
				pwd_empty: false,
				err: false,
			}
		},
		methods: {
			handleUser(e) {//用户名失去焦点
				this.user = e.detail.value
				if (this.user.length > 0) {
					this.u_empty = false
					this.err = false
				} else {
					this.u_empty = true
				}
			},
			handlePwd(e) {//密码失去焦点
				this.pwd = e.detail.value
				if (this.pwd.length > 0) {
					this.pwd_empty = false
					this.err = false
				} else {
					this.pwd_empty = true
				}
			},
			handlePwdFocus(e) {//密码聚焦
				this.pwd_empty = false
				this.err = false
			},
			handleUserFocus(e) {//用户名聚焦
				this.u_empty = false
				this.err = false
			},
			// testfun(){//后台连接测试
			// 	uni.request({
			// 		url:'http://192.168.0.3:3000/test',
			// 		data:{
						
			// 		},
			// 		method:'GET',
			// 		success:(res=>{
			// 			console.log(res)
			// 		})
			// 	})
			// },
			toRegister(){//跳转到注册页面
				uni.navigateTo({
					url:'../register/register',
				})
			},
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			login(){//点击登录
				if(this.user && this.pwd){
					console.log('login!')
				}else{
					if(!this.user){
						this.u_empty = true
					}
					if(!this.pwd){
						this.pwd_empty = true
					}
					
				}
			}
		
		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.content {

		.top-bar{
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0);
			border-bottom: none;
			
		}

		.logo {
			text-align: center;

			image {
				padding-top: 240rpx;
				width: 194rpx;
				height: 92rpx;
				margin: 0 auto;
			}
		}

		.main {
			padding: 0 $uni-spacing-row-lg;

			.title {
				font-size: 56rpx;
				font-weight: 400;
				color: $uni-text-color;
				line-height: 80rpx;
				padding: 40rpx 0;
			}

			.slogan {
				font-size: 40rpx;
				color: $uni-text-color-grey;
				line-height: 56rpx;
			}

			.form {
				margin-top: 48rpx;

				input {
					padding-top: 8rpx;
					height: 88rpx;
					font-size: $uni-font-size-lg;
					font-weight: 500;
					color: $uni-text-color;
					line-height: 88rpx;
					border-bottom: 1rpx solid $uni-border-color;
				}



				.tips,
				.empty {
					font-size: $uni-font-size-lg;
					color: $uni-color-warning;
					line-height: 54rpx;
				}

				button {
					&:after {
						border: none;
					}
					&:active{
						color: #fff;
						margin-top: 120rpx;
						width: 520rpx;
						height: 96rpx;
						text-align: center;
						background: #ddd;
						border-radius: $uni-border-radius-lg;
						font-size: $uni-font-size-lg;
						font-family: PingFangSC-Medium;
						font-weight: 500;
						line-height: 96rpx;
						transition: all 0.1s ease;
					}
				}

				.submit {
					margin-top: 120rpx;
					width: 520rpx;
					height: 96rpx;
					text-align: center;
					background: $uni-color-primary;
					box-shadow: 0px 50rpx 32rpx -36rpx rgba(255, 288, 49, 0.4);
					border-radius: $uni-border-radius-lg;
					font-size: $uni-font-size-lg;
					font-family: PingFangSC-Medium;
					font-weight: 500;
					color: rgba(39, 40, 50, 1);
					line-height: 96rpx;
				}
			}
		}
	}
</style>
