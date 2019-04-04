<template>
  <div class="not-found">
    <h1 class="not-heading">404</h1>
    <p class="not-subheading">Not found</p>
    <p class="not-subheading">
      <span class="count">{{countDown}}</span> 秒后返回网站首页
    </p>
  </div>
</template>

<script>
let Time = null
export default {
  name: 'NotFound',
  data() {
    return {
      countDown: 4
    }
  },
  created() {
    Time = setInterval(() => {
      this.countDown--
      if (this.countDown === 0) {
        this.$router.push('/')
      }
    }, 1000)
  },
  destroyed() {
    clearInterval(Time)
    Time = null
  }
}
</script>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;

  height: 100vh;

  color: #fff;
  background-image: radial-gradient(circle, #4d7bca, #2b4b80);

  justify-content: center;
  align-items: center;
  .not-heading {
    font-size: 8em;
    font-weight: 700;

    margin: 0 0 10px;

    text-shadow: 0 1px 4px #393333;
  }

  .not-subheading {
    font-size: 1.5em;

    margin: 0 0 30px;

    letter-spacing: 2px;
  }
}

</style>
