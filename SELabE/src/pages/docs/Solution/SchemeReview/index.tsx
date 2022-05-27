import React, {useState} from 'react';
import {Input, message} from 'antd';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import type {ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';


type DataSourceType = {
  id: React.Key;
  title?: string;
  reason?: string;
  state?: string;
};
type AdviceType = {
  id: React.Key;
  duty?: string;
  advice?: string;
  signature?: string;
  date?: string;
}
const defaultData: DataSourceType[] = [
  {
    id: 10001,
    title: '《测试方案》书写规范性',
    reason: '',
    state: '',
  },
  {
    id: 10002,
    title: '测试环境是否具有典型意义以及是否符合用户要求',
    reason: '',
    state: '',
  },
  {
    id: 10003,
    title: '测试内容的完整性，是否覆盖了整个系统',
    reason: '',
    state: '',
  },
  {
    id: 10004,
    title: '测试方法的选取是否合理',
    reason: '',
    state: '',
  },
  {
    id: 10005,
    title: '测试用例能否覆盖问题',
    reason: '',
    state: '',
  },
  {
    id: 10006,
    title: '输入、输出数据设计合理性',
    reason: '',
    state: '',
  },
  {
    id: 10007,
    title: '测试时间安排是否合理',
    reason: '',
    state: '',
  },
  {
    id: 10008,
    title: '测试人力资源安排是否合理',
    reason: '',
    state: '',
  },
];

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '评审内容',
    dataIndex: 'title',
    width: '30%',
    editable: false,
  },
  {
    title: '是否通过',
    width: 120,
    key: 'state',
    dataIndex: 'state',
    valueType: 'select',
    valueEnum: {
      open: {
        text: '不通过',
        status: 'Error',
      },
      closed: {
        text: '通过',
        status: 'Success',
      },
    },
  },
  {
    title: '不通过原因',
    dataIndex: 'reason',
    renderFormItem: (_, {record}) => {
      console.log('----===>', record);
      return <Input addonBefore={(record as any)?.addonBefore}/>;
    },
  },
];
const adviceColumns: ProColumns<AdviceType>[] = [
  {
    title: '职责',
    dataIndex: 'duty',
    width: '30%',
    editable: false,
  },
  {
    title: '评审意见',
    dataIndex: 'advice',
  },
  {
    title: '签字',
    dataIndex: 'signature',
    renderFormItem: (_, {record}) => {
      console.log('----===>', record);
      return <Input addonBefore={(record as any)?.addonBefore}/>;
    },
  },
  {
    title: '日期',
    dataIndex: 'date',
    valueType: "date",
  },
];
const adviceData: AdviceType[] = [
  {
    id: 20001,
    duty: '测试工程师',
    advice: '',
    signature: '',
    date: '',
  },
  {
    id: 20002,
    duty: '测试室负责人',
    advice: '',
    signature: '',
    date: '',
  },
  {
    id: 20003,
    duty: '质量负责人',
    advice: '',
    signature: '',
    date: '',
  },
  {
    id: 20004,
    duty: '技术负责人',
    advice: '',
    signature: '',
    date: '',
  },
  {
    id: 20005,
    duty: '监督人',
    advice: '',
    signature: '',
    date: '',
  },
]

export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  const [adviceEditable, setAdviceEditableRow] = useState<React.Key[]>(() =>
    adviceData.map((item) => item.id)
  );

  const request = async () => {
    return {}
  }
  const onFinish = async (values: any) => {
    //await waitTime(2000);
    console.log(values);
    //todo
    message.success('提交成功');
  }
  return (
    <ProForm
      onFinish={onFinish}
      request={request}
    >

      <ProForm.Group>
        <ProFormText
          width="md"
          name="softName"
          label="软件名称"
          tooltip="最长为 24 位"
          placeholder="请输入名称"
          rules={[{required: true, message: '这是必填项'}]}
        />
        <ProFormText width="md"
                     name="version"
                     label="版本号"
                     placeholder="请输入版本号"
                     rules={[{required: true, message: '这是必填项'}]}
        />
        <ProForm.Group>
          <ProFormText
            width="md"
            name="contractId"
            label="主合同编号"
            tooltip="最长为 24 位"
            placeholder="请输入编号"
            rules={[{required: true, message: '这是必填项'}]}
          />
          <ProFormText width="md"
                       name="type"
                       label="测试类别"
                       placeholder="请输入类别"
                       rules={[{required: true, message: '这是必填项'}]}
          />
        </ProForm.Group>
      </ProForm.Group>
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

      <ProForm.Item
        label=""
        name="adviceDataSource"
        initialValue={adviceData}
        trigger="onValuesChange"
      >
        <EditableProTable<AdviceType>
          rowKey="id"
          toolBarRender={false}
          columns={adviceColumns}
          recordCreatorProps={{
            newRecordType: undefined,
            hidden: true,
            record: () => ({
              id: Date.now(),
            }),
          }}
          editable={{
            type: 'multiple',
            editableKeys: adviceEditable,
            onChange: setAdviceEditableRow,
            //actionRender: (row, config, dom) => []
          }}
        />
      </ProForm.Item>
    </ProForm>
  );
};
