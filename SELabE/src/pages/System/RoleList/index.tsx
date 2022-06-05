import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {useRef, useState} from 'react';
import {FooterToolbar, PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormRadio, ProFormText} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import UpdateForm from './components/UpdateForm';
import CreateForm from "./components/CreateForm";
import {addRule, removeRule, updateRule} from './service';
import type {API} from "@/services/ant-design-pro/typings";
import {menuList, addMenuItem, deleteMenuItem, roleList} from "@/services/ant-design-pro/system/api";
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

const handleUpdate = async (fields: API.MenuDataItem, currentRow?: API.MenuDataItem) => {
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

const RoleList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */

  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RoleDataItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RoleDataItem[]>([]);
  /** 国际化配置 */

  const columns: ProColumns<API.RoleDataItem>[] = [
    {
      title: '角色ID',
      dataIndex: 'id',
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
      title: '角色名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, role) => [
        <a
          key="config"
          onClick={() => {
            setCurrentRow(role);
            console.log(role);
            handleUpdateModalVisible(true);
          }}
        >
          编辑
        </a>,
        <a
          key="view"
          onClick={() => {
            handleUpdateModalVisible(true);
            setCurrentRow(role);
          }}
        >
          查看
        </a>,
      ],
    },
  ];

  const request = async (
    params: any,
  ) => {
    const res = (await roleList(params).then((result) => {
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
      <ProTable<API.RoleDataItem>
        onLoad={request}
        headerTitle="所有角色"
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
      <CreateForm
        modalVisible={createModalVisible}
        // onSubmit={async (value) => {
        //   console.log(value);
        // }}
        onCancel={()=>{
          handleModalVisible(false);
        }}>

      </CreateForm>

      <UpdateForm
        onSubmit={async (value) => {
          console.log(value);
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
          <ProDescriptions<API.RoleDataItem>
            column={2}
            title={currentRow?.name}
            request={request}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.RoleDataItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;
