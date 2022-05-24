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
          {
            name: 'register-result',
            icon: 'smile',
            path: '/user/registerresult',
            component: './user/RegisterResult',
          },
          {
            name: 'register',
            icon: 'smile',
            path: '/user/register',
            component: './user/Register',
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
    path: '/delegation',
    name: '委托管理',
    icon: 'crown',
    //access:,
    //component: './tester/delegation',
    routes: [
      //客户（可以新增删除填写委托）
      {
        path: './check/client',
        name: '（客户)查看委托',
        icon: 'smile',
        component: './Delegation/check/Client',
      },
      //其他人：只能看
      {
        path: './check/normal',
        name: '查看委托',
        icon: 'smile',
        component: './Delegation/check',
      },
      //市场部分配
      {
        path: './distribute/marketing',
        name: '(市场部)分配委托',
        icon: 'smile',
        component: './Delegation/distribute/Marketing',
      },
      //测试部分配
      {
        path: './distribute/testing',
        name: '(测试部)分配委托',
        icon: 'smile',
        component: './Delegation/distribute/Testing',
      },
      //审核
      {
        path: './audit/marketing',
        name: '(市场部)审核委托',
        icon: 'smile',
        component: './Delegation/audit/Marketing'
      },
      {
        path: './audit/testing',
        name: '(测试部)审核委托',
        icon: 'smile',
        component: './Delegation/audit/Testing'
      },
      //报价
      {
        path: './offer/market',
        name: '(市场部)生成报价',
        icon: 'smile',
        component: './Delegation/offer/Market',
      },
      {
        path: './offer/client',
        name: '(客户)处理报价',
        icon: 'smile',
        component: './Delegation/offer/Client',
      },
    ],
  },
  {
    path: '/docs',
    name: '文档',
    icon: 'smile',
    routes: [
      {
        path: '/docs/schemeReview',
        name: '测试方案评审表',
        icon: 'smile',
        component: './docs/SchemeReview',
      },
      {
        path: '/docs/softDocReview',
        name: '软件文档评审表',
        icon: 'smile',
        routes: [
          {
            path: '/docs/softDocReview/marketing',
            name: '市场部评审',
            icon: 'smile',
            component: './docs/DocumentReview/Marketing',
          },
          {
            path: '/docs/softDocReview/testing',
            name: '测试部评审',
            icon: 'smile',
            component: './docs/DocumentReview/Testing',
          }
        ]
      },
      {
        path:'/docs/new-delegation',
        name:'填写委托',
        icon:'table',
        component: './docs/NewDelegation',
      },
      {
        name: '软件项目委托测试保密协议',
        icon: 'table',
        path: '/docs/confidentiality-agreement',
        component: './docs/ConfidentialityAgreement',
      },
      {
        name: '软件委托测试合同',
        icon: 'table',
        path: '/docs/contract',
        component: './docs/Contract',
      },
      {
        name: '报价单',
        path: '/docs/quotation/marketing',
        icon: 'smile',
        component: './docs/Quotation/Marketing',
      },
      {
        name: '查看报价单',
        path: '/docs/quotation/client',
        icon: 'smile',
        component: './docs/Quotation/Client',
      },
    ]
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
