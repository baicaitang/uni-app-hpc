export default {
	//用户信息
	friends(){
		let friendArr = [
			{
				id:1,
				isfriend:0,
				imgurl:'1.png',
				tip:2,
				name:'新闻',
				email:'ab@qq.com',
				time:new Date(),
				info:'据北京市公安局朝阳分局通报：针对网传“太阳宫某小区有人高空抛物”视频，经核实，事发于2020年6月30日。犯罪嫌疑人王某东（男，40岁）因家庭矛盾发泄情绪，从位于13楼的家中将花盆等物品抛出窗外，未造成人员受伤。7月1日，王某东因涉嫌以危险方法危害公共安全已。',
				news:'你好，我是好友推荐来的，请求加你为好友，可以通过以下吗？'
			},
			{
				id:2,
				isfriend:0,
				imgurl:'2.png',
				tip:0,
				name:'李子柒',
				email:'baicaitang@qq.com',
				time:new Date(),
				info:'家长心思过于保守，我刷过的高三模拟里面也不止一处出现李子柒，写作文举例子也不止一次用到李子柒。当然，你可以说她是纯粹赚钱搞的噱头，但是她真正做到了促进中国田园文化向外的传播。',
				news:'你好，我是好友推荐来的，请求加你为好友，可以通过以下吗？'
			},
			{
				id:3,
				isfriend:0,
				imgurl:'3.png',
				tip:1,
				name:'网红',
				email:'hpc@qq.com',
				time:new Date(),
				info:'“网红”并不是一定是贬义的，“三百六十行，行行出状元”。她也没偷没抢，只是做好了自己，又没有逼迫你消费',
				news:'你好，我是好友推荐来的，请求加你为好友，可以通过以下吗？'
			},
			{
				id:4,
				isfriend:0,
				imgurl:'4.png',
				tip:3,
				name:'我是谁',
				email:'hello@qq.com',
				time:new Date(),
				info:'在《妻子的浪漫旅行》中,谢娜也是别出心裁,上演了妻子团的一个舞台,还扬言要去踢馆《乘风破浪的姐姐》。其实这些姐姐们也是属于有颜值有身材的。',
				news:'你好，我是好友推荐来的，请求加你为好友，可以通过以下吗？'
			},
			{
				id:5,
				isfriend:0,
				imgurl:'5.png',
				tip:1,
				name:'乘风破浪',
				email:'aoto@qq.com',
				time:new Date(),
				info:'赵薇工作室亲自发文辟谣称，“捕风捉影，吃瓜谨慎”，否认了赵薇与黄有龙离婚的传闻。',
				news:'你好，可以通过以下吗？'
			},
			{
				id:6,
				isfriend:0,
				imgurl:'6.png',
				tip:58,
				name:'匿名',
				email:'zxcvbn@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好，可以通过以下吗？'
			},
			{
				id:7,
				isfriend:0,
				imgurl:'6.png',
				tip:555,
				name:'知乎',
				email:'abjsdbj@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好，可以通过以下吗？'
			},
			{
				id:8,
				isfriend:0,
				imgurl:'7.png',
				tip:0,
				name:'豆瓣',
				email:'opq@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好通过一下'
			},
			{
				id:9,
				isfriend:0,
				imgurl:'6.png',
				tip:2222,
				name:'微博',
				email:'fgdfgddbj@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好通过一下'
			},
			{
				id:10,
				isfriend:0,
				imgurl:'4.png',
				tip:5,
				name:'百度',
				email:'xxss@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好通过一下'
			},
			{
				id:11,
				isfriend:0,
				imgurl:'1.png',
				tip:11,
				name:'匿名',
				email:'zdrttr@qq.com',
				time:new Date(),
				info:'几大网络巨头投资的网络公司签约的网红就是不一样，传播什么正能量了，教你做人了还是教你做事了 就是吃的吧？那么多科研人员，人民英雄没有给你带来正能量！！！',
				news:'你好通过一下'
			},
		];
		return friendArr
	},
	//好友关系
	isFriend(){
		let isfriend = [
			{
				userid:1,
				friendid:2
			},
			{
				userid:1,
				friendid:4
			},
			{
				userid:1,
				friendid:6
			},
			{
				userid:1,
				friendid:3
			}
		]
		return isfriend
	},
	//聊天信息
	message(){
		let msgs =[
			{
				id:'b',
				imgurl:'7.png',
				message:{
					voice:'abc',
					time:'10'
				},
				types:2,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*13,
				tip:1
			},
			{
				id:'b',
				imgurl:'7.png',
				message:'几股哟必侬[莫名破]twutstxynlkGVGV',
				types:0,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*12*34,
				tip:2
			},
			{
				id:'a',
				imgurl:'1.png',
				message:'01.gif',
				types:1,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*60*11,
				tip:3
			},
			{
				id:'b',
				imgurl:'7.png',
				message:'爱奇艺娱乐频道为您提供最新最全娱乐资讯，专业解读娱乐圈。',
				types:0,
				time:new Date()-1000*60*23,
				tip:4
			},
			{
				id:'a',
				imgurl:'1.png',
				message:'onReachBottomDistance、titleNView的transparent透明渐变',
				types:0,
				time:new Date()-1000*60*40*48,
				tip:5
			},
			{
				id:'a',
				imgurl:'1.png',
				message:'transparent透明渐变',
				types:0,
				time:new Date()-1000*60*40*48,
				tip:6
			},
			{
				id:'b',
				imgurl:'7.png',
				message:'dog.jpg',
				types:1,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*60*40*50,
				tip:7
			},
			{
				id:'b',
				imgurl:'7.png',
				message:'哦哦，那个真的感觉很厉害样子',
				types:0,
				time:new Date()-1000*60*60*59,
				tip:8
			},
			{
				id:'a',
				imgurl:'1.png',
				message:{
					voice:'qfgigviqvv',
					time:'40'
				},
				types:2,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*70*50*13*12,
				tip:9
			},
			{
				id:'a',
				imgurl:'1.png',
				message:{
					name:'陈家祠哈斯吃饭哈丕欧你拍五位',
					address:'康王中路33号你明白吗保障农民军扩军军军军军扩多绿绿',
					latitude:'39.909473',
					longitude:'116.39730899999999'
				},
				types:3,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*70*50*13*20,
				tip:10
			},
			{
				id:'b',
				imgurl:'7.png',
				message:{
					name:'吃饭哈丕欧你拍五位',
					address:'保障农民军扩军军军军军扩多绿绿',
					latitude:'39.909473',
					longitude:'116.39730899999999'
				},
				types:3,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*70*50*13*44,
				tip:11
			},
			{
				id:'b',
				imgurl:'7.png',
				message:{
					name:'哈回去爱U忘记',
					address:'and空间按空间很大健康',
					latitude:'39.909473',
					longitude:'116.39730899999999'
				},
				types:3,//(0:文字，1:图片，2:音频，3:地图)
				time:new Date()-1000*70*50*13*60,
				tip:12
			},
		];
	  return msgs
	}

}