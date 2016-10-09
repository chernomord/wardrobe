<template>
  <div id="app">
    <nav class="navbar navbar-default">
      <div class="container-fluid">
        <div class="collapse navbar-collapse">
        <ul class="nav navbar-nav">
          <li>
            <router-link to="/look">Образ</router-link>
          </li>
          <li>
            <router-link to="/wardrobe">Гардероб</router-link>
          </li>
        </ul>
        </div>
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

  #app a {
    color: #42b983;
    text-decoration: none;
  }

  .router-link-active {
    background-color: rgba(205, 236, 216, 0.82) !important;
  }

</style>
