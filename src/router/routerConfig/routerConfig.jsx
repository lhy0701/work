import HeaderFooter from '../../layouts/HeaderFooter'
import Home from '../../pages/Home'
import Aboutus from '../../pages/Aboutus'
import Download from '../../pages/Download'
import Backend from '../../pages/BackEnd'
import Cloud from '../../pages/Cloud'
import Plugin from '../../pages/Plugin'
const routerConfig = [
  {
    path: '/',
    layout: HeaderFooter,
    component: Home
  },
  {
    path: '/download',
    layout: HeaderFooter,
    component: Download
  },
  {
    path: '/aboutus',
    layout: HeaderFooter,
    component: Aboutus
  },
  {
    path: '/backend',
    layout: HeaderFooter,
    component: Backend
  },
  {
    path: '/cloud',
    layout: HeaderFooter,
    component: Cloud
  },
  {
    path: '/plugin',
    layout: HeaderFooter,
    component: Plugin
  },
  {
    path: '*',
    layout: HeaderFooter,
    component: Home
  }
  // {
  //   path: '*',
  //   layout: HeaderFooter,
  //   component: NotFound
  // }
]

export default routerConfig
