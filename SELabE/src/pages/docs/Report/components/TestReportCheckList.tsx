import ProForm, {ProFormDatePicker, ProFormText} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {PageContainer} from '@ant-design/pro-layout';
import {Input, message, PageHeader} from 'antd';
import React, {useState} from 'react';
import type {ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {saveTable10} from "@/services/ant-design-pro/report/api";

type DataSourceType = {
  id: React.Key;
  serial?: string;
  check?: string;
  desc?: string;
  result?: string;
};
const defaultData: DataSourceType[] = [
  {
    id: 10001,
    serial: '1',
    check: '报告编号',
    desc: '检查报告编号的正确性（是否符合编码规则）与前后的一致性（报告首页与每页页眉）。',
    result: ''
  },
  {
    id: 10002,
    serial: '2',
    check: '页码',
    desc: '检查页码与总页数是否正确（报告首页与每页页眉）。',
    result: ''
  },
  {
    id: 10003,
    serial: '3',
    check: '软件名称',
    desc: '是否和确认单一致，是否前后一致（共三处，包括首页、报告页、附件三）。',
    result: ''
  },
  {
    id: 10004,
    serial: '4',
    check: '版本号',
    desc: '是否和确认单一致，是否前后一致（共二处，包括首页、报告页）。',
    result: ''
  },
  {
    id: 10005,
    serial: '5',
    check: '委托单位',
    desc: '是否和确认单一致，是否前后一致（共二处，包括首页、报告页）。',
    result: ''
  },
  {
    id: 10006,
    serial: '6',
    check: '完成日期',
    desc: '是否前后一致（共二处，包括首页、报告页页末）。',
    result: ''
  },
  {
    id: 10007,
    serial: '7',
    check: '委托单位地址',
    desc: '是否和确认单一致（共一处，报告页）。',
    result: ''
  },
  {
    id: 10008,
    serial: '8',
    check: '序号',
    desc: '附件二、附件三中的序号是否正确、连续。',
    result: ''
  },
  {
    id: 10009,
    serial: '9',
    check: '测试样品',
    desc: '样品名称是否正确，数量是否正确。',
    result: ''
  },
  {
    id: 100010,
    serial: '10',
    check: '软、硬件列表',
    desc: '列表是否完整（如打印机），用途描述是否合理正确。',
    result: ''
  },
  {
    id: 1000111,
    serial: '11.1',
    check: '错别字',
    desc: '报告中是否还有错别字。',
    result: ''
  },
  {
    id: 1000112,
    serial: '11.2',
    check: '语句',
    desc: '报告的语句是否通顺合理；每个功能描述结束后是否都有句号。',
    result: ''
  },
  {
    id: 1000113,
    serial: '11.3',
    check: '格式',
    desc: '报告的格式是否美观，字体是否一致，表格大小是否一致。（如无特殊情况请尽量不要将报告页中的表格分为2页。）',
    result: ''
  },
  {
    id: 100012,
    serial: '12',
    check: '用户文档测试报告',
    desc: '语句是否通顺，是否准确描述用户的文档。',
    result: ''
  },
];
const columns: ProColumns<DataSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'serial',
    width: '5%',
    editable: false,
  },
  {
    title: '检查内容',
    dataIndex: 'check',
    width: '15%',
    editable: false,
  },
  {
    title: '内容描述',
    dataIndex: 'desc',
    width: '60%',
    editable: false,
  },
  {
    title: '检查结果',
    dataIndex: 'result',
    renderFormItem: (_, {record}) => {
      console.log('----===>', record);
      return <Input addonBefore={(record as any)?.addonBefore}/>;
    },
  },
];
//todo
const TestReportCheckList: React.FC<{
  editable: boolean,
}> = (props) => {
  const params = useLocation();
  const delegationId: number = (params as any).query.id;
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  //todo
  const onFinish = async (value: any) => {
    console.log(value);
    const rId = (await getDelegationById(delegationId)).data.reportId;
    const resp = await saveTable10({
      reportId: rId!,
      data: value,
    })
    if (resp.code == 0) {
      message.success('保存成功');
    }
  }
  const request = async () => {
    return {};
  }
  return (
    <PageContainer>
      <PageHeader
        className="testreportchecklist"
        title="测试报告检查表"
      />
      <ProForm onFinish={onFinish}
               key={'testreportchecklist'}

        //从后端请求数据显示
               request={request}
      >
        <ProCard border>
          <ProFormText name='软件名称' label='软件名称' width='xl'/>
          <ProFormText name='委托单位' label='委托单位' width='xl'/>
        </ProCard>
        <ProForm.Item
          label=""
          name="dataSource"
          initialValue={defaultData}
          trigger="onValuesChange"
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              hidden: true,
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys,
              onChange: setEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
          />
        </ProForm.Item>
        <ProCard border>
          <ProFormText name="检查人" label='检查人' width='md'/>
          <ProFormDatePicker name='日期' label='日期'/>
        </ProCard>
      </ProForm>
    </PageContainer>
  );
};

export default TestReportCheckList;
