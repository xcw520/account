import Pub from './Pub.vue'
import test from '../../../untils/test';

export default {
    install: function(Vue) {
        Vue.component('pub', Pub);//挂全局组件
        Vue.prototype.$test = test;//挂全局方法
    }
}