<template>
    <div class="cartcontrol">
      <transition name="rotate">
        <div class="cart-decrease icon-remove_circle_outline" v-show="isCounting" @click.stop="decrCart"></div>
      </transition>
      <transition name="fade">
         <div class="cart-count" v-show="isCounting">{{food.count}}</div>
      </transition>
        <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
import Vue from 'vue'
import BScroll from '../BScroll/better-scroll.vue'
export default {
  name: 'cartcontrol',
  props: {
    food: {
      type: Object
    },
    shopcart: {
      type: Object
    }
  },
  data: function () {
    return {
    }
  },
  created: function () {
    // console.log(this.foods)
  },
  computed: {
    isCounting () {
      if (this.food.count > 0) {
        return true
      } else {
        return false
      }
    },
    ...mapState({
      // shopcart: state => state.shopcart
    })
  },
  methods: {
    addCart () {
      if (!BScroll.methods.isConstructed()) {
        return
      }
      if (!this.food.count) {
        Vue.set(this.food, 'count', 1)
      } else {
        this.food.count++
      }
      this.add()
      // this.ballDrop = true
      this.$emit('addCart', event.target)
    },
    decrCart () {
      if (!BScroll.methods.isConstructed()) {
        return
      } else if (this.food.count === 0) {
        Vue.delete(this.food, 'count')
      } else {
        this.food.count--
        this.decrease()
      }
    },
    ...mapMutations({
      add: 'increment',
      decrease: 'decrement'
    })
  }
}
</script>

<style lang="stylus" scoped>
  .cartcontrol
    font-size 0
    // 按钮动画
    .rotate-enter
      opacity 0
      position absolute
      right 30px
    .rotate-leave-to
      opacity 0
      position absolute
      right 0px
    .rotate-enter-to,.rotate-leave
      position absolute
      right 48px
    .rotate-enter-active
      animation rotate  .3s linear 
    .rotate-leave-active
      animation rotate  .3s linear 
    @keyframes rotate 
      0%
        transform rotate(0)
      100%
        transform rotate(360deg)
    .cart-decrease
      display inline-block
      padding 6px
      font-size 24px
      color rgb(0,160,220) 
      line-height 24px  
      transition all .3s linear
    // 文字动画
    .fade-enter,.fade-leave-to
      opacity 0
    .fade-enter-active
      transition opacity .3s linear .3s
    .cart-count
      display inline-block
      width 12px
      vertical-align top
      line-height 36px
      font-size 10px
      text-align center
    .cart-add
      display inline-block
      padding 6px
      font-size 24px
      color rgb(0,160,220)
      line-height 24px


</style>