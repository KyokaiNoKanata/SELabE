import request from "umi-request";
import type API from "@/services/ant-design-pro/typings"

export async function menuList(
  options?: Record<string, any>,
  params?: {
    pageSize?: number;
    current?: number;
  }
) {
  return request<{
    data: API.MenuData
  }>('/admin-api/system/front/menu/page', {
    method: 'GET',
    params: {
      pageSize: params?.pageSize,
      current: params?.current,
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
  options?: Record<string, any>,
) {
  return request<{
    data: API.RoleData;
  }>('/admin-api/system/front/role/list-all-simple', {
    method: 'GET',
    params: {},
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

export async function userList(
  options?: Record<string, any>,
) {
  return request<{
    data: API.UserData;
  }>('/admin-api/system/front/user/list-all-simple', {
    method: 'GET',
    params: {},
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
  options?: Record<string, any>,
) {
  return request<API.Response>('/admin-api/system/front/permission/assign-role-menu', {
    method: 'POST',
    data: {
      userId: userId,
      roleIds: roleIds,
    },
    ...(options || {}),
  });
}
