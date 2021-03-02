import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from './home'
import Me from './me'
import Money from './money'
import Plan from './plan'
import Charts from './charts'
Vue.use(VueRouter);

const routes = [
    Home,//首页
    Me,//我的
    Money,//记账
    Plan,//计划
    Charts//图表
]

export default new VueRouter({
    routes
})