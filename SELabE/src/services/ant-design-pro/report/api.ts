// 软件测试问题清单 table11
import request from "umi-request";
import type {API} from "@/services/ant-design-pro/typings";

/**
 * 测试报告的创建，获得，提交
 * @param delegationId 通过委托id创建管理的report
 * @return data = reportId
 */
export async function createReport(body: { delegationId: number }) {
  return request<API.Response>('/admin-api/system/report/create', {
    method: 'POST',
    data: {
      delegationId: body.delegationId,
    },
  });
}

export async function getReport(params: { reportId: number }) {
  return request<API.Response>('/admin-api/system/report/get', {
    method: 'GET',
    params: {
      id: params.reportId,
    },
  });
}

export async function submitReport(body: { reportId: number }) {
  return request<API.Response>('/admin-api/system/report/submit', {
    method: 'PUT',
    data: {
      id: body.reportId,
    },
  });
}


export function getTable11(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table11', {
      method: 'GET',
      params: params,
    }
  )
}

export function saveTable11(body: {
  reportId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/report/save/table11', {
      method: 'PUT',
      data: body,
    }
  )
}

//软件测试记录 table9
export function getTable9(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table9', {
      method: 'GET',
      params: params,
    }
  )
}

export function saveTable9(body: {
  reportId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/report/save/table9', {
      method: 'PUT',
      data: body,
    }
  )
}

//测试用例 table8
export function getTable8(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table8', {
      method: 'GET',
      params: params,
    }
  )
}

export function saveTable8(body: {
  reportId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/report/save/table8', {
      method: 'PUT',
      data: body,
    }
  )
}
