<template>
    <div class="shopcart">
      <div class="content">
        <div class="content-left">
            <div class="logo-wrapper">
                <div class="logo" :class="{'highlight':isHighLight}" @click="toggleList">
                    <i class="icon-shopping_cart" :class="{'highlight':isHighLight}" ref="icon"></i>
                </div>
                <div class="num" v-show="showTotalCount">{{totalCount}}</div>
            </div>
            <div class="price" :class="{'highlight':isHighLight}">￥{{totalPrice}}</div>
            <div class="desc">另需配送费￥{{deliveryPrice}}元</div>
        </div>
        <div class="content-right">
            <div class="pay" :class="isEnough?'enough':'not-enough'">
                {{payDesc}}
            </div>
        </div>
      </div>
      <transition name="fold">
        <div class="shopcart-list" v-if="listShow">
          <div class="list-header border-1px">
            <h1 class="title">购物车</h1>
            <span class="empty" @click="empty">清空</span>
          </div>  
          <scroll ref="scroll" :probeType="3" class="list-content" :data="selectFoods">
              <ul>
                <li class="food border-1px" v-for="food in selectFoods" :key="food">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.count*food.price}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul> 
          </scroll>
        </div>
      </transition>
      <transition name="fade">
        <div class="list-mask" v-if="listShow"></div>
      </transition>
    </div>
</template>

<script>
import cartcontrol from '../cartcontrol/cartcontrol.vue'
import scroll from '../BScroll/better-scroll.vue'
import {mapState, mapMutations} from 'vuex'
import Vue from 'vue'
export default {
  name: 'shopcart',
  props: {
    deliveryPrice: {
      type: Number,
      default: 0
    },
    minPrice: {
      type: Number,
      default: 0
    },
    selectFoods: {
      type: Array,
      default: {
        price: 0,
        count: 0
      }
    }
  },
  data: function () {
    return {
      fold: true
    }
  },
  computed: {
    totalPrice () {
      let total = 0
      this.selectFoods.forEach((food) => {
        total += food.count * food.price
      })
      return total
    },
    isHighLight () {
      if (this.totalCount > 0) {
        return true
      } else {
        return false
      }
    },
    isEnough () {
      if (this.totalPrice >= this.minPrice) {
        return true
      } else {
        return false
      }
    },
    payDesc () {
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice
        return `还差￥${diff}元起送`
      } else {
        return '去结算'
      }
    },
    showTotalCount () {
      if (this.totalCount > 0) {
        return true
      } else {
        return false
      }
    },
    listShow () {
      if (!this.fold) {
        if (!this.totalCount) {
          this.fold = !this.fold
          return false
        }
      }
      return !this.fold
    },
    ...mapState({
      totalCount: state => state.totalCount
    })
  },
  methods: {
    toggleList () {
      if (!this.totalCount) {
        return
      }
      this.fold = !this.fold
    },
    empty () {
      this.selectFoods.forEach((food) => {
        Vue.delete(food, 'count')
        this.emptyTotal()
      })
    },
    ...mapMutations({
      emptyTotal: 'reset'
    })
  },
  components: {
    cartcontrol,
    scroll
  }
}
</script>

<style lang="stylus" scoped>
 @import ("../../common/stylus/mixin")
  .shopcart
    position fixed
    left 0
    bottom 0
    z-index 50
    width 100%
    height 48px
    .content
       display flex
       background #141d27
       .content-left
        flex 1
        font-size 0
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px
          margin 0 12px
          padding 6px
          width 56px
          height 56px
          box-sizing border-box
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            text-align center
            background #2b343c
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              font-size 24px
              color #80858a
              line-height 44px
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            box-shadow 0 4px 8px 0 rgba(0,0,0,0.2)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          padding-right 12px
          box-sizing border-box
          border-right 1px solid rgba(255,255,255,0.1)
          font-size 16px
          font-weight 700
          color rgba(255,255,255,0.4)
          &.highlight
            color #fff
        .desc
          display inline-block
          margin 12px 12px 0 12px
          line-height 24px
          color rgba(255,255,255,0.4)
          font-size 12px
       .content-right
         flex 0 0 105px
         width 105px
         .pay
          height 48px
          line-height 48px
          text-align center
          font-size 12px
          font-weight 700
          color rgba(255,255,255,0.4)
          &.not-enough
            background #2b343c
          &.enough
            background #00b43c
            color #fff
    .fold-enter,.fold-leave-to
      transform: translate3d(0,100%,0)
    .fold-enter-active,.fold-leave-active
      transition all .5s
    .shopcart-list
      position absolute
      left 0
      bottom 48px
      z-index -50    
      width 100%
      .list-header
        height 40px
        line-height 40px
        background-color #f3f5f7
        padding 0 18px
        border-1px (rgba(7,17,27,0.1))
        .title
          float left
          font-size 14px
          color rgb(7,17,27)
        .empty
          float right  
          font-size 12px
          color rgb(0,160,220)
      .list-content
        padding 0 18px
        max-height 217px
        overflow hidden
        background #fff
        .food
          position relative
          padding 12px 0
          box-sizing border-box
          border-1px (rgba(7,17,27,0.1)) 
          .name
            line-height 24px
            font-size 12px
            color rgb(7,17,24)
          .price
            position absolute
            right 90px
            bottom 12px
            line-height 24px
            font-size 14px
            font-weight 700
            color rgb(240,20,20)
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
  .fade-enter
    opacity 0
  .fade-enter-active,.fade-leave-active
    transition .1s
  .fade-leave
    opacity 1
  .list-mask
    position fixed
    top:0
    left:0
    width 100%
    height 100%
    z-index -60
    background rgba(7,17,27,0.6)
    backdrop-filter blur(10px)
    

</style>
