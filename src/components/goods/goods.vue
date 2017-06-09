<template>
<div>
  <div class="goods">
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for='(item, key) in goods' class="menu-item" :class="{'current':currentIndex===key}" @click="selectMenu(key, $event)">
          <span class="text border-1px">
          <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}</span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodWrapper"> 
      <ul>
        <li v-for='item in goods' class="food-list food-list-hook">
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li @click="theFood(food, $event)" v-for="food in item.foods" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol :food="food" v-on:choiceFood="selectFood" v-on:removeFood="removeFood" v-on:cartadd="cartadd"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart ref="shopcart" :select-foods="this.selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
  </div>
  <food :food="selectedFood" ref="food" v-on:choiceFood="selectFood" v-on:cartadd="cartadd" v-on:removeFood="removeFood"></food>
</div>
  
</template>

<script>
  import BScroll from 'better-scroll';
  import shopcart from 'components/shopcart/shopcart';
  import cartcontrol from 'components/cartcontrol/cartcontrol';
  import food from 'components/food/food';

  const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data () {
      return {
        goods: [],
        listHeight: [],
        foodScrollY: 0,
        selectFoods: [],
        selectedFood: {}
      };
    },
    computed: {
      currentIndex () {
        for (let i = 0; i < this.listHeight.length; i++) {
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];
          if (!height2 || (this.foodScrollY >= height1 && this.foodScrollY < height2)) {
            return i;
          }
        }
        return 0;
      }
    },
    created () {
      this.$http.get('/api/goods').then((res) => {
        res = res.body;
        if (res.errno === ERR_OK) {
          this.goods = res.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      });
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    methods: {
      _initScroll () {
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {
          click: true
        });
        this.foodScroll = new BScroll(this.$refs.foodWrapper, {
          click: true,
          probeType: 3
        });
        this.menuScroll.on('scroll', (pos) => {
          this.menuScrollY = Math.abs(Math.round(pos.y));
        });
        this.foodScroll.on('scroll', (pos) => {
          this.foodScrollY = Math.abs(Math.round(pos.y));
        });
        this.foodScroll.on('scrollEnd', () => {
          let scrollMenu = this.$refs.menuWrapper.getElementsByClassName('menu-item');
          this.menuScroll.scrollToElement(scrollMenu[this.currentIndex], 300);
        });
      },
      _calculateHeight () {
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0, len = foodList.length; i < len; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      },
      selectMenu (key, event) {
        if (!event._constructed) {
          return;
        }
        let foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
        let el = foodList[key];
        this.menuClickIndex = key;
        this.foodScroll.scrollToElement(el, 300);
      },
      selectFood (food) {
        this.selectFoods.push(food);
      },
      removeFood (food) {
        this.selectFoods.splice(this.selectFoods.findIndex(function (value) {
          return value === food;
        }), 1);
      },
      cartadd (target) {
        // 优化动画，防止第一次加载时候，由于运算量大导致动画卡顿
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target);
        });
      },
      theFood (food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .goods
    display: flex
    position: absolute
    width: 100%
    top: 174px
    bottom: 46px
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        weight: 56px
        line-height: 14px
        padding: 0 12px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          font-weight: 700
          .text
            border-none()
        .icon 
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
          &.decrease
            bg-img('decrease_3')
          &.discount
            bg-img('discount_3')
          &.guarantee
            bg-img('guarantee_3')
          &.invoice
            bg-img('invoice_3')
          &.special
            bg-img('special_3')
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          font-size: 12px
          border-1px(rgba(7,17,27,.1))
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147,153,159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px 18px 0 18px
        padding-bottom: 18px
        border-1px(rgba(7,17,27,.1))
        &:last-child
          border-none()
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7,17,27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .desc
            margin-bottom: 8px
            line-height: 12px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240,20,20)
            .old
              color: rgb(147,153,159)
              font-size: 10px
              text-descoration: line-through
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
            
            
</style>
