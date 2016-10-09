<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div class="container">
    <form class="form-inline">
      <div class="form-group">
        <label for="exampleInputFile">Файл изображения</label>
        <input type="file" id="exampleInputFile" accept=".jpg,.png,.jpeg" v-on:change="fileOnChange">
        <p class="help-block">Допустимый размер файла не более 1Мб</p>
        <img :src="previewSRC" height="100">
      </div>
      <div class="row">
        <div class="col col-md-6">
          <h3>Тип вещи: {{itemTypeCurrent.name}}</h3>
          <div class="form-group">
            <label class="radio-inline" v-for="type in itemTypes">
              <input type="radio" name="itemType" :value="type" v-model="itemTypeCurrent"> {{ type.name }}
            </label>
          </div>
        </div>
        <div class="col col-md-6">
          <h3>Cезон: {{seasonsCurrent.name}}</h3>
          <div class="form-group">
            <label class="radio-inline" v-for="season in seasons">
              <input type="checkbox" name="season" :value="season" v-model="seasonsCurrent"> {{ season.name }}
            </label>
          </div>
        </div>
      </div>
      <button type="button" class="btn btn-default" v-on:click="submit()">Submit</button>
      <div class="alert alert-success" v-if="upload.status === 'success'">{{upload.message}}</div>
      <div class="alert alert-danger" v-if="upload.status === 'fail'">{{upload.message}}</div>
    </form>
    <hr>
    <div class="row">
      <div class="col-sm-4 col-md-3" v-for="item in wardrobe">
        <div class="thumbnail">
          <img :src="item.fileURL" alt="..." class="img-rounded">
          <div class="caption">
            <p>Тип: {{item.type.name}}</p>
            <p>Сезон: <span v-for="season in item.season">{{season.name}}, </span></p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
//  import Vue from 'vue'
  import fsStore from '../../wardrobe-store-fs'
  import pica from '../pica'
//  const pica = require('pica')
  console.log('DFSDFS', pica)
  export default {

    name: 'itemUpload',

    created: function () {
      fsStore.init()
      this.wardrobe = fsStore.getAllItems()
    },

    methods: {
      fileOnChange: function (el) {
        this.imageFile = el.target.files[0]
        this.previewSRC = window.URL.createObjectURL(this.imageFile)
        console.dir(this.imageFile)
      },
      submit: function () {
//        console.log(pica)
        fsStore.add(this.imageFile, this.seasonsCurrent, this.itemTypeCurrent).then(url => {
          this.upload.status = 'success'
          this.upload.message = 'Получилось!'
          console.log(url)
          this.wardrobe = fsStore.getAllItems()
        }).catch(error => {
          this.upload.status = 'fail'
          this.upload.message = error
          console.log(error)
        })
      }
    },

    data: () => ({

      itemTypes: [{name: 'Сумка', value: 'bag'},
        {name: 'На голову', value: 'hat'},
        {name: 'Шарфик', value: 'scarf'},
        {name: 'Жилетка', value: 'waistcoat'},
        {name: 'Платье', value: 'dress'},
        {name: 'Носки', value: 'socks'},
        {name: 'Обувь', value: 'shoes'},
        {name: 'Верхняя одежда', value: 'top'},
        {name: 'Штаны/юбка', value: 'bottom'},
        {name: 'Плащь', value: 'coat'},
        {name: 'Свитер', value: 'sweater'}],

      itemTypeCurrent: '',

      seasons: [{name: 'лето', value: 'summer'},
        {name: 'зима', value: 'winter'},
        {name: 'межсезонье', value: 'inter_season'}],

      seasonsCurrent: [{name: 'лето', value: 'summer'},
        {name: 'зима', value: 'winter'},
        {name: 'межсезонье', value: 'inter_season'}],

      imageFile: '',
      previewSRC: '',

      upload: {
        status: '',
        message: ''
      },

      wardrobe: ''

    })

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
