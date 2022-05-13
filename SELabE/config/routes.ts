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
    name: 'list.table-list',
    icon: 'table',
    path: '/list',
    component: './TableList',
  },
  {
    name: '软件委托测试合同',
    icon: 'table',
    path: '/contract',
    component: './Contract',
  }
  ,
  {
    name: '软件项目委托测试保密协议',
    icon: 'table',
    path: '/confidentiality-agreement',
    component: './ConfidentialityAgreement',
  }
  ,
  {
    name:'填写委托',
    icon:'table',
    path:'/new-delegation/:ID',
    component: './NewDelegation',
  }
  ,
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
