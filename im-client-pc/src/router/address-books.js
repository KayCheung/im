export default {
    path: '/address/books',
    name: 'addressBooks',
    component: () => import('@/views/addressbooks/index'),
    children: [
      {
        path: '/address/books/team/members',
        meta: {
          title: '组织架构',
          needLogin: true,
        },
        component: () => import('@/views/addressbooks/teamMembers'),
      },
      {
        path: '/address/books/organization',
        meta: {
          title: '组织架构',
          needLogin: true,
        },
        component: () => import('@/views/addressbooks/organization'),
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
  