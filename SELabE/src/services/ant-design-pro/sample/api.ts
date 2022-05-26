import request from "umi-request";
import type {API} from "@/services/ant-design-pro/typings";

//通过委托id创建样品
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

//客户 更新样品
//admin-api/system/sample/update
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

//客户 提交样品
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

//通过样品 id 获得样品
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

//市场部/测试部 审核样品通过/不通过
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
