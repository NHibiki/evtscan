import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Block from '@/components/Block'
import Trx from '@/components/Trx'
import Fungible from '@/components/Fungible'
import Domain from '@/components/Domain'
import ShowList from '@/components/ShowList'

Vue.use(Router)

export function createRouter() {
  return new Router({
    mode: 'history',
    routes: [
      { path: '/', name: 'Index', component: Index },
      { path: '/block/:id', name: 'Block', component: Block },
      { path: '/block', name: 'Blocks', component: ShowList },
      { path: '/trx/:id', name: 'Trx', component: Trx },
      { path: '/trx', name: 'Transactions', component: ShowList },
      { path: '/fungible/:id', name: 'Fungible', component: Fungible },
      { path: '/fungible', name: 'Fungibles', component: ShowList },
      { path: '/domain/:id', name: 'Domain', component: Domain },
      { path: '/domain', name: 'Domains', component: ShowList },
    ]
  })
}
