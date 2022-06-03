import constant from "./constant";

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
    routes: [
      //客户查看委托（可以新增删除填写委托）
      {
        path: './list/client',
        name: '查看委托',
        icon: 'smile',
        component: './Delegation/list/Client',
      },
      //其他人查看委托
      {
        path: './list/common',
        name: '查看委托',
        icon: 'smile',
        component: './Delegation/list/Common',
      },
      //市场部分配委托
      {
        path: './distribute/marketing',
        name: '分配委托',
        icon: 'smile',
        component: './Delegation/distribute/Marketing',
      },
      //测试部分配委托
      {
        path: './distribute/testing',
        name: '分配委托',
        icon: 'smile',
        component: './Delegation/distribute/Testing',
      },
      //市场部审核委托
      {
        path: './audit/marketing',
        name: '(市场部)审核委托',
        icon: 'smile',
        component: './Delegation/audit/Marketing'
      },
      //测试部审核委托
      {
        path: './audit/testing',
        name: '(测试部)审核委托',
        icon: 'smile',
        component: './Delegation/audit/Testing'
      },
      //生成报价
      {
        path: './offer/market',
        name: '(市场部)生成报价',
        icon: 'smile',
        component: './Delegation/offer/Market',
      },
      //处理报价
      {
        path: './offer/client',
        name: '(客户)处理报价',
        icon: 'smile',
        component: './Delegation/offer/Client',
      },
    ],
  },
  {
    path: '/contract',
    name: '合同管理',
    icon: 'crown',
    routes: [
      //查看合同详情
      {
        path: './list',
        name: '查看合同',
        icon: 'smile',
        component: './Contract/list',
      },
      //市场部填写（创建）
      {
        path: './create/staff',
        name: '（市场部)填写合同',
        icon: 'smile',
        component: './Contract/write/Marketing',
      },
      //客户填写（创建）
      {
        path: './create/client',
        name: '（客户)填写合同',
        icon: 'smile',
        component: './Contract/write/Client',
      },
      //客户检查合同
      {
        path: './audit/client',
        name: '（客户)检查合同',
        icon: 'smile',
        component: './Contract/audit/Client',
      },
      //市场部审核合同
      {
        path: './audit/staff',
        name: '（市场部)审核合同',
        icon: 'smile',
        component: './Contract/audit/Marketing',
      },
      //市场部 上传合同
      {
        path: './upload',
        name: '上传合同',
        icon: 'smile',
        component: './Contract/upload',
      },
    ]
  },
  {
    path: '/sample',
    name: '样品管理',
    icon: 'crown',
    routes: [
      //(客户)上传样品
      {
        path: './submit',
        name: '上传样品',
        icon: 'smile',
        component: './Sample/submit',
      },
      {
        path: './audit/marketing',
        name: '验收样品',
        icon: 'smile',
        component: './Sample/audit/Marketing'
      },
      {
        path: './audit/testing',
        name: '验收样品',
        icon: 'smile',
        component: './Sample/audit/Testing'
      },
    ]
  },
  {
    path: '/solution',
    name: '测试方案',
    icon: 'crown',
    routes: [
      /*
      {
        path: '/solution/checkAll',
        name: '查看测试方案',
        icon: 'smile',
        component: './Solution',
      },
      */
      {
        path: '/solution/write',
        name: '编写测试方案',
        icon: 'smile',
        component: './Solution/Write',
      },
      {
        path: '/solution/audit',
        name: '审核测试方案',
        icon: 'smile',
        component: './Solution/Audit'
      }
    ]
  },
  {
    path: '/report',
    name: '测试报告',
    icon: 'crown',
    routes: [
      {
        path: '/report/write',
        name: '填写测试文档',
        icon: 'smile',
        component: './Report/Write',
      },
      //(测试部主管)审核测试报告
      {
        path: '/report/audit/manager',
        name: '(测试部主管)审核测试报告',
        icon: 'smile',
        component: './Report/audit/Manager',
      },
      //(用户)审核测试报告
      {
        path: '/report/audit/client',
        name: '(用户)审核测试报告',
        icon: 'smile',
        component: './Report/audit/Client',
      },
      //(签字人)审核测试报告
      {
        path: '/report/audit/signatory',
        name: '(签字人)审核测试报告',
        icon: 'smile',
        component: './Report/audit/Signatory',
      },
      //测试部员工 归档测试报告
      {
        path: '/report/archive',
        name: '归档测试报告',
        icon: 'smile',
        component: './Report/Archive',
      },
      //市场部员工 发送报告
      {
        path: '/report/send',
        name: '发送测试报告',
        icon: 'smile',
        component: './Report/Send',
      },
      //客户 接收报告
      {
        path: '/report/receive',
        name: '接收测试报告',
        icon: 'smile',
        component: './Report/Receive',
      },
    ]
  },
  {
    path: constant.docPath.ROOT,
    name: '文档',
    icon: 'smile',
    routes: [
      {
        path: constant.docPath.delegation.ROOT,
        icon: 'smile',
        name: '委托',
        routes: [
          {
            path: constant.docPath.delegation.APPLY,
            name: '填写委托',
            icon: 'table',
            component: './docs/Delegation/Apply',
          },
          //委托详情页
          {
            path: './detail',
            name: '委托详情',
            icon: 'smile',
            component: './docs/Delegation/DelegationDetail'
          },
          {
            path: constant.docPath.delegation.AUDIT,
            name: '审核委托',
            icon: 'table',
            routes: [
              {
                path: constant.docPath.delegation.audit.MARKETING,
                name: '市场部',
                icon: 'table',
                component: './docs/Delegation/audit/Marketing',
              },
              {
                path: constant.docPath.delegation.audit.TESTING,
                name: '测试部',
                icon: 'table',
                component: './docs/Delegation/audit/testing',
              },
            ]
          },
          {
            path: constant.docPath.delegation.offer.ROOT,
            name: '委托报价',
            icon: 'table',
            routes: [
              {
                name: '填写报价单',
                path: constant.docPath.delegation.offer.WRITE,
                icon: 'smile',
                component: './docs/delegation/offer/Marketing',
              },
              {
                name: '处理报价单',
                path: constant.docPath.delegation.offer.HANDLE,
                icon: 'smile',
                component: './docs/delegation/offer/Client',
              },
            ]
          },
        ]
      },
      {
        name: '合同',
        icon: 'table',
        path: constant.docPath.contract.ROOT,
        routes: [
          {
            path: constant.docPath.contract.write.CLIENT,
            name: '(客户)填写合同',
            icon: 'smile',
            component: './docs/Contract/write/Client',
          },
          {
            path: constant.docPath.contract.write.MARKETING,
            name: '(市场部)填写合同',
            icon: 'smile',
            component: './docs/Contract/write/Marketing',
          },
          {
            path: constant.docPath.contract.audit.CLIENT,
            name: '(客户)检查合同',
            icon: 'smile',
            component: './docs/Contract/audit/Client',
          },
          {
            path: constant.docPath.contract.audit.MARKETING,
            name: '(市场部)检查合同',
            icon: 'smile',
            component: './docs/Contract/audit/Marketing',
          },
          {
            path: constant.docPath.contract.upload.CHECKLIST,
            name:'市场部填写软件项目委托测试工作检查表',
            icon: 'smile',
            component: "./docs/Contract/checkListAfterUploadContract",
          },
        ]
      },


      {
        name: '样品',
        path: constant.docPath.sample.ROOT,
        icon: 'smile',
        routes: [
          {
            name: '样品详情',
            path: constant.docPath.sample.AUDIT,
            icon: 'smile',
            component: './docs/Sample/detail',
          },
        ]
      },
      {
        path: constant.docPath.solution.ROOT,
        name: '测试方案',
        routes: [
          {
            path: constant.docPath.solution.WRITE,
            name: '填写测试方案',
            icon: 'table',
            component: './docs/Solution/NewSolution',
          },
          {
            path: constant.docPath.solution.AUDIT,
            name: '审核测试方案',
            icon: 'table',
            component: './docs/Solution/AuditSolution',
          },
        ]
      },
      {
        name: '测试报告',
        path: constant.docPath.report.ROOT,
        routes: [
          {
            path: constant.docPath.report.WRITE,
            name: '填写测试文档',
            icon: 'table',
            component: './docs/Report/Write',
          },
          {
            path: constant.docPath.report.ROOT,
            name: '审核测试报告',
            icon: 'table',
            routes: [
              {
                path: constant.docPath.report.audit.MANAGER,
                name: '(测试部主管)审核测试报告',
                icon: 'table',
                component: './docs/Report/Audit/Manager',
              },
              {
                path: constant.docPath.report.audit.CLIENT,
                name: '(客户)审核测试报告',
                icon: 'table',
                component: './docs/Report/Audit/Client',
              },
              {
                path: constant.docPath.report.audit.SIGNATORY,
                name: '(授权签字人)审核测试报告',
                icon: 'table',
                component: './docs/Report/Audit/Signatory',
              },
              {
                path: constant.docPath.report.ARCHIVE,
                name: '归档',
                icon: 'table',
                component: './docs/Report/Archive',
              }
            ]
          },
        ]
      }
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
