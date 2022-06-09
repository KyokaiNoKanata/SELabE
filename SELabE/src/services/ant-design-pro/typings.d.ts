// @ts-ignore
/* eslint-disable */

declare namespace API {
  /**
   * 后端返回格式
   */
  type Response = {
    /**
     * code,0表示正确，非0表示不正确
     */
    code: number,
    /**
     * 数据
     */
    data: any,
    /**
     * 信息，错误提示
     */
    msg: string,
  }
  /**
   * 合同项
   */
  type ContractItem = {
    /**
     * 合同编号
     */
    id: number;
    /**
     * 创建时间
     */
    createTime: string;
    /**
     * 客户审核合同意见
     */
    clientRemark?: string;
    /**
     * 市场部人员审核合同意见
     */
    staffRemark?: string;
    /**
     * 软件委托测试合同ID
     */
    table4Id?: string;
    /**
     * 软件项目委托测试保密协议ID
     */
    table5Id?: string;
    url?: string;
  }
  /**
   * 提交样品的信息
   */
  type SubmitSampleItemType = {
    /**
     * 样品编号
     */
    id: number;
    /**
     * 样品信息
     */
    information?: string;
    /**
     * 处理方式
     */
    processType?: string;
    /**
     * 样品上传方式，如果在线上传则填写为线上，其余需说明方式的具体信息
     */
    type?: string;
    /**
     * 如果样品为线上上传，需要填写样品的url,上传文件后生成
     */
    url?: string;
  }
  /**
   * 样品信息
   */
  type SampleItem = SubmitSampleItemType & {
    //id? :number;//样品编号
    /**
     * 创建时间
     */
    createTime?: string;//创建时间
    //information?: string;//样品信息
    /**
     * 修改意见
     */
    modifyRemark?: string;
    //processType?: string;//处理方式
    /**
     * 审核意见
     */
    remark?: string;
    /**
     * 样品状态 0.未发送 1.已发送 2.已审核 3.待修改 4.已修改 5.已处理
     */
    state?: number;
    //type?: string; //样品上传方式，如果在线上传则填写为线上，其余需说明方式的具体信息
    //url?: string;  //如果样品为线上上传，需要填写样品的url
    /**
     * 审核人id，只能为选定的市场部或者测试部两个人中的一个
     */
    verifyId?: string;
  }
  /**
   * 委托项
   */
  type DelegationItem = {
    /**
     * 取消原因
     */
    cancelRemark?: string;
    /**
     * 委托单位
     */
    clientUnit?: string
    /**
     * 编号
     */
    id: number;
    /**
     * 名称
     */
    name: string;
    /**
     * 合同Id
     */
    contractId?: number;
    /**
     * 发起者编号
     */
    creatorId?: number;
    /**
     * 发起时间
     */
    launchTime: string;
    /**
     * 市场部人员Id
     */
    marketDeptStaffId?: number;
    /**
     * 市场部处理人员意见
     */
    marketRemark?: string;
    /**
     * 报价单Id
     */
    offerId?: string;
    /**
     * 用户报价单意见
     */
    offerRemark?: string;
    /**
     * 项目编号
     */
    projectId?: number;
    /**
     * 测试报告Id
     */
    reportId?: number;
    /**
     * 样品Id
     */
    sampleId?: number;
    /**
     * 软件名
     */
    softwareName?: number;
    /**
     * 测试方案Id
     */
    solutionId?: number;
    /**
     * 状态
     */
    state: string;
    /**
     * 软件项目委托测试工作检查表ID
     */
    table12Id?: number;
    /**
     * 软件文档评审表ID
     */
    table14Id?: string;
    /**
     * 软件项目委托测试申请表ID
     */
    table2Id?: string;
    /**
     * 委托测试软件功能列表ID
     */
    table3Id?: string;
    /**
     * 分配的测试部人员id
     */
    testingDeptStaffId?: number;
    /**
     * 测试部人员处理意见
     */
    testingRemark?: string;
    /**
     * 文档材料url
     */
    url?: string;
    /**
     * 版本号
     */
    version?: string;
  }
  /**
   * 委托请求参数
   */
  type DelegationQueryParams = {
    /**
     * 是否升序, true 升序, false 降序
     */
    asc?: boolean;
    /**
     * 开始创建时间
     */
    beginCreateTime?: string;
    /**
     * 开始发起时间
     */
    beginLaunchTime?: string;
    /**
     * 取消原因
     */
    cancelRemark?: string;
    /**
     * 合同id
     */
    contractId?: number;
    /**
     * 发起者编号
     */
    creatorId?: number;
    /**
     * 结束创建时间
     */
    endCreateTime?: string;
    /**
     * 结束发起时间
     */
    endLaunchTime?: string;
    /**
     * 分配的市场部人员id
     */
    marketDeptStaffId?: number;
    /**
     * 名称
     */
    name?: string;
    /**
     * 报价单ID
     */
    offerId?: string;
    /**
     * 排序字段 注意格式ab_cd
     */
    orderField?: string;
    /**
     * 页码，从 1 开始
     */
    pageNo: number;
    /**
     * 每页条数，最大值为 100
     */
    pageSize: number;
    /**
     * 项目编号
     */
    projectId?: string;
    /**
     * 测试报告id
     */
    reportId?: number;
    /**
     * 样品id
     */
    sampleId?: number;
    /**
     * 测试方案id
     */
    solutionId?: number;
    /**
     * 状态
     */
    state?: string;
    /**
     * 软件文档评审表ID
     */
    table14Id?: string;
    /**
     * 软件项目委托测试申请表ID
     */
    table2Id?: string;
    /**
     * 委托测试软件功能列表ID
     */
    table3Id?: string;
    /**
     * 分配的测试部人员id
     */
    testingDeptStaffId?: number;
    //update_time?: string;查询里没有但可以作为排序字段
  }
  type CurrentUser = {
    code?: number;
    data?: {
      user?: {
        avatar?: string;
        nickname?: string;
        id?: string;
      }
    };
    msg?: string;

  };
  type SolutionItem = {
    auditorId?: number;
    createTime?: string;
    id: ? number;
    table13Id?: string;
    table6Id?: string;
  };
  type LoginResult = {
    status?: string;
    type?: string;
    code?: number;
    data?: {
      token?: string;
      refreshToken?: string;
      currentAuthority?: string;
      currentUser?: CurrentUser;
    };
    msg?: string;
  };

  type DelegationProcessItem = {
    /**
     * 委托编号
     */
    delegationId: number,
    /**
     * 原状态
     */
    fromState: number,
    /**
     * 现状态
     */
    toState: number,
    /**
     * 编号
     */
    id: number,
    /**
     * 日志欸容
     */
    remark: string,
    /**
     * 操作然Id
     */
    operatorId: number,
    /**
     * 日志时间
     */
    operateTime: string,
    mapValue: {
      delegation: DelegationItem,
    }
  }
  type RuleListItem = {
    key?: number;
    disabled?: boolean;
    href?: string;
    avatar?: string;
    name?: string;
    owner?: string;
    desc?: string;
    callNo?: number;
    status?: number;
    updatedAt?: string;
    createdAt?: string;
    progress?: number;
  };

  type RuleList = {
    data?: RuleListItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type FakeCaptcha = {
    code?: number;
    status?: string;
  };

  type LoginParams = {
    username?: string;
    password?: string;
    autoLogin?: boolean;
    type?: string;
  };

  type ErrorResponse = {
    /** 业务约定的错误码 */
    errorCode: string;
    /** 业务上的错误信息 */
    errorMessage?: string;
    /** 业务上的请求是否成功 */
    success?: boolean;
  };

  type NoticeIconList = {
    data?: NoticeIconItem[];
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
  };

  type NoticeIconItemType = 'notification' | 'message' | 'event';

  type NoticeIconItem = {
    id?: string;
    extra?: string;
    key?: string;
    read?: boolean;
    avatar?: string;
    title?: string;
    status?: string;
    datetime?: string;
    description?: string;
    type?: NoticeIconItemType;
  };

  type MenuData = {
    code?: string;
    data: MenuDataItem[];
    msg?: string;
  }

  type MenuDataItem = {
    name?: string;
    path?: string;
    hideInMenu?: string;
    id?: number;
    status?: number;
  }

  type RoleDataItem = {
    id?: number;
    name?: string;
    menuIds?: number[];
  }

  type RoleData = {
    data?: RoleDataItem[];
  }

  type UserDataItem = {
    id?: number;
    nickname?: string;
    roleIds?: number[];
  }

  type UserData = {
    data?: UserDataItem[];
  }
}
export default API;
