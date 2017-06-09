<template>
  <div class="cartcontrol">
    <transition name="slide-roll-fade">
      <div class="cart-decrease icon-remove_circle_outline" v-show="food.count>0" @click.stop="decreaseCart"></div>
    </transition>
    <transition name="fade">
      <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    </transition>
    <div class="cart-add icon-add_circle" @click.stop="addCart"></div>
  </div>
</template>

<script>
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart (event) {
        if (!event._constructed) {
          return;
        }
        // 防止多次被点击
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
          this.$emit('choiceFood', this.food);
        } else {
          this.food.count++;
        }
        this.$emit('cartadd', event.target);
      },
      decreaseCart () {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
          if (this.food.count === 0) {
            this.$emit('removeFood', this.food);
          }
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size: 0
    .cart-decrease, .cart-add
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: rgb(0,160,220)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
    .slide-roll-fade-enter-active
      transition: all .4s linear
    .slide-roll-fade-leave-active
      transition: all .4s linear
    .slide-roll-fade-enter, .slide-roll-fade-leave-active
      transform: translate3d(24px, 0 , 0) rotate(180deg)
      opacity: 0
    .slide-roll-fade-leave
      opacity: 1
    .fade-enter-active, .fade-leave-active 
      transition: opacity .5s
    .fade-enter, .fade-leave-active 
      opacity: 0
</style>
