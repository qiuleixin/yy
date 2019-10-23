import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import './plugins/element.js'
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// require styles 导入富文本编辑器对应的样式


// 导入全局样式表
import './assets/css/global.css'
//导入字体图标样式
import './assets/fonts/iconfont.css'

// 导入Nprogress 对应的js 和css 
import Nprogress from 'nprogress'


import axios from 'axios'
// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 在request 拦截器中展示进度条  Nprogress.start()
axios.interceptors.request.use(config => {
        // console.log(config)
        Nprogress.start()
        config.headers.Authorization = window.sessionStorage.getItem('token')
            //最后必须添加 return config
        return config
    })
    // 在response拦截器中隐藏进度条 Nprogress.done()
axios.interceptors.response.use(config => {
    Nprogress.done()
    return config
})
Vue.prototype.$http = axios
Vue.component('tree-table', TreeTable)

// 将富文本编辑器，注册为全局可用的组件
Vue.use(VueQuillEditor)


Vue.config.productionTip = false
    // 全局注册时间过滤器
Vue.filter('datFormat', function(originVal) {
    const dt = new Date(originVal)

    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')

    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')