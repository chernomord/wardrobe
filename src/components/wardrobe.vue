<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <template v-if="wardrobe.hasOwnProperty('top')">
      <p>Всего вещей: {{calcItems(wardrobe)}}, аксессуаров: {{calcItems(accessories)}}</p>
    </template>
    <div>
      <button class="btn btn-primary" v-on:click="loadWardrobe()" v-if="wardrobe === 'empty'">Загрузить гардероб
      </button>
    </div>
    <template v-if="wardrobe.hasOwnProperty('top')">
      <button class="btn btn-primary" v-on:click="generateLook()">Создать образ</button>
      <button class="btn btn-default" v-on:click="saveLook()" v-if="look.main !== 'empty'">Сохранить</button>
    </template>
    <div class="look">
      <div class="look__main" v-if="look.main !== 'empty'">
        <div class="wardrobe-item" v-for="(key, item) in look.main" v-bind:class="getClass(key)">
          <img :src="'static/images/' + key + '/' + item" :width="imgWidth">
        </div>
      </div>
      <div class="look__accessories" v-if="look.accessories !== 'empty'">
        <div class="wardrobe-item" v-for="(key, item) in look.accessories">
          <img :src="'static/images/accessories/' + key + '/' + item" :width="imgWidth">
        </div>
      </div>
    </div>
    <div>
      <h3>Сохраненные образы</h3>
      <div class="btn-toolbar saved-looks" style="text-align:center;">
        <div class="btn-group" role="group" v-for="look in storedLooks">
          <button type="button" class="btn btn-default btn-sm" v-on:click="loadLook($index)">{{look.name}}</button>
          <button type="button" class="btn btn-warning btn-sm" v-on:click="deleteLook($index)">✕</button>
        </div>
      </div>
      <!--<button class="btn btn-default btn-sm" v-for="look in storedLooks" v-on:click="loadLook($index)">-->
      <!--{{$index}}-->
      <!--<a class="btn btn-default btn-xs">x</a>-->
      <!--</button>-->
    </div>

  </div>
</template>

<script>
  export default {

    name: 'wardrobe',

    data: () => ({
      imgWidth: 150,
      msg: 'Гардероб!',
      wardrobe: 'empty',
      accessories: 'empty',
      look: {
        main: 'empty',
        accessories: 'empty'
      },
      storedLooks: []
    }),

    ready: function () {
      let storedLooks = window.localStorage.getItem('storedLooks')
      if (storedLooks) {
        storedLooks = JSON.parse(storedLooks)
        this.storedLooks = storedLooks
      }
    },

    methods: {
      saveLook: function () {
        /**
         *
         * @param look {Object}
         * @param storedLooks {Array}
         * @returns {boolean}
         */
        const noEquals = (look, storedLooks) => {
          let noEqual = true
          for (let i = 0; i < this.storedLooks.length; ++i) {
            if (JSON.stringify(storedLooks[i].look) === JSON.stringify(look)) {
              noEqual = false
              break
            }
          }
          return noEqual
        }
        const maxNum = () => {
          let maxNum = 1
          for (let i = 0; i < this.storedLooks.length; ++i) {
            let curName = parseInt(this.storedLooks[i].name, 10)
            if (curName >= maxNum) maxNum = curName + 1
          }
          return maxNum
        }
        if (this.look.main !== 'empty' && noEquals(this.look, this.storedLooks)) {
          let lookToStore = {}
          lookToStore.name = maxNum()
          lookToStore.look = JSON.parse(JSON.stringify(this.look))
          this.storedLooks.push(lookToStore)
          lookToStore = JSON.stringify(this.storedLooks)
          window.localStorage.setItem('storedLooks', lookToStore)
        }
      },

      deleteLook: function (idx) {
        this.storedLooks.splice(idx, 1)
        window.localStorage.setItem('storedLooks', JSON.stringify(this.storedLooks))
      },

      loadLook: function (idx) {
        this.look = JSON.parse(JSON.stringify(this['storedLooks'][idx].look))
      },

      loadWardrobe: function () {
        let x = new XMLHttpRequest()
        x.open('GET', 'static/wardrobe.json', true)
        x.send()
        x.onreadystatechange = () => { // (3)
          if (x.readyState !== 4) return
          if (x.status !== 200) {
            console.debug(x.status + ': ' + x.statusText) // исключение
          } else {
            let data = JSON.parse(x.responseText)
            this.accessories = data.accessories
            delete data.accessories
            this.wardrobe = data
          }
        }
      },
      generateLook: function () {
        let tempLook = {}
        Object.getOwnPropertyNames(this.wardrobe).forEach(val => {
          if (val !== '__ob__') {
            let index = Math.round(Math.random() * (this.wardrobe[val].length - 1))
            tempLook[val] = this.wardrobe[val][index]
          }
        })
        let accessories = {}
        Object.getOwnPropertyNames(this.accessories).forEach(val => {
          let decide = Math.random() - 0.5
          if (decide > 0 && val !== '__ob__') {
            let index = Math.round(Math.random() * (this.accessories[val].length - 1))
            accessories[val] = this.accessories[val][index]
          }
        })
        this.look.main = tempLook
        this.look.accessories = accessories
      },
      /**
       * Calculate total items in arrays of dictionary properties
       * @param input {object}
       * @returns {number}
       */
      calcItems: function (input) {
        let total = 0
        if (input instanceof Object) {
          Object.getOwnPropertyNames(input).forEach(val => {
            total = total + (input[val].length || 0)
          })
        }
        return total
      },
      /**
       * Return name of the class
       * @param name {string}
       */
      getClass: name => (name)
    },

    created: function () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
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
