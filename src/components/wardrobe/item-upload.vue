<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <section>
    <div class="jumbotron jumbotron-fluid p-b-1">
      <div class="raw"><h2>Добавить вещь в гардероб</h2></div>
      <form class="form">
        <div class="form-group">
          <label class="custom-file">
            <input type="file" id="file" class="custom-file-input" accept=".jpg,.png,.jpeg" v-on:change="fileOnChange">
            <span class="custom-file-control" v-bind:class="{'chosen': imageFile.name}"></span>
          </label>
          <p class="help-block" v-if="imageFile.name">Выбран файл: {{ imageFile.name }}</p>
          <img :src="previewSRC" height="100" v-if="previewSRC">
        </div>
        <div class="form-group">
          <select class="custom-select" v-model.lazy="itemTypeCurrent">
            <option :value="type" v-for="type in itemTypes">{{ type.name }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Cезон: </label>

            <label class="custom-control custom-checkbox" v-for="season in seasons">
              <input type="checkbox" class="custom-control-input" name="season" :value="season"
                     v-model="seasonsCurrent">
              <span class="custom-control-indicator"></span>
              <span class="custom-control-description">{{ season.name }}</span>
            </label>

        </div>
        <div class="form-group">
          <button type="button" class="btn btn-primary"
                  v-on:click="submit()" v-bind:disabled="validation.upload">Сохранить
          </button>
        </div>
        <div class="alert alert-success" v-if="upload.status === 'success'">{{upload.message}}</div>
        <div class="alert alert-danger" v-if="upload.status === 'fail'">{{upload.message}}</div>
      </form>
    </div>
    <!-- Гардероб -->
    <div class="container" v-for="type in typesPresentInWardrobe()">
      <h2>Гардероб</h2>
      <hr>
      <h4 class=" text-md-left">{{ type.name }}</h4>
      <div class="wardrobe-items">
        <div class="item" v-for="item in containsTypeVal(wardrobe, type)">
          <img class="item-img" :src="item.fileURL" :alt="item.uid" nopin="nopin">
          <button class="item-close" v-on:click="remove(item.uid)">×</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  //  import Vue from 'vue'
  import fsStore from '../../wardrobe-store-fs'
  //  const pica = require('pica')
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
        fsStore.add(this.imageFile, this.seasonsCurrent, this.itemTypeCurrent).then(url => {
          this.upload.status = 'success'
          this.upload.message = 'Получилось!'
          console.log(url)
          this.wardrobe = fsStore.getAllItems()
        }).catch(error => {
          this.upload.status = 'fail'
          this.upload.message = error.message
          console.dir(error)
        })
      },
      remove: function (uid) {
        fsStore.delete(uid).then(updated => {
          this.wardrobe = updated
        }).catch(error => {
          this.upload.status = 'fail'
          this.upload.message = error.message
          console.dir(error)
        })
      },
      containsTypeVal: function (list, type) {
        return list.filter(item => {
          if (item.type.value === type.value) return item
        })
      },
      typesPresentInWardrobe: function () {
        return this.itemTypes.filter(type => {
          for (let i = 0; i < this.wardrobe.length; ++i) {
            if (this.wardrobe[i].type.value === type.value) {
              return type
            }
          }
        })
      }
    },

    computed: {
      validation: function () {
        return {
          upload: !(this.imageFile !== '' && this.itemTypeCurrent.value !== '' && this.seasonsCurrent.length > 0)
        }
      }
    },

    data: () => ({

      itemTypes: [{name: 'Тип одежды...', value: ''},
        {name: 'Сумка', value: 'bag'},
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

      itemTypeCurrent: {name: 'Тип одежды...', value: ''},

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

      wardrobe: []

    })

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .custom-file-control:lang(ru)
    &:before
      content: "Выбрать"
    &:after
      content: "Нужно фото..."
      position: absolute
      left 1em

  .custom-file-control.chosen:lang(ru)
    &:after
      content "Есть фото!"

  .custom-select
    line-height 1.2em
    cursor pointer

  .wardrobe-items
    display flex
    flex-wrap wrap
    .item
      position relative
      width 10%
      &:hover > .item-close
        opacity 1
      &:hover > .item-img
        opacity .4
      &-close
        opacity 0
        position absolute
        right 10px
        top 10px
        font-size 2em
        background: #d63d30;
        line-height: 0.6em;
        vertical-align: middle;
        text-align: center;
        padding: 4px;
        color: white;
        border 0
        border-radius: 4px;
        transition: opacity .2s ease
        &:hover
          text-decoration none
    .item-img
      width 100%
      transition: opacity .2s ease
      display block
      position relative

  .card-columns
    column-count 6
    .card
      break-inside avoid
</style>
