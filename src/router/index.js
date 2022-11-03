import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

// 引入组件   懒加载
const Login = () => import("@/views/Login/index.vue");
const LayOut = () => import("@/Layout/index.vue");

// home
const Home = () => import("@/views/Home/index");
// title
const Title = () => import("@/views/Title/index");
// chapter
const Chapter = () => import("@/views/Chapter/index");
// video
const Video = () => import("@/views/Video/index");
// model
const Model = () => import("@/views/Model/index");
// vip
const Vip = () => import("@/views/Vip/index");
// zfb
const ZfbOrder = () => import("@/views/ZfbOrder/index");
// wx
const WxOrder = () => import("@/views/WxOrder/index");
// logs
const Logs = () => import("@/views/Logs/index");
// person
const Person = () => import("@/views/Person/index");
// manager
const Manager = () => import("@/views/Manager/index");
const ManagerInsert = () => import("@/views/Manager/insert");


const routes = [
  {
    path:'/',
    component:LayOut,
    redirect:'/home',
    children:[
      {
        path:'home',
        component:Home,
        meta:{   //原信息
          title:'首页'
        }
      },
    ]
  },
  {
    path:'/title',
    component:LayOut,
    children:[
      {
        path:'',
        component:Title,
        meta:{   //原信息
          title:'大标题管理'
        }
      },
    ]
  },
  {
    path:'/chapter',
    component:LayOut,
    children:[
      {
        path:'',
        component:Chapter,
        meta:{   //原信息
          title:'章节管理'
        }
      },
    ]
  },
  {
    path:'/video',
    component:LayOut,
    children:[
      {
        path:'',
        component:Video,
        meta:{   //原信息
          title:'视频管理'
        }
      },
    ]
  },
  {
    path:'/model',
    component:LayOut,
    children:[
      {
        path:'',
        component:Model,
        meta:{   //原信息
          title:'模块管理'
        }
      },
    ]
  },
  {
    path:'/vip',
    component:LayOut,
    children:[
      {
        path:'',
        component:Vip,
        meta:{   //原信息
          title:'会员管理'
        }
      },
    ]
  },
  {
    path:'/zfborder',
    component:LayOut,
    children:[
      {
        path:'',
        component:ZfbOrder,
        meta:{   //原信息
          title:'支付宝订单'
        }
      },
    ]
  },
  {
    path:'/wxorder',
    component:LayOut,
    children:[
      {
        path:'',
        component:WxOrder,
        meta:{   //原信息
          title:'微信订单'
        }
      },
    ]
  },
  {
    path:'/logs',
    component:LayOut,
    children:[
      {
        path:'',
        component:Logs,
        meta:{   //原信息
          title:'登录日志'
        }
      },
    ]
  },
  {
    path:'/person',
    component:LayOut,
    redirect:'/person/index',
    children:[
      {
        path:'index',
        component:Person,
        meta:{   //原信息
          title:'个人中心'
        }
      },
    ]
  },
  {
    path:'/manager',
    component:LayOut,
    redirect:'/manager/index',
    children:[
      {
        path:'index',
        component:Manager,
        meta:{   //原信息
          title:'查询管理员'
        }
      },
      {
        path:'insert',
        component:ManagerInsert,
        meta:{   //原信息
          title:'新增管理员'
        }
      },
    ]
  },
  {
    path:'/login',
    component:Login,
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
