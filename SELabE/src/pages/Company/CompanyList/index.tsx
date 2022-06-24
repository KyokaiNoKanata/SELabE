import {PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message} from 'antd';
import type {ReactNode} from 'react';
import React, { useRef, useState} from 'react';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormText} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import type API from "@/services/ant-design-pro/typings";
import {
  addCompanyItem,
  companyList,
  deleteCompanyItem,
  updateCompanyItem,
} from "@/services/ant-design-pro/system/api";
// import
/**
 * 添加公司
 *
 * @param fields
 */
type Pagination = {
  total: number;
  pageSize: number;
  current: number;
};

const handleAdd = async (fields: API.CompanyDataItem) => {
  const hide = message.loading('正在添加');
  try {
    const res = await addCompanyItem({ ...fields });
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

const handleUpdate = async (currentRow?: API.CompanyDataItem) => {
  const hide = message.loading('正在修改');
  try {
    await updateCompanyItem(currentRow);
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
 * 删除节点
 *
 * @param currentRow
 */

const handleRemove = async (currentRow: API.CompanyDataItem) => {
  const hide = message.loading('正在删除');
  console.log(currentRow);
  try {
    await deleteCompanyItem(currentRow.id!);
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
  const [currentRow, setCurrentRow] = useState<API.CompanyDataItem>();
  /** 国际化配置 */

  const columns: ProColumns<API.CompanyDataItem>[] = [
    {
      title: '公司ID',
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
      title: '公司名称',
      dataIndex: 'name',
      valueType: 'textarea',
    },
    {
      title: '地址',
      dataIndex: 'address',
      valueType: 'textarea',
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      valueType: 'textarea',
    },
    {
      title: '认证码',
      dataIndex: 'code',
      valueType: 'textarea',
      copyable: true
    },
    {
      title: '操作',
      dataIndex: 'edit',
      valueType: 'option',
      render: (text: ReactNode, record: API.CompanyDataItem) => [
        <ModalForm
          title="编辑公司信息"
          key={"edit" + record.id}
          width="400px"
          onFinish={
            async (values?: API.CompanyDataItem) => {
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
                message: '公司名称为必填项',
              },
            ]}
            width="md"
            name="name"
            label="公司名称"
            initialValue={record.name}
          />
          <ProFormText
            width="md"
            name="address"
            label="公司地址"
            initialValue={record.address}
          />
          <ProFormText
            width="md"
            name="phone"
            label="联系电话"
            initialValue={record.phone}
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

      ]
    }
    ];

  return (
    <PageContainer>
      <ProTable<API.CompanyDataItem, Pagination>
        pagination={{
          pageSize: 10,
        }}
        headerTitle="所有公司"
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
          const res = await companyList(params);
          return {
            data: res.data.list,
            total: res.data.total,
            result: true
          };
        }}
        columns={columns}
      />
      <ModalForm
        title="新建公司"
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
              message: '公司名称为必填项',
            },
          ]}
          width="md"
          name="name"
          label="公司名称"
        />
        <ProFormText
          width="md"
          name="address"
          label="公司地址"
        />
        <ProFormText
          width="md"
          name="phone"
          label="联系电话"
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
          <ProDescriptions<API.CompanyDataItem>
            column={2}
            title={currentRow?.name}
            params={{
              id: currentRow?.name,
            }}
            columns={columns as ProDescriptionsItemProps<API.CompanyDataItem>[]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default RoleList;
