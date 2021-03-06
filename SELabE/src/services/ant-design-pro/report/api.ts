// 软件测试问题清单 table11
import request from "umi-request";
import type API from "@/services/ant-design-pro/typings";

/**
 * 测试报告的创建
 * @param body.delegationId 通过委托id创建管理的report
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

/**
 * 获得测试报告
 * @param params.reportId: 报告编号
 */
export async function getReport(params: { reportId: number }) {
  return request<API.Response>('/admin-api/system/report/get', {
    method: 'GET',
    params: {
      id: params.reportId,
    },
  });
}

/**
 * 提交测试报告
 * @param body.reportId:报告编号
 */
export async function submitReport(body: { reportId: number }) {
  return request<API.Response>('/admin-api/system/report/submit', {
    method: 'PUT',
    data: {
      id: body.reportId,
    },
  });
}

/**
 * 获得table11
 * @param params.id:表格编号
 */
export function getTable11(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table11', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存table11
 * @param body.reportId: 表格编号
 * @param body.data: json对象
 */
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
/**
 * 获得table9
 * @param params.id：表格编号
 */
export function getTable9(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table9', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存table9
 * @param body.reportId: 表格编号
 * @param body.data: json对象
 */
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
/**
 * 获得测试用例表单table8
 * @param params.id: 表格编号
 */
export function getTable8(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table8', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存测试用例表单table8
 * @param body.reportId: 表格编号
 * @param body.data: json数据
 */
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

//测试报告 table7
/**
 * 获得测试报告table7
 * @param params.id: 表格编号
 */
export function getTable7(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table7', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存测试报告table7
 * @param body.id:表格编号
 * @param body.data: json对象
 */
export function saveTable7(body: {
  reportId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/report/save/table7', {
      method: 'PUT',
      data: body,
    }
  )
}

/**
 * 获得测试报告检查表table10
 * @param params id:表格编号
 */
export function getTable10(params: {
  id: number //表格编号
}) {
  return request<API.Response>('/admin-api/system/report/get/table10', {
      method: 'GET',
      params: params,
    }
  )
}

/**
 * 保存测试报告检查表table10
 * @param body.reportId: 表格编号
 * @param body.data: json数据
 */
export function saveTable10(body: {
  reportId: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/report/save/table10', {
      method: 'PUT',
      data: body,
    }
  )
}

/**
 * 审核不通过：分测试部主管，用户，签字人
 * @params: person = {manager,client,signatory}中的一个
 */
export function rejectReport(params: { person: string, reportId: number, remark: string }) {
  const url = '/admin-api/system/report/reject/' + params.person;
  return request<API.Response>(url, {
      method: 'PUT',
      data: {
        id: params.reportId,
        remark: params.remark,
      },
    }
  )
}

/**
 * 审核通过：分测试部主管，用户，签字人
 * @params: person = {manager,client,signatory}中的一个
 */
export function acceptReport(params: { person: string, reportId: number, remark: string }) {
  const url = '/admin-api/system/report/accept/' + params.person;
  return request<API.Response>(url, {
      method: 'PUT',
      data: {
        id: params.reportId,
        remark: params.remark,
      },
    }
  )
}

/**
 * 测试部归档
 */
export function archiveReport(body: {
  reportId: number,
}) {
  return request<API.Response>('/admin-api/system/report/archive', {
      method: 'PUT',
      data: {
        id: body.reportId,
      },
    }
  )
}

/**
 * 市场部发送报告
 * @param body.reportId: 报告编号
 */
export function sendReport(body: {
  reportId: number,
}) {
  return request<API.Response>('/admin-api/system/report/send', {
      method: 'PUT',
      data: {
        id: body.reportId,
      },
    }
  )
}

/**
 * 客户 确认接收测试报告
 * @param: body.reportId: 报告编号
 */
export function receiveReport(body: {
  reportId: number,
}) {
  return request<API.Response>('/admin-api/system/report/receive', {
      method: 'PUT',
      data: {
        id: body.reportId,
      },
    }
  )
}
