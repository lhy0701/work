<template>
  <!-- :default-active="$route.matched[2].path" -->
  <el-menu
    class="my-menu"
    @select="handleSelect"
    :collapse="isCollapse"
    :default-openeds="openeds"
    :default-active="$route.matched[1].path"
  >
    <el-menu-item :index="'/'" :style="{borderBottom: '1px solid #efefef'}">
      <i class="el-icon-menu"></i>
      <span slot="title">首 页</span>
    </el-menu-item>
    <el-submenu :index="i + ''" v-for="(item, i) in menus" :key="i" :show-timeout="100">
      <template slot="title">
        <i :class="item.icon"></i>
        <span>{{item.name}}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          :index="subMenu.link"
          v-for="(subMenu, j) in item.menu"
          :key="j"
        >{{subMenu.name}}</el-menu-item>
      </el-menu-item-group>
    </el-submenu>
  </el-menu>
</template>

<script>
import { Menu, MenuItem, Submenu, MenuItemGroup } from 'element-ui'
import { env } from '@/core/js/env'

export default {
  name: 'MyMenu',
  components: {
    'el-menu': Menu,
    'el-menu-item': MenuItem,
    'el-submenu': Submenu,
    'el-menu-item-group': MenuItemGroup
  },
  data() {
    return {
      isCollapse: false,
      openeds: ['0'],
      defaultActive: '',
      menus: [],
      defaultMenus: [
        {
          name: '开店管理',
          icon: 'el-icon-goods',
          menu: []
        },
        {
          name: '数据分析',
          icon: 'el-icon-date',
          menu: []
        },
        {
          name: '付费授权',
          icon: 'el-icon-edit-outline',
          menu: []
        },
        {
          name: '财务管理',
          icon: 'el-icon-document',
          menu: []
        },
        {
          name: '权限管理',
          icon: 'el-icon-edit',
          menu: []
        },
        {
          name: '其他设置',
          icon: 'el-icon-setting',
          menu: []
        },
        {
          name: '企业管理',
          link: '/shop-manage/enterprise'
        },
        {
          name: '门店管理',
          link: '/shop-manage/store'
        },
        {
          name: '联盟管理',
          link: '/shop-manage/alliance'
        },
        {
          name: '日活跃统计',
          link: '/analyze/active-statistical'
        },
        {
          name: '活跃分析',
          link: '/analyze/active-analyze'
        },
        {
          name: '代理统计',
          link: '/analyze/agency-statistics'
        },
        {
          name: '缴费管理',
          link: '/pay-manage/pay-ment'
        },
        {
          name: '对账中心',
          link: '/finance-manage/account-check'
        },
        {
          name: '扫码付交易流水',
          link: '/finance-manage/qrcode-pay'
        },
        {
          name: '扫码付交易统计',
          link: '/finance-manage/qrcode-statistic'
        },
        {
          name: '用户管理',
          link: '/authority-manage/user-manage'
        },
        {
          name: '角色管理',
          link: '/authority-manage/role-manage'
        },
        {
          name: '解绑手机号',
          link: '/other-settings/unbind-mobile'
        },
        {
          name: '测试扫码付',
          link: '/other-settings/qrcode'
        }
      ]
    }
  },
  created() {
    let roles = env.getRoles()
    let menus = []
    for (const item of roles) {
      if (typeof item.ChildFunction === 'string') {
        item.ChildFunction = item.ChildFunction.split(',')
      }
    }
    for (const role of roles) {
      let parentMenu
      for (const menu of this.defaultMenus) {
        if (role.ParentFunction === menu.name) {
          parentMenu = menu
        } else {
          for (const child of role.ChildFunction) {
            if (child === menu.name) {
              parentMenu.menu.push(menu)
            }
          }
        }
      }
      if (parentMenu) {
        menus.push(parentMenu)
      }
    }
    this.menus = menus
  },
  mounted() {
    if (this.$route.matched[1]) {
      this.defaultActive = this.$route.matched[1].path
    } else {
      this.defaultActive = '/'
    }
  },
  methods: {
    handleSelect(key) {
      if (key.indexOf(this.$router.currentRoute.name) > -1) return
      this.$router.push(key)
    }
  }
  // watch: {
  //   $route(to) {
  //     if (to.matched[1]) {
  //       this.defaultActive = to.matched[1].path
  //     } else {
  //       this.defaultActive = '/'
  //     }
  //   }
  // }
}
</script>

<style scoped lang="scss">
</style>
