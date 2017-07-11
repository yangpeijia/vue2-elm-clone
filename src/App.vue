<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab">
      <div class="tab-item border-1px">
        <router-link to="/goods" :seller="seller" class="link">商品 </router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings" class="link">评价</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/sellers" class="link">商家</router-link>
      </div>
    </div>
    <keep-alive>  
      <router-view :seller="seller"></router-view>
    </keep-alive>
  </div>
</template>

<script>
  import {urlParse} from './common/js/util'
  import header from './components/header/header.vue'
  import axios from 'axios'
  const ERR_OK = 0

  export default {
    name: 'app',
    data: function () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse()
            return queryParam.id
          })()
        }
      }
    },
    created: function () {
      var self = this
      axios.get('/api/seller?id=' + this.seller.id)
        .then(function (response) {
          response = response.data
          if (response.errno === ERR_OK) {
            self.seller = Object.assign({}, self.seller, response.data)
          }
        })
    },
    components: {
      'v-header': header
    }
  }
</script>

<style lang="stylus">
  @import './common/stylus/mixin'
  .tab
    display flex
    width 100%
    height 40px
    line-height 40px
    border-1px(rgba(7,17,27,0.1))
    .tab-item
      flex 1
      text-align center 
      .link
        display block
        font-size 14px
        color rgb(77,85,93)
        &.active
          color rgb(240,20,20)
      
</style>
