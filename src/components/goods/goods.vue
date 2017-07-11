<template>
  <div class="goods">
    <scroll :data="goods" :pulldown="true" @pulldown="loadData" class="menu-wrapper">
      <ul>
        <li v-for="(item,index) in goods" :key="item" class="menu-item border-1px" :class="{current:isCurrent(index)}" @click="selectMenu(index)">   
          <span class="text">
              <icon :Type="3" :number="goods[index].type" v-if="goods[index].type>=0"></icon>
              {{goods[index].name}}
          </span>
        </li>
      </ul>
    </scroll>
    <scroll class="foods-wrapper" :data="goods" :pulldown="true" @pulldown="loadData" :probeType="3" :listenScroll="true" v-on:scroll="getPosY" ref="child">
      <ul ref="itemlist">
        <li v-for="(item,index) in goods" :key="goods[index]" class="foods-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="(food,index) in item.foods" :key="index" class="food-item border-1px" @click="selectFood(food)">
              <div class="icon">
                  <img width="57" height="57" :src="food.icon" alt="食物图片">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                </div>
                <price :food="food"></price>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" v-on:addCart="drop" ref="cart-control"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </scroll>
    <shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" ref="shopcart"></shopcart>
    <div class="ball-container">
        <transition name="fade" v-for="ball in balls" :key="ball" @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
          <div class="ball" v-show="ball.show">
            <div class="inner inner-hook"></div>
          </div>
        </transition>
    </div>
    <food :food="selectedFood" ref="food"  v-on:addCart="drop"></food>
  </div>
</template>

<script>
import axios from 'axios'
import icon from '../iconStyle/icon.vue'
import scroll from '../BScroll/better-scroll.vue'
import shopcart from '../shopcart/shopcart.vue'
import cartcontrol from '../cartcontrol/cartcontrol'
import food from '../food/food'
import price from '../price/price'
const ERR_OK = 0
export default {
  name: 'goods',
  props: {
    seller: {
      type: Object
    }
  },
  data: function () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      index: 0,
      selectedFood: {},
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBalls: []
    }
  },
  components: {
    icon,
    scroll,
    shopcart,
    cartcontrol,
    food,
    price
  },
  created: function () {
    this.loadData()
  },
  computed: {
    currentIndex: function () {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i]
        let height2 = this.listHeight[i + 1]
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          this.listHeight.length = 0
          this.index = i
          return this.index
        }
      }
      this.listHeight.length = 0
    },
    selectFoods () {
      let foods = []
      this.goods.forEach((good) => {
        good.foods.forEach((food) => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  },
  methods: {
    loadData: function () {
      var self = this
      axios.get('/api/goods')
      .then(function (response) {
        response = response.data
        if (response.errno === ERR_OK) {
          self.goods = response.data
        }
      })
    },
    getPosY: function (pos) {
      this.scrollY = Math.abs(Math.round(pos.y))
      this.calculateHeight()
    },
    selectFood (food) {
      if (!this.$refs.child.isConstructed()) {
        return
      }
      this.selectedFood = food
      this.$refs.food.show()
    },
    calculateHeight: function () {
      let foodList = this.$refs.itemlist.getElementsByClassName('food-list-hook')
      let height = 0
      this.listHeight.push(height)
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i]
        height += item.clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu: function (index) {
      if (!this.$refs.child.isConstructed()) {
        return
      }
      let foodList = this.$refs.itemlist.getElementsByClassName('food-list-hook')
      let el = foodList[index]
      this.$refs.child.scrollToElement(el, 0)
      this.index = index
    },
    isCurrent: function (index) {
      if (this.index === index) {
        return true
      } else if (this.currentIndex === index) {
        return true
      }
    },
    drop (el) {
      // 触发一次事件就会将所有小球进行遍历
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i]
        if (!ball.show) { // 将false的小球放到dropBalls
          ball.show = true
          ball.el = el // 设置小球的el属性为一个dom对象
          this.dropBalls.push(ball)
          return
        }
      }
    },
    beforeEnter (el) { // 这个方法的执行是因为这是一个vue的监听事件
      let count = this.balls.length
      while (count--) {
        let ball = this.balls[count]
        if (ball.show) {
          let rect = ball.el.getBoundingClientRect() // 获取小球的相对于视口的位移(小球高度)
          let x = rect.left - 32
          let y = -(window.innerHeight - rect.top - 22) // 负数,因为是从左上角往下的的方向
          el.style.display = '' // 清空display
          el.style.webkitTransform = `translate3d(0,${y}px,0)`
          el.style.transform = `translate3d(0,${y}px,0)`
          // 处理内层动画
          let inner = el.getElementsByClassName('inner-hook')[0] // 使用inner-hook类来单纯被js操作
          inner.style.webkitTransform = `translate3d(${x}px,0,0)`
          inner.style.transform = `translate3d(${x}px,0,0)`
        }
      }
    },
    enter (el, done) { // 这个方法的执行是因为这是一个vue的监听事件
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight // 触发重绘html
      this.$nextTick(() => { // 让动画效果异步执行,提高性能
        el.style.webkitTransform = 'translate3d(0,0,0)'
        el.style.transform = 'translate3d(0,0,0)'
        // 处理内层动画
        let inner = el.getElementsByClassName('inner-hook')[0] // 使用inner-hook类来单纯被js操作
        inner.style.webkitTransform = 'translate3d(0,0,0)'
        inner.style.transform = 'translate3d(0,0,0)'
        el.addEventListener('transitionend', done) // Vue为了知道过渡的完成，必须设置相应的事件监听器。
      })
    },
    afterEnter (el) { // 这个方法的执行是因为这是一个vue的监听事件
      let ball = this.dropBalls.shift() // 完成一次动画就删除一个dropBalls的小球
      if (ball) {
        ball.show = false
        el.style.display = 'none' // 隐藏小球
      }
    }
  }
}
</script>

<style lang='stylus' scoped>
  @import "../../common/stylus/mixin"
  .goods
    display flex
    position absolute
    top 174px
    bottom  46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px
      width 80px
      background  #f3f5f7
      .menu-item
        display table
        padding 0 12px
        height 54px
        width 56px
        &.current
          position relative
          margin-top -1px
          font-weight 700
          background-color #fff
          z-index 10
          .text
            border-none()
        .text
          display table-cell
          z-index 10
          font-size 12px
          line-height 14px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
    .foods-wrapper
      flex 1
      .title
          height 26px
          padding-left 24px
          border-left 2px solid #d9dde1
          color rgb(147,153,159)
          font-size 12px
          line-height 26px
          background-color #f3f5f7
      .food-item
        display flex
        margin 18px
        padding-bottom 18px
        border-1px (rgba(7,17,27,0.1))
        &:last-child
            border-none() 
            margin-bottom 0
        .icon
            flex 0 0 57px
            margin-right 10px
        .content
          flex 1
          .name
              margin 2px 0 8px 0
              height 14px
              font-size 14px
              line-height 14px
              color rgb(7,17,21)
          .desc,.extra
              font-size 10px
              line-height 12px
              color rgb(147,153,159)
          .desc
              margin-bottom 8px
          .extra
              .count
                margin-right 12px  
          
          .cartcontrol-wrapper
            position absolute
            right 0
            bottom 6px
    .ball-container
      .ball
        position fixed
        left: 34px
        bottom: 26px
        z-index:200
        transition: all .5s cubic-bezier(.45,-0.3,.94,.54)
        .inner
          width 18px
          height 18px
          border-radius 50%
          background rgb(0,160,220)
          transition: all .5s linear
</style>