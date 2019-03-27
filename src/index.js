import ReactDOM from 'react-dom'
import * as serviceWorker from './serviceWorker'
import './style/ui.scss'
import router from './router'

const CXD_CONTAINER = document.getElementById('root')

if (!CXD_CONTAINER) {
  throw new Error('当前页面不存在 <div id="root"></div> 节点')
}

ReactDOM.render(router, CXD_CONTAINER)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister()
