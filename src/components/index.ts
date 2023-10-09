import { App, Component } from 'vue'
//引入项目中全部的全局组件
import SvgIcon from './SvgIcon/SvgIcon.vue'
import Pagination from './Pagination/Pagination.vue'
//引入element-plus提供的全部图标组件
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

//全局对象
const allGlobalComponent: Record<string, Component> = { SvgIcon, Pagination }

//对外暴露一个插件对象
export default {
  //务必叫做install方法
  install(app: App) {
    //注册项目的全部全局组件
    Object.keys(allGlobalComponent).forEach((key: string) => {
      app.component(key, allGlobalComponent[key] as Component)
    })
    //将element-plus提供的图标注册为全局组件
    for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
      app.component(key, component)
    }
  },
}
