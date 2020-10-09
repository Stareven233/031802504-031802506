import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(ElementUI)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
// $mount('#app') ：手动挂载到id为app的dom中
// 当Vue实例没有el属性时，可以之后调用vm.$mount()方法来延迟挂载
