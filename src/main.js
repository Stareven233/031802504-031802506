import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Vue2OrgTree from 'vue2-org-tree'
import 'vue2-org-tree/dist/style.css'

Vue.use(ElementUI)
Vue.use(Vue2OrgTree)
Vue.config.productionTip = false

new Vue({
  render: h => h(App)
}).$mount('#app')
// $mount('#app') ：手动挂载到id为app的dom中
// 当Vue实例没有el属性时，可以之后调用vm.$mount()方法来延迟挂载
