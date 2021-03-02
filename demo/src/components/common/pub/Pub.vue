<template>
  <div id="pub">
    <h1>全局组件</h1>
    <button @click="send">按钮</button>
    <button @click="tests">方法按钮</button>
  </div>
</template>

<script>
export default {
  methods: {
    send() {
      this.$http({
        methods: "GET",
        url: "https://api.github.com/users/xcw520",
      }).then((res) => {
        console.log(res);
      });
    },
    tests() {
        this.$test();
    }
  },
};
</script>