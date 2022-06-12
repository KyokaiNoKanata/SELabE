import request from "umi-request";
import type API from "@/services/ant-design-pro/typings";

/**
 * 根据委托id创建对应的样品
 * @param body.delegationId:委托id
 */
export async function createSample(
  body: {
    delegationId: number,
  },
) {
  return request<API.Response>('/admin-api/system/sample/create', {
    method: 'POST',
    data: body,
  });
}

/**
 * 客户更新样品
 * @param body 样品内容
 */
export async function updateSample(
  body: {
    id: number,//样品编号
    information?: string;
    processType?: string;
    type?: string;
    url?: string;
  },
) {
  return request<API.Response>('/admin-api/system/sample/update', {
    method: 'PUT',
    data: body,
  });
}

/**
 * 客户提交样品
 * @param body.id:样品编号
 */
export async function submitSample(
  body: {
    id: number,//样品编号
  },
) {
  return request<API.Response>('/admin-api/system/sample/submit', {
    method: 'PUT',
    data: body,
  });
}

/**
 * 通过id获得样品
 * @param sampleId：样品id
 */
export async function getSampleById(
  sampleId: number
) {
  return request<API.Response>('/admin-api/system/sample/get', {
    method: 'GET',
    params: {
      id: sampleId,
    },
  });
}

/**
 * 审核样品通过
 * @param body.sampleId: 样品编号
 * @param body.remark: 审核意见
 */
export async function auditSampleSuccess(body: {
                                           sampleId: number,
                                           remark: string,
                                         }
) {
  return request<API.Response>('/admin-api/system/sample/audit/success', {
    method: 'PUT',
    data: {
      id: body.sampleId,
      remark: body.remark,
    }
  });
}

/**
 * 审核样品不通过
 * @param body.sampleId: 样品编号
 * @param body.remark: 审核意见
 */
export async function auditSampleFail(body: {
                                        sampleId: number;
                                        remark: string;
                                      }
) {
  return request<API.Response>('/admin-api/system/sample/audit/fail', {
    method: 'PUT',
    data: {
      id: body.sampleId,
      remark: body.remark,
    }
  });
}
