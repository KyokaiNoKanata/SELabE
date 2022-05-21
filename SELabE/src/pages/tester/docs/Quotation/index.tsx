import {PageContainer} from "@ant-design/pro-layout";
import {PageHeader} from "antd";
import ProForm, {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormText
} from "@ant-design/pro-form";
import type {ProColumns} from '@ant-design/pro-components';
import {EditableProTable} from '@ant-design/pro-components';
import React, {useState} from 'react';


type DataSourceType = {
  id: React.Key;
  xiangmu?: string;
  fenxiang?: string;
  danjia?: string;
  shuoming?: string;
  hangheji?: string;
  children?: DataSourceType[];
};


const columns: ProColumns<DataSourceType>[] = [
  {
    title: '项目',
    dataIndex: 'xiangmu',
  },
  {
    title: '分项',
    dataIndex: 'fenxiang',
  },
  {
    title: '单价',
    dataIndex: 'danjia',
  },
  {
    title: '说明',
    dataIndex: 'shuoming',
  },
  {
    title: '行合计',
    dataIndex: 'hangheji',
  },
  {
    title: '操作',
    valueType: 'option',
  },
];

const onFinish = async (value: any) => {
  console.log(value);
};


const Quotation = () => {

  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  return (
    <PageContainer>
      <PageHeader
        className="quotation"
        title="报价单"
      />
      <ProForm
        key={'quotation'}
        onFinish={onFinish}
      >
        <ProFormDatePicker name="报价日期" label="报价日期"/>
        <ProFormDateRangePicker name="报价有效期" label="报价有效期"/>
        <ProFormText name="软件名称" label="软件名称" width="md"/>
        <ProForm.Item
          name="项目表格"
          trigger="onValuesChange"
        >
          <EditableProTable<DataSourceType>
            rowKey="id"
            toolBarRender={false}
            columns={columns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              position: 'bottom',
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
        <ProFormText name="小计" label="小计" width="xl"/>
        <ProFormText name="税率（8%）" label="税率（8%）" width="xl"/>
        <ProFormText name="总计" label="总计" width="xl"/>
        <ProFormText name="报价提供人" label="报价提供人" width="xl"/>
        <ProFormText name="如果接受报价，请在此签字" label="如果接受报价，请在此签字" width="xl"/>
      </ProForm>
    </PageContainer>
  );
}
export default Quotation;
