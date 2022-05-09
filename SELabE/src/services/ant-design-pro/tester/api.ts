import request from "umi-request";
import {DelegationList} from "@/services/ant-design-pro/typings";
import idID from "@/locales/id-ID";
import {isNumber} from "lodash";

/** 获取委托列表 GET /admin-api/system/delegation/page */
export async function delegationPage(
  params: {
    pageNo: number;
    pageSize: number;
  },
  options?: { [key: string]: any },
) {
  return request<{
    code: number,
    data: {
      list: API.DelegationItem[],
      total: number,
    }
    msg: string
  }>('/admin-api/system/delegation/page', {
    method: 'GET',
    params: {
      pageNo:params.pageNo,
      pageSize:params.pageSize,
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
  }>('/admin-api/system/delegation/delete',{
    method: 'DELETE',
    params: {
      id:params.id,
    }
  });
}



/** 接收任务 POST /api/receiveDelegation */
export async function receiveDelegation(params: {
    workId: number,
    delegationId: number,
  },options?: { [key: string]: any }
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
  delegationId: number, }, options?: { [key: string]: any }
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
  delegationId: number, }, options?: { [key: string]: any }
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
  delegationId: number, }, options?: { [key: string]: any }
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
  let url = '/api/distribute';
  return request(url,{
    method: 'POST',
    params: {
      ...params
    }
  });
}



