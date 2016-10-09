<template>
  <div id="app">
    <nav class="navbar navbar-dark bg-inverse">
      <div class="nav navbar-nav">
        <router-link class="nav-item nav-link" to="/look">Образ</router-link>
        <router-link class="nav-item nav-link" to="/wardrobe">Гардероб</router-link>
      </div>
    </nav>
    <router-view/>

  </div>
</template>

<script>
  import look from './components/look'

  export default {
    components: {
      look
    }
  }
</script>

<style>
  html {
    height: 100%;
  }

  body {
    display: flex;
    /*align-items: center;*/
    justify-content: center;
    height: 100%;
  }

  #app {
    color: #2c3e50;
    /*margin-top: -100px;*/
    max-width: 1200px;
    font-family: Source Sans Pro, Helvetica, sans-serif;
    text-align: center;
    margin: 0 auto;
    width: 100%;
  }

  /*#app a {*/
    /*color: #42b983;*/
    /*text-decoration: none;*/
  /*}*/

  .router-link-active {
    color: #fff !important;
  }

</style>
