import store from '@/store'

export default {
    path: '/address/books',
    name: 'addressBooks',
    redirect: '/address/books/loading',
    component: () => import('@/views/addressbooks/index'),
    children: [
      {
        path: '/address/books/loading',
        meta: {
          title: '组织架构',
          needLogin: true,
        },
        component: () => import('@/components/global/Loading'),
      },
      {
        path: '/address/books/team/members',
        meta: {
          title: '组织架构',
          needLogin: true,
        },
        component: () => import('@/views/addressbooks/organization'),
        beforeEnter: (to, from, next) => {
          if (!store.state.organization.loadStatus) {
            next('/address/books')
          }
          store.commit('SWITCH_TO_TEAM');
          next();
        },
      },
      {
        path: '/address/books/organization',
        meta: {
          title: '组织架构',
          needLogin: true,
        },
        component: () => import('@/views/addressbooks/organization'),
        beforeEnter: (to, from, next) => {
          if (!store.state.organization.loadStatus) {
            next('/address/books')
          }
          store.commit('SWITCH_TO_DEPARTMENT');
          next();
        },
      },
      {
        path: '/address/books/groups',
        meta: {
          title: '我的群组',
          needLogin: true,
        },
        component: () => import('@/views/addressbooks/groups'),
      },
    ],
  }
  