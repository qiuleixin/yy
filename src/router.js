import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/login.vue'
import Home from './components/home.vue'


Vue.use(Router)

const router = new Router({
        routes: [
            { path: '/', redirect: '/login' },
            { path: '/login', component: Login },
            { path: '/home', component: Home }
        ]
    })
    //挂载路由导航守卫
router.beforeEach((to, form, next) => {
    //to 将要访问的路径
    //form 代表从那个路径跳转而来
    // next 是一个函数，放行
    // next() 放行， next('/login') 强行跳转
    if (to.path == '/login') next()
        //获取token
    const tokenStr = window.sessionStorage.getItem('token')
    if (!tokenStr) next('/login')
    next()
})

export default router