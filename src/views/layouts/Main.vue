<template>
  <el-container style="height: 100%">
    <el-header>
      <my-header></my-header>
    </el-header>
    <el-container class="h">
      <my-menu></my-menu>
      <el-main class="el-main-home" style="height: 100%">
        <el-tabs
          type="card"
          closable
          class="standard-tabs"
          v-if="openTab.length"
          @tab-click="tabClick"
          @tab-remove="tabRemove"
          v-model="activeIndex"
        >
          <el-tab-pane
            :key="item.route"
            v-for="(item) in openTab"
            :label="item.name"
            :name="item.route"
          ></el-tab-pane>
        </el-tabs>
        <div class="router-enter">
          <keep-alive v-if="$route.meta.keepAlive">
            <router-view></router-view>
          </keep-alive>
          <router-view v-if="!$route.meta.keepAlive"></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { Header, Container, Main, Tabs, TabPane } from 'element-ui'
import MyHeader from '@/components/Header'
import MyMenu from '@/components/Menu'

export default {
  name: 'MyMain',
  components: {
    MyHeader,
    MyMenu,
    'el-header': Header,
    'el-container': Container,
    'el-main': Main,
    'el-tabs': Tabs,
    'el-tab-pane': TabPane
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      if (this.openTab.length) {
        // 开发环境不新建
        this.$store.commit('set_active_index', this.$route.fullPath)
        return
      }
      if (this.$route.fullPath !== '/') {
        this.$store.commit('add_tabs', {
          route: '/',
          name: '首页'
        })
        this.$store.commit('add_tabs', {
          route: this.$route.fullPath,
          name: this.$route.meta.tabName
        })
        this.$store.commit('set_active_index', this.$route.fullPath)
      } else {
        this.$store.commit('add_tabs', {
          route: '/',
          name: '首页'
        })
        this.$store.commit('set_active_index', '/')
        this.$router.push('/')
      }
    },
    tabClick() {
      this.$router.push({ path: this.activeIndex })
    },
    tabRemove(targetName) {
      if (targetName == '/') {
        return
      }
      this.$store.commit('delete_tabs', targetName)
      if (this.activeIndex === targetName) {
        // 设置当前激活的路由
        if (this.openTab && this.openTab.length >= 1) {
          this.$store.commit('set_active_index', this.openTab[this.openTab.length - 1].route)
          this.$router.push({ path: this.activeIndex })
        } else {
          this.$router.push({ path: '/' })
        }
      }
    }
  },
  computed: {
    openTab() {
      return this.$store.state.openTab
    },
    activeIndex: {
      get() {
        return this.$store.state.activeIndex
      },
      set(val) {
        this.$store.commit('set_active_index', val)
      }
    }
  },
  watch: {
    $route(to) {
      let flag = false
      for (let item of this.openTab) {
        if (item.route === to.fullPath) {
          this.$store.commit('set_active_index', to.fullPath)
          flag = true
          break
        }
      }
      if (!flag) {
        this.$store.commit('add_tabs', {
          route: to.fullPath,
          name: to.meta.tabName
        })
        this.$store.commit('set_active_index', to.fullPath)
      }
    }
  }
}
</script>

<style lang="scss">
// 样式解决
.standard-tabs {
  .el-tabs__header {
    margin: 0;
  }
}
</style>
