import {PageContainer} from "@ant-design/pro-layout";
import {Button, message, PageHeader} from "antd";
import ProForm, {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormText
} from "@ant-design/pro-form";
import React, {useRef, useState} from 'react';
import ProCard from "@ant-design/pro-card";
import {EditableProTable, ProColumns} from "@ant-design/pro-table";
import {useLocation} from "react-router-dom";
import {ProFormInstance} from "@ant-design/pro-form/lib/BaseForm/BaseForm";

type DataSourceType = {
  id: React.Key;
  classification?: string;
  tid?: string;
  design?: string;
  statute?:string;
  preconditions?:string;
  process?:string;
  result?: string;
  author?:string;
  reality?:string;
  accord?:string;
  bugid?:string;
  executor?:string;
  confirmor?:string;
  children?: DataSourceType[];
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '测试分类',
    dataIndex: 'classification',
  },
  {
    title: 'ID',
    dataIndex: 'tid',
  },
  {
    title: '测试用例设计说明',
    dataIndex: 'design',
  },
  {
    title: '与本测试用例有关的规约说明',
    dataIndex: 'statute',
  },
  {
      title: '前提条件',
      dataIndex: 'preconditions',
  },
  {
    title: '预期的结果',
    dataIndex: 'result',
  },
  {
      title: '测试用例设计者',
      dataIndex: 'author',
  },
  {
      title: '实际结果',
      dataIndex: 'reality',
  },
  {
      title: '是否与预期结果一致',
      dataIndex: 'accord',
  },
  {
      title: '相关的BUG编号',
      dataIndex: 'bugid',
  },
  {
      title: '用例执行者',
      dataIndex: 'executor',
  },
  {
      title: '执行测试时间',
      dataIndex: 'time',
  },
  {
      title: '确认人',
      dataIndex: 'confirmor',
  },
  {
    title: '操作',
    valueType: 'option',
    width:'1%',
  },
];



/**
 * @param props isClient 判断身份是不是客户，如果是，则前面只能看不能写，最后签字，不然，是市场部，
 * @constructor
 */
//editable为true可编辑
const TestRecordForm: React.FC<{editable: boolean}> = (props) => {
  const Display=async()=>{
    if(props.editable)
      {return '';}
     else
     {return 'none';}

  }
  const sub={Display};
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const request = async () => {
   return {};
  };
  //保存
  const onFinish = async (value: any) => {
   console.log(value);
      };
  //提交:提交委托号即可
  const handleSubmit = async () => {
    console.log("提交")
  }
  //接受，需要签字


  return (
    <PageContainer>
      <PageHeader
        className="testcase"
        title="测试用例"
      />
      <ProCard>
        <ProForm
          key={'testcase'}
          onFinish={onFinish}
          request={request}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '保存',
            },
            submitButtonProps: {
              style: {
                  display: sub,
                }
            },
            render: (_, doms) => {
              return  [
                props.editable && (doms[0], doms[1]),
                props.editable && <Button htmlType="button" onClick={handleSubmit} key='submit'>提交</Button>,

              ]
            }
          }}
        >

          <ProForm.Item
            name="测试用例"
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
                hidden: !props.editable,
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

        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
export default TestRecordForm;
