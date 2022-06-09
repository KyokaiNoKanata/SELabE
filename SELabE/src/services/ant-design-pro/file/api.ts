import request from "umi-request";
import type API from "@/services/ant-design-pro/typings";
import {message} from "antd";

/**
 * 上传文件
 * @param path 路径
 * @param file 文件
 * @return 返回值为文件路径
 */
export async function uploadFile(path: string, file: any) {
  return request<API.Response>('/admin-api/infra/file/upload', {
    method: 'POST',
    params: {
      path: path,
    },
    data: file,
  })
}
//pdf
/**
 *
 * @param tableId 表格在mongodb中的编号
 * @param tableName 表格名，例如”table10"，标价单则为offer
 * @return 返回的data 是生成的pdf对应的url
 */
export async function exportPDF(tableId: string,tableName: string) {
  return request<API.Response>('/admin-api/system/delegation/export-pdf', {
    method: 'GET',
    params: {
      tableId: tableId,
      tableName: tableName,
    },
  })
}

/**
 * 通过委托编号导出pdf
 * @param delegationId 委托编号
 * @param tableName 表格名称，例如table2
 */
export async function exportPDFByDelegation(delegationId: number, tableName: string) {
  return request<API.Response>('/admin-api/system/delegation/export-pdf-by-delegation', {
    method: 'GET',
    params: {
      delegationId: delegationId,
      tableName: tableName,
    },
  })
}

export async function downloadPDF(tableId: string,tableName: string) {
  const resp = await exportPDF(tableId,tableName);
  if (resp.code== 0) {
    const url = resp.data;
    const a = document.createElement("a");
    a.href = url;
    a.click();
  } else {
    message.error(resp.msg);
  }
}
export async function downloadPDFByDelegation(delegationId: number,tableName: string) {
  const resp = await exportPDFByDelegation(delegationId,tableName);
  if (resp.code== 0) {
    const url = resp.data;
    const a = document.createElement("a");
    a.href = url;
    a.click();
  } else {
    message.error(resp.msg);
  }
}
