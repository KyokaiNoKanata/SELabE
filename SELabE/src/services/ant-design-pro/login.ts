// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import type API from "../ant-design-pro/typings"

export async function getFakeCaptcha(
  mobile?: number,
  scene?: number,
  options?: { [key: string]: any },
) {
  return request<API.Response>('/admin-api/system/send-sms-code', {
    method: 'POST',
    data: {
      mobile: mobile,
      scene: scene
    },
    ...(options || {}),
  });
}
