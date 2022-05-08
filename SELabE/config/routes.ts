export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/welcome',
    name: 'welcome',
    icon: 'smile',
    component: './Welcome',
  },
  {
    path: '/admin',
    name: 'admin',
    icon: 'crown',
    access: 'canAdmin',
    component: './Admin',
    routes: [
      {
        path: '/admin/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/client',
    name: 'client',
    icon: 'crown',
    access: 'isClient',
    component: './Client',
    routes: [
      {
        path: '/client/sub-page',
        name: 'sub-page',
        icon: 'smile',
        component: './Welcome',
      },
      {
        component: './404',
      },
    ],
  },
  {
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    path: '/',
    name: '委托',
    icon: 'crown',
    //access:,
    //component: './tester/delegation',
    routes: [
      {
        path: '/delegation',
        name: '查看委托',
        icon: 'smile',
        component: './tester/delegation',
      },
      {
        path: '/documention',
        name: '测试文档',
        icon: 'smile',
        routes: [
          {
            path: '/documention/schemeReview',
            name: '测试方案评审表',
            icon: 'smile',
            component: './tester/documention/schemeReview',
          },
          /*{
            path: '/documention/documentReview',
            name: '软件文档评审表',
            icon: 'smile',
            component: './tester/documention/documentReview'
          }*/
        ]
      },
    ],
  },

  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
