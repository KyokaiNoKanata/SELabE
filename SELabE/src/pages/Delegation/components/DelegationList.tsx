import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, message, Drawer, Modal} from 'antd';
import React, {useState, useRef} from 'react';
import {useIntl, FormattedMessage} from 'umi';
import { PageContainer} from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
const { confirm } = Modal;

import {
  deleteDelegation,
  updateDelegation,
  createDelegation,
  //getSimpleUserByRole,
  getProcessList,
} from "@/services/ant-design-pro/delegation/api";
import {API} from "@/services/ant-design-pro/typings";
/** 根据id删除委托 */
const handleDelete = async (id: number) => {
  const hide = message.loading('提交中');
  try {
    const resp = await deleteDelegation({
      id:id,
    });
    console.log(resp)
    hide();
    if(resp.code == 0) {
      message.success('委托已删除');
    } else {
      message.error(resp.msg);
    }
    return true;
  } catch (error) {
    hide();
    message.error('删除委托失败，请稍后重试');
    return false;
  }
};

/** 更新委托(id->名称，url)
const handleUpdateDelegation = async (data: {
                                        id: number,
                                        name: string,
                                        url?: string,
                                      }
) => {
  const res = await updateDelegation(data)
  if(res.code == 0) {
    message.success('更新委托成功')
  } else {
    message.error(res.msg)
  }
  return res.data;
}
 */

/** 新增委托(name->id) */
const handleCreateDelegation = async (params: {
  name: string
}) => {
  const res = await createDelegation({
    name:params.name
  })
  //todo:check condition
  if(res.code == 0) {
    message.success('创建委托成功')
  } else {
    message.error(res.msg)
  }
  return res.data;
}



/**
 * 根据roleCode获取所有xx部人员姓名（用于分配）
 * @return options:{label,value}[]
 */

const handleUpdateDelegation = async (data: {
                                        id: number,
                                        name: string,
                                        url?: string,
                                      }
) => {
  console.log('handle update')
  const res = await updateDelegation(data)
  if(res.code == 0) {
    message.success('更新委托成功')
  } else {
    message.error(res.msg)
  }
  return res.data;
}
const getOperateTime = async (delegationId: number) => {
  const process = await getProcessList({
    id: delegationId,
  });
  const operateTime = process.data[process.data.length-1].operateTime;
  return operateTime;
}
export type DelegationListType = {
  request: any; //从后端获取数据（带条件，比如发起者是自己的）
  roles: string[];//权限集合
  user: any;//当前用户信息
  //operation: string[];//操作集合，例如审核，填写，分配等
  operationColumns: ProColumns<API.DelegationItem>[];//额外的操作列
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  params?: (param: API.PageParams, roles: string[], user: {
    avatar?: string,
    nickname?: string,
    id?: number,
  }) => API.PageParams[];
}
const DelegationList: React.FC<DelegationListType> = (props) => {
  const request = async (
    params: {//传入的参数名固定叫 current 和 pageSize
      pageSize?: number;
      current?: number;
    },
    options?: Record<string, any>
  ) => {
    const result = await props.request(params,options)
      //状态变更时间
    for(let i = 0; i < result.list.length; i++) {
      result.list[i].operateTime = await getOperateTime(result.list[i].id!);
    }
    return {
      data: result.list,
      total: result.total, //分页固定属性
      result: true,
    }
  }
  let actionRef = useRef<ActionType>();
  if(props.actionRef) {
    actionRef = props.actionRef;
  }
  const [currentRow, setCurrentRow] = useState<API.DelegationItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.DelegationItem[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);//新建
  const [showDetail, setShowDetail] = useState<boolean>(false);
  //const [roles,setRoles] = useState<[string]>([]);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();
  const roles = props.roles;
  let columns: ProColumns<API.DelegationItem>[] = [
    /** 委托编号 show */
    {
      title: '编号',
      dataIndex: 'id',
      //valueType: 'textarea',
      hideInSearch: false,
      hideInTable: false,
    },
    /** 名称 name show */
    {
      title: (
        <FormattedMessage
          id="pages.delegation.nameLabel"
          defaultMessage="委托名称"
        />
      ),
      dataIndex: 'name',
      render: (dom, entity) => {
        return (
          <a
            onClick={() => {
              setCurrentRow(entity);//显示详情
              setShowDetail(true);
            }}
          >
            {dom}
          </a>
        );
      },
    },
    /** 合同编号 contractId show */
    {
      title: '合同编号',
      dataIndex: 'contractId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 发起者人编号 creatorId show */
    {
      title: '发起人编号',
      dataIndex: 'creatorId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 发起时间 launchTime show */
    {
      title: '发起时间',
      dataIndex: 'launchTime',
      hideInSearch: true,
      hideInTable: false,
      valueType: 'dateTime',
      render: (text, record) => [
        // todo format Date
        new Date(record.launchTime!).toLocaleString()
      ]
    },
    /**状态 status show */
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'state',
      hideInForm: false,
      hideInSearch: true,//
      //todo:render
    },
    //状态变更时间
    {
      title: '状态变更时间',
      dataIndex: 'operateTime',
      hideInSearch: true,
      hideInTable: false,
      valueType: 'dateTime',
      render: (text, record) => [
        // todo format Date
        //String(new Date(record.operateTime))
        //new Date(record.operateTime).toLocaleTimeString()
        new Date(record.operateTime!).toLocaleString()
      ]
    },
    /** 分配的市场部人员id marketDeptStaffId hide */
    {
      title: '分配的市场部人员编号',
      dataIndex: 'marketDeptStaffId',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
    },
    /**市场部人员处理意见 show */
    {
      title: "市场部人员处理意见",
      dataIndex: 'marketRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**报价单编号 offerId hide*/
    {
      title: "报价单编号",
      dataIndex: 'offerId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 用户报价单意见 show */
    {
      title: "用户报价单意见",
      dataIndex: 'offerRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    /**测试报告编号 offerId hide*/
    {
      title: "测试报告编号",
      dataIndex: 'reportId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**样品编号 sampleId hide*/
    {
      title: "样品编号",
      dataIndex: 'sampleId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**测试方案编号 solutionId hide*/
    {
      title: "测试方案编号",
      dataIndex: 'solutionId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    /** 软件文档评审表ID table14Id hide */
    {
      title: '软件文档评审表ID',
      dataIndex: 'table14Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 软件项目委托测试申请表ID table2Id hide */
    {
      title: '软件项目委托测试申请表ID',
      dataIndex: 'table2Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 委托测试软件功能列表ID table3Id hide */
    {
      title: '委托测试软件功能列表ID',
      dataIndex: 'table3Id',
      hideInSearch: true,
      hideInTable: true,
    },

    /** 分配的测试部人员ID testingDeptStaffId hide */
    {
      title: '测试部人员ID',
      dataIndex: 'testingDeptStaffId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 测试部人员处理意见 show*/
    {
      title: "测试部人员处理意见",
      dataIndex: 'testingRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 文档材料url url hide */
    {
      title: '文档材料url',
      dataIndex: 'url',
      hideInSearch: true,
      hideInTable: true,
    },

    /**用户 修改 */
    {
      title:'修改名称',
      dataIndex: 'modify',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: true,
      sorter:false,
      render: (text, record) => [
        /**修改名称和url*/
        <ModalForm
          key={'modify'}
          title="修改委托"
          trigger={<Button type="primary">修改</Button>}
          submitter={{
            searchConfig: {
              submitText: '确认',
              resetText: '取消',
            },
          }}
          onFinish={async (values) => {
            const id = record.id!;
            const name = values.name;
            //const url = values.url;
            await handleUpdateDelegation({
              id:id,
              name:name,
              //url:url,
            });
            actionRef.current?.reload();
            return true;
          }}
        >
          <ProFormText
            width="md"
            name="name"
            label="委托名称"
            placeholder="请输入委托名称"
            initialValue={record.name}
          />
        </ModalForm>,
      ]
    },
  ];
  if(props.operationColumns && props.operationColumns.length > 0) {
    columns = columns.concat(props.operationColumns)
  }

  return (
    <PageContainer>
      <ProTable<API.DelegationItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.delegationTable.title',
          defaultMessage: '委托列表',
        })}
        actionRef={actionRef}
        rowKey="id"
        search={
          {
            labelWidth: 108,
            filterType: "query",
            //if need
            /*optionRender: ({searchText, resetText}, {form}) => {
              return [
                <Button
                  key="searchText"
                  type="primary"
                  onClick={() => {
                    form?.submit();
                    console.log('search');
                    console.log()
                  }}
                >
                  {searchText}
                </Button>,
                <Button
                  key="resetText"
                  onClick={() => {
                    form?.resetFields();
                    console.log('reset')
                  }}
                >
                  {resetText}
                </Button>,

              ];
            },*/
          }
        }
        pagination={{
          pageSize: 10,
        }}
        /*新建*/
        toolBarRender={() => [
          (roles.includes('client') || roles.includes('super_admin'))&&
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="todo" defaultMessage="新建" />
          </Button>,
          /*删除*/
          (roles.includes('client') || roles.includes('super_admin'))&&
          <Button
            type="primary"
            key="danger"
            danger
            onClick={
              () => {
                confirm({
                  title: '确认删除吗?',
                  icon: <ExclamationCircleOutlined />,
                  content: '',
                  onOk() {
                    //console.log('批量删除');
                    //console.log(selectedRowsState);
                    const ids = selectedRowsState.map(record => record.id);
                    //console.log(ids);
                    setSelectedRows([]);
                    if(!roles.includes('client')) {
                      message.error('您没有权限删除委托');
                      return;
                    }
                    // ?
                    ids.forEach((id: any) => {
                      handleDelete(id).then(() => actionRef.current?.reloadAndRest?.());
                    })

                  },
                  onCancel() {
                    console.log('Cancel');
                  },
                });
              }
            }
          >
            <FormattedMessage id="todo" defaultMessage="删除" />
          </Button>,
        ]}
        /*请求数据*/
        request={request}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}
      />

      {/** 在侧边展示详情 */}
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
          <ProDescriptions<API.DelegationItem>
            column={2}
            title={currentRow?.name}
            request={async () => ({
              data: currentRow || {},
            })}
            params={{
              id: currentRow?.name,
            }}
            columns={columns.filter(item => item.valueType != 'option') as ProDescriptionsItemProps<API.DelegationItem>[]}
          />
        )}
      </Drawer>

      {/** 新增 */}
      <ModalForm
        title={intl.formatMessage({
          id: 'pages.delegationTable.createDelegation',
          defaultMessage: '新建委托',
        })}
        width="400px"
        visible={createModalVisible}
        onVisibleChange={handleModalVisible}
        onFinish={async (value: {
          name: string
        }) => {
          if(!roles.includes('client')) {
            message.error('您没有权限创建委托');
            return;
          }
          //console.log(value);
          const success = await handleCreateDelegation(value);
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
              message: (
                <FormattedMessage
                  id="pages.delegationTable.delegationName"
                  defaultMessage="委托名称"
                />
              ),
            },
          ]}
          placeholder='请输入委托名称'
          width="md"
          name="name"
        />
      </ModalForm>
    </PageContainer>
  );
};
export default DelegationList;
