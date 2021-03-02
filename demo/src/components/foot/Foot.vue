<template>
  <div id="foot">
    <div
      class="nav-tab-overlay"
      :style="{ left: activeIndex * 18 + '%' }"
    ></div>
    <div
      class="nav-item"
      :class="{ active: activeIndex == index }"
      v-for="(item, index) in items"
      :key="index"
      @click="change(index)"
    >
      <router-link
        :to="item.url"
        tag="div"
        :class="{ activeurl: activeIndex == index }"
      >
        <i :class="item.icon"></i>
        <p>{{ item.label }}</p>
      </router-link>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      items: [
        { icon: "el-icon-tickets", label: "账单", url: "/" },
        { icon: "el-icon-s-data", label: "图表", url: "/charts" },
        { icon: "el-icon-plus", label: "记账", url: "/addmoney" },
        { icon: "el-icon-finished", label: "计划", url: "/plan" },
        { icon: "el-icon-s-custom", label: "我的", url: "/me" },
      ],
      activeIndex: 0,
    };
  },
  methods: {
    change(index) {
      this.activeIndex = index;
    },
  },
  created() {
    for (let i = 0; i < this.items.length; i++) {
      if (window.location.href.indexOf(this.items[i].url) > 0) {
        this.activeIndex = i;
      }
    }
  },
  watch: {
    $route: {
      handler() {
        for (let i = 0; i < this.items.length; i++) {
          if (window.location.href.indexOf(this.items[i].url) > 0) {
            this.activeIndex = i;
          }
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
};
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
body {
  display: flex;
  justify-self: center;
  align-items: center;
  
}
#foot {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 10vh;
  background-color: #fff;
  display: flex;
  overflow: hidden;
  border: 2vw solid #fff;
  box-sizing: border-box;
  .nav-item {
    position: relative;
    width: 18%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transition: 0.3s;
    cursor: pointer;
    i {
      font-size: 24px;
      padding-left: 3px;
      color: #e7b342;
      transition: 0.3s;
      transform: translate(0, 50%);
    }
    .activeurl i {
      transform: translate(0, 0px);
    }
    p {
      font-size: 1rem;
      color: #e7b342;
      user-select: none;
      transition: 0.3s;
      opacity: 0;
    }
    .activeurl p {
      opacity: 1;
    }
  }
  .nav-item.active {
    width: 24%;
  }
  .nav-tab-overlay {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 24%;
    background-color: #fff5e4;
    transition: 0.3s;
    border-radius: 20px;
    z-index: -1;
  }
}
</style>