<template>
	<view class="content">
		<view class="top-bar">
			<view class="top-bar-left" @tap="backOne">
				<image src="../../static/images/sign/back.png" mode="" class="back"></image>
			</view>
			<view class="top-bar-right">
				<image src="../../static/images/sign/关闭@3x.png" mode="" class="close"></image>
			</view>
		</view>
		<view class="logo">
			<image src="../../static/images/sign/logob.png" mode=""></image>
		</view>
		<view class="main">
			<view class="title">
				注册
			</view>
			<view class="form">
				<view class="inputs">
					<view class="input">
						<input type="text" @blur="handleUser" @focus="handleUserFocus" @input="handleUserEnter" placeholder="请输入昵称" class="user"
						 placeholder-style="color:#aaa;font-weight:400;" />
						<view class="employ" v-if="u_employ">
							用户名已有
						</view>
						<view class="empty" v-if="u_empty">
							用户名不能为空
						</view>
						<image v-if="isuser" src="../../static/images/sign/right1.png" mode="" class="ok"></image>
					</view>
					<view class="input">
						<input type="text" @blur="handleEmail" @focus="handleEmailFocus" @input="handleEmailEnter" placeholder="请输入邮箱"
						 class="email" placeholder-style="color:#aaa;font-weight:400;" />
						<view class="employ" v-if="e_employ">
							邮箱已注册
						</view>
						<view class="empty" v-if="e_empty">
							邮箱不能为空
						</view>
						<view class="invalid" v-if="invalid">
							邮箱无效
						</view>
						<image v-if="isemail" src="../../static/images/sign/right1.png" mode="" class="ok"></image>
					</view>
					<view class="input">
						<input :type="type" @blur="handlePwd" @focus="handlePwdFucus" @input="handlePwdEnter" placeholder="这里输入密码" class="pwd"
						 placeholder-style="color:#aaa;font-weight:400;" />
						<view class="employ" v-if="pwd_employ">
							密码过于简单
						</view>
						<view class="empty" v-if="pwd_empty">
							请填写密码
						</view>
						<image :src="looksrc" mode="" class="look" @tap="looks"></image>
					</view>
				</view>
				<button type="submit" :class="[{submit:isok},{submit2:isok2}]" @tap="register">注册</button>
			</view>

		</view>
	</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				type: 'password',
				e_empty: false, //是否为空
				u_empty: false,
				pwd_empty: false,
				isuser: false, //用户名是否正确
				isemail: false, //邮箱是否正确
				invalid: false, //邮箱是否有效
				u_employ: false, //用户名是否占用
				e_employ: false, //邮箱是否已经注册
				pwd_employ: false, //密码是否过于简单
				look: false, //是否显示密码
				looksrc: "../../static/images/sign/biyan.png",
				email: '', // 邮箱
				user: '', //用户名
				pwd: '', //密码
				isok: true,
				isok2: false
			}
		},
		methods: {
			looks() { //点击眼镜显示隐藏密码
				if (this.look) {
					this.type = "password"
					this.look = !this.look
					this.looksrc = "../../static/images/sign/biyan.png"
				} else {
					this.type = "text"
					this.look = !this.look
					this.looksrc = "../../static/images/sign/look.png"
				}
			},
			handleUser(e) { //用户名失去焦点
				this.user = e.detail.value
				if (this.user.length > 0) {
					this.u_empty = false
					this.isuser = true
				} else {
					this.u_empty = true
					this.isuser = false
				}
			},
			handleEmail(e) { //邮箱失去焦点
				this.email = e.detail.value
				this.handleVerifyMailbox()
			},
			handlePwd(e) { //密码失去焦点
				this.pwd = e.detail.value
				if (this.pwd.length > 0) {
					if (this.pwd.length < 5) {
						this.pwd_empty = false
						this.pwd_employ = true
						this.looksrc = ''
					} else {
						this.pwd_empty = false
						this.pwd_employ = false
						this.looksrc = "../../static/images/sign/biyan.png"
					}
				} else {
					this.pwd_empty = true
					this.looksrc = ''
				}
			},
			handleEmailFocus(e) { //邮箱聚焦
				this.e_empty = false
			},
			handleUserFocus(e) { //用户名聚焦
				this.u_empty = false
			},
			handlePwdFucus(e) { //密码聚焦
				this.pwd_empty = false
				this.pwd_employ = false
				this.looksrc = ''
			},
			handlePwdEnter(e) { //密码输入时
				this.looksrc = "../../static/images/sign/biyan.png"
			},
			handleEmailEnter(e) { //邮箱输入时
				this.isemail = false
				this.invalid = false
			},
			handleUserEnter(e) { //用户名输入时
				this.isuser = false
			},
			backOne() { //返回上一页
				uni.navigateBack({
					delta: 1
				});
			},
			register() { //点击注册
				if (this.user && this.email && this.pwd) {
					if (this.handleVerifyMailbox()) { //验证邮箱、验证用户名、邮箱是否被占用
						this.isok = false
						this.isok2 = true
					} else {
						this.isok = true
						this.isok2 = false
					}
					console.log('register!')
				} else { //其中一个为空
					this.isok = true
					this.isok2 = false
					if (!this.user) {
						this.u_empty = true
						this.isuser = false
					}
					if (!this.email) {
						this.e_empty = true
						this.isemail = false
					}
					if (!this.pwd) {
						this.pwd_empty = true
						this.looksrc = ''
					}
				}
			},
			handleVerifyMailbox() { //验证邮箱
				let reg = /^[0-9a-zA-Z_.-]+[@][0-9a-zA-Z_.-]+([.][a-zA-Z]+){1,2}$/;
				if (this.email.length > 0) {
					this.e_empty = false
					if (reg.test(this.email)) { //验证邮箱是否合格
						// console.log('ok')
						this.invalid = false
						this.isemail = true
						return true
					} else {
						// console.log('error')
						this.invalid = true
						this.isemail = false
						return false
					}
				} else {
					// console.log('email is empty!')
					this.e_empty = true
					this.invalid = false
					return false
				}
			},

		}
	}
</script>

<style lang="scss">
	@import "../../commons/css/mycss.scss";
	.content {

		.top-bar {
			box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0);

			.top-bar-right {
				height: 100%;
				width: 88rpx;

			}

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

				.inputs {
					.input {
						position: relative;

						.employ,
						.empty,
						.invalid {
							position: absolute;
							top: 8rpx;
							right: 0;
							font-size: $uni-font-size-base;
							font-family: PingFangSC-Medium;
							font-weight: 500;
							color: rgba(255, 93, 91, 1);
							line-height: 88rpx;
						}

						.ok {
							position: absolute;
							top: 34rpx;
							right: 0;
							width: 38rpx;
							height: 38rpx;
						}

						.look,
						.close-eye {
							position: absolute;
							top: 40rpx;
							right: 0;
							width: 38rpx;
							height: 24rpx;
						}
					}
				}

				button {
					&:after {
						border: none;
					}

				}

				.submit {
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

					&:active {
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
						transition: all 0.1s ease;
					}
				}

				.submit2 {
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
					transition: all 0.1s ease;

					&:active {
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
			}
		}
	}
</style>
