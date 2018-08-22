import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Block from '@/components/Block'
import Trx from '@/components/Trx'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/block/:id', name: 'Block', component: Block },
    { path: '/trx/:id', name: 'Trx', component: Trx },
  ]
})
