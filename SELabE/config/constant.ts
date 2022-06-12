/**
 * 常量表
 */

const constant = {
  /**
   * 委托状态
   */
  delegationState: {
    DELEGATE_WRITING: {code: 10, desc: "委托填写中"},
    WAIT_MARKETING_DEPARTMENT_ASSIGN_STAFF: {code: 20, desc: "等待市场部主管分配市场部人员"},
    WAIT_TESTING_DEPARTMENT_ASSIGN_STAFF: {code: 30, desc: "等待测试部主管分配测试部人员"},
    MARKETING_DEPARTMENT_AUDIT_DELEGATION: {code: 40, desc: "市场部审核委托中"},
    TESTING_DEPARTMENT_AUDIT_DELEGATION: {code: 50, desc: "测试部审核委托中"},
    MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL: {code: 60, desc: "市场部审核委托不通过，委托修改中"},
    TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL: {code: 70, desc: "测试部审核委托不通过，委托修改中"},
    MARKETING_DEPARTMENT_AUDIT_DELEGATION_SUCCESS: {code: 80, desc: "市场部审核委托通过"},
    TESTING_DEPARTMENT_AUDIT_DELEGATION_SUCCESS: {code: 90, desc: "测试部审核委托通过"},
    AUDIT_DELEGATION_SUCCESS: {code: 100, desc: "委托审核通过"},
    MARKETING_DEPARTMENT_GENERATE_OFFER: {code: 110, desc: "市场部生成报价中"},
    CLIENT_DEALING_OFFER: {code: 120, desc: "客户处理报价中"},
    CLIENT_REJECT_OFFER: {code: 130, desc: "客户不接受报价，市场部修改报价"},
    CLIENT_ACCEPT_OFFER: {code: 140, desc: "客户接受报价"},
    MARKETING_DEPARTMENT_GENERATE_CONTRACT: {code: 150, desc: "市场部生成合同草稿中"},
    CLIENT_AUDIT_CONTRACT: {coe: 160, desc: "客户检查合同草稿中"},
    CLIENT_WRITING_CONTRACT: {code: 170, desc: "客户接受市场部合同草稿，填写合同中"},
    MARKETING_DEPARTMENT_AUDIT_CONTRACT: {code: 180, desc: "市场部审核客户填写的草稿中"},
    MARKETING_DEPARTMENT_AUDIT_CONTRACT_FAIL: {code: 190, desc: "市场部审核合同不通过，客户修改中"},
    CLIENT_AUDIT_CONTRACT_FAIL: {code: 200, desc: "客户不接受市场部合同草稿，市场部修改合同草稿"},
    MARKETING_DEPARTMENT_AUDIT_CONTRACT_SUCCESS: {code: 210, desc: "市场部审核合同通过"},
    CONTRACT_SIGNING: {code: 220, desc: "合同签署中"},
    CONTRACT_SIGN_SUCCESS: {code: 230, desc: "合同签署成功"},
    WAITING_TESTING_DEPT_MANAGER_FILL_PROJECT_ID:{code: 235, desc: "等待测试部主管填写项目编号中"},
    //CLIENT_SENDING_SAMPLE(240, "客户发送样品中"),
    CLIENT_UPLOAD_SAMPLE_INFO: {code: 250, desc: "用户上传样品中"},
    CHECKING_SAMPLE: {code: 260, desc: "测试部/市场部验收样品中"},
    //SAMPLE_CHECK_FAIL_RESENDING_SAMPLE(270, "样品验收不通过，用户重新发送样品中"),
    SAMPLE_CHECK_FAIL_MODIFY_SAMPLE: {code: 280, desc: "样品验收不通过，用户重新修改"},
    SAMPLE_CHECK_SUCCESS: {code: 290, desc: "样品验收通过"},
    TESTING_DEPT_WRITING_TEST_SOLUTION: {code: 300, desc: "测试部编写测试方案中"},
    QUALITY_DEPT_AUDIT_TEST_SOLUTION: {code: 310, desc: "质量部审核测试方案中"},
    QUALITY_DEPT_AUDIT_TEST_SOLUTION_FAIL: {code: 320, desc: "测试方案审核未通过，测试部修改测试方案中"},
    QUALITY_DEPT_AUDIT_TEST_SOLUTION_SUCCESS: {code: 330, desc: "测试方案审核通过"},
    TESTING_DEPT_WRITING_TEST_REPORT: {code: 340, desc: "测试部测试进行中，填写测试文档"},
    TESTING_DEPT_GENERATE_TEST_REPORT: {code: 350, desc: "测试部测试完成，生成测试报告"},
    TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT: {code: 360, desc: "测试部主管审核测试报告中"},
    TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_FAIL: {code: 370, desc: "测试部主管测试报告审核未通过，测试部修改测试文档中"},
    TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_SUCCESS: {code: 380, desc: "测试部主管测试报告审核通过，用户审核中"},
    CLIENT_AUDIT_TEST_REPORT_FAIL: {code: 390, desc: "用户审核测试报告未通过，测试部修改测试文档中"},
    CLIENT_AUDIT_TEST_REPORT_SUCCESS: {code: 400, desc: "用户审核测试报告通过，授权签字人审核测试报告中"},
    SIGNATORY_AUDIT_TEST_REPORT_FAIL: {code: 410, desc: "授权签字人测试报告审核未通过，测试部修改测试文档中"},
    SIGNATORY_AUDIT_TEST_REPORT_SUCCESS: {code: 420, desc: "授权签字人测试报告审核通过"},
    TESTING_DEPT_ARCHIVE_TEST_REPORT_AND_PROCESS_SAMPLE: {code: 430, desc: "测试部测试文档归档，处理样品中"},
    MARKETING_DEPT_SEND_TEST_REPORT: {code: 440, desc: "市场部发送测试报告中"},
    WAIT_FOR_CLIENT_RECEIVE_TEST_REPORT: {code: 450, desc: "等待客户接收测试报告中"},
    CLIENT_CONFIRM_RECEIVE_TEST_REPORT: {code: 460, desc: "客户确认接收测试报告"},
    CLIENT_CANCEL_DELEGATION: {code: 470, desc: "客户取消委托"},
    ADMIN_CANCEL_DELEGATION: {code: 480, desc: "管理员取消委托"},

    //有项目编号
    HAS_PROJECT_QUERY: "235,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460",
    //有测试报告
    HAS_REPORT: "350,360,370,380,390,400,410,420,430,440,450,460",
    //有样品
    HAS_SAMPLE: "260,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460",
    //等待审核
    REPORT_WAITING_AUDIT: "360,380,400",
    //有测试方案
    HAS_SOLUTION: "310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460",

    //已取消
    CANCELED: "470,480",
    //委托进行中
    DELEGATION_PROCESSING: "10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230",
  },
  /**
   * 权限
   */
  roles: {
    SUPER_ADMIN: {en: "super_admin", cn: "超级管理员"},
    NORMAL_USER: {en: "normal_user", cn: "普通用户"},
    CUSTOMER: {en: "customer", cn: "客户"},
    TEST_DEPARTMENT_MANAGER: {en: "test_department_manager", cn: "测试部主管"},
    TEST_DEPARTMENT_STAFF: {en: "test_department_staff", cn: "测试部员工"},
    MARKET_DEPARTMENT_MANAGER: {en: "marketing_department_manger", cn: "市场部主管"},
    MARKET_DEPARTMENT_STAFF: {en: "marketing_department_staff", cn: "市场部员工"},
    QUALITY_DEPARTMENT_STAFF: {en: "quality_department_staff", cn: "质量部员工"},
    SIGNATORY: {en: "signatory", cn: "签字人"},
  },
  /**
   * 页面地址（不是菜单）
   */
  //相关页面
  docPath: {
    ROOT: "/docs",
    /**
     * 委托相关页面
     */
    delegation: {
      ROOT: "/docs/delegation",
      APPLY: "/docs/delegation/apply",
      DETAIL: "/docs/delegation/detail",
      AUDIT: "/docs/delegation/audit",
      audit: {
        MARKETING: "/docs/delegation/audit/marketing",
        TESTING: "/docs/delegation/audit/testing",
      },
      offer: {
        ROOT: "/docs/delegation/offer",
        HANDLE: "/docs/delegation/offer/client",
        WRITE: "/docs/delegation/offer/marketing",
      },
      FILL_PROJECT_ID: "/docs/delegation/fill-project-id",
    },
    project: {
      ROOT: "/docs/project",
      DETAIL: "/docs/project/detail",
    },
    /**
     * 合同相关页面
     */
    contract: {
      ROOT: "/docs/contract",
      write: {
        CLIENT: "/docs/contract/write/client",
        MARKETING: "/docs/contract/write/marketing",
      },
      audit: {
        CLIENT: "/docs/contract/audit/client",
        MARKETING: "/docs/contract/audit/marketing",
      },
      upload: {
        CHECKLIST: "/docs/contract/upload/checkList",
      }
    },
    /**
     * 样品相关页面
     */
    sample: {
      ROOT: "/docs/sample",
      AUDIT: "/docs/sample/audit",
      READ: "/docs/sample/read",
    },
    /**
     * 测试方案相关页面
     */
    solution: {
      ROOT: "/docs/solution",
      WRITE: "/docs/solution/new-solution",
      AUDIT: "/docs/solution/audit-solution",
    },
    /**
     * 测试报告相关页面
     */
    report: {
      ROOT: "/docs/report",
      WRITE: "/docs/report/write",
      audit: {
        ROOT: "/docs/report/audit",
        CLIENT: "/docs/report/audit/client",
        MANAGER: "/docs/report/audit/manager",
        SIGNATORY: "/docs/report/audit/signatory",
      },
      READ_ONLY: "/docs/report/read",
      ARCHIVE: "/docs/report/archive",
    },
    forms: {
      table6: "/docs/form/table6",
    }
  },
  /**
   * 空表
   */
  tables: {
    table12: {
      软件名称: '',
      版本号: '',
      申报单位: '',
      起始时间: '',
      预计完成时间: '',
      主测人: '',
      实际完成时间: '',
      '1-1': '',
      '1-2': '',
      '1-3': '',
      '2-1': '',
      '2-2': '',
      '2-3': '',
      '3-1': '',
      '3-2': '',
      '4': '',
      '5-1': '',
      '5-2': '',
      '5-3': '',
      '5-4': '',
      '5-5': '',
      '6-1': '',
      '7-1': '',
      '7-2': '',
      '7-3': '',
      '8-1': '',
      '8-2': '',
      '8-3': '',
      '8-4': '',
      '9-1': '',
      '9-2': '',
      '9-3': '',
    }
  },
  //菜单(真正需要分配的菜单结构) 尚未完善 todo
  menu: {
    all: {
      delegation: {
        list: "/delegation/list",                     //查看委托 所有人
        distribute: "/delegation/distribute",         //分配委托 市场部/测试部主管
        writeOffer: "/delegation/offer/write",        //生成报价 市场部员工
        auditOffer: "/delegation/offer/audit",        //处理报价 客户
        writeContract: "/delegation/contract/write",  //填写合同 市场部员工/客户
        auditContract: "/delegation/contract/audit",  //审核合同 市场部员工/客户
        uploadContract: "delegation/contract/upload", //上传合同 市场部员工
        fillProjectId: "/delegation/fillProjectId",   //填写项目编号 测试部主管
      },
      project: {
        list:   "/project/list",                      //查看项目 所有人
        sample: {
          list: "/project/sample/list",               //查看样品 所有人
          submit: "/project/sample/submit",           //上传样品 客户
          audit: "/project/sample/audit",             //验收样品 市场部/测试部员工
        },
        solution: {
          list:  "/project/solution/list",            //查看测试方案 所有人
          write: "/project/solution/write",           //编写测试方案 测试部员工
          audit: "/project/solution/audit",           //审核测试方案 质量部员工
        },
        report: {
          read:  "/project/report/read",              //查看测试报告 所有人
          write: "/project/report/write",             //填写测试报告 测试部员工
          audit: "/project/report/audit",             //审核测试报告 测试部主管/客户/签字人
          archive: "/project/report/archive",         //归档测试报告 测试部员工
          send: "/project/report/send",               //发送测试报告 市场部员工
          receive: "/project/report/receive",         //接收测试报告 客户
        }
      }
    },
  }
}
export default constant;
