import {PageContainer} from "@ant-design/pro-layout";
import {Button, message, PageHeader} from "antd";
import ProForm from "@ant-design/pro-form";
import React, {useState} from 'react';
import ProCard from "@ant-design/pro-card";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {createReport, getReport, getTable11, saveTable11, submitReport} from "@/services/ant-design-pro/report/api";

type DataSourceType = {
  id: React.Key;
  qid?: string;
  desc?: string;
  requirementitem?: string;
  initialconditions?: string;
  defectcases?: string;
  associatedcases?: string;
  time?: string;
  responsible?: string;
  suggest?: string;
  children?: DataSourceType[];
};

const columns: ProColumns<DataSourceType>[] = [
  {
    title: '序号',
    dataIndex: 'qid',
    width: "8%",
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
    width: '1%',
  },
];


/**
 * 问题清单 table11
 * @param props isClient 判断身份是不是客户，如果是，则前面只能看不能写，最后签字，不然，是市场部，
 * @constructor
 */
//editable为true可编辑
const QuestionListForm: React.FC<{ editable: boolean }> = (props) => {
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = (params as any).query.id;
  //const formRef = useRef<ProFormInstance>();
  const Display = async () => {
    if (props.editable) {
      return '';
    } else {
      return 'none';
    }

  }
  const sub = {Display};
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() => []);
  const request = async () => {
    //如果已经有了对应的reportId,填一下
    const rId = (await getDelegationById(delegationId)).data.reportId;
    setReportId(rId);
    //console.log('solutionId = ' + sId);
    //如果没有report
    if (!rId) {
      //创建一下report
      await createReport({
        delegationId: delegationId,
      })
      return {};
    }
    //问题清单 table11
    const solution = await getReport({reportId: rId!});
    const table11Id = solution.data.table11Id;
    const resp = await getTable11({id: table11Id})
    if (resp.data == null) {
      return {};
    }
    console.log(resp.data);
    return resp.data;
  };
  //保存
  const onFinish = async (values: any) => {
    console.log(values);
    const resp = await saveTable11({
      reportId: reportId!,
      data: values,
    })
    if (resp.code != 0) {
      message.error(resp.msg);
    } else {
      message.success('保存成功');
    }
    return true;
  };
  //提交
  const handleSubmit = async () => {
    console.log("提交")
    const resp = await submitReport({
      reportId: reportId!
    })
    if (resp.code != 0) {
      message.error(resp.msg);
      return false;
    }
    message.success('提交成功');
    return true;
  }


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
              return [
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
