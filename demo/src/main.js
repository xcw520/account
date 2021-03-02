import Vue from 'vue'
import App from './App.vue'

import axios from 'axios'
Vue.prototype.$http1 = axios;

import less from 'less'
Vue.use(less)

import Pub from './components/common/pub'
Vue.use(Pub)

import Foot from './components/foot'
Vue.use(Foot)

import md5 from './components/common/pub/md5'
Vue.prototype.$md5 = md5;

import ajax from './components/common/pub/axios'
Vue.prototype.$http = ajax;
// import ElementUI from 'element-ui';
// import 'element-ui/lib/theme-chalk/index.css';
// Vue.use(ElementUI);
import {
  Card, Upload, Button, DatePicker, Row, Col, Form, FormItem, Input, Table, TableColumn, Radio, RadioGroup, RadioButton,Drawer,Progress
} from 'element-ui';
Vue.use(Card)
Vue.use(Upload)
Vue.use(Button)
Vue.use(DatePicker)
Vue.use(Row)
Vue.use(Col)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Drawer)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Progress)
import { Calendar, Cell, Field, Popup, DatetimePicker, NumberKeyboard, Circle, Uploader, Toast, Dialog} from 'vant';
Vue.use(Calendar);
Vue.use(Cell);
Vue.use(Field);
Vue.use(Popup);
Vue.use(DatetimePicker);
Vue.use(NumberKeyboard)
Vue.use(Circle);
Vue.use(Uploader);
Vue.use(Toast);
Vue.use(Dialog);
import echarts from 'echarts'
Vue.prototype.$echarts = echarts;


import VueAMap from 'vue-amap'
Vue.use(VueAMap)
VueAMap.initAMapApiLoader({
  key: '59f860a8e34907d5f7c7687478390243',
  plugin: ['AMap.CitySearch'],
  v: '1.4.4',
  uiVersion: '1.0'
})

import router from './router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
