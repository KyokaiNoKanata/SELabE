import request from "umi-request";
import {API} from "@/services/ant-design-pro/typings";

export function createContract(body: {
  delegationId: number
}) {
  return request<API.Response>('/admin-api/system/contract/create',{
      method: 'POST',
      data: body,
    }
  )
}
//根据合同id获得合同
export function getContractById(params: {
  id: number
}) {
  return request<API.Response>('/admin-api/system/contract/get',{
      method: 'GET',
      params: params,
    }
  )
}
//根据表格id获得合同表table4
export function getTable4(params: {
  id: number
}) {
  return request<API.Response>('/admin-api/system/contract/get/table4',{
      method: 'GET',
      params: params,
    }
  )
}
//保存合同表 table4
export function saveTable4(body: {
  contractId?: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/contract/save/table4',{
      method: 'PUT',
      data: body,
    }
  )
}

/**
 * 保密协议(table5)的保存与获取
 */
//根据表格id获得合同表table5
export function getTable5(params: {
  id: number
}) {
  return request<API.Response>('/admin-api/system/contract/get/table5',{
      method: 'GET',
      params: params,
    }
  )
}
//保存合同表 table5
export function saveTable5(body: {
  contractId?: number,
  data: object,
}) {
  return request<API.Response>('/admin-api/system/contract/save/table5',{
      method: 'PUT',
      data: body,
    }
  )
}

//市场部提交合同
export function submitContractStaff(body: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/submit/staff',{
      method: 'PUT',
      data: {
        id: body.contractId,
      }
    }
  )
}
//客户提交合同
export function submitContractClient(body: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/submit/client',{
      method: 'PUT',
      data: {
        id: body.contractId,
      }
    }
  )
}
//客户通过/不通过合同草稿
export function acceptContractClient(body: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/accept/client',{
      method: 'PUT',
      data: {
        id: body.contractId,
      }
    }
  )
}
export function rejectContractClient(body: {
  contractId?: number,
  reason?: string,
}) {
  return request<API.Response>('/admin-api/system/contract/reject/client',{
      method: 'PUT',
      data: {
        id: body.contractId,
        reason: body.reason,
      }
    }
  )
}
//市场部通过/不通过合同
export function acceptContractStaff(body: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/accept/staff',{
      method: 'PUT',
      data: {
        id: body.contractId,
      }
    }
  )
}
export function rejectContractStaff(body: {
  contractId?: number,
  reason?: string,
}) {
  return request<API.Response>('/admin-api/system/contract/reject/staff',{
      method: 'PUT',
      data: {
        id: body.contractId,
        reason: body.reason,
      }
    }
  )
}
//上传合同材料的url
export function uploadContractFile(body: {
  contractId?: number,
  url?: string,
}) {
  return request<API.Response>('/admin-api/system/contract/upload/doc',{
      method: 'PUT',
      data: {
        id: body.contractId,
        url: body.url,
      }
    }
  )
}
