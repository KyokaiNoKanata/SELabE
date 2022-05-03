import request from "umi-request";
import {DelegationList} from "@/services/ant-design-pro/typings";

/** 获取委托列表 GET /api/delegation */
export async function delegation(
  params: {
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.DelegationList>('/api/delegation', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
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
