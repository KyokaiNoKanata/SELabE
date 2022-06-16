import {Button, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {ReactNode} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormRadio, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import type API from "@/services/ant-design-pro/typings";
import {
  assignRoleToUser,
  userList,
  updateUserItem,
  getRoleByUser,
  allRoles,
} from "@/services/ant-design-pro/system/api";

type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

const handleUpdate = async (currentRow?: API.UserDataItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateUserItem(currentRow);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
}

/**
 * 更新用户角色配置
 *
 * @param currentRow
 */

const handleRoleUpdate = async (currentRow?: API.UserDataItem) => {
  const hide = message.loading('正在配置');
  console.log(currentRow);
  try {
    await assignRoleToUser(currentRow?.id, currentRow?.roleIds);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const RoleList: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const [, setCurrentRow] = useState<API.UserDataItem>();
  /** 国际化配置 */

  const columns: ProColumns<API.UserDataItem>[] = [
    {
      title: '用户ID',
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              //setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '用户名',
      dataIndex: 'username',
      valueType: 'textarea'
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      valueType: 'textarea',
    },
    {
      title: '上次登陆IP',
      dataIndex: 'loginIP',
      valueType: 'textarea',
    },

    {
      title: '操作',
      dataIndex: 'edit',
      valueType: 'option',
      render: (text: ReactNode, record: API.UserDataItem) => [
        <ModalForm
          title="编辑用户信息"
          key={"edit" + record.id}
          width="400px"
          onFinish={
            async (values?: API.UserDataItem) => {
              values!.id = record.id;
              await handleUpdate(values);
              actionRef.current?.reload();
              return true;
            }
          }
          trigger={<a>编辑</a>}
        >
          <ProFormText
            name="id"
            label="用户ID"
            width="md"
            disabled
            initialValue={record.id}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '用户名为必填项',
              },
            ]}
            width="md"
            name="username"
            label="用户名"
            initialValue={record.username}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '用户昵称为必填项',
              },
            ]}
            width="md"
            name="nickname"
            label="用户昵称"
            initialValue={record.nickname}
          />
          <ProFormText
            width="md"
            name="remark"
            label="备注（选填）"
            initialValue={record.remark}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '邮箱为必填项',
              }
            ]}
            width="md"
            name="email"
            label="邮箱"
            initialValue={record.email}
          />
          <ProFormRadio.Group
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            name="sex"
            label="性别"
            options={[
              {
                value: 1,
                label: '男',
              },
              {
                value: 0,
                label: '女',
              },
            ]}
            initialValue={record.sex}
          />
        </ModalForm>,
        <ModalForm
          key={'deploy' + record.id}
          title={"分配角色"}
          trigger={<Button type={"primary"}>配置</Button>}
          onFinish={async (values?: API.UserDataItem) => {
            values!.id = record.id;
            await handleRoleUpdate(values);
            actionRef.current?.reload();
            return true;
          }}
          request={
            async () => {
              return await getRoleByUser(record.id).then((res: { code?: number; data?: number[]; msg?: string }) => {
                console.log(res);
                return {
                  roleIds: res.data
                };
              });
            }}
          submitter={
            {
              searchConfig: {
                submitText: '确认',
                resetText: '取消',
              }}}
        >
          <ProFormSelect
            mode={"multiple"}
            name="roleIds"
            request={
              async () => {
                return await allRoles().then(res => {
                  return res.data?.map(item => {
                    return {
                      value: item.id,
                      label: item.name,
                    };
                  });
                })
              }
            }
          />
        </ModalForm>

      ]
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.UserDataItem, Pagination>
        pagination={{
          pageSize: 10,
        }}
        headerTitle="所有用户"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={
          async (
            params: Pagination
          ) => {
            const res = await userList(params);
            return {
              data: res.data.list,
              total: res.data.total,
              result: true
            };
          }}
        columns={columns}
      />

    </PageContainer>
  );
};

export default RoleList;
