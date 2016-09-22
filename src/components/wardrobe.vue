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
    </template>
    <div v-if="look.main !== 'empty'">
      <div class="wardrobe-item" v-for="(key, item) in look.main">
        <img :src="'static/images/' + key + '/' + item" :width="imgWidth">
      </div>
    </div>
    <div v-if="look.accessories !== 'empty'">
      <div class="wardrobe-item" v-for="(key, item) in look.accessories">
        <img :src="'static/images/accessories/' + key + '/' + item" :width="imgWidth">
      </div>
      <hr>
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
      }
    }),

    methods: {
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
          if (decide && val !== '__ob__') {
            let index = Math.round(Math.random() * (this.accessories[val].length - 1))
            accessories[val] = this.accessories[val][index]
          }
        })
        console.log(accessories)
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
            console.log(val)
            total = total + (input[val].length || 0)
          })
        }
        return total
      }
    },

    created: function () {

    }

  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1 {
    color: #42b983;
  }

  .list td:first-of-type {
    text-align: left;
  }

  .list td:last-of-type {
    text-align: right;
  }

  .wardrobe-item {
    display: inline-block;
    margin: 20px;
  }
</style>
