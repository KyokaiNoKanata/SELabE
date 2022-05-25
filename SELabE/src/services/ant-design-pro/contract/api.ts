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
export function submitContractStaff(params: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/submit/staff',{
      method: 'PUT',
      params: {
        id: params.contractId,
      }
    }
  )
}
//客户提交合同
export function submitContractClient(params: {
  contractId?: number,
}) {
  return request<API.Response>('/admin-api/system/contract/submit/client',{
      method: 'PUT',
      params: {
        id: params.contractId,
      }
    }
  )
}
