import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Block from '@/components/Block'
import Trx from '@/components/Trx'
import ShowList from '@/components/ShowList'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'Index', component: Index },
    { path: '/block/:id', name: 'Block', component: Block },
    { path: '/block', name: 'Blocks', component: ShowList },
    { path: '/trx/:id', name: 'Trx', component: Trx },
    { path: '/trx', name: 'Transactions', component: ShowList },
  ]
})
