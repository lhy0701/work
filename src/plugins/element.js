import Vue from 'vue'
import { Button, Icon, MessageBox, Message, Loading } from 'element-ui'

Vue.use(Button)
Vue.use(Icon)
Vue.use(Loading.directive)
Vue.prototype.$loading = Loading.service
Vue.prototype.$msgbox = MessageBox
Vue.prototype.$alert = MessageBox.alert
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$message = Message
