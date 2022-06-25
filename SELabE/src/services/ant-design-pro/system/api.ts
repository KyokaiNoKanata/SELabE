import request from "umi-request";
import type API from "@/services/ant-design-pro/typings"
import type { RcFile } from "antd/lib/upload";

export async function menuList(
  params?: {
    total: number;
    pageSize: number;
    current: number;
  },
  options?: any,
) {
  return request<API.MenuData>('/admin-api/system/front/menu/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      pageNo: params?.current,
    },
    ...(options || {}),
  });
}

export async function allMenus(
  options?: Record<string, any>,
  params?: any
) {
  return request<{
    data: API.MenuDataItem[]
  }>('/admin-api/system/front/menu/list-all-simple', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addMenuItem(data?: API.MenuDataItem, options?: Record<string, any>) {
  return request<API.Response>('/admin-api/system/front/menu/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateMenuItem(data?: API.MenuDataItem, options?: Record<string, any>) {
  return request<API.Response>('/admin-api/system/front/menu/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteMenuItem(id: number, options?: Record<string, any>) {
  return request<API.Response>('/admin-api/system/front/menu/delete', {
    method: 'DELETE',
    params:{
      id: id,
    },
    ...(options || {}),
  });
}

export async function roleList(
  params?: {
    total: number;
    pageSize: number;
    current: number;
  },
  options?: any,
) {
  return request<API.RoleData>('/admin-api/system/front/role/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      pageNo: params?.current,
    },
    ...(options || {}),
  });
}

export async function allRoles(
  options?: Record<string, any>,
  params?: any
) {
  return request<{
    data: API.RoleDataItem[]
  }>('/admin-api/system/front/role/list-all-simple', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addRoleItem(data?: API.RoleDataItem, options?: API.RoleDataItem) {
  return request<API.Response>('/admin-api/system/front/role/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateRoleItem(data?: API.RoleDataItem, options?: API.RoleDataItem) {
  return request<API.Response>('/admin-api/system/front/role/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteRoleItem(id: number, options?: any) {
  return request<API.Response>('/admin-api/system/front/role/delete', {
    method: 'DELETE',
    params:{
      id: id,
    },
    ...(options || {}),
  });
}

export async function getMenuByRole(
  roleId?: number,
  options?: Record<string, any>,
) {
  return request<{
    code?: number;
    data?: number[];
    msg?: string;
  }>('/admin-api/system/front/permission/list-role-resources', {
    method: 'GET',
    params: {
      roleId: roleId,
    },
    ...(options || {}),
  });
}

export async function assignMenuToRole(
  roleId?: number,
  menuIds?: number[],
  options?: Record<string, any>,
) {
  return request<API.Response>('/admin-api/system/front/permission/assign-role-menu', {
    method: 'POST',
    data: {
      roleId: roleId,
      menuIds: menuIds,
    },
    ...(options || {}),
  });
}

export async function allUsers(
  options?: Record<string, any>,
  params?: any
) {
  return request<{
    data: API.UserDataItem[]
  }>('/admin-api/system/front/user/list-all-simple', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function userList(
  params?: {
    total: number;
    pageSize: number;
    current: number;
  },
  options?: any,
) {
  return request<API.UserData>('/admin-api/system/front/user/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      pageNo: params?.current,
    },
    ...(options || {}),
  });
}

export async function updateUserItem(data?: API.UserDataItem, options?: any) {
  return request<API.Response>('/admin-api/system/front/user/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function getRoleByUser(
  userId?: number,
  options?: Record<string, any>,
) {
  return request<{
    code?: number;
    data?: number[];
    msg?: string;
  }>('/admin-api/system/front/permission/list-user-roles', {
    method: 'GET',
    params: {
      userId: userId,
    },
    ...(options || {}),
  });
}

export async function assignRoleToUser(
  userId?: number,
  roleIds?: number[],
  options?: any
) {
  return request<API.Response>('/admin-api/system/front/permission/assign-user-role', {
    method: 'POST',
    data: {
      userId: userId,
      roleIds: roleIds,
    },
    ...(options || {}),
  });
}

export async function updateUserInfo(data: API.UserDataItem, options?: any) {
  return request<API.UserDataItem>("/admin-api/system/front/user/profile/update", {
    method: 'PUT',
    data: {
      nickname: data.nickname,
      email: data.email
    },
    ...(options || {}),
  });
}

export async function companyList(
  params?: {
    total: number;
    pageSize: number;
    current: number;
  },
  options?: any,
) {
  return request<API.CompanyData>('/admin-api/system/company/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      pageNo: params?.current,
    },
    ...(options || {}),
  });
}

export async function allCompanies(
  options?: Record<string, any>,
  params?: any
) {
  return request<{
    data: API.CompanyDataItem[]
  }>('/admin-api/system/company/list-all-simple', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function addCompanyItem(data?: API.CompanyDataItem, options?: any) {
  return request<API.Response>('/admin-api/system/company/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateCompanyItem(data?: API.CompanyDataItem, options?: any) {
  return request<API.Response>('/admin-api/system/company/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteCompanyItem(id: number, options?: Record<string, any>) {
  return request<API.Response>('/admin-api/system/company/delete', {
    method: 'DELETE',
    params:{
      id: id,
    },
    ...(options || {}),
  });
}

export async function authList(
  params?: {
    total: number;
    pageSize: number;
    current: number;
  },
  options?: any,
) {
  return request<API.CompanyData>('/admin-api/system/user-company/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      pageNo: params?.current,
    },
    ...(options || {}),
  });
}

export async function addAuthItem(data?: API.AuthDataItem, options?: any) {
  return request<API.Response>('/admin-api/system/user-company/create', {
    method: 'POST',
    data,
    ...(options || {}),
  });
}

export async function updateAuthItem(data?: API.CompanyDataItem, options?: any) {
  return request<API.Response>('/admin-api/system/user-company/update', {
    method: 'PUT',
    data,
    ...(options || {}),
  });
}

export async function deleteAuthItem(id: number, options?: Record<string, any>) {
  return request<API.Response>('/admin-api/system/user-company/delete', {
    method: 'DELETE',
    params:{
      id: id,
    },
    ...(options || {}),
  });
}

export async function uploadAvatar(img: RcFile, options?: any) {
  const formData = new FormData();
  formData.append('avatarFile', img);
  return request<API.Response>('/admin-api/system/front/user/profile/update-avatar', {
    method: 'PUT',
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}

export async function getCompany(options?: any) {
  return request<any>('/admin-api/system/user-company/get-company', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function addAuth(code?: number, userId?: number, options?: any) {
  return request<API.Response>('/admin-api/system/user-company/auth', {
    method: 'POST',
    data:{
      code: code,
      userId: userId
      //userId:
    },
    ...(options || {}),
  });
}
