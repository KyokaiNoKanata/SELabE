import request from 'umi-request';
import type API from '@/services/ant-design-pro/typings';

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
export async function createSolution(delegationId: number) {
  return request<API.Response>('/admin-api/system/solution/create', {
    method: 'POST',
    data: {
      delegationId: delegationId,
    },
  });
}

/**
 * 保存测试方案表格
 * @param body.solutionId：测试方案表格编号
 * @param body.data: json对象
 */
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
 * @param params.id: 测试方案编号
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
 * @param params.id:测试方案表格编号
 */
export async function getSolutionTable(params: { id: string }) {
  return request<API.Response>('/admin-api/system/solution/get/table6', {
    method: 'GET',
    params: params,
  });
}

/**
 * 提交测试方案
 * @param solutionId：测试方案表格编号
 */
export async function submitSolution(solutionId: number) {
  return request<API.Response>('/admin-api/system/solution/submit/table6', {
    method: 'PUT',
    data: {
      solutionId: solutionId,
    },
  });
}

/**
 * 质量部审核测试方案通过
 * @param solutionId：测试方案编号
 */
export async function auditSolutionSuccess(solutionId: number) {
  return request<API.Response>('/admin-api/system/solution/audit/success', {
    method: 'PUT',
    data: {
      solutionId: solutionId
    }
  });
}
/**
 * 质量部审核测试方案不通过
 * @param solutionId 测试方案编号
 */
export async function auditSolutionFail(solutionId: number) {
  return request<API.Response>('/admin-api/system/solution/audit/fail', {
    method: 'PUT',
    data: {
      solutionId: solutionId
    }
  });
}
/**
 * 获得测试方案评审表table13
 * @param params.id: 表格编号
 */
export function getTable13(params: {
  id: number
}) {
  return request<API.Response>('/admin-api/system/solution/get/table13', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存测试方案评审表 table13
 * @param body.solutionId:表格编号
 * @param body.data:json对象
 */
export function saveTable13(body: {
  solutionId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/solution/save/table13', {
      method: 'PUT',
      data: body,
    }
  )
}





