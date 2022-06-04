import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormRadio, ProFormText, ProFormTextArea} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type {FormValueType} from './components/UpdateForm';
import UpdateForm from './components/UpdateForm';
import {addRule, removeRule, updateRule} from './service';
import type {API} from "@/services/ant-design-pro/typings";
import {menuList, addMenuItem, deleteMenuItem} from "@/services/ant-design-pro/system/api";
// import
/**
 * 添加节点
 *
 * @param fields
 */

const handleAdd = async (fields: API.MenuDataItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addMenuItem({ ...fields });
    console.log(res);
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
 * @param fields
 */

const handleUpdate = async (fields: FormValueType, currentRow?: API.MenuDataItem) => {
  const hide = message.loading('正在配置');

  try {
    await updateRule({
      ...currentRow,
      ...fields,
    });
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};
/**
 * 删除节点
 *
 * @param selectedRows
 */

const handleRemove = async (selectedRows: API.MenuDataItem[]) => {
  const hide = message.loading('正在配置');
  console.log(selectedRows);
  try {
    await deleteMenuItem(selectedRows[0].id);
    hide();
    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

const MenuList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.MenuDataItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.MenuDataItem[]>([]);
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
      valueType: 'textarea',
    },
    {
      title: '在菜单中显示',
      dataIndex: 'hideInMenu',
      hideInForm: false,
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
      hideInForm: false,
      valueEnum: {
        0: {
          text: '默认',
          status: 'Success',
        },
        1: {
          text: '开发中',
          status: 'Processing',
        },
        2: {
          text: '已上线',
          status: 'Success',
        }
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => [
        <a
          key="config"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(record);
          }}
        >
          编辑
        </a>,
      ],
    },
  ];

  const request = async (
    params: any,
  ) => {
    const res = (await menuList(params).then((result) => {
      //console.log(result.data);
      return result;
    }));
    return {
      data: res.data,
      result: true,
    }
  };

  return (
    <PageContainer>
      <ProTable<API.MenuDataItem>
        onLoad={request}
        headerTitle="所有菜单"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> 新建
          </Button>,
        ]}
        request={request}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
        </FooterToolbar>
      )}
      <ModalForm
        title="新建菜单"
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value) => {
          const success = await handleAdd(value as API.MenuDataItem);
          if (success) {
            handleModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
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
              label: '默认',
            },
            {
              value: '1',
              label: '开发中',
            },
            {
              value: '2',
              label: '已上线',
            }
          ]}
        />
      </ModalForm>
      <UpdateForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value, currentRow);

          if (success) {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);

            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          handleUpdateModalVisible(false);
          setCurrentRow(undefined);
        }}
        updateModalVisible={updateModalVisible}
        values={currentRow || {}}
      />

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
            request={request}
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
