import {ExclamationCircleOutlined, PlusOutlined} from '@ant-design/icons';
import {Button, Drawer, message, Modal} from 'antd';
import type {ReactNode} from 'react';
import React, { useRef, useState} from 'react';

import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {ModalForm, ProFormText,} from '@ant-design/pro-form';
import type {ProDescriptionsItemProps} from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';
import {
  cancelDelegationAdmin,
  cancelDelegationClient,
  createDelegation,
  delegationPage,
  deleteDelegation,
  updateDelegation,
} from "@/services/ant-design-pro/delegation/api";
import type API from "@/services/ant-design-pro/typings";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {Link, useIntl} from "umi";
import {getUserInfo} from "@/services/ant-design-pro/api";
import constant from "../../../../config/constant";
import type {ProFormInstance} from "@ant-design/pro-form/lib/BaseForm/BaseForm";

const {confirm} = Modal;

/** 根据id删除委托 */
const handleDelete = async (id: number) => {
  const hide = message.loading('提交中');
  try {
    const resp = await deleteDelegation({
      id: id,
    });
    console.log(resp)
    hide();
    if (resp.code == 0) {
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
    name: params.name
  })
  if (res.code == 0) {
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
  if (res.code == 0) {
    message.success('更新委托成功')
  } else {
    message.error(res.msg)
  }
  return res.data;
}
/*const getOperateTime = async (delegationId: number) => {
  const process = await getProcessList({
    id: delegationId,
  });
  const operateTime = process.data[process.data.length - 1].operateTime;
  return operateTime;
}*/
export type DelegationListType = {
  /**
   *  额外的操作列
   */
  operationColumns: ProColumns<API.DelegationItem>[];
  /**
   * 如果是项目列表，第一列换成项目id，委托id隐藏
   */
  projectsList?: boolean;
  /**
   * 可变的，指可以增删委托。
   */
  changeable?: boolean;
  /**
   * 是否列出全部，如果是，才可以根据状态查询，不然已经有状态限制了
   */
  queryState?: boolean;
  /**
   * 前置列
   */
  columnsBefore?: ProColumns<API.DelegationItem>[];
  /**
   * actionRef
   */
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  /**
   * 查询参数
   * @param param 初始查询参数，含pageSize,pageNo,name(可选)
   * @param roles 当前用户权限列表
   * @param userId 用户id
   * @return 完整的参数的Promise，含权限限制
   */
  queryParams: (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number,
  ) => Promise<API.DelegationQueryParams>,
}
/**
 * 委托列表模板
 * @param props：属性
 * @constructor
 */
const DelegationList: React.FC<DelegationListType> = (props) => {
  const cancelFormRef = useRef<ProFormInstance>();
  let actionRef = useRef<ActionType>();
  if (props.actionRef) {
    actionRef = props.actionRef;
  }
  const [currentRow, setCurrentRow] = useState<API.DelegationItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.DelegationItem[]>([]);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);//新建
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const [roles, setRoles] = useState<string[]>([]);
  const [userId,setUserId] = useState<number>(-1);
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const request = async (
    params: {//传入的参数名固定叫 current 和 pageSize
      pageSize?: number;
      current?: number;
    } & {
      name?: string;
      projectId?: string;
      state?: string;
    },
    /**
     * 排序对象
     */
    sort?: object,
    options?: Record<string, any>
  ) => {
    /*if (props.request) {
      await props.request(params, options);
    }*/
    const user = (await getUserInfo()).data;
    setRoles(user.roles);
    setUserId(user.user.id)
    const p1: API.DelegationQueryParams = {
      pageSize: params.pageSize!,
      pageNo: params.current!,
      name: params.name,
      projectId: params.projectId,
      state: params.state,
    }
    if (sort && sort != {}) {
      //todo
      //应该驼峰转下划线，应该统一处理一下，现在就需要 id，state，launchTime，就将就下
      const key = Object.keys(sort!)[0];
      const value = Object.values(sort!)[0];
      p1.asc = (value == 'ascend');
      p1.orderField = new Map([
        ['id', 'id'],
        ['state', 'state'],
        ['launchTime', 'launch_time'],
        ['projectId','project_Id'],
      ]).get(key);
    }
    //remove params.current
    const p = await props.queryParams!(p1, user.roles, user.user.id);//获得参数
    const result = (await delegationPage(p, options)).data;
    return {
      data: result.list,
      total: result.total, //分页固定属性
      result: true,
    }
  }
  let columns: ProColumns<API.DelegationItem>[] = [
    /** 委托编号 show */
    {
      title: '委托编号',
      dataIndex: 'id',
      //valueType: 'textarea',
      hideInSearch: true,
      hideInTable: props.projectsList != undefined,
      sorter: true,
    },
    /** 项目编号 */
    {
      title: '项目编号',
      dataIndex: 'projectId',
      hideInTable: props.projectsList == undefined,
      hideInSearch: props.projectsList == undefined,
      sorter: true,
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
    /** 合同编号 contractId  */
    {
      title: '合同编号',
      dataIndex: 'contractId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 发起者人编号 creatorId  */
    {
      title: '发起人编号',
      dataIndex: 'creatorId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 发起时间 launchTime  */
    {
      title: '发起时间',
      dataIndex: 'launchTime',
      hideInSearch: true,
      hideInTable: false,
      valueType: 'dateTime',
      sorter: true,
      render: (text, record) => [
        // todo format Date
        new Date(record.launchTime!).toLocaleString()
      ]
    },
    /**状态 status */
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status"/>,
      dataIndex: 'state',
      hideInForm: false,
      hideInSearch: !props.queryState,//
      sorter: true,
      valueType: 'select',
      valueEnum: {
        "": {
          text: '全部委托',
          status: 'Default',
        },
        "470,480": {
          text: '已取消的委托',
          status: 'Error',
        },
        "235,240,250,260,270,280,290,300,310,320,330,340,350,360,370,380,390,400,410,420,430,440,450,460": {
          text: '已立项的委托',
          status: 'Success',
        },
        "10,20,30,40,50,60,70,80,90,100,110,120,130,140,150,160,170,180,190,200,210,220,230" : {
          text: '进行中的委托',
          status: 'Processing',
        }
      }
      //render
    },
    /*//状态变更时间
    {
      title: '状态变更时间',
      dataIndex: 'update_time',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'dateTime',
      render: (text, record) => [
        //  format Date
        //String(new Date(record.operateTime))
        //new Date(record.operateTime).toLocaleTimeString()
        new Date(record.update_time!).toLocaleString()
      ]
    },*/
    /** 分配的市场部人员id marketDeptStaffId  */
    {
      title: '分配的市场部人员编号',
      dataIndex: 'marketDeptStaffId',
      hideInSearch: true,
      hideInTable: true,
      valueType: 'textarea',
    },
    /**市场部人员处理意见  */
    {
      title: "市场部人员处理意见",
      dataIndex: 'marketRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**报价单编号 offerId */
    {
      title: "报价单编号",
      dataIndex: 'offerId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 用户报价单意见  */
    {
      title: "用户报价单意见",
      dataIndex: 'offerRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    /**测试报告编号 offerId */
    {
      title: "测试报告编号",
      dataIndex: 'reportId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**样品编号 sampleId */
    {
      title: "样品编号",
      dataIndex: 'sampleId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**测试方案编号 solutionId */
    {
      title: "测试方案编号",
      dataIndex: 'solutionId',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },

    /** 软件文档评审表ID table14Id  */
    {
      title: '软件文档评审表ID',
      dataIndex: 'table14Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 软件项目委托测试申请表ID table2Id  */
    {
      title: '软件项目委托测试申请表ID',
      dataIndex: 'table2Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 委托测试软件功能列表ID table3Id  */
    {
      title: '委托测试软件功能列表ID',
      dataIndex: 'table3Id',
      hideInSearch: true,
      hideInTable: true,
    },

    /** 分配的测试部人员ID testingDeptStaffId */
    {
      title: '测试部人员ID',
      dataIndex: 'testingDeptStaffId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 测试部人员处理意见 */
    {
      title: "测试部人员处理意见",
      dataIndex: 'testingRemark',
      valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 文档材料url */
    {
      title: '文档材料url',
      dataIndex: 'url',
      hideInSearch: true,
      hideInTable: true,
    },
    /**
     * 取消原因
     */
    {
      title: '取消原因',
      dataIndex: 'cancelRemark',
      hideInSearch: true,
      hideInTable: true,
    },
    //填写委托
    /** 填写委托 */
    {
      title: '填写委托',
      dataIndex: 'write',
      valueType: 'option',
      hideInTable: !roles.includes(constant.roles.CUSTOMER.en) || props.projectsList!=undefined,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        if ((record.state == constant.delegationState.DELEGATE_WRITING.desc
          || record.state == constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc
          || record.state == constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc)) {
          return (
            <Link to={{pathname: constant.docPath.delegation.APPLY, state: {id: id}}}>
              <Button type="primary">填写</Button>
            </Link>
          )
        } else if(record.state == constant.delegationState.CLIENT_CANCEL_DELEGATION.desc
          || record.state == constant.delegationState.ADMIN_CANCEL_DELEGATION.desc){
          return (
            <text>委托已取消</text>
          )
        } else {
          return (
            <text>委托已填写</text>
          )
        }
      }
    },
    //取消委托
    {
      title: '取消委托',
      dataIndex: 'cancel',
      valueType: 'option',
      hideInTable: props.projectsList != undefined,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {

        if(record.state == constant.delegationState.CLIENT_CANCEL_DELEGATION.desc
          || record.state == constant.delegationState.ADMIN_CANCEL_DELEGATION.desc) {
          return [];
        }

        return [
          <ModalForm
            formRef={cancelFormRef}
            key={'audit'}
            title="取消委托"
            trigger={<Button type="primary">
              取消
            </Button>}
            onFinish={async () => {
              const delegationId = cancelFormRef.current?.getFieldFormatValue!(['delegationId']);
              const cancelRemark = cancelFormRef.current?.getFieldFormatValue!(['cancelRemark']);
              let resp = undefined;
              if(userId == record.creatorId) {
                resp = await cancelDelegationClient({
                  delegationId: delegationId,
                  remark: cancelRemark,
                });
              } else {
                resp = await cancelDelegationAdmin({
                  delegationId: delegationId,
                  remark: cancelRemark,
                })
              }
              if(resp.code == 0) {
                message.success('取消成功');
                actionRef.current?.reload();
                return true;
              } else {
                message.error(resp.msg);
                return false;
              }
            }}
            submitter={
              {
                searchConfig: {
                  submitText: '确认取消',
                  resetText: '让我想想',
                }
              }
            }
          >
            <ProFormText
              name={'delegationId'}
              label={'委托编号'}
              readonly
              initialValue={record.id}
             />
            <ProFormText
              label={'取消理由'}
              name={'cancelRemark'}
              placeholder={'请输入取消理由'}
             />
          </ModalForm>
        ]
      }
    },
    /**用户 修改 */
    {
      title: '修改名称',
      dataIndex: 'modify',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: true,
      sorter: false,
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
              id: id,
              name: name,
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
  if (props.operationColumns && props.operationColumns.length > 0) {
    columns = columns.concat(props.operationColumns)
  }

  return (
    <PageContainer>
      <ProTable<API.DelegationItem, API.DelegationQueryParams>
        /*headerTitle={intl.formatMessage({
          id: 'pages.delegationTable.title',
          defaultMessage: '委托列表',
        })}*/
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
        //分页信息
        pagination={{
          pageSize: 10,//每页最大数量
        }}
        /*新建*/
        toolBarRender={() => [
          (roles.includes(constant.roles.CUSTOMER.en) || roles.includes(constant.roles.SUPER_ADMIN.en)) &&
          props.changeable &&
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              handleModalVisible(true);
            }}
          >
            <PlusOutlined/> <FormattedMessage id="todo" defaultMessage="新建"/>
          </Button>,
          /*删除*/
          (roles.includes(constant.roles.CUSTOMER.en) || roles.includes(constant.roles.SUPER_ADMIN.en)) &&
          props.changeable &&
          <Button
            type="primary"
            key="danger"
            danger
            //批量删除按钮
            onClick={
              () => {
                confirm({
                  title: '确认删除吗?',
                  icon: <ExclamationCircleOutlined/>,
                  content: '',
                  onOk() {
                    //console.log('批量删除');
                    //console.log(selectedRowsState);
                    const ids = selectedRowsState.map(record => record.id);
                    //console.log(ids);
                    setSelectedRows([]);
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
            <FormattedMessage id="todo" defaultMessage="删除"/>
          </Button>,
        ]}
        request={request}//查询请求
        columns={columns}//列
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
          const resp = await handleCreateDelegation(value);
          if (resp) {
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
