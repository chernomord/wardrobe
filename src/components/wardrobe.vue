<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <section>
    <item-upload></item-upload>
    <div class="container">
    <hr>
    <div class="alert alert-warning" role="alert">
      <strong>Обрати внимание!</strong> Все загруженные фотографии хранятся локально на твоем компьютере именно в этом
      браузере. Никакие файлы никуда не отправляются и не синхронизируются. Поэтому пожалуйста, после загрузки не удаляй
      фотографии со своего
      компьютера.
    </div>
    </div>
  </section>
</template>

<script>
  import itemUpload from 'wardrobe/item-upload.vue'
  //  import store from '../wardrobe-store'
  //  import looks from '../looks-store'
  export default {

    name: 'wardrobe',

    components: {
      'item-upload': itemUpload
//      'radio': radio
    },

    data: () => ({}),

    mounted: function () {
    },

    methods: {},

    created: function () {

    }

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

  $main-top-offset = 20px
  $main-bot-offset = 220px

  h1
    color: #42b983;

  .list td
    &:first-of-type
      text-align: left;
    &:last-of-type
      text-align: right;

  .wardrobe-item
    display: inline-block;
    position: absolute;
    left: 400px;
    &.top
      top: $main-top-offset
      left: calc(12.5% - 75px);
    &.dress
      top: $main-top-offset
      left: calc(37.5% - 75px);
    &.sweater
      top: $main-top-offset
      left: calc(62.5% - 75px);
    &.coat
      top: $main-top-offset
      left: calc(87.5% - 75px);
    &.bottom
      top: $main-top-offset + $main-bot-offset
      left: calc(50% - 75px);
      z-index: -1;
    &.shoes
      top: $main-top-offset + $main-bot-offset
      left: calc(32% - 75px);
      z-index: -1;
      & img
        width: 110px;
    &.socks
      top: $main-top-offset + $main-bot-offset
      left: calc(75% - 75px);
      z-index: -1;
      & img
        width: 110px;

  .look__main
    position: relative;
    width: 600px;
    height: 480px;
    margin: 0 auto;

  .look__accessories
    position: relative;
    margin: 0 auto;
    & .wardrobe-item
      position: relative;
      display inline-block
      left: initial;
    & img
      width 80px

  .saved-looks
    display inline-block
    text-align center

</style>
