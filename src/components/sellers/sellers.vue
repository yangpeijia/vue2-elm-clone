<template>
    <scroll class="seller" ref="child">
      <div class="seller-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="desc border-1px">
            <star :size="36" :score="seller.score"></star>
            <span class="text">({{seller.ratingCount}})</span>
            <span class="text">月售{{seller.sellCount}}单</span>
          </div>
          <ul class="remark">
            <li class="block">
              <h2 class="title">起送价</h2>
              <div class="content">
                 <span class="stress">{{seller.minPrice}}</span>元 
              </div>
            </li>
            <li class="block">
              <h2 class="title">商家配送</h2>
              <div class="content">
                 <span class="stress">{{seller.deliveryPrice}}</span>元 
              </div>
            </li>
            <li class="block">
              <h2 class="title">平均配送时间</h2>
              <div class="content">
                 <span class="stress">{{seller.deliveryTime}}</span>分钟 
              </div>
            </li>
          </ul>
          <div class="favorite" @click="toggleFavorite">
            <span class="icon-favorite" :class="{'active':favorite}"></span>
            <span class="text">{{favoriteText}}</span>
          </div>
        </div>
        <split></split>
        <div class="bulletin">
          <h1 class="title">公告与活动</h1>
          <div class="content-wrapper">
            <p class="content">{{seller.bulletin}}</p>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item border-1px" v-for="item in seller.supports" :key="item">
              <icon :Type="4" :number="item.type"></icon>
              <span class="text">{{item.description}}</span>
            </li>
          </ul>
        </div>
        <split></split>
        <div class="pics">
          <h1 class="title">商家实景</h1>
          <scroll class="pic-wrapper" :scrollX="true" :scrollY="false" :probeType="3" :data="seller.pics" >
            <ul class="pic-list" ref="picList">
              <li class="pic-item" v-for="pic in seller.pics" :key="pic">
                <img :src="pic" alt="商家实景" width="120" height="90">
              </li>
            </ul>
          </scroll>
        </div>
        <split></split>
        <div class="info">
          <h1 class="title border-1px">商家信息</h1>
          <ul>
            <li class="info-item border-1px" v-for="info in seller.infos" :key="info">{{info}}</li>
          </ul>
        </div>
      </div> 
    </scroll>
</template>

<script>
import star from '../star/star'
import split from '../split/split'
import icon from '../iconStyle/icon'
import scroll from '../BScroll/better-scroll'
import {saveToLocal, loadFromLocal} from '../../common/js/store'
export default {
  props: {
    seller: {
      type: Object
    }
  },
  data: function () {
    return {
      favorite: (() => {
        return loadFromLocal(this.seller.id, 'favorite', false)
      })()
    }
  },
  components: {
    star,
    split,
    icon,
    scroll
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    toggleFavorite () {
      if (!this.$refs.child.isConstructed()) {
        return
      }
      this.favorite = !this.favorite
      saveToLocal(this.seller.id, 'favorite', this.favorite)
    }
  },
  mounted: function () {
    let picWidth = 120
    let margin = 6
    let width = (picWidth + margin) * this.seller.pics.length - margin
    this.$nextTick(() => {
      this.$refs.picList.style.width = width + 'px'
    })
  }
}

</script>

<style lang="stylus" scoped>
@import "../../common/stylus/mixin"
  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .desc
        padding-bottom 18px 
        border-1px(rgba(7,17,27,0.1))
        font-size 0
        .star
          display inline-block
          margin-right 8px
        .text
          display inline-block
          margin-right 12px
          line-height 18px
          vertical-align top
          font-size 10px
          color rgb(77,85,93)
      .remark
        display flex
        padding-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none
          .title
            margin-bottom 4px
            line-height 10px
            font-size 10px
            color rgb(147,153,159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7,17,27)
            .stress
              font-size 24px
      .favorite
        position absolute
        width 50px
        right 11px
        top 18px
        text-align center
        .icon-favorite
          display block
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(240,20,20)
        .text
          line-height 10px
          font-size 10px
          color rgb(77,85,93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px
      .content-wrapper
        padding 0 12px 16px 
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height 24px
          font-size 12px
          color rgb(240,20,20)
      .supports
        .support-item
          padding 16px 12px
          border-1px(rgba(7,17,27,0.1))
          font-size 0
          &:last-child
            border-none()
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
    .pics
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        color rgb(7,17,27)
        font-size 14px 
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display:inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin-right 0px 
    .info
      padding 18px 18px 0 18px 
      color rgb(7,17,27)
      .title 
        padding-bottom 12px
        line-height 14px
        font-size 14px
        border-1px(rgba(7,17,27,0.1)) 
      .info-item
        padding 16px 12px
        line-height 16px
        border-1px (rgba(7,17,27,0.1))
        font-size 12px
        &:last-child
            border-none()  
</style>