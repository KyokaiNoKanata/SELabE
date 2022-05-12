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
  return request<API.Response>('/api/admin-api/system/delegation/delete',{
    method: 'DELETE',
    params: {
      id:params.id,
    }
  });
}

/**
 * 修改委托(id name,url) put
 */
export async function updateDelegation(data: {
  id: number,
  name: string,
  url: string,
}) {
  return request<API.Response>('/api/admin-api/system/delegation/update',{
    method: 'PUT',
    data: data,
  });
}
/** 新增委托 ok*/
export async function createDelegation(data: {
  name: string,
}) {
  return request<API.Response>('/api/admin-api/system/delegation/create', {
    method: 'POST',
    data: data
  })
}


/**
 * 市场部主管分发委托
 */
export async function distributeDelegationMarketing(data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) {
  return request<API.Response>('/api/admin-api/system/delegation/distribute/marketing',{
    method: 'PUT',
    data: data,
  });
}

/**
 * 测试部主管分发委托
 */
export async function distributeDelegationTesting(data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) {
  return request<API.Response>('/api/admin-api/system/delegation/distribute/testing',{
    method: 'PUT',
    data: data,
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
  return request<API.Response>('/api/admin-api/system/delegation/get/table14',{
    method: 'GET',
    params: params,
  });
}

/**
 * 用户填表完成，提交委托
 */
export async function submitDelegation(data: {
  id: number,
}) {
  return request<API.Response>('/api/admin-api/system/delegation/submit',{
    method: 'PUT',
    data:data,
  });
}
/**
 * （市场部）审批
 */
//不通过/admin-api/system/delegation/audit/fail/marketing
export async function marketingAuditFail(data: {
  id: number;//委托编号
  remark: string;//建议
}) {
  return request<API.Response>('/api/admin-api/system/delegation/audit/fail/marketing',{
    method: 'PUT',
    data:data
  });
}
//通过/admin-api/system/delegation/audit/success/marketing
export async function marketingAuditSuccess(data: {
  id: number;//委托编号
  remark: string;//建议
}) {
  return request<API.Response>('/api/admin-api/system/delegation/audit/success/marketing',{
    method: 'PUT',
    data: data,
  });
}

/**
 * 获取所有市场部人员的id和姓名
 */
//getSimpleUserMarketing
export async function getSimpleUserByRole(params: {
  roleCode: string
}) {
  return request<{
    code: number,
    data: {
      id: string,
      nickname: string,
    }[],
    msg: string,
  }>('/api/admin-api/system/permission/list-role-simple-users',{
    method: 'POST',
    params: params
  })
}
