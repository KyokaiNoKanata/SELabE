import request from "umi-request";
import type {API} from "@/services/ant-design-pro/typings";

//上传文件 /admin-api/infra/file/upload
export async function uploadFile(path: string, file: any) {
  return request<API.Response>('/admin-api/infra/file/upload', {
    method: 'POST',
    params: {
      path: path,
    },
    data: file,
  })
}
