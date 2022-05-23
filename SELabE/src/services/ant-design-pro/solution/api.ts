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
