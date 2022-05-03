import {DownloadOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {Button, message, Input, Drawer, Upload} from 'antd';
import React, { useState, useRef } from 'react';
import { useIntl, FormattedMessage } from 'umi';
import { PageContainer, FooterToolbar } from '@ant-design/pro-layout';
import type { ProColumns, ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProForm, {
  ModalForm,
  ProFormText,
  ProFormTextArea,
  ProFormUploadButton,
  ProFormUploadDragger
} from '@ant-design/pro-form';
import type { ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import { rule, addRule, updateRule, removeRule} from '@/services/ant-design-pro/api';
import {
  cancelDelegation,
  receiveDelegation,
  delegation,
  uploadResult,
  uploadScheme
} from "@/services/ant-design-pro/tester/api";
import {reject} from "lodash";
import {RcFile} from "antd/es/upload";


/**
 * @en-US Add node
 * @zh-CN 添加节点
 * @param fields
 */

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
/** 提交测试方案 */
let formData = new FormData();
const fileList = [];

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
    message.success('测试结果已提交');
    return true;
  } catch (error) {
    hide();
    message.error('提交结果失败，请稍后重试');
    return false;
  }
};

const DelegationList: React.FC = () => {

  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<API.RuleListItem>();
  const [selectedRowsState, setSelectedRows] = useState<API.RuleListItem[]>([]);
  const [updateModalVisible, handleUpdateModalVisible] = useState<boolean>(false);

  const [showDetail, setShowDetail] = useState<boolean>(false);
  const stateMap = {
    'notReceived':0,
    'received':1,
    'schemeEvaluating':2,
    'schemeRefused':3,
    'schemePass':4,
    'testing':5,
    'reportEvaluating':6,
    'reportRefused':7,
    'finish':8,
  }
  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.DelegationItem>[] = [
    /** id编号 */
    {
      title: '编号',
      dataIndex: 'id',
      //valueType: 'textarea',
      hideInSearch: true,
      hideInTable: true,
    },
    /**名称*/
    {
      title: (
        <FormattedMessage
          id="pages.delegation.nameLabel"
          defaultMessage="委托名称"
        />
      ),
      dataIndex: 'name',
      tip: 'The delegation name is the unique key',
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
    /** 受理时间 acceptTime */
    {
      title: '受理时间',
      dataIndex: 'acceptTime',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 受理人编号 acceptorId */
    {
      title: '受理人编号',
      dataIndex:'acceptorId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 创建时间 launchTime */
    {
      title: '创建时间',
      dataIndex: 'launchTime',
      hideInSearch: true,
      hideInTable: false,
    },
    /** 创建人编号 creatorId */
    {
      title: '发起人编号',
      dataIndex: 'creatorId',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 处理时间 processTime */
    {
      title: '处理时间',
      dataIndex: 'processTime',
      hideInSearch: true,
      hideInTable: false,
    },
    /** 软件项目委托测试申请表ID table2Id */
    {
      title: '软件项目委托测试申请表ID',
      dataIndex: 'table2Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /** 委托测试软件功能列表ID table3Id */
    {
      title: '委托测试软件功能列表ID',
      dataIndex: 'table3Id',
      hideInSearch: true,
      hideInTable: true,
    },
    /**状态*/
    {
      title: <FormattedMessage id="pages.searchTable.titleStatus" defaultMessage="Status" />,
      dataIndex: 'status',
      hideInForm: false,
      sorter: (a,b) => stateMap[a.status] - stateMap[b.status],
      valueEnum: {
        notReceived:{text:'测试任务待接收',status: 'Default'},
        received:{text:'测试任务已接收',status: 'Processing'},
        schemeEvaluating:{text:'测试方案审核中',status: 'Processing'},
        schemeRefused:{text:'测试方案不通过',status: 'Error'},
        schemePass:{text:'测试方案已通过',status: 'Success'},
        testing:{text:'测试中',status: 'Processing'},
        reportEvaluating:{text:'测试报告审核中',status: 'Processing'},
        reportRefused:{text:'测试报告不通过',status: 'Error'},
        finish:{text:'测试已完成',status: 'Success'},
      },
    },
    /**备注*/
    {
      title: "备注",
      dataIndex: 'remark',
      valueType: 'textarea',
      hideInSearch: true,
    },
    /**操作*/
    {
      title: <FormattedMessage id="pages.searchTable.titleOption" defaultMessage="Operating" />,
      dataIndex: 'option',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text, record,_,action) => [
        record.status === 'notReceived' && <a key="receiveTask"
          onClick={() => {
            //console.log(record.status)
            const success = handleReceive(record)
            if(success) {
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
        >接受测试任务</a>,

        (record.status === 'received' || record.status === 'schemeRefused') &&
        <ModalForm<{
          name: string;
          company: string;
        }>
          title="提交测试方案"
          trigger={
            <a>
              提交测试方案
            </a>
          }
          autoFocusFirstInput
          modalProps={{
            //onCancel: () => console.log('cancel'),
          }}
          //submitTimeout={2000}
          onFinish={async (values) => {
            //await waitTime(2000);
            //console.log('提交方案')
            const success = handleSubmitScheme(record,formData)
            if(success) {
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            return true;
          }}
        >

          <ProForm.Group>
            <Upload
              beforeUpload={(file) => {
                return new Promise(async (resolve, reject) => {
                  //console.log(file.name)
                  formData = new FormData()
                  formData.append('file',file)
                  return reject(false);
                });
              }}
              >
              <Button type="primary" icon={<DownloadOutlined />}>
                上传
              </Button>
            </Upload>
          </ProForm.Group>
        </ModalForm>,


        (record.status === 'schemePass' || record.status === 'reportRefused' || record.status === 'testing')
            && <ModalForm<{
          name: string;
          company: string;
        }>
          title="提交测试结果"
          trigger={
            <a>
              提交测试结果
            </a>
          }
          autoFocusFirstInput
          modalProps={{
            //onCancel: () => console.log('cancel'),
          }}
          //submitTimeout={2000}
          onFinish={async (values) => {
            //await waitTime(2000);
            //console.log('提交结果')
            const success = handleSubmitResult(record,formData)
            if(success) {
              setCurrentRow(undefined);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
            return true;
          }}
        >

          <ProForm.Group>
            <Upload
              beforeUpload={(file) => {
                return new Promise(async (resolve, reject) => {
                  //console.log(file.name)
                  formData = new FormData()
                  formData.append('file',file)
                  return reject(false);
                });
              }}
            >
              <Button type="primary" icon={<DownloadOutlined />}>
                上传
              </Button>
            </Upload>
          </ProForm.Group>
        </ModalForm>,



        (record.status === 'received') &&
        <a key="cancelDelegation"
           onClick={() => {
             const success = handleCancel(record)
             if(success) {
               setCurrentRow(undefined);
               if (actionRef.current) {
                 actionRef.current.reload();
               }
             }
           }}
        >取消</a>
      ],
    },

  ];

  return (
    <PageContainer>
      <ProTable<API.DelegationItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.searchTable.title',
          defaultMessage: 'Enquiry form',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            type="primary"
            key="primary"
            onClick={() => {
              //handleModalVisible(true);
            }}
          >
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        request={delegation}
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
    </PageContainer>
  );
};
export default DelegationList;



