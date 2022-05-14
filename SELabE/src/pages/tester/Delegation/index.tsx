import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, message, Drawer, Modal} from 'antd';
import React, { useState, useRef } from 'react';
import {useIntl, FormattedMessage} from 'umi';
import { PageContainer} from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  ModalForm, ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
const { confirm } = Modal;

import {
  deleteDelegation,
  delegationPage,
  updateDelegation,
  createDelegation,
  marketingAuditFail,
  marketingAuditSuccess,
  submitDelegation,
  getSimpleUserByRole,
  distributeDelegationMarketing,
  distributeDelegationTesting,
  testingAuditFail,
  testingAuditSuccess
} from "@/services/ant-design-pro/tester/api";
import DistributeForm from "@/pages/tester/Delegation/components/DistributeForm";
import { Link } from 'umi';
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

/** 获取委托(分页) */
const handleGetDelegation = async (
  params: {//传入的参数名固定叫 current 和 pageSize
    pageSize?: number;
    current?: number;
  },
  options?: Record<string, any>
) => {
  //修改参数名称
  //const p = params;
  //p['pageNo'] = params.current;
  const p: any = {
    pageNo: params.current,
    pageSize: params.pageSize,
  };
  const res = await delegationPage(p,options);
  return {
    data:res.data.list,
    total: res.data.total, //分页固定属性
    result: true,
  };
}
/** 更新委托(id->名称，url) */
const handleUpdateDelegation = async (params: {
                                        id: number,
                                        name: string,
                                        url: string,
                                      }
) => {
  const res = await updateDelegation({
      id: params.id,
      name: params.name,
      url: params.url,
    }
  )
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
/** 提交委托 */
const handleSubmitDelegation = async (data: {
  id: number
}) => {
  const res = await submitDelegation({
    id: data.id
  })
  if(res.code == 0) {
    message.success('委托已提交');
  } else {
    message.error(res.msg)
  }
}
/** 市场部审批委托() */
//不通过
const handleAuditFailMarketing = async (data: {
  id: number,//委托编号
  remark: string,//审核意见
}) => {
  const res = await marketingAuditFail({
    id: data.id,
    remark: data.remark,
  });
  if(res.data == true) {
    message.success('提交成功');
  } else {
    message.error(res.msg)
  }
}
//通过
const handleAuditSuccessMarketing = async (data: {
  id: number,
  remark: string,
}) => {
  const res = await marketingAuditSuccess({
    id: data.id,
    remark: data.remark,
  });
  console.log(res)
  if(res.code == 0) {
    message.success('提交成功');
  } else {
    message.error(res.msg)
  }
}

/** 测试部审批委托() */
//不通过
const handleAuditFailTesting = async (data: {
  id: number,//委托编号
  remark: string,//审核意见
}) => {
  const res = await testingAuditFail({
    id: data.id,
    remark: data.remark,
  });
  if(res.data == true) {
    message.success('提交成功');
  } else {
    message.error(res.msg)
  }
}
//通过
const handleAuditSuccessTesting = async (data: {
  id: number,
  remark: string,
}) => {
  const res = await testingAuditSuccess({
    id: data.id,
    remark: data.remark,
  });
  console.log(res)
  if(res.code == 0) {
    message.success('提交成功');
  } else {
    message.error(res.msg)
  }
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
/*const handleGetMarketingUser = async () => {
  return await handleGetUserByRole({
    roleCode: 'marketing_department_staff'
  })
}*/
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
/** 以下内容不可信 */




const DelegationList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.DelegationItem>();
  //const [selectedRowsState, setSelectedRows] = useState<API.DelegationItem[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);//新建
  const [showDetail, setShowDetail] = useState<boolean>(false);

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.DelegationItem>[] = [
    /** id编号 hide */
    {
      title: '编号',
      dataIndex: 'id',
      //valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
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
        <label key={'time'}>{String(new Date(record.launchTime))}</label>
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
    /**状态 status show */
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'state',
      hideInForm: false,
      //todo:render
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

    /**修改、删除 */
    {
      title:'修改',
      dataIndex: 'modify',
      valueType: 'option',
      hideInTable: false,
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
            const url = values.url;
            await handleUpdateDelegation({
              id:id,
              name:name,
              url:url,
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
          <ProFormText
            width="md"
            name="url"
            label="url"
            placeholder="请输入url"
            initialValue={record.url}
          />
        </ModalForm>,
      ]
    },
    {
      title: '删除',
      dataIndex: 'delete',
      valueType: 'option',
      hideInTable: false,
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
                        handleDelete(record.id).
                        then(() => actionRef.current?.reload());//重新请求，更新表格
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }
                }>删除</Button>
      ]
    },
    /**提交相关的表单*/
    {
      title:'填写表单',
      dataIndex: 'submit',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => {
        const {id} = record;
        return [
        /*<Link to={{ pathname:'new-delegation', query: {id}}}>
          <Button type="primary">填写表单</Button>
        </Link>,*/
        <ModalForm
          key={'submit'}
          title="填写表单"
          trigger={<Button type="primary" >填写</Button>}
          submitter={{
            searchConfig: {
              submitText: '提交',
              resetText: '取消',
            },
          }}
          onFinish={async () => {
            console.log('填写完成')
            await handleSubmitDelegation({
              id: record.id
            });
            actionRef.current?.reload();
            return true;
          }}
        >
          <Link to={{ pathname:'/docs/new-delegation', query: {id}}}>
            <Button type="primary">前往填写表单</Button>
          </Link>
        </ModalForm>
        ];
      }
    },
    /**(市场部)审核委托*/
    {
      title: '市场部审核',
      dataIndex: 'auditMarketing',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => [
        <ModalForm
          key={'auditMarketing'}
          title="市场部审核"
          trigger={
            <Button type="primary">
              审核
            </Button>
          }
          submitter={{
            searchConfig: {
              submitText: '确认',
              resetText: '取消',
            },
          }}
          onFinish={async (values) => {
            const id = record.id;
            const remark = values.marketRemark;
            //通过
            if(values.pass == 0) {
              await handleAuditSuccessMarketing({
                id: id,
                remark: remark,
              });
            }
            //不通过
            else {
              await handleAuditFailMarketing({
                id: id,
                remark: remark,
              });
            }
            actionRef.current?.reload();
            return true;
          }}
        >
          <ProFormSelect
            showSearch
            width="md"
            label="是否通过"
            name="pass"
            placeholder={'选择是否通过'}
            valueEnum={{
              0: '通过',
              1: '不通过',
            }}
           />
          <ProFormText
            width="md"
            name="marketRemark"
            label="审核意见"
            placeholder="请输入审核意见"
            initialValue={record.marketRemark}
          />
        </ModalForm>,
      ]
    },
    /** 测试部审核委托 */
    //x
    {
      title: '测试部审核',
      dataIndex: 'auditTesting',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => {
        const {id} = record;
        return [
          <ModalForm
            key={'auditTesting'}
            title="测试部审核"
            trigger={
              <Button type="primary">
                审核
              </Button>
            }
            submitter={{
              searchConfig: {
                submitText: '确认',
                resetText: '取消',
              },
            }}
            onFinish={async (values) => {
              const remark = values.testingRemark;
              //通过
              if (values.pass == 0) {
                await handleAuditSuccessTesting({
                  id: record.id,
                  remark: remark,
                });
              }
              //不通过
              else {
                await handleAuditFailTesting({
                  id: record.id,
                  remark: remark,
                });
              }
              actionRef.current?.reload();
              return true;
            }}
          >
            {/*todo*/}
            <Link to={{pathname: '/docs/softDocReview',
              query: {id}}}>
              <Button type="primary">填写软件文档评审表</Button>
            </Link>
            <ProFormSelect
              showSearch
              width="md"
              label="是否通过"
              name="pass"
              placeholder={'选择是否通过'}
              valueEnum={{
                0: '通过',
                1: '不通过',
              }}
            />
            <ProFormText
              width="md"
              name="testingRemark"
              label="审核意见"
              placeholder="请输入审核意见"
              initialValue={record.testingRemark}
            />
          </ModalForm>
        ]
      }
    },
    /**(市场部主管)分配委托给市场部人员*/
    ///admin-api/system/delegation/distribute/marketing
    {
      title: '市场部分配',
      dataIndex: 'distributeMarketing',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => [
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
    },
    /**(测试部主管)分配委托给测试部人员*/
    ///admin-api/system/delegation/distribute/marketing
    {
      title: '测试部分配',
      dataIndex: 'distributeTesting',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => [
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
          }} />
      ]
    },
    /** 查看委托详情 */
    {
      title: '查看详情',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record) => [
        <Button type="primary"
                key='delete'
                onClick={
                  () => {
                    setCurrentRow(record);//显示详情
                    setShowDetail(true);
                  }
                }>查看</Button>,
        ],
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
        rowKey="key"
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
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        /*请求数据*/
        request={handleGetDelegation}
        columns={columns}
        /*rowSelection={{
          onChange: (_, selectedRows) => {
            setSelectedRows(selectedRows);
          },
        }}*/
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
          console.log(value);
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



