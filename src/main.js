import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './App.vue'
import look from 'components/look'
import wardrobe from 'components/wardrobe'

Vue.config.devtools = true
// install router
Vue.use(VueRouter)

const routes = [
  {path: '/look', component: look},
  {path: '/wardrobe', component: wardrobe},
  {path: '*', redirect: '/look'}
]

const router = new VueRouter({
  routes
})

/* eslint-disable no-new */
new Vue({
  router,
  el: 'app',
  render: h => h(App)
})
