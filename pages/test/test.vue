<template>
	<view>
		<view class="upload" @tap="upload">上传图片</view> 
		<image v-for="(item,index) in img" :key="index" :src="item" mode=""></image>
		
		<button @tap="searchUser">search</button>
		
	</view>
</template>

<script>
	import myfun from '../../commons/js/myfun.js';
	export default {
		data() {
			return {
				id:'ghjkasgdjagjd',
				img:[],
				
				
			}
		},
		onLoad(){
			// try {
			//     const value = uni.getStorageSync('user');
			//     if (value) {
			//         console.log(value);
			//     }
			// } catch (e) {
			//     // error
			// }
		},
		methods: {
			upload:function(){  //上传、下载
				// 当前日期文件夹
				let url = myfun.fileName(new Date())
				
				uni.chooseImage({
					
					  count: 9, //默认9
					  sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
					  sourceType: ['album','camera'], //从相册选择
				    success: (chooseImageRes) => {
				        const tempFilePaths = chooseImageRes.tempFilePaths;
								
								// console.log(tempFilePaths)
								for(let i = 0;i < tempFilePaths.length; i ++){//for循环tempFilePaths上传多个
									
									const uploadTask = uni.uploadFile({
									    url: this.serverUrl +'/files/upload', 
									    filePath: tempFilePaths[i],
									    name: 'file',
									    formData: {
									        url: url,
													name: new Date().getTime() + this.id + i,
									    },
									    success: (uploadFileRes) => {
												 console.log(uploadFileRes);
													let path = this.serverUrl + '/' + url + '/' + uploadFileRes.data
													this.img.push(path)
									    }
									});
													
									uploadTask.onProgressUpdate((res) => {
									    console.log('上传进度' + res.progress);
									    // console.log('已经上传的数据长度' + res.totalBytesSent);
									    // console.log('预期需要上传的数据总长度' + res.totalBytesExpectedToSend);
													
									    // 测试条件，取消上传任务。
									    // if (res.progress > 50) {
									    //     uploadTask.abort();
									    // }
									});
									
								}
								  
				    }
				});
			},
		
			searchUser:function(){// 搜索用户
				uni.request({
					url:this.serverUrl + '/friend/applyfriend',
					data:{
						uid:'5f98e47c47611534e0b3aea3',
						fid:'5f93856ec0df6a6218a27f96',
						token:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOThlNDdjNDc2MTE1MzRlMGIzYWVhMyIsInRpbWUiOiIyMDIwLTEwLTI4VDA2OjQ3OjUxLjIzNFoiLCJpYXQiOjE2MDM4Njc2NzEsImV4cCI6MTYxNDIzNTY3MX0.me2ydgHUxq7ciWRg4RdS25fUilv-IR7nI_TVbFONCbI",
						msg:'你好，小李'
					},
					method:'POST',
					success:(data) => {
						
							
								let status = data.data.status
								
								// 访问后端成功
								if(status == 200){
									console.log(status)
									
								}else if(status == 500){
									uni.showToast({
									    title: '服务器出错了！',
											icon:'none',
									    duration: 2000
									});
								}else if(status == 300){
									uni.showToast({
									    title: 'token过期！',
											icon:'none',
									    duration: 2000
									});
								}
						
					}
				})
				
				
			},
			  
			searchUser2:function(){// 搜索分页
				uni.request({
					url:this.serverUrl + '/chat/msg',
					data:{
						
					},
					method:'POST',
					success:(data) => {
						
							
								let status = data.data.status
								
								// 访问后端成功
								if(status == 200){
									console.log(status)
									
								}else if(status == 500){
									uni.showToast({
									    title: '服务器出错了！',
											icon:'none',
									    duration: 2000
									});
								}else if(status == 300){
									uni.showToast({
									    title: 'token过期！',
											icon:'none',
									    duration: 2000
									});
								}
						
					}
				})
				
				
			},
			
			
			
			
		}
	}
</script>

<style lang="scss">
	.upload{
		padding-top:40rpx;
		text-align:center;
	}
	
	button{
		margin:100rpx auto;
		width: 200rpx;
		height:60rpx;
		line-height: 60rpx;
		background-color: #ffaa00;
	}
</style>
