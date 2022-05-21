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
  getSimpleUserByRole,
  distributeDelegationMarketing,
  distributeDelegationTesting,
} from "@/services/ant-design-pro/tester/api";
import DistributeForm from "@/pages/tester/Delegation/components/DistributeForm";
import { Link } from 'umi';
import {FormattedDate} from "@@/plugin-locale/localeExports";
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

/** 更新委托(id->名称，url) */
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

const handleGetUserByRole = async (params: {
  roleCode: string,
}) => {
  const res = await getSimpleUserByRole(params);
  //select 固定的格式
  type Option = {
    label: string,
    value: string,
  }
  const options: Option[] = [];
  res.data.forEach(item => {
    options.push({
      label: item.nickname,
      value: item.id,
    })
  })
  return options
}
/**市场部主管分配委托 */
const handleDistributeDelegationMarketing = async (data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) => {
  const resp = await  distributeDelegationMarketing(data);
  if(resp.code == 0) {
    message.success('分配成功');
  } else {
    message.error(resp.msg)
  }
}
/**测试主管分配委托 */
const handleDistributeDelegationTesting = async (data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) => {
  const resp = await  distributeDelegationTesting(data);
  if(resp.code == 0) {
    message.success('分配成功');
  } else {
    message.error(resp.msg)
  }
}


export type DelegationListType = {
  request: any; //从后端获取数据（带条件，比如发起者是自己的）
  roles: [string];
  user: any;//当前用户信息
}
const DelegationList: React.FC<DelegationListType> = (props) => {

  const actionRef = useRef<ActionType>();
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
  const columns: ProColumns<API.DelegationItem>[] = [
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
    },
    /** 发起者人编号 creatorId show */
    {
      title: '发起人编号',
      dataIndex: 'creatorId',
      hideInSearch: true,
      hideInTable: false,
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
        <label key={'time'}>{FormattedDate((record.launchTime), 'yyyy-MM-dd HH:mm:ss')}</label>
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
    },
    /** 文档材料url url hide */
    {
      title: '文档材料url',
      dataIndex: 'url',
      hideInSearch: true,
      hideInTable: true,
    },

    /**用户 修改、删除 */
    {
      title:'修改名称',
      dataIndex: 'modify',
      valueType: 'option',
      hideInTable: !roles.includes('client'),
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
            const id = record.id;
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
    {
      title: '删除',
      dataIndex: 'delete',
      valueType: 'option',
      hideInTable: true,
      sorter:false,
      render: (text, record) => [
        /**删除(含确认dialog)*/
        <Button type="primary"
                danger
                key='delete'
                onClick={
                  () => {
                    confirm({
                      title: '确认删除吗?',
                      icon: <ExclamationCircleOutlined />,
                      content: '',
                      onOk() {
                        handleDelete(record.id)
                          .then(() => actionRef.current?.reload())//重新请求，更新表格
                          .then(()=>setSelectedRows([]));
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }
                }>删除</Button>
      ]
    },

    //可以进行的操作
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => {
        const {id} = record;
        if(record.state == '委托填写中'
          && roles.includes('client')
          && record.creatorId == props.user.id) {
          return [
            <Link to={{ pathname:'/docs/new-delegation', query: {id}}}>
              <Button type="primary">填写委托</Button>
            </Link>
          ]
        }
        else if(record.state?.includes('委托修改中')
          && roles.includes('client')
          && record.creatorId == props.user.id) {
          return [
            <Link to={{ pathname:'/docs/new-delegation', query: {id}}}>
              <Button type="primary">修改委托</Button>
            </Link>
          ]
        }
        else if(record.state == '等待市场部主管分配市场部人员'
          && roles.includes('marketing_department_manger')) {
          return [
            <DistributeForm
              key={'distributeMarket'}
              request={async () => {
                return await handleGetUserByRole({
                  roleCode: 'marketing_department_staff',
                })
              }}
              onSubmit={async (values) => {
                //console.log(values)
                await handleDistributeDelegationMarketing({
                  acceptorId: values.acceptorId,
                  id: record.id,
                })
                actionRef.current?.reload();
                return true;
              }} />
          ]
        }
        else if(record.state == '等待测试部主管分配测试部人员'
          && roles.includes('test_department_manager')) {
          return [
            <DistributeForm
              key={'distributeTest'}
              request={async () => {
                return await handleGetUserByRole({
                  roleCode: 'test_department_staff',
                })
              }}
              onSubmit={async (values) => {
                //console.log(values)
                await handleDistributeDelegationTesting({
                  acceptorId: values.acceptorId,
                  id: record.id,
                })
                actionRef.current?.reload();
                return true;
              }}/>
          ]
        }
        else if(record.state == '市场部审核委托中'
          && roles.includes('marketing_department_staff')
          && record.marketDeptStaffId == props.user.id) {
          return [
            <Link to={{ pathname:'/docs/softDocReview/marketing', query: {id}}}>
              <Button type="primary">审核委托</Button>
            </Link>
          ]
        }
        else if(record.state == '测试部审核委托中'
          && roles.includes('test_department_staff')
          && record.testingDeptStaffId == props.user.id) {
          return [
            <Link to={{ pathname:'/docs/softDocReview/testing', query: {id}}}>
              <Button type="primary">审核委托</Button>
            </Link>
          ]
        }
        else if((record.state == '市场部生成报价中' || record.state?.includes('市场部修改报价'))
          && roles.includes('marketing_department_staff')
          && record.marketDeptStaffId == props.user.id) {
          return [<Link to={{ pathname:'/docs/quotation/marketing', query: {id}}}>
            <Button type="primary">生成报价</Button>
          </Link>
            ]
        }
        else if(record.state == '客户处理报价中'
          && roles.includes('client')
          && record.creatorId == props.user.id) {
          return [<Link to={{ pathname:'/docs/quotation/client', query: {id}}}>
            <Button type="primary">处理报价</Button>
          </Link>
          ]
        }
        else{
          const {id} = record;
          return [
          ]
        }
      }
    },
    /** 查看委托详情 */
    {
      title: '查看详情',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => {
        const {id} = record;
        return [
        <Link to={{ pathname:'delegation/detail', query: {id}}}>
          <Button type="primary">查看详情 todo</Button>
        </Link>
      ]}
    },
  ];
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
        request={props.request}
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
