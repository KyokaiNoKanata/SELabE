import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import React, {ReactNode, useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormDigit, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type API from "@/services/ant-design-pro/typings";
import {
  addRoleItem,
  allMenus,
  assignMenuToRole,
  deleteRoleItem,
  getMenuByRole,
  roleList,
  updateRoleItem,
} from "@/services/ant-design-pro/system/api";
// import
/**
 * 添加角色
 *
 * @param fields
 */
type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

const handleAdd = async (fields: API.RoleDataItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addRoleItem({ ...fields });
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

const handleUpdate = async (currentRow?: API.RoleDataItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateRoleItem(currentRow);
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
 * 更新角色菜单配置
 *
 * @param currentRow
 */

const handleMenuUpdate = async (currentRow?: API.RoleDataItem) => {
  const hide = message.loading('正在配置');

  try {
    await assignMenuToRole(currentRow?.id, currentRow?.menuIds);
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
 * @param currentRow
 */

const handleRemove = async (currentRow: API.RoleDataItem) => {
  const hide = message.loading('正在删除');
  console.log(currentRow);
  try {
    await deleteRoleItem(currentRow.id!);
    hide();
    message.success('删除成功');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败请重试！');
    return false;
  }
};

const RoleList: React.FC = () => {
  /** 新建窗口的弹窗 */
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  /** 分布更新窗口的弹窗 */
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RoleDataItem>();
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
      title: '角色标识',
      dataIndex: 'code',
      valueType: 'textarea',
    },
    {
      title: '操作',
      dataIndex: 'edit',
      valueType: 'option',
      render: (text: ReactNode, record: API.RoleDataItem) => [
        <ModalForm
          title="编辑角色"
          key={"edit" + record.id}
          width="400px"
          onFinish={
            async (values?: API.RoleDataItem) => {
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
                message: '角色标识为必填项',
              },
            ]}
            width="md"
            name="code"
            label="角色标识"
            initialValue={record.code}
          />
          <ProFormText
            rules={[
              {
                required: true,
                message: '角色名称为必填项',
              },
            ]}
            width="md"
            name="name"
            label="角色名称"
            initialValue={record.name}
          />
          <ProFormText
            width="md"
            name="remark"
            label="说明（选填）"
            initialValue={record.mark}
          />
          <ProFormDigit
            rules={[
              {
                required: true,
                message: '排序权重为必填项',
              },
            ]}
            width="md"
            name="sort"
            label="排序权重"
            initialValue={record.sort}
          />
        </ModalForm>,
        <ModalForm
          key={'delete' + record.id}
          title={"确认删除?"}
          width={"400px"}
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
          <p>{"删除后无法恢复"}</p>
        </ModalForm>,
        <ModalForm
          key={'deploy' + record.id}
          title={"分配菜单"}
          trigger={<Button type={"primary"}>配置</Button>}
          onFinish={async (values?: API.RoleDataItem) => {
              values!.id = record.id;
              await handleMenuUpdate(values);
              actionRef.current?.reload();
              return true;
          }}
          request={
            async () => {
            return await getMenuByRole(record.id).then((res) => {
              return {
                menuIds: res.data
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
            name="menuIds"
            request={
              async () => {
                return await allMenus().then(res => {
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
      <ProTable<API.RoleDataItem, Pagination>
        pagination={{
          pageSize: 10,
        }}
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
        request={
          async (
          params: Pagination
        ) => {
          const res = await roleList(params);
          return {
            data: res.data.list,
            total: res.data.total,
            result: true
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="新建角色"
        width="400px"
        visible={createModalVisible}
        onFinish={
          async (values: API.MenuDataItem)=>{
            await handleAdd(values)
            actionRef.current?.reload();
            return true;
          }
        }
        onVisibleChange={handleModalVisible}>
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色标识为必填项',
            },
          ]}
          width="md"
          name="code"
          label="角色标识"
        />
        <ProFormText
          rules={[
            {
              required: true,
              message: '角色名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="角色名称"
        />
        <ProFormText
          width="md"
          name="remark"
          label="说明（选填）"
        />
        <ProFormDigit
          rules={[
            {
              required: true,
              message: '排序权重为必填项',
            },
          ]}
          width="md"
          name="sort"
          label="排序权重"
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
          <ProDescriptions<API.RoleDataItem>
            column={2}
            title={currentRow?.name}
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
