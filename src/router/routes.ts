//对外暴露配置路由 (常量路由)
export const constantRoutes = [
  {
    //登录路由
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'login', //明明路由
    meta: {
      title: '登录', //菜单标题
      hidden: true, //路由标题在菜单中是否隐藏,  true:隐藏   false不隐藏
      icon: 'Promotion', //菜单文字左侧的图标, 支持element-plus全部图标
    },
  },
  {
    //登录成功以后战术数据的路由
    path: '/',
    component: () => import('@/layout/Layout.vue'),
    name: 'layout',
    redirect: '/home',
    meta: {
      title: '', //不写title和icon, 防止展示首页时在面包屑组件多出layout面包屑
      icon: '',
    },
    children: [
      {
        path: '/home',
        component: () => import('@/views/Home/Home.vue'),
        meta: {
          title: '首页',
          icon: 'HomeFilled',
        },
      },
    ],
  },
  {
    //404
    path: '/404',
    component: () => import('@/views/404/404.vue'),
    name: '404',
    meta: {
      title: '404',
      hidden: true,
      icon: 'DocumentDelete',
    },
  },
  {
    path: '/screen',
    component: () => import('@/views/Screen/Screen.vue'),
    name: 'Screen',
    meta: {
      title: '数据大屏',
      icon: 'Platform',
    },
  },
  {
    path: '/acl',
    component: () => import('@/layout/Layout.vue'),
    name: 'Acl',
    meta: {
      title: '权限管理',
      icon: 'Lock',
    },
    redirect: '/acl/user',
    children: [
      {
        path: '/acl/user',
        component: () => import('@/views/Acl/User/User.vue'),
        name: 'User',
        meta: {
          title: '用户管理',
          icon: 'User',
        },
      },
      {
        path: '/acl/role',
        component: () => import('@/views/Acl/Rule/Rule.vue'),
        name: 'Role',
        meta: {
          title: '角色管理',
          icon: 'UserFilled',
        },
      },
      {
        path: '/acl/permission',
        component: () => import('@/views/Acl/Permission/Permission.vue'),
        name: 'Permission',
        meta: {
          title: '菜单管理',
          icon: 'Monitor',
        },
      },
    ],
  },
  {
    path: '/product',
    component: () => import('@/layout/Layout.vue'),
    name: 'Product',
    meta: {
      title: '商品管理',
      icon: 'Goods',
    },
    redirect: '/product/trademark',
    children: [
      {
        path: '/product/trademark',
        component: () => import('@/views/Product/Trademark/Trademark.vue'),
        name: 'Trademark',
        meta: {
          title: '品牌管理',
          icon: 'ShoppingCartFull',
        },
      },
      {
        path: '/product/attr',
        component: () => import('@/views/Product/Attr/Attr.vue'),
        name: 'Attr',
        meta: {
          title: '属性管理',
          icon: 'ChromeFilled',
        },
      },
      {
        path: '/product/spu',
        component: () => import('@/views/Product/Spu/Spu.vue'),
        name: 'Spu',
        meta: {
          title: 'SPU管理',
          icon: 'Calendar',
        },
      },
      {
        path: '/product/sku',
        component: () => import('@/views/Product/Sku/Sku.vue'),
        name: 'Sku',
        meta: {
          title: 'SKU管理',
          icon: 'Orange',
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    name: 'any',
    meta: {
      title: '任意路由',
      hidden: true,
      icon: 'DataLine',
    },
  },
]
