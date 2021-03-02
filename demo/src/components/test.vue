<template>
  <div id="test">
    <button @click="send">测试按钮</button>
  </div>
</template>

<script>
export default {
  methods: {
    send() {
      alert("一个测试");
    },
  },
};
</script>