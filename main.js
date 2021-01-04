import Vue from 'vue'
import App from './App'

// 引入socket.io模块
import io from './components/socket/weapp.socket.io.js'

Vue.config.productionTip = false

// 全局变量
// 服务器地址
Vue.prototype.serverUrl = 'http://192.168.24.11:3000';
// weapp.socket.io
Vue.prototype.socket = io('http://192.168.24.11:8082')

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
