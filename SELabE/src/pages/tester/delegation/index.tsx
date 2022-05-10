import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, message, Drawer, Modal} from 'antd';
import React, { useState, useRef } from 'react';
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
  deleteDelegation, delegationPage, updateDelegation, createDelegation
} from "@/services/ant-design-pro/tester/api";


/** 根据id删除委托 */
const handleDelete = async (id: number) => {
  const hide = message.loading('提交中');
  try {
    const resp = await deleteDelegation({
      id:id,
    });
    console.log(resp)
    //todo:返回结果
    hide();
    message.success('委托已删除');
    //await delegation()
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
  const p = params;
  //p['pageNo'] = params.current;
  (p as any).pageNo = params.current;
  delete p.current;
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
  console.log(res);
  if(res.data == true) {
    message.success('更新委托成功')
  } else {
    message.error('更新委托失败')
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
  if(res.code == 200) {
    message.success('创建委托成功')
  } else {
    message.error('创建委托失败')
  }
  return res.data;
}
/** 以下内容不可信 */
/*
const handleReceive = async (record:API.DelegationItem) => {
  console.log(record)
  const hide = message.loading('正在接收委托');
  try {
    await receiveDelegation({
      workId: record.workId,
      delegationId: record.delegationId
    });
    hide();
    message.success('接收委托成功');
    return true;
  } catch (error) {
    hide();
    message.error('接收委托失败，请稍后重试');
    return false;
  }
};
const handleCancel = async (record: API.DelegationItem) => {
  //console.log(fields)
  const hide = message.loading('取消中');
  try {
    await cancelDelegation({
      workId: record.workId,
      delegationId: record.delegationId
    });
    hide();
    message.success('委托任务已取消');
    return true;
  } catch (error) {
    hide();
    message.error('取消委托失败，请稍后重试');
    return false;
  }
};

let formData = new FormData();

const handleSubmitScheme = async (record: API.DelegationItem,formData:FormData) => {
  //console.log(fields)
  const hide = message.loading('提交中');
  try {
    await uploadScheme(formData,{
      workId: record.workId,
      delegationId: record.delegationId
    });
    hide();
    message.success('委托方案已提交');
    return true;
  } catch (error) {
    hide();
    message.error('委托方案提交失败，请稍后重试');
    return false;
  }
};
const handleSubmitResult = async (record: API.DelegationItem,formData:FormData) => {
  //console.log(fields)
  const hide = message.loading('提交中');
  try {
    await uploadResult(formData,{
      workId: record.workId,
      delegationId: record.delegationId
    });
    hide();
    message.success('任务已经分配');
    return true;
  } catch (error) {
    hide();
    message.error('分配任务失败，请稍后重试');
    return false;
  }
};
const handleDistribute = async (name: string, delegationId:number) => {
  console.log(name)
  let testerId = 1;
  const hide = message.loading('提交中');
  try {
    await distributeDelegation({
      testerId:testerId,
      delegationId:delegationId,
    });
    hide();
    message.success('测试结果已提交');
    return true;
  } catch (error) {
    hide();
    message.error('提交结果失败，请稍后重试');
    return false;
  }
};
*/



const DelegationList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.DelegationItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.DelegationItem[]>([]);
  /*const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);*/
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);//新建
  const [showDetail, setShowDetail] = useState<boolean>(false);
  /*const stateMap = {
    'notReceived':0,
    'received':1,
    'schemeEvaluating':2,
    'schemeRefused':3,
    'schemePass':4,
    'testing':5,
    'reportEvaluating':6,
    'reportRefused':7,
    'finish':8,
    'notDistributed':9,
  }*/


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
    },
    /** 分配的市场部人员id marketDeptStaffId hide */
    {
      title: '分配的市场部人员编号',
      dataIndex: 'marketDeptStaffId',
      hideInSearch: true,
      hideInTable: true,
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
      //sorter: (a,b) => stateMap[a.status] - stateMap[b.status],
      /*valueEnum: {
        notReceived:{text:'测试任务待接收',status: 'Default'},
        received:{text:'测试任务已接收',status: 'Processing'},
        schemeEvaluating:{text:'测试方案审核中',status: 'Processing'},
        schemeRefused:{text:'测试方案不通过',status: 'Error'},
        schemePass:{text:'测试方案已通过',status: 'Success'},
        testing:{text:'测试中',status: 'Processing'},
        reportEvaluating:{text:'测试报告审核中',status: 'Processing'},
        reportRefused:{text:'测试报告不通过',status: 'Error'},
        finish:{text:'测试已完成',status: 'Success'},
        notDistributed:{text:'任务待分发',status:'Default'},
      },*/
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
      dataIndex: 'modify',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      title:'',
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
            handleUpdateDelegation({
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
                        handleDelete(record.id);
                        actionRef.current?.reload()//重新请求，更新表格
                      },
                      onCancel() {
                        console.log('Cancel');
                      },
                    });
                  }
                }>删除</Button>
        ]
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
        rowSelection={{
          onChange: (_, selectedRows) => {
            //console.log("change")
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
            columns={columns as ProDescriptionsItemProps<API.DelegationItem>[]}
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



