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
    path: '/system',
    name: '系统管理',
    icon: 'crown',
    //access: 'canAdmin',
    routes: [
      {
        path: './menulist',
        name: '菜单管理',
        component: './System/MenuList',
      },
      {
        path: './rolelist',
        name: '角色管理',
        component: './System/RoleList',
      },
      {
        path: './userlist',
        name: '用户管理',
        component: './System/UserList',
      },
      {
        name: '查询表格',
        icon: 'smile',
        path: '/system/testtable',
        component: './System/TestTable',
      },
    ],
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
    path: '/delegation',
    name: '委托管理',
    icon: 'crown',
    routes: [
      //查看委托
      {
        path: './list',
        name: '查看委托',
        icon: 'smile',
        component: './Delegation/list',
      },
      //分配委托
      {
        path: './distribute',
        name: '分配委托',
        icon: 'smile',
        component: './Delegation/Distribute',
      },
      //市场部/测试部 审核委托
      {
        path: './audit',
        name: '审核委托',
        icon: 'smile',
        component: './Delegation/Audit'
      },
      //市场部 生成报价
      {
        path: './offer/write',
        name: '生成报价',
        icon: 'smile',
        component: './Delegation/offer/Market',
      },
      //处理报价
      {
        path: './offer/audit',
        name: '处理报价',
        icon: 'smile',
        component: './Delegation/offer/Client',
      },
      /*//查看合同详情
      {
        path: './contract/list',
        name: '查看合同',
        icon: 'smile',
        component: './Contract/list',
      },*/
      //客户/市场部 填写合同
      {
        path: './contract/write',
        name: '填写合同',
        icon: 'smile',
        component: './Contract/write',
      },
      //客户/市场部 审核合同
      {
        path: './contract/audit',
        name: '审核合同',
        icon: 'smile',
        component: './Contract/audit',
      },
      //市场部 上传合同
      {
        path: './contract/upload',
        name: '上传合同',
        icon: 'smile',
        component: './Contract/upload',
      },
      {
        path: './fillProjectId',
        name: '填写项目编号',
        icon: 'smile',
        component: './Delegation/FillProjectId',
      },
    ],
  },
  /*{
    path: '/contract',
    name: '合同管理',
    icon: 'crown',
    routes: [

    ]
  },*/
  {
    name: '项目管理',
    path: '/project',
    icon: 'crown',
    routes: [
      {
        path: './list',
        name: '查看项目',
        component: './Project/list'
      },
      {
        path: './sample',
        name: '样品管理',
        icon: 'crown',
        routes: [
          {
            path: './list',
            name: '查看样品',
            icon: 'smile',
            component: './Sample/list',
          },
          //(客户)上传样品
          {
            path: './submit',
            name: '上传样品',
            icon: 'smile',
            component: './Sample/submit',
          },
          /*{
            path: './audit/marketing',
            name: '市场部验收样品',
            icon: 'smile',
            component: './Sample/audit/Marketing'
          },
          {
            path: './audit/testing',
            name: '测试部验收样品',
            icon: 'smile',
            component: './Sample/audit/Testing',
          },*/
          {
            path: './audit',
            name: '验收样品',
            icon: 'smile',
            component: './Sample/audit',
          },
        ],
      },
      {
        path: './solution',
        name: '测试方案',
        icon: 'crown',
        routes: [
          {
            path: './list',
            name: '查看测试方案',
            icon: 'smile',
            component: './Solution/list',
          },
          {
            path: './write',
            name: '编写测试方案',
            icon: 'smile',
            component: './Solution/Write',
          },
          {
            path: './audit',
            name: '审核测试方案',
            icon: 'smile',
            component: './Solution/Audit'
          }
        ]
      },
      {
        path: './report',
        name: '测试报告',
        icon: 'crown',
        routes: [
          {
            path: './read',
            name: '查看测试报告',
            icon: 'smile',
            component: './Report/list',
          },
          {
            path: './write',
            name: '填写测试文档',
            icon: 'smile',
            component: './Report/Write',
          },
          /*//(测试部主管)审核测试报告
          {
            path: './audit/manager',
            name: '(测试部主管)审核测试报告',
            icon: 'smile',
            component: './Report/audit/Manager',
          },
          //(用户)审核测试报告
          {
            path: './audit/client',
            name: '(用户)审核测试报告',
            icon: 'smile',
            component: './Report/audit/Client',
          },
          //(签字人)审核测试报告
          {
            path: './audit/signatory',
            name: '(签字人)审核测试报告',
            icon: 'smile',
            component: './Report/audit/Signatory',
          },*/
          //审核测试报告
          {
            path: './audit',
            name: '审核测试报告',
            icon: 'smile',
            component: './Report/audit',
          },
          //测试部员工 归档测试报告
          {
            path: './archive',
            name: '归档测试报告',
            icon: 'smile',
            component: './Report/Archive',
          },
          //市场部员工 发送报告
          {
            path: './send',
            name: '发送测试报告',
            icon: 'smile',
            component: './Report/Send',
          },
          //客户 接收报告
          {
            path: './receive',
            name: '接收测试报告',
            icon: 'smile',
            component: './Report/Receive',
          },
        ],
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
          {
            path: constant.docPath.delegation.FILL_PROJECT_ID,
            name: '填写项目编号',
            icon: 'table',
            component: './docs/delegation/FillProjectId',
          }
        ]
      },
      {
        name: '合同',
        icon: 'table',
        path: constant.docPath.contract.ROOT,
        routes: [
          {
            path: constant.docPath.contract.write.CLIENT,
            name: '客户填写合同',
            icon: 'smile',
            component: './docs/Contract/write/Client',
          },
          {
            path: constant.docPath.contract.write.MARKETING,
            name: '市场部填写合同草稿',
            icon: 'smile',
            component: './docs/Contract/write/Marketing',
          },
          {
            path: constant.docPath.contract.audit.CLIENT,
            name: '客户检查合同',
            icon: 'smile',
            component: './docs/Contract/audit/Client',
          },
          {
            path: constant.docPath.contract.audit.MARKETING,
            name: '市场部检查合同',
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
        name: '项目',
        icon: 'table',
        path: constant.docPath.project.ROOT,
        routes: [
          {
            path: constant.docPath.project.DETAIL,
            name: '项目详情',
            icon: 'smile',
            component: './docs/Project/detail',
          },
        ]
      },
      {
        name: '样品',
        path: constant.docPath.sample.ROOT,
        icon: 'smile',
        routes: [
          {
            name: '审核样品',
            path: constant.docPath.sample.AUDIT,
            icon: 'smile',
            component: './docs/Sample/audit',
          },
          {
            name: '查看样品',
            path: constant.docPath.sample.READ,
            icon: 'smile',
            component: './docs/Sample/read',
          }
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
            path: constant.docPath.report.READ_ONLY,
            name: "查看测试报告",
            icon: 'table',
            component: './docs/Report/Read',
          },
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
        ],
      },
      {
        path: "/docs/form/",
        name: '表单',
        routes: [
          {
            path: "/docs/form/table2",
            name: '软件项目委托测试申请书',
            icon: 'table',
            component: './docs/tables/table2',
          },
          {
            path: "/docs/form/table3",
            name: '委托测试软件功能列表',
            icon: 'table',
            component: './docs/tables/table3',
          },
          {
            path: "/docs/form/table4",
            name: '软件委托测试合同',
            icon: 'table',
            component: './docs/tables/table4',
          },
          {
            path: "/docs/form/table5",
            name: '软件项目委托测试保密协议',
            icon: 'table',
            component: './docs/tables/table5',
          },
          {
            path: "/docs/form/table6",
            name: '测试方案',
            icon: 'table',
            component: './docs/tables/table6',
          },
          {
            path: "/docs/form/table7",
            name: '测试报告',
            icon: 'table',
            component: './docs/tables/table7',
          },
          {
            path: "/docs/form/table8",
            name: '测试用例',
            icon: 'table',
            component: './docs/tables/table8',
          },
          {
            path: "/docs/form/table9",
            name: '测试记录',
            icon: 'table',
            component: './docs/tables/table9',
          },
          {
            path: "/docs/form/table10",
            name: '测试报告检查表',
            icon: 'table',
            component: './docs/tables/table10',
          },
          {
            path: "/docs/form/table11",
            name: '问题清单',
            icon: 'table',
            component: './docs/tables/table11',
          },
          {
            path: "/docs/form/table12",
            name: '工作检查表',
            icon: 'table',
            component: './docs/tables/table12',
          },
          {
            path: "/docs/form/table13",
            name: '测试方案评审表',
            icon: 'table',
            component: './docs/tables/table13',
          },
          {
            path: "/docs/form/table14",
            name: '软件文档评审表',
            icon: 'table',
            component: './docs/tables/table14',
          },
          {
            path: "/docs/form/offer",
            name: '报价单',
            icon: 'table',
            component: './docs/tables/offer',
          },
        ]
      }
    ],
  },
  {
    path: '/accountsettings',
    component: './System/AccountSettings/index',
    hideInMenu: true
  },
  {
    path: '/',
    redirect: '/welcome',
  },
  {
    component: './404',
  },
];
