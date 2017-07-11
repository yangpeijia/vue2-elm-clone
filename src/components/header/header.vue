<template>
  <div class="header">
     <div class="content-wrapper">
        <div class="avatar">
          <img width="64" height="64" :src="seller.avatar" alt="头像">
        </div>
        <div class="content">
          <div class="title">
            <span class="brand"></span>
            <span class="name">{{seller.name}}</span>
          </div>
          <div class="description">
            {{seller.description}}/{{seller.deliveryTime}}分钟送达
          </div>
          <div v-if="seller.supports" class="support">
            <icon :Type="1" :number="seller.supports[0].type"></icon>
            <span class="text">{{seller.supports[0].description}}</span>
          </div>
        </div>
        <div v-if="seller.supports" class="support-count" @click="showDetail">
          <span class="count">{{seller.supports.length}}个</span>
          <i class='icon-keyboard_arrow_right'></i>
        </div>     
     </div>   
     <div class="bulletin-wrapper" @click="showDetail">
       <span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
       <i class="icon-keyboard_arrow_right"></i>
     </div>
     <div class="background">
       <img :src="seller.avatar" width="100%" height="100%" alt="底层背景图">
     </div>
     <transition name="fade">
       <div v-show="detailShow" class="detail">
         <div class="detail-wrapper clearfix">
           <div class="detail-main">
              <h1 class="name">{{seller.name}}</h1>
              <div class="star-wrapper">
                <star :size="48" :score="seller.score"></star>
              </div>
              <v-title title="优惠信息"></v-title>
              <ul v-if="seller.supports" class="support">
                <li class="support-item" v-for="(item,index) in seller.supports" :key="item">
                  <icon :Type="2" :number="seller.supports[index].type"></icon>
                  <span class="text">{{seller.supports[index].description}}</span>
                </li>
              </ul>
              <v-title title="商家公告"></v-title>
              <div class="bulletin">
                <p class="content">{{seller.bulletin}}</p>
              </div>
           </div>
         </div>
         <div class="detail-close" @click="hideDetail">
           <i class='icon-close'></i>
         </div>
       </div>
     </transition>
  </div>
</template>

<script>
  import star from '../star/star.vue'
  import title from '../title/title.vue'
  import icon from '../iconStyle/icon.vue'
  export default {
    name: 'header',
    props: {
      seller: {
        type: Object
      }
    },
    data: function () {
      return {
        detailShow: false
      }
    },
    methods: {
      showDetail: function () {
        this.detailShow = true
      },
      hideDetail: function () {
        this.detailShow = false
      }
    },
    components: {
      star,
      'v-title': title,
      icon
    }
  }
</script>

<style lang="stylus">
  @import ("../../common/stylus/mixin")
  .header
    position relative
    overflow hidden
    color #fff
    background-color rgba(7,27,17,0.5)
    .content-wrapper
      position relative
      padding 24px 12px 18px 24px
      font-size 0
      .avatar
        display inline-block
      .content
        display inline-block 
        margin-left 16px
        vertical-align top
        .title
          margin 2px 0 8px 0
          .brand
            display inline-block
            vertical-align top
            width 30px
            height 18px
            bg-image('brand')
            background-size 30px 18px
            background-repeat no-repeat
          .name
            margin-left 6px
            font-size 16px
            font-weight bold
            line-height 18px
        .description
          font-size 12px
          line-height 12px
          margin-bottom 10px
        .support
          .text
            font-size 10px
            line-height 14px
      .support-count
        position absolute
        right 12px
        bottom 15px
        height 24px
        line-height 24px
        padding 0px 8px
        background-color rgba(0,0,0,0.2)
        border-radius 14px
        text-align center
        &:active
          background-color rgba(206,198,198,0.2) 
        .count
          margin-right 2px
          margin-left 2px
          vertical-align top
          font-size 10px
          line-height 26px
        .icon-keyboard_arrow_right
          font-size 10px
          line-height 24px
    .bulletin-wrapper
      position relative
      padding 0px 16px 0 22px
      height 28px
      line-height 28px
      white-space nowrap
      overflow hidden
      text-overflow ellipsis
      background-color rgba(7,17,27,0.2)
      &:active
        background-color rgba(206,198,198,0.2)
      .bulletin-title
        display inline-block
        width 22px
        height 12px
        bg-image("bulletin")
        background-size 22px 12px
        background-repeat no-repeat
      .bulletin-text
        margin 0 30px 0 4px
        vertical-align middle
        font-size 10px
      .icon-keyboard_arrow_right
        position absolute
        right 12px
        top 9px
        font-size 10px
    .background
      position absolute
      left 0
      top 0
      width 100%
      z-index -1
      overflow hidden
      filter blur(10px)
    .fade-enter,.fade-leave-to
      opacity 0
    .fade-enter-active,.fade-leave-active
      transition all .3s ease
    .detail
      position fixed
      z-index 100
      top 0
      left 0
      width 100%
      height 100%
      overflow auto
      background-color rgba(7,17,27,0.8)
      backdrop-filter blur(10px)
      .detail-wrapper
        min-height 100%
        width 100%
        .detail-main
          margin-top 64px
          padding-bottom 64px
          .name
            font-size 16px
            font-weight 700
            line-height 16px
            text-align center
          .star-wrapper
            margin-top 16px
            padding 2px 0
            text-align center 
          
          .support
            width 80%
            margin 0 auto
            .support-item
              padding 0 12px
              margin-bottom 12px
              font-size 0
              &:last-child
                margin-bottom 0
              .text
                line-height 16px
                font-size 12px
          .bulletin
            width 80%
            margin 0 auto
            .content
              padding 0 12px
              line-height 24px
              font-size 12px
      .detail-close
        position relative
        width 32px
        height 32px
        margin -64px auto 0 auto
        clear both
        font-size 32px
</style>

