import request from "umi-request";

/** 获取委托列表 GET /api/admin-api/system/delegation/page */
export async function delegationPage(
  params: {
    pageNo: number;
    pageSize: number;
  },
  options?: Record<string, any>,
) {
  console.log("request")
  return request<{
    code: number,
    data: {
      list: API.DelegationItem[],
      total: number,
    }
    msg: string
  }>('/api/admin-api/system/delegation/page', {
    method: 'GET',
    params: {
      ...params
    },
    ...(options || {}),
  });
}
/**
 * 删除委托
 * @param params id
 */
export async function deleteDelegation(params: {
  id: number,
}) {
  return request<{
    code: number,
    data: boolean,
    msg: string,
  }>('/api/admin-api/system/delegation/delete',{
    method: 'DELETE',
    params: {
      id:params.id,
    }
  });
}

/**
 * 修改委托(id name,url) put
 */
export async function updateDelegation(params: {
  id: number,
  name: string,
  url: string,
}) {
  return request<{
    code: number,
    data: boolean,
    msg: string,
  }>('/api/admin-api/system/delegation/update',{
    method: 'PUT',
    data: {
      id:params.id,
      name: params.name,
      url: params.url,
    }
  });
}
/** 新增委托 ok*/
export async function createDelegation(params: {
  name: string,
}) {
  return request<{
    code: number,
    data: boolean,
    msg: string,
  }>('/api/admin-api/system/delegation/create', {
    method: 'POST',
    data: {
      name: params.name,
    }
  })
}

/** 接收任务 POST /api/receiveDelegation */
export async function receiveDelegation(params: {
                                          workId: number,
                                          delegationId: number,
                                        },options?: Record<string, any>
) {
  return request<API.DelegationItem>('/api/receiveDelegation', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {}),
  });
}
/** 取消接受的任务 */
export async function cancelDelegation(params: {
  workId: number,
  delegationId: number, }, options?: Record<string, any>
) {
  //console.log(params)
  return request<API.DelegationItem>('/api/cancelDelegation', {
    method: 'POST',
    params: {
      ...params
    },
    ...(options || {}),
  });
}
/**上传测试方案*/
export async function uploadScheme(file: FormData, params: {
  workId: number,
  delegationId: number, }, options?: Record<string, any>
) {
  return request<API.DelegationItem>('/api/uploadScheme', {
    method: 'POST',
    params: {
      ...params
    },
    data: file,
    ...(options || {}),
  });
}
/**上传测试结果*/
/**上传文件*/
export async function uploadResult(file: FormData, params: {
  workId: number,
  delegationId: number, }, options?: Record<string, any>
) {
  return request<API.DelegationItem>('/api/uploadResult', {
    method: 'POST',
    params: {
      ...params
    },
    data: file,
    ...(options || {}),
  });
}

/**
 * 分发委托
 */
export async function distributeDelegation(params: {
  testerId: number,
  delegationId: number,
}) {
  //let url = '/api/distribute/' + {delegationId};
  const url = '/api/distribute';
  return request(url,{
    method: 'POST',
    params: {
      ...params
    }
  });
}

/**
 * 获得软件文档评审表
 * GET /admin-api/system/delegation/get/table14
 * id
 */
export async function getTable14(params: {
  id: number,//表格编号
}) {
  return request('/api/admin-api/system/delegation/get/table14',{
    method: 'GET',
    params: params,
  });
}

/**
 * （市场部）审批
 */
//不通过/admin-api/system/delegation/audit/fail/marketing
export async function marketingAuditFail(params: {
  id: number;//委托编号
  remark: string;//建议
}) {
  return request('/api/admin-api/system/delegation/audit/fail/marketing',{
    method: 'PUT',
    params: params,
  });
}
//通过/admin-api/system/delegation/audit/success/marketing
export async function marketingAuditSuccess(params: {
  id: number;//委托编号
  remark: string;//建议
}) {
  return request('/api/admin-api/system/delegation/audit/success/marketing',{
    method: 'PUT',
    params: params,
  });
}

