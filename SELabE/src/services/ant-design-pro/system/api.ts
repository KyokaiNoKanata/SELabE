import request from "umi-request";
import type API from "@/services/ant-design-pro/typings"

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
  options?: Record<string, any>,
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
