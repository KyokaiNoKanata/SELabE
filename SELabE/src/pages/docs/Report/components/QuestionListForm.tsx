import {PageContainer} from "@ant-design/pro-layout";
import {message, PageHeader} from "antd";
import ProForm from "@ant-design/pro-form";
import React, {useState} from 'react';
import ProCard from "@ant-design/pro-card";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {createReport, getReport, getTable11, saveTable11} from "@/services/ant-design-pro/report/api";

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


/**
 * 问题清单 table11
 * @param props isClient 判断身份是不是客户，如果是，则前面只能看不能写，最后签字，不然，是市场部，
 * @constructor
 */
//editable为true可编辑
const QuestionListForm: React.FC<{ editable: boolean }> = (props) => {
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '序号',
      dataIndex: 'qid',
      width: "8%",
      editable: () => props.editable,
    },
    {
      title: '问题（缺陷）简要描述',
      editable: () => props.editable,
      dataIndex: 'desc',
    },
    {
      title: '对应需求条目',
      editable: () => props.editable,
      dataIndex: 'requirementitem',
    },
    {
      title: '发现缺陷的初始条件',
      dataIndex: 'initialconditions',
      editable: () => props.editable,
    },
    {
      title: '发现缺陷用例及具体操作路径（要具体）',
      dataIndex: 'defectcases',
      editable: () => props.editable,
    },
    {
      title: '关联用例',
      dataIndex: 'associatedcases',
      editable: () => props.editable,
    },
    {
      title: '发现时间',
      editable: () => props.editable,
      dataIndex: 'time',
    },
    {
      title: '责任人',
      editable: () => props.editable,
      dataIndex: 'responsible',
    },
    {
      title: '修改建议',
      editable: () => props.editable,
      dataIndex: 'suggest',
    },
    {
      title: '操作',
      valueType: 'option',
      editable: () => props.editable,
      width: '1%',
    },
  ];
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = (params.state as any).id;

  //const formRef = useRef<ProFormInstance>();
  function Display() {
    if (props.editable) {
      return '';
    } else {
      return 'none';
    }
  }


  const sub = Display();
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
                props.editable && (doms[0], doms[1])
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
