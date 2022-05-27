// @ts-ignore
/* eslint-disable */

declare namespace API {
  type Response = {
    code: number,//0:ok
    data: any,
    msg: string,
  }
  type ContractItem = {
    id?: number;
    createTime?: string;
    clientRemark?: string;
    staffRemark?: string;
    table4Id: string;//
    table5Id: string;
    url: string;
  }
  type SubmitSampleItemType = {
    id?: number;//样品编号
    information?: string;//样品信息
    processType?: string;//处理方式
    type?: string; //样品上传方式，如果在线上传则填写为线上，其余需说明方式的具体信息
    url?: string;  //如果样品为线上上传，需要填写样品的url
  }
  type SampleItem = SubmitSampleItemType & {
    //id? :number;//样品编号
    createTime?: string;//创建时间
    //information?: string;//样品信息
    modifyRemark?: string;//修改意见
    //processType?: string;//处理方式
    remark?: string; //审核意见
    state?: number; //样品状态 0.未发送 1.已发送 2.已审核 3.待修改 4.已修改 5.已处理
    //type?: string; //样品上传方式，如果在线上传则填写为线上，其余需说明方式的具体信息
    //url?: string;  //如果样品为线上上传，需要填写样品的url
    verifyId?: string; //审核人id，只能为选定的市场部或者测试部两个人中的一个
  }
  type DelegationItem = {
    update_time?: string;//状态变更时间 不管

    id?: number;//编号
    name?: string;//名称
    contractId?: number;//合同id*
    creatorId?: number;//发起者编号
    launchTime?: string;//发起时间*
    marketDeptStaffId?: number;//分配的市场部人员id
    marketRemark?: string;//市场部人员处理意见*
    offerId?: string;//报价单ID
    offerRemark?: string;//用户报价单意见*
    reportId?: number;//测试报告id
    sampleId?: number;//样品id
    solutionId?: number;//测试方案id
    state?: string;//状态*
    table14Id?: string;//软件文档评审表ID
    table2Id?: string;//软件项目委托测试申请表ID
    table3Id?: string;//委托测试软件功能列表ID
    testingDeptStaffId?: number;//分配的测试部人员id
    testingRemark?: string;//测试部人员处理意见*
    url?: string;//文档材料url

    asc?: string;//是否升序, true 升序, false 降序
    orderField?: string;//排序字段
  }
  type DelegationList = {
    data?: DelegationItem[],
    /** 列表的内容总数 */
    total?: number;
    success?: boolean;
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

  interface IPageParams {
    pageNo?: number;
    current?: number;
    pageSize?: number;
  }

  type PageParams = Pick<IPageParams, "pageNo" | "current"> & DelegationItem;
  /*type PageParams = {
    [key: string]: number;
    //pageNo?: number;
    pageSize?: number;
  };*/
  type DelegationProcessItem = {
    delegationId: number,
    fromState: number, //原状态
    toState: number,   //现状态
    id: number,
    remark: string,
    operatorId: number,
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
  }
}

export class SolutionItem {
}
