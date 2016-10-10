<template xmlns:v-on="http://www.w3.org/1999/xhtml" xmlns:v-bind="http://www.w3.org/1999/xhtml">
  <section>
    <div class="jumbotron jumbotron-fluid">
      <h1 class="screen-1">Помощник для подбора образа</h1>
      <p>Текущая версия — 0.3 alpha</p>
      <p>Создан чтобы помочь в ситуациях когда никак не можешь определиться, что же одеть сегодня</p>
    </div>
    <div class="container">
      <div class="row">
        <div class="col col-md-6">
          <h2>Как пользоваться</h2>
          <ol class="text-xs-left">
            <li>В разделе "Гардероб" загрузи фотографии нескольких вещей (чем больше вещей тем лучше)</li>
            <li>После этого в разделе "Образ" создавай образы</li>
          </ol>
        </div>
        <div class="col col-md-6">
          <h2>Возможности версии 0.3</h2>
          <ol class="text-xs-left">
            <li>Загрузка вещей с сохранением фотографий в локальном хранилище</li>
            <li>Сохранение таких свойств вещей, как погодный режим и тип вещи</li>
            <li>Удаление вещи из гардероба</li>
            <li>Создание образа с фильтром по погодному режиму или без</li>
            <li>Сохранение образа с возможностью его загрузки в дальнейшем</li>
            <li>Все данные пользователя хранятся на его устройстве в браузере</li>
          </ol>
        </div>

      </div>
    </div>
  </section>
</template>

<script>
  export default {

    name: 'about',

    components: {
    },

    data: () => ({}),

    methods: {}

  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

</style>
