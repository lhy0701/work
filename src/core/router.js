import Vue from 'vue'
import Router from 'vue-router'
import { env } from '@/core/js/env'

let verifyLogin = (to, from, next) => {
  if (env.user && env.user.name) {
    next()
  } else {
    next('/login')
    // next()
  }
}

Vue.use(Router)

let routes = [
  {
    path: '*',
    component: () => import('@/views/not-found/not-found.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/passport/Login.vue')
  },
  {
    path: '/',
    component: () => import(/* webpackChunkName: "main" */ '@/views/layouts/Main.vue'),
    beforeEnter: verifyLogin,
    children: [
      /**
       * 首页
       */
      {
        path: '/',
        meta: {
          tabName: '首页'
        },
        component: () => import(/* webpackChunkName: "name" */ '@/views/home/Home.vue')
      }
    ]
  }
]

let router = new Router({
  mode: 'history',
  base: process.env.NODE_ENV === 'production' ? '/backend/' : '/',
  routes
})

export let dynamicRoutes = [
  /**
   * 开店管理
   *
   */

  {
    path: 'shop-manage/enterprise', // 企业管理
    component: () => import(/* webpackChunkName: "enterprise" */ '@/views/shop-manage/enterprise/Enterprise.vue'),
    meta: {
      name: '企业管理'
    },
    children: [
      {
        path: '',
        name: '',
        redirect: {
          path: 'list'
        }
      },
      // 企业列表
      {
        path: 'list',
        name: 'enterpriselist',
        meta: {
          keepAlive: true,
          tabName: '企业管理'
        },
        component: () => import('@/views/shop-manage/enterprise/list/List.vue')
      },
      // 企业新增
      {
        path: 'add',
        name: 'enterpriseadd',
        meta: {
          tabName: '新增企业'
        },
        component: () => import('@/views/shop-manage/enterprise/add/add.vue')
      },
      // 企业修改
      {
        path: 'redact',
        name: 'enterpriseredact',
        meta: {
          tabName: '修改企业信息'
        },
        component: () => import('@/views/shop-manage/enterprise/add/add.vue')
      },
      // 企业详情
      {
        path: 'detail',
        name: 'enterprisedetail',
        meta: {
          tabName: '查看企业'
        },
        component: () => import('@/views/shop-manage/enterprise/detail/Detail.vue')
      }
    ]
  },
  {
    path: 'shop-manage/store', // 门店管理
    component: () => import(/* webpackChunkName: "store" */ '@/views/shop-manage/store/Store.vue'),
    meta: {
      name: '门店管理'
    },
    children: [
      {
        path: '',
        name: '',
        redirect: {
          path: 'list'
        }
      },
      {
        path: 'list',
        name: 'storelist',
        meta: {
          keepAlive: true,
          tabName: '门店管理'
        },
        component: () => import(/* webpackChunkName: "storelist" */ '@/views/shop-manage/store/list/List.vue')
      },
      {
        path: 'add',
        name: 'storeadd',
        meta: {
          tabName: '新建门店'
        },
        component: () => import(/* webpackChunkName: "storeadd" */ '@/views/shop-manage/store/add/add.vue')
      },
      {
        path: 'redact',
        name: 'storeredact',
        meta: {
          tabName: '修改门店信息'
        },
        component: () => import(/* webpackChunkName: "storeredact" */ '@/views/shop-manage/store/add/add.vue')
      },
      {
        path: 'detail',
        name: 'storedetail',
        meta: {
          tabName: '门店信息'
        },
        component: () => import(/* webpackChunkName: "storedetail" */ '@/views/shop-manage/store/detail/Detail.vue')
      }
    ]
  },
  {
    path: 'shop-manage/alliance', // 联盟管理
    component: () => import('@/views/shop-manage/alliance/Alliance.vue'),
    meta: {
      name: '联盟管理'
    },
    children: [
      {
        path: '',
        name: '',
        redirect: {
          path: 'list'
        }
      },
      {
        path: 'list',
        name: 'alliance-list',
        meta: {
          keepAlive: true,
          tabName: '联盟管理'
        },
        component: () => import(/* webpackChunkName: "alliance-list" */ '@/views/shop-manage/alliance/list/List.vue')
      },
      {
        path: 'add',
        name: 'alliance-add',
        meta: {
          tabName: '新增联盟'
        },
        component: () => import(/* webpackChunkName: "alliance-add" */ '@/views/shop-manage/alliance/add/Add.vue')
      },
      {
        path: 'redact',
        name: 'alliance-redact',
        meta: {
          tabName: '修改联盟信息'
        },
        component: () => import(/* webpackChunkName: "alliance-redact" */ '@/views/shop-manage/alliance/add/Add.vue')
      }
      // {
      //   path: 'detail',
      //   name: 'alliance-detail',
      //   meta: {
      //     keepAlive: true,
      //     tabName: '查看联盟信息'
      //   },
      //   component: () =>
      //     import(/* webpackChunkName: "alliance-detail" */ '@/views/shop-manage/alliance/detail/Detail.vue')
      // }
    ]
  },
  /**
   * 数据分析
   */
  {
    path: 'analyze/active-statistical', // 日活统计
    name: 'analyze/active-statistical',
    meta: {
      name: '日活跃统计',
      tabName: '日活跃统计'
    },
    component: () =>
      import(/* webpackChunkName: "active-statistical" */ '@/views/analyze/active-statistical/ActiveStatistical.vue')
  },
  {
    path: 'analyze/active-analyze', // 活跃分析
    name: 'analyze/active-analyze',
    meta: {
      name: '活跃分析',
      tabName: '活跃分析'
    },
    component: () => import(/* webpackChunkName: "active-analyze" */ '@/views/analyze/active-analyze/ActiveAnalyze.vue')
  },
  {
    path: 'analyze/agency-statistics', // 代理统计
    name: 'analyze/agency-statistics',
    meta: {
      name: '代理统计',
      tabName: '代理统计'
    },
    component: () => import(/* webpackChunkName: "agency-statistics" */ '@/views/analyze/agency-statistics/AgencyStatistics.vue')
  },
  /**
   * 付费管理
   */
  {
    path: 'pay-manage/pay-ment', // 缴费管理
    component: () => import(/* webpackChunkName: "pay-ment" */ '@/views/pay-manage/pay-ment/PayMent.vue'),
    meta: {
      name: '缴费管理'
    },
    children: [
      {
        path: '/',
        name: 'pay-ment-list',
        meta: {
          keepAlive: true,
          tabName: '缴费管理'
        },
        component: () => import(/* webpackChunkName: "pay-ment-list" */ '@/views/pay-manage/pay-ment/list/List.vue')
      },
      {
        path: 'pay-ment-detail/:enterpriseId',
        name: 'pay-ment-detail',
        meta: {
          tabName: '缴费历史'
        },
        component: () =>
          import(/* webpackChunkName: "pay-ment-detail" */ '@/views/pay-manage/pay-ment/detail/Detail.vue')
      }
    ]
  },
  {
    name: 'finance-manage/account-check', // 对账中心
    path: 'finance-manage/account-check',
    meta: {
      keepAlive: true,
      name: '对账中心',
      tabName: '对账中心'
    },
    component: () =>
      import(/* webpackChunkName: "account-check" */ '@/views/finance-manage/account-check/AccountCheck.vue')
  },
  {
    name: 'finance-manage/qrcode-pay',
    path: 'finance-manage/qrcode-pay',
    meta: {
      keepAlive: true,
      name: '扫码付交易流水',
      tabName: '扫码付交易流水'
    },
    component: () => import(/* webpackChunkName: "qrcode-pay" */ '@/views/finance-manage/qrcode-pay/QrcodePay.vue')
  },
  {
    name: 'finance-manage/qrcode-statistic',
    path: 'finance-manage/qrcode-statistic',
    meta: {
      keepAlive: true,
      name: '扫码付交易统计',
      tabName: '扫码付交易统计'
    },
    component: () =>
      import(/* webpackChunkName: "qrcode-pay" */ '@/views/finance-manage/qrcode-statistic/QrcodeStatistic.vue')
  },
  /**
   * 权限管理
   */
  {
    path: 'authority-manage/user-manage', // 用户管理
    name: 'authority-manage/user-manage',
    meta: {
      name: '用户管理',
      tabName: '用户管理'
    },
    component: () => import(/* webpackChunkName: "user-manage" */ '@/views/authority-manage/user-manage/UserManage.vue')
  },
  {
    path: 'authority-manage/role-manage', // 用户管理
    meta: {
      name: '角色管理'
    },
    component: () =>
      import(/* webpackChunkName: "role-manage" */ '@/views/authority-manage/role-manage/RoleManage.vue'),
    children: [
      {
        path: '/',
        name: 'role-list',
        meta: {
          tabName: '角色管理'
        },
        component: () =>
          import(/* webpackChunkName: "role-list" */ '@/views/authority-manage/role-manage/role-list/RoleList.vue')
      },
      {
        path: '/authority-manage/role-manage/role-permission',
        name: 'role-permission',
        meta: {
          tabName: '权限设置'
        },
        component: () =>
          import(/* webpackChunkName: "role-permission" */ '@/views/authority-manage/role-manage/role-permission/RolePermission.vue')
      }
    ]
  },
  /**
   * 其他设置
   */
  {
    path: 'other-settings/qrcode',
    name: 'other-settings/qrcode',
    meta: {
      name: '测试扫码付',
      tabName: '测试扫码付'
    },
    component: () => import('@/views/other-settings/TestQrCode.vue')
  },
  {
    path: 'other-settings/unbind-mobile',
    name: 'other-settings/unbind-mobile',
    meta: {
      name: '解绑手机号',
      tabName: '解绑手机号'
    },
    component: () => import(/* webpackChunkName: "unbind-mobile" */ '@/views/other-settings/UnbindMobile.vue')
  }
]
export default router
