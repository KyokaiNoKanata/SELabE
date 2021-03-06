// @ts-ignore
/* eslint-disable */
import { request } from 'umi';
import API from "../ant-design-pro/typings"

/**
 * userInfo 获取用户信息
 */
export async function getUserInfo() {
  return request< {
    code: number,
    data: {
      permissions: string[],
      roles: string[],
      user: {
        id: number,
        nickname: string,
        avatar: string,
      }
    }
  }>("/admin-api/system/get-permission-info",{
    method: 'GET',
  })
}

/** 获取当前的用户 GET /api/currentUser */
export async function currentUser(options?: { [key: string]: any }) {
  const info = (await request<{
    data: API.UserDataItem
    code: number
  }>
  ('/admin-api/system/front/user/profile/get',{
    method: 'GET',
    ...(options || {}),
  }).then((res)=>{
    return res.data;
  }));
  const menu = (await request<{
    data: API.MenuDataItem[];
    code: number;
  }>('/admin-api/system/menus', {
    method: 'GET',
    ...(options || {}),
  }).then(res => {return res.data;}));
  return {
    userId: info.id,
    menuData: menu,
    userInfo: info
  } as API.CurrentUser;
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 登录接口 POST /api/login/account */
export async function loginByAccount(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin-api/system/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

export async function loginByMobile(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>('/admin-api/system/sms-login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 新建规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function menuData(options?: { [key: string]: any }) {
  return request<{
    data: API.MenuData;
  }>('/admin-api/system/list-menus', {
    method: 'GET',
    ...(options || {}),
  });
}
