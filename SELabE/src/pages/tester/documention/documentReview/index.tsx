import React, { useState } from 'react';
import {Input, message, PageHeader} from 'antd';
import ProForm, {ProFormContext, ProFormDatePicker, ProFormDateRangePicker, ProFormText} from '@ant-design/pro-form';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import {curryRight, eachRight, iteratee} from "lodash";
import Line from "antd/es/progress/Line";
import ProLayout, {FooterToolbar} from "@ant-design/pro-layout";
import rightContent from "@/components/RightContent";

const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

type ReviewItemType = {
  id: React.Key;
  type: number;
  name: string;
  desc: string;
  result: string;
  explain: string;
}
const reviewColumns:  ProColumns<ReviewItemType>[] = [
  {
    title: '评审类别',
    dataIndex: 'type',
    editable: false,
    width: '8%',
  },
  {
    title: '评审项',
    dataIndex: 'name',
    editable: false,
    width: '15%',
  },
  {
    title: '评审内容',
    dataIndex: 'desc',
    editable: false,
  },
  {
    title: '评审结果',
    dataIndex: 'result',
    width: '20%',
  },
  {
    title: '评审结果说明',
    dataIndex: 'explain',
  },
]
const reviewData: ReviewItemType[] = [
  {
    id: 11,
    type: 1,
    name: '可用性',
    desc: '产品说明对于用户和潜在需方是可用的',
    result: '',
    explain: '',
  },
  {
    id: 21,
    type: 2,
    name: '内容',
    desc: '足够用于评价适用性',
    result: '',
    explain: '',
  },
  {
    id: 22,
    type: '',
    name: '',
    desc: '排除内在的不一致',
    result: '',
    explain: '',
  },
  {
    id: 23,
    type: '',
    name: '',
    desc: '可测试或可验证的',
    result: '',
    explain: '',
  },
  {
    id: 31,
    type: 3,
    name: '标识和标示',
    desc: '显示唯一标识',
    result: '',
    explain: '',
  },
  {
    id: 32,
    type: '',
    name: '',
    desc: '通过名称版本和日期指称',
    result: '',
    explain: '',
  },
  {
    id: 33,
    type: '',
    name: '',
    desc: '包含供方和至少一家经销商的名称和地址',
    result: '',
    explain: '',
  },
  {
    id: 41,
    type: 4,
    name: '功能性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的功能进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 51,
    type: 5,
    name: '可靠性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的可靠性进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 61,
    type: 6,
    name: '易用性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的易用性进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 71,
    type: 7,
    name: '效率陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的效率进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 81,
    type: 8,
    name: '维护性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的维护性进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 91,
    type: 9,
    name: '可移植性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的可移植性进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 101,
    type: 10,
    name: '使用质量陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的使用质量进行陈述',
    result: '',
    explain: '',
  },
]
const documentReviewData: ReviewItemType[] = [
  {
    id: 1001,
    type: 1,
    name: '完备性',
    desc: '包含所有必需信息',
    result: '',
    explain: '',
  },
  {
    id: 1002,
    type: '',
    name: '',
    desc: '包含产品说明中所有功能以及可调用功能的说明',
    result: '',
    explain: '',
  },
  {
    id: 1003,
    type: '',
    name: '',
    desc: '包含可靠性特征及其操作',
    result: '',
    explain: '',
  },
  {
    id: 1004,
    type: '',
    name: '',
    desc: '包含已处理的和可造成系统失效终止的差错和失效',
    result: '',
    explain: '',
  },
  {
    id: 1005,
    type: '',
    name: '',
    desc: '必要的数据备份与恢复指南',
    result: '',
    explain: '',
  },
  {
    id: 1006,
    type: '',
    name: '',
    desc: '所有关键功能的完备的细则信息和参考信息',
    result: '',
    explain: '',
  },
  {
    id: 1007,
    type: '',
    name: '',
    desc: '陈述产品说明中所有限制',
    result: '',
    explain: '',
  },
  {
    id: 1008,
    type: '',
    name: '',
    desc: '陈述最大最小磁盘空间',
    result: '',
    explain: '',
  },
  {
    id: 1009,
    type: '',
    name: '',
    desc: '关于应用管理职能的所有必要信息',
    result: '',
    explain: '',
  },
  {
    id: 1010,
    type: '',
    name: '',
    desc: '让用户验证是否完成应用管理职能的信息',
    result: '',
    explain: '',
  },
  {
    id: 1011,
    type: '',
    name: '',
    desc: '文档集分若干部分，需给出完整标识',
    result: '',
    explain: '',
  },
  {
    id: 1021,
    type: 2,
    name: '正确性',
    desc: '文档中所有的信息都是正确的',
    result: '',
    explain: '',
  },
  {
    id: 1022,
    type: '',
    name: '',
    desc: '没有歧义的信息',
    result: '',
    explain: '',
  },
  {
    id: 1031,
    type: '',
    name: '',
    desc: '文档集中的各文档不相互矛盾, 与产品说明也不矛盾',
    result: '',
    explain: '',
  },
  {
    id: 1041,
    type: 4,
    name: '易理解性',
    desc: '使用用户可理解的术语和文体',
    result: '',
    explain: '',
  },
  {
    id: 1051,
    type: 5,
    name: '易学性',
    desc: '为如何使用该软件提供了足够的信息',
    result: '',
    explain: '',
  },
  {
    id: 1061,
    type: 6,
    name: '可操作性',
    desc: '电子文档可打印',
    result: '',
    explain: '',
  },
  {
    id: 1062,
    type: '',
    name: '功能性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的功能进行陈述',
    result: '',
    explain: '',
  },
  {
    id: 1063,
    type: '',
    name: '可靠性陈述',
    desc: '根据GB/T 25000.51-2010规范对软件的可靠性进行陈述',
    result: '',
    explain: '',
  },

  ]
export default () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    reviewData.map((item) => item.id)
  );
  const [documentEditableKeys, setDocumentEditableRowKeys] = useState<React.Key[]>(() =>
    documentReviewData.map((item) => item.id)
  );
  /*const [adviceEditable, setAdviceEditableRow] = useState<React.Key[]>(() =>
    adviceData.map((item) => item.id)
  );*/
  return (
    <ProForm<{
      name: string;
      company: string;
    }>
      onFinish={async (values) => {
        //await waitTime(2000);
        console.log(values);
        //todo
        message.success('提交成功');
      }}
      initialValues={{
        name: '001',
        useMode: 'chapter',
      }}
      submitter={{
        render: (_,dom) =>
          <div style={
            {textAlign:"right",
              margin:20,
            }
          }>
            {dom[0]}
            {dom[1]}
          </div>,
      }}
    >

      <ProForm.Group>
        <PageHeader
        title={'软件文档评审表'}
        >
      </PageHeader>
        <ProForm.Group>

        <ProFormText
          width="md"
          name="softName"
          label="软件名称"
          tooltip=""
          placeholder="请输入名称"
          rules={[{ required: true, message: '这是必填项' }]}
        />
        <ProFormText width="md"
                     name="version"
                     label="版本号"
                     placeholder="请输入版本号"
                     rules={[{ required: true, message: '这是必填项' }]}
        />
        </ProForm.Group>
          <ProForm.Group>
          <ProFormText
            width="xl"
            name="organization"
            label="委托单位"
            tooltip=""
            placeholder="请输入委托单位"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm.Group>

        <ProForm.Group>
          <ProFormText
            width="md"
            name="reviewer"
            label="评审人"
            tooltip=""
            placeholder="请输入评审人"
            rules={[{ required: true, message: '这是必填项' }]}
          />

          <ProFormDatePicker
            name='time'
            label="评审完成时间"
            rules={[{ required: true, message: '这是必填项' }]}
          />
        </ProForm.Group>

      </ProForm.Group>
      {/*一、软件说明部分评审*/}
      <ProForm.Group>
        <PageHeader
          className="site-page-header"
          title="一、软件说明部分评审"
        />
        <ProForm.Item
          label=""
          name="dataSource"
          initialValue={reviewData}
          trigger="onValuesChange"
        >
        <EditableProTable<ReviewItemType>
          rowKey="id"
          toolBarRender={false}
          columns={reviewColumns}
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
      </ProForm.Group>
      {/*二、软件文档集评审*/}
      <ProForm.Group>
        <PageHeader
          className="site-page-header"
          title="二、软件文档集评审"
        />
        <ProForm.Item
          label=""
          name="documentReviewData"
          initialValue={documentReviewData}
          trigger="onValuesChange"
        >
          <EditableProTable<ReviewItemType>
            rowKey="id"
            toolBarRender={false}
            columns={reviewColumns}
            recordCreatorProps={{
              newRecordType: 'dataSource',
              hidden: true,
              record: () => ({
                id: Date.now(),
              }),
            }}
            editable={{
              type: 'multiple',
              editableKeys:documentEditableKeys,
              onChange: setDocumentEditableRowKeys,
              actionRender: (row, _, dom) => {
                return [dom.delete];
              },
            }}
            onReset = {()=>{}}
          />
        </ProForm.Item>
      </ProForm.Group>
      {/*检查人*/}
      <ProForm.Group
        style={{textAlign:"right"}}
      >
        <ProFormText
          width="md"
          name="reviewer"
          label="检查人"
          tooltip=""
          placeholder="请输入检查人"
          rules={[{ required: true, message: '这是必填项' }]}
        />
      </ProForm.Group>
    </ProForm>
  );
};
