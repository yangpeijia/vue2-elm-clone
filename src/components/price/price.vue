<template>
  <div class="price">
    ￥<span class="now">{{food.price}}元</span>
    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}元</span>
  </div>
</template>

<script>
export default {
  name: 'price',
  props: {
    food: {
      type: Object,
      default: null
    }
  },
  data: function () {
    return {}
  },
  methods: {}
}
</script>

<style lang="stylus" scoped>
   .price
     font-weight 700
     line-height 24px
     font-size 10px
     color rgb(240,20,20)
     .now
       margin-right 8px
       font-size 14px
     .old
       text-decoration line-through
       color rgb(147,153,159) 
</style>