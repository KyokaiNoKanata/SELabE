import request from 'umi-request';
import type {API} from '@/services/ant-design-pro/typings';

/**
 * 获取测试方案分页
 */
export async function solutionPage(
  params: {
    pageNo?: number;
    pageSize?: number;
  },
  options?: Record<string, any>,
) {
  //console.log("request")

  return request<{
    code: number;
    data: {
      list: API.SolutionItem[];
      total: number;
    };
    msg: string;
  }>('/admin-api/system/solution/page', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/**
 * 创建测试方案
 * @param delegationId: 委托编号
 * @return resp.data = solutionId
 */
///admin-api/system/solution/create
export async function createSolution(delegationId: number) {
  return request<API.Response>('/admin-api/system/solution/create', {
    method: 'POST',
    data: {
      delegationId: delegationId,
    },
  });
}


export async function saveSolution(body: { solutionId: number; data: object }) {
  return request<API.Response>('/admin-api/system/solution/save/table6', {
    method: 'PUT',
    data: {
      solutionId: body.solutionId,
      data: body.data,
    },
  });
}

/**
 * 获得测试方案
 * GET /admin-api/system/solution/get
 */
export async function getSolution(params: { id: number }) {
  return request<API.Response>('/admin-api/system/solution/get', {
    method: 'GET',
    params: params,
  });
}

/**
 * 获得测试方案表格
 * GET /admin-api/system/solution/get/table6
 * id
 */
export async function getSolutionTable(params: { id: string }) {
  return request<API.Response>('/admin-api/system/solution/get/table6', {
    method: 'GET',
    params: params,
  });
}

/**
 * 提交测试方案
 */
export async function submitSolution(solutionId: number) {
  return request<API.Response>('/admin-api/system/solution/submit/table6', {
    method: 'PUT',
    data: {
      solutionId: solutionId,
    },
  });
}
