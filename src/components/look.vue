<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <div>
    <div class="jumbotron jumbotron-fluid">
    <h1>Образ</h1>
    <p v-if="!canCreateLook">Для создания образа необходимо загрузить по крайней мере две вещи. Для этого нужно перейти в раздел <router-link to="/wardrobe">Гардероб</router-link></p>
    <template v-if="canCreateLook">
      <p>Всего вещей: {{calcItems(wardrobe)}}, аксессуаров: {{calcItems(accessories)}}</p>
    </template>
    <template v-if="canCreateLook">
      <input type="radio" id="winter" value="winter" v-model="weather">
      <label for="winter">Зима</label>
      <input type="radio" id="inter_season" value="inter_season" v-model="weather">
      <label for="inter_season">Межсезонье</label>
      <input type="radio" id="summer" value="summer" v-model="weather">
      <label for="summer">Лето</label>
      <button class="btn btn-link" v-on:click="weather = 'any'"> -- Без разницы</button>
      <button class="btn btn-primary" v-on:click="generateLook()">Создать образ</button>
      <button class="btn btn-default" v-on:click="saveLook()" v-if="look.main !== 'empty'">Сохранить</button>
    </template>
      </div>
    <div class="look">
      <div class="look__main" v-if="look.main !== 'empty'">
        <div class="wardrobe-item" v-for="(item, key) in look.main" v-bind:class="key">
          <img :src="item.fileURL" :width="imgWidth">
        </div>
      </div>
      <div class="look__accessories" v-if="look.accessories !== 'empty'">
        <div class="wardrobe-item" v-for="(item, key) in look.accessories">
          <img :src="item.fileURL" :width="imgWidth">
        </div>
      </div>
    </div>
    <div v-if="storedLooks.length > 0">
      <h3>Сохраненные образы</h3>
      <div class="btn-toolbar saved-looks" style="text-align:center;">
        <div class="btn-group" role="group" v-for="(look, index) in storedLooks">
          <button type="button" class="btn btn-default btn-sm" v-on:click="loadLook(index)">{{look.name}}</button>
          <button type="button" class="btn btn-warning btn-sm" v-on:click="deleteLook(index)">✕</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import store from '../wardrobe-store'
  import looks from '../looks-store'
  import fsStore from '../wardrobe-store-fs'
  console.log(fsStore)
//  import radio from '../strap/Radio.vue'
//  import buttonGroup from '../strap/buttonGroup.vue'
  export default {

    name: 'look',

//    components: {
//      'button-group': buttonGroup,
//      'radio': radio
//    },

    data: () => ({
      imgWidth: 150,
      msg: 'Гардероб!',
      wardrobe: 'empty',
      weather: 'any',
      accessories: 'empty',
      look: {
        main: 'empty',
        accessories: 'empty'
      },
      storedLooks: []
    }),

    computed: {
      canCreateLook: function () {
        return Object.keys(this.wardrobe).length + Object.keys(this.accessories).length > 1
      }
    },

    mounted: function () {
      this.storedLooks = looks.get()
      store.loadWardrobe().then(
        result => {
          console.log(result)
          this.wardrobe = result.wardrobe
          this.accessories = result.accessories
        })
    },

    methods: {
      saveLook: function () {
        looks.add(this.look)
      },

      deleteLook: function (idx) {
        looks.delete(idx)
      },

      loadLook: function (idx) {
        this.look = JSON.parse(JSON.stringify(this['storedLooks'][idx].look))
      },

      loadWardrobe: function () {
        store.loadWardrobe().then(
          result => {
            this.wardrobe = result.wardrobe
            this.accessories = result.accessories
          })
      },

      generateLook: function () {
        this.look = store.generateLook(this.wardrobe, this.accessories, this.weather)
      },

      /**
       * Calculate total items in arrays of dictionary properties
       * @param input {object}
       * @returns {number}
       */
      calcItems: function (input) {
        let total = 0
        if (input instanceof Object) {
          Object.keys(input).forEach(val => {
            total = total + (input[val].length || 0)
          })
        }
        return total
      }
    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">

  $main-top-offset = 20px
  $main-bot-offset = 220px

  /*h1*/
    /*color: #42b983;*/

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
