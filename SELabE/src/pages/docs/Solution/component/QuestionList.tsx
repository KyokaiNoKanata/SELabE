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
  qid?: string;
  desc?:string;
  requirementitem?:string;
  initialconditions?:string;
  defectcases?:string;
  associatedcases?:string;
  time?:string;
  responsible?:string;
  suggest?:string;
  children?: DataSourceType[];
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'qid',
    width:"8%",
  },
  {
    title: '问题（缺陷）简要描述',
    dataIndex: 'desc',
  },
  {
    title: '对应需求条目',
    dataIndex: 'requirementitem',
  },
  {
    title: '发现缺陷的初始条件',
    dataIndex: 'initialconditions',
  },
  {
      title: '发现缺陷用例及具体操作路径（要具体）',
      dataIndex: 'defectcases',
  },
  {
      title: '关联用例',
      dataIndex: 'associatedcases',
  },
  {
      title: '发现时间',
      dataIndex: 'time',
  },
  {
      title: '责任人',
      dataIndex: 'responsible',
  },
  {
      title: '修改建议',
      dataIndex: 'suggest',
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
const QuestionListForm: React.FC<{editable: boolean}> = (props) => {
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
export default QuestionListForm;
