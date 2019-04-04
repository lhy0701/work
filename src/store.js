import Vue from 'vue'
import Vuex from 'vuex'
import { backEndService } from '@/core/js/services'
import { env } from '@/core/js/env'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    openTab: [], //所有打开的路由
    activeIndex: '/', //激活状态
    site: 0
  },
  mutations: {
    // 添加tabs
    add_tabs(state, data) {
      this.state.openTab.push(data)
    },
    // 删除tabs
    delete_tabs(state, route) {
      let index = 0
      for (let option of state.openTab) {
        if (option.route === route) {
          break
        }
        index++
      }
      this.state.openTab.splice(index, 1)
    },
    // 设置当前激活的tab
    set_active_index(state, index) {
      this.state.activeIndex = index
    },
    setSite(state, index) {
      this.state.site = index
    }
  },
  actions: {
    async findSite({ commit }) {
      let res = await backEndService.getData({
        Code: '31573',
        AgentUserId: env.getUser().userId
      })
      let site = res.Message.Quantity * 1 || 0
      commit('setSite', site)
    }
  }
})
