<template>
  <div class="dashboard-container">
    <span class="hello">欢迎进入数据决策中心系统</span>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
    }
  },
  computed: {
  },
  created() {
  }
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 0 !important;
  display: flex;
  justify-content: center;
  height: 100%;
  background: url('~@/assets/images/dashboard-bg.jpg') no-repeat;
  background-size: cover;
  background-color: #000;
  .hello {
    font-size: 3vw;
    color: #ffffff;
    font-weight: 600;
    padding-top: 3vw;
  }
}

</style>
