<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <div>
      <button class="btn btn-primary" v-on:click="loadWD()" v-if="wardrobe === 'empty'">Загрузить гардероб</button>
    </div>
    <template v-if="wardrobe.hasOwnProperty('top')">
      <button class="btn btn-primary" v-on:click="generateLook()">Создать образ</button>
    </template>
    <div v-if="look !== 'empty'">
      <div class="container">
        <h4>Размер фотографии: </h4>
        <label class="radio-inline" v-for="num in ([120,180,240])">
          <input type="radio" name="inlineRadioOptions" v-model="imgWidth" :value="num">{{num}}
        </label>
      </div>
      <div class="wardrobe-item" v-for="(key, item) in look">
        <img :src="'static/images/' + key + '/' + item" :width="imgWidth">
      </div>
    </div>
        <template v-if="wardrobe.hasOwnProperty('top')">
      <table class="table list">
        <thead>
        <tr>
          <td>Группа</td>
          <td>Всего шт.</td>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(key, group) in wardrobe">
          <td>{{key}}</td>
          <td>{{group.length}}</td>
        </tr>
        </tbody>
      </table>
    </template>
  </div>
</template>

<script>
  export default {

    name: 'wardrobe',

    data: () => ({
      imgWidth: 120,
      msg: 'Гардероб!',
      wardrobe: 'empty',
      look: 'empty'
    }),

    methods: {
      loadWD: function () {
        let x = new XMLHttpRequest()
        x.open('GET', 'static/wardrobe.json', true)
        x.send()
        x.onreadystatechange = () => { // (3)
          if (x.readyState !== 4) return
          if (x.status !== 200) {
            console.debug(x.status + ': ' + x.statusText) // исключение
          } else {
            this.wardrobe = JSON.parse(x.responseText) // результат
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
        this.look = tempLook
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
