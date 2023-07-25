export default {
  path: '/auth/login',
  name: 'auth',
  meta: {
    title: '账号登录？',
    needLogin: false,
  },
  component: () => import('@/views/auth/blLogin')
  // redirect: '/auth/login',
  // component: () => import('@/views/auth/layout'),
  // children: [
  //   {
  //     path: '/auth/login',
  //     meta: {
  //       title: '账号登录？',
  //       needLogin: false,
  //     },
  //     component: () => import('@/views/auth/login'),
  //   },
  //   {
  //     path: '/auth/register',
  //     meta: {
  //       title: '账号注册？',
  //       needLogin: false,
  //     },
  //     component: () => import('@/views/auth/register'),
  //   },
  //   {
  //     path: '/auth/forget',
  //     meta: {
  //       title: '找回密码？',
  //       needLogin: false,
  //     },
  //     component: () => import('@/views/auth/forget'),
  //   },
  // ],
}
