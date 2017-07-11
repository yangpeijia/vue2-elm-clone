import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const goods = r => require.ensure([], () => r(require('../components/goods/goods.vue')), 'goods')
const ratings = r => require.ensure([], () => r(require('../components/ratings/ratings.vue')), 'ratings')
const sellers = r => require.ensure([], () => r(require('../components/sellers/sellers.vue')), 'sellers')

export default new Router({
  routes: [{
    path: '/goods',
    component: goods
  },
  {
    path: '/ratings',
    component: ratings
  },
  {
    path: '/sellers',
    component: sellers
  }
  ],
  linkActiveClass: 'active'
})
