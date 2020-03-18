const home = () => import('@/views/home/home')
const login = () => import('@/views/login/login')
const entry = () => import('@/views/entry/entry')
const locking = () => import('@/views/locking/locking')
const componentDemo = () => import('@/views/componentDemo/')
const formDemo = () => import('@/views/componentDemo/formDemo')
// const gameCreate = () => import('@/views/businessManage/gameManage/components/gameCreate')


import children from './modules/entry'

export default [{
    path: '/',
    redirect: {
      path: '/entry'
    }
  },
  {
    path: '/home',
    component: home,
    children,
  },
  {
    path: '/login',
    name: 'login',
    component: login
  },
  {
    path: '/entry',
    name: 'entry',
    component: entry
  },
  {
    path: '/locking',
    name: 'locking',
    component: locking
  },
  {
    path: '/componentDemo',
    name: 'componentDemo',
    component: componentDemo
  },
  {
    path: '/formDemo',
    name: 'formDemo',
    component: formDemo
  },
  // {
  //   path: '/gameCreate',
  //   name: 'gameCreate',
  //   component: gameCreate
  // }
]