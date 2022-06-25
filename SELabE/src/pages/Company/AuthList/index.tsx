import {Button, message} from 'antd';
import React, {useRef, useState} from 'react';
import type {ReactNode} from "react";
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import type API from "@/services/ant-design-pro/typings";
import {
  authList,
  addAuthItem,
  deleteAuthItem,
  updateAuthItem,
  allUsers,
  allCompanies,
} from "@/services/ant-design-pro/system/api";
import {PlusOutlined} from "@ant-design/icons";
import {forEach} from "lodash";

type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

const handleAdd = async (fields: API.AuthDataItem) => {
  const hide = message.loading('正在添加');
  try {
    await addAuthItem({ ...fields });
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

/**
 * 更新用户公司配置
 *
 * @param currentRow
 */
const handleUpdate = async (currentRow?: API.AuthDataItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateAuthItem(currentRow);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
}


const handleRemove = async (item: API.AuthDataItem) => {
  const hide = message.loading('正在删除');
  try {
    await deleteAuthItem(item.id!);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('失败失败请重试！');
    return false;
  }
};

const getUserData = async () => {
  const result = await allUsers();
  return result.data;
}

const getCompanyData = async () => {
  const result = await allCompanies();
  return result.data;
}

const RoleList: React.FC = () => {
  const userOptions: { label: string | undefined; value: number | undefined; }[] | undefined = [];
  const companyOptions: { label: string | undefined; value: number | undefined; }[] | undefined = [];

  const actionRef = useRef<ActionType>();
  const [, setCurrentRow] = useState<API.AuthDataItem>();
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  /** 国际化配置 */

  const columns: ProColumns<API.AuthDataItem>[] = [
    {
      title: '认证编号',
      dataIndex: 'id',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      valueType: 'textarea'
    },
    {
      title: '公司ID',
      dataIndex: 'companyId',
      valueType: 'textarea',
    },

    {
      title: '操作',
      dataIndex: 'edit',
      valueType: 'option',
      render: (text: ReactNode, record: API.AuthDataItem) => [
        <ModalForm
          title="编辑认证信息"
          key={"edit" + record.id}
          width="400px"
          onFinish={
            async (values?: API.AuthDataItem) => {
              values!.id = record.id;
              await handleUpdate(values);
              actionRef.current?.reload();
              return true;
            }
          }
          trigger={<a>修改</a>}
        >
          <ProFormText
            name="id"
            label="用户ID"
            width="md"
            disabled
            initialValue={record.userId}
          />
        </ModalForm>,
        <ModalForm
          key={'delete' + record.id}
          title={"确认撤销?"}
          width="400px"
          trigger={<a>撤销认证</a>}
          onFinish={async () => {
            const res = await handleRemove(record);
            actionRef.current?.reload();
            return res;
          }}
          submitter={
            {
              searchConfig: {
                submitText: '确认',
                resetText: '取消',
              }
            }
          }
        >
          <p>{"用户ID："}{record.userId}</p>
          <p>{"公司ID："}{record.companyId}</p>
        </ModalForm>
      ]
    }
  ];

  return (
    <PageContainer>
      <ProTable<API.AuthDataItem, Pagination>
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleCreateModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
        }}
        headerTitle="已认证用户"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        request={
          async (
            params: Pagination
          ) => {
            const res = await authList(params);
            return {
              data: res.data.list,
              total: res.data.total,
              result: true
            };
          }}
        columns={columns}
      />
      <ModalForm
        title="添加认证"
        width="400px"
        visible={createModalVisible}
        onFinish={
          async (values: API.AuthDataItem)=>{
            await handleAdd(values);
            actionRef.current?.reload();
            return true;
          }
        }
        onVisibleChange={handleCreateModalVisible}
      >
        <ProFormSelect
          name="userId"
          label="选择用户"
          width="lg"
          request={async () => {
            getUserData().then(res => {
              forEach(res, (item: API.UserDataItem) => {
                userOptions.push({
                  label: item.nickname,
                  value: item.id
                })
              });
            });
            return userOptions;
          }
          }
        />
        <ProFormSelect
          name="companyId"
          label="认证公司"
          width="lg"
          request={async () => {
            getCompanyData().then(res => {
              forEach(res, (item: API.CompanyDataItem) => {
                console.log(item);
                companyOptions.push({
                  label: item.name,
                  value: item.id
                })
              });
            });
            return companyOptions;
          }
          }
        />

      </ModalForm>
    </PageContainer>
  );
};

export default RoleList;
