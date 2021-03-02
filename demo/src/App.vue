<template>
  <div id="app">
    <!-- <router-link to="/me">我的 </router-link> -->
    <!-- <div>
      <router-link to="/">首页 </router-link>
      
      <router-link to="/mechoice">界面查看</router-link>
    </div> -->
    <div>
      <router-view></router-view>
    </div>
     <foot></foot>
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>


* {
  margin: 0;
  padding: 0;

}
#app {
  font-family:'楷体';
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
}
</style>
