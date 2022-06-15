import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import type {ReactNode} from 'react';
import React, {useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type API from "@/services/ant-design-pro/typings";
import {addMenuItem, deleteMenuItem, menuList, updateMenuItem} from "@/services/ant-design-pro/system/api";
import {ModalForm, ProFormRadio, ProFormText} from "@ant-design/pro-form";
// import
/**
 * 添加节点
 *
 * @param fields
 */

type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

const handleAdd = async (fields: API.MenuDataItem) => {
  const hide = message.loading('正在添加');
  try {
    await addMenuItem({ ...fields });
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
 * 更新节点
 *
 * @param item
 */

const handleUpdate = async (item?: API.MenuDataItem) => {
  const hide = message.loading('正在配置');
  try {
    await updateMenuItem(item);
    hide();
    message.success('修改成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param item
 */

const handleRemove = async (item: API.MenuDataItem) => {
  const hide = message.loading('正在删除');
  try {
    await deleteMenuItem(item.id!);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('失败失败请重试！');
    return false;
  }
};

const MenuList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleCreateModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MenuDataItem>();
  /** 国际化配置 */

  const columns: ProColumns<API.MenuDataItem>[] = [
    {
      title: '菜单名称',
      dataIndex: 'name',
      //tip: '规则名称是唯一的 key',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    {
      title: '路径',
      dataIndex: 'path',
      copyable: true,
      ellipsis: true,
      valueType: 'textarea',
    },
    {
      title: '在菜单中显示',
      dataIndex: 'hideInMenu',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '是',
          status: 'Success',
        },
        1: {
          text: '否',
          status: 'Default',
        },
      }
    },
    {
      title: '状态',
      dataIndex: 'status',
      filters: true,
      onFilter: true,
      valueType: 'select',
      valueEnum: {
        0: {
          text: '已上线',
          status: 'Success',
        },
        1: {
          text: '开发中',
          status: 'Processing',
        },
        2: {
          text: '未规划',
          status: 'Default',
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'edit',
      valueType: 'option',
      render: (text: ReactNode, record: API.MenuDataItem) => [
        <ModalForm
          title="编辑菜单"
          key={"edit" + record.id}
          width="400px"
          onFinish={
            async (values?: API.MenuDataItem)=>{
              console.log(values);
              values!.id = record.id;
              await handleUpdate(values);
              actionRef.current?.reload();
              return true;
          }
          }
          trigger={<a>编辑</a>}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '菜单名称为必填项',
              },
            ]}
            width="md"
            name="name"
            label="菜单名称"
            initialValue={record.name}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '路径为必填项',
              },
            ]}
            width="md"
            name="path"
            label="路径"
            initialValue={record.path}
          />
          <ProFormRadio.Group
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            name="hideInMenu"
            label="在菜单中显示"
            initialValue={record.hideInMenu}
            options={[
              {
                value: 0,
                label: '是',
              },
              {
                value: 1,
                label: '否',
              },
            ]}
          />
          <ProFormRadio.Group
            width="md"
            name="status"
            label="状态"
            initialValue={record.status}
            options={[
              {
                value: 0,
                label: '已上线',
              },
              {
                value: 1,
                label: '开发中',
              },
              {
                value: 2,
                label: '未规划',
              }
            ]}
          />
        </ModalForm>,
        <ModalForm
          key={'delete' + record.id}
          title={"确认删除?"}
          width="400px"
          trigger={<a>删除</a>}
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
          <p>{"菜单名称："}{record.name}</p>
          <p>{"路径："}{record.path}</p>
        </ModalForm>
      ],
    },
  ];


  return (
    <PageContainer>
      <ProTable<API.MenuDataItem, Pagination>
        headerTitle="所有菜单"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: 10,
        }}
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
        request={async (
          params: Pagination
        ) => {
          const res = await menuList(params);
          return {
            data: res.data.list,
            total: res.data.total,
            result: true
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="新建菜单"
        width="400px"
        visible={createModalVisible}
        onFinish={
          async (values: API.MenuDataItem)=>{
            console.log(values);
            await handleAdd(values);
            actionRef.current?.reload();
            return true;
          }
        }
        onVisibleChange={handleCreateModalVisible}
        >
          <ProFormText
            rules={[
              {
                required: true,
                message: '菜单名称为必填项',
              },
            ]}
            width="md"
            name="name"
            label="菜单名称"
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '路径为必填项',
              },
            ]}
            width="md"
            name="path"
            label="路径"
          />
          <ProFormRadio.Group
            rules={[
              {
                required: true,
              },
            ]}
            width="md"
            name="hideInMenu"
            label="在菜单中显示"
            options={[
              {
                value: '0',
                label: '是',
              },
              {
                value: '1',
                label: '否',
              },
            ]}
          />
          <ProFormRadio.Group
            width="md"
            name="status"
            label="状态"
            options={[
              {
                value: '0',
                label: '已上线',
              },
              {
                value: '1',
                label: '开发中',
              },
              {
                value: '2',
                label: '未规划',
              }
            ]}
          />
      </ModalForm>


      <Drawer
        width={600}
        visible={showDetail}
        onClose={() => {
          setCurrentRow(undefined);
          setShowDetail(false);
        }}
        closable={false}
      >
        {currentRow?.name && (
          <ProDescriptions<API.MenuDataItem>
            column={2}
            title={currentRow?.name}
            //request={request}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.MenuDataItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default MenuList;
