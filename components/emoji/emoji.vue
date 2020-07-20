<template>
	<view class="emoji" :style="{height:height+'px'}">
		<view class="emoji-line" v-for="(item,i) in emoji" :key="i">
			<view class="emoji-line-item" v-for="(emoji,index) in item" :key="index" @tap="clickEmoji(emoji)">
				{{emoji}}
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				emoji:[
					['😀','😁','😂','🤣','😃'],
					['😅','😆','😎','😍','😘'],
					['👹','👺','💀','👻','😿'],
					['🤖','💩','😺','😻','😽'],
					['🏻','🏽','🏿','🗣','👤'],
					['👥','👫','👬','👭','👂'],
					['😀','😁','😂','🤣','😃'],
					['😅','😆','😎','😍','😘'],
					['👹','👺','💀','👻','😿'],
					['🤖','💩','😺','😻','😽'],
					['🏻','🏽','🏿','🗣','👤'],
					['👥','👫','👬','👭','👂'],
				],
			};
		},
		props:{
			height:{
				type:Number,
				default:300
			}
		},
		methods:{
			clickEmoji(emoji){
				this.$emit('emotion',emoji)
			}
		}
	}
</script>

<style lang="scss">
	.emoji{
		width: 100%;
		padding: 10rpx ;
		box-sizing: border-box;
		overflow: hidden;
		overflow-y: auto;
		text-align: center;
		
		.emoji-line{
			display: flex;
			
			.emoji-line-item{
				flex: 1;
				text-align: center;
				padding: 6rpx 40rpx;
			}
		}
	}
</style>
