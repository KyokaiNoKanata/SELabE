import {PlusOutlined} from '@ant-design/icons';
import {Button} from 'antd';
import React, {useRef} from 'react';
import {FormattedMessage, Link, useIntl} from 'umi';
import {PageContainer} from '@ant-design/pro-layout';
import type {ActionType, ProColumns} from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {solutionPage} from '@/services/ant-design-pro/solution/api';
import type {API} from '@/services/ant-design-pro/typings';

/** 获取测试方案(分页) */
const handleGetSolution = async (params: {
  //传入的参数名固定叫 current 和 pageSize
  pageSize?: number;
  current?: number;
}) => {
  //修改参数名称
  //const p = params;
  //p['pageNo'] = params.current;
  const param: any = {
    pageNo: params.current,
    pageSize: params.pageSize,
  };
  const res = await solutionPage(param);
  return {
    data: res.data.list,
    total: res.data.total, //分页固定属性
    result: true,
  };
};

const DelegationList: React.FC = () => {
  const actionRef = useRef<ActionType>();

  /**
   * @en-US International configuration
   * @zh-CN 国际化配置
   * */
  const intl = useIntl();

  const columns: ProColumns<API.SolutionItem>[] = [
    {
      title: '质量部审核人ID',
      dataIndex: 'auditorId',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      sorter: true,
    },
    {
      title: '测试方案编号',
      dataIndex: 'id',
    },
    {
      title: '测试方案评审表ID',
      dataIndex: 'table13Id',
    },
    {
      title: '软件测试方案ID',
      dataIndex: 'table6Id',
    },
    {
      title: '操作',
      hideInTable: false,
      sorter: false,
      dataIndex: 'option',
      valueType: 'option',
      render: (text, record) => {
        const { id } = record;
        return [
          <Link to={{ pathname: '/docs/new-solution', query: { id } }}>
            <Button type="primary">填写</Button>
          </Link>,
        ];
      },
    },
  ];
  return (
    <PageContainer>
      <ProTable<API.SolutionItem, API.PageParams>
        headerTitle={intl.formatMessage({
          id: 'pages.delegationTable.title',
          defaultMessage: '测试方案列表',
        })}
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 108,
          filterType: 'query',
        }}
        pagination={{
          pageSize: 10,
        }}
        /*新建*/
        toolBarRender={() => [
          <Button type="primary" key="primary" onClick={() => {}}>
            <PlusOutlined /> <FormattedMessage id="pages.searchTable.new" defaultMessage="New" />
          </Button>,
        ]}
        /*请求数据*/
        request={handleGetSolution}
        columns={columns}
      />
    </PageContainer>
  );
};
export default DelegationList;
