import {PageContainer} from "@ant-design/pro-layout";
import {message, PageHeader} from "antd";
import ProForm from "@ant-design/pro-form";
import React, {useState} from 'react';
import ProCard from "@ant-design/pro-card";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";

import {createReport, getReport, getTable8, saveTable8} from "@/services/ant-design-pro/report/api";


/**
 * @param props isClient 判断身份是不是客户，如果是，则前面只能看不能写，最后签字，不然，是市场部，
 * @constructor
 */
//editable为true可编辑
const TestCaseForm: React.FC<{ editable: boolean }> = (props) => {
  type DataSourceType = {
    id: React.Key;
    classification?: string;
    tid?: string;
    design?: string;
    statute?: string;
    result?: string;
    author?: string;
    time?: string;
    children?: DataSourceType[];
  };

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '测试分类',
      dataIndex: 'classification',
      editable: () => props.editable,
    },
    {
      title: 'ID',
      dataIndex: 'tid',
      width: "10%",
      editable: props.editable,
    },
    {
      title: '测试用例设计说明',
      dataIndex: 'design',
      editable: props.editable,
    },
    {
      title: '与本测试用例有关的规约说明',
      dataIndex: 'statute',
      editable: props.editable,
    },
    {
      title: '预期的结果',
      dataIndex: 'result',
      editable: props.editable,
    },
    {
      title: '测试用例设计者',
      dataIndex: 'author',
      editable: props.editable,
    },
    {
      title: '测试时间',
      dataIndex: 'time',
      editable: props.editable,
    },

    {
      title: '操作',
      valueType: 'option',
      editable: props.editable,
      width: '5%',
    },
  ];
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = (params.state as any).id;
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
    if (!rId) {
      //创建一下report
      const resp = await createReport({
        delegationId: delegationId,
      })
      setReportId(resp.data);
      return {};
    }
    //测试用例 table8
    const report = await getReport({reportId: rId!});
    console.log(report);
    const table8Id = report.data.table8Id;
    const resp = await getTable8({id: table8Id})
    if (resp.data == null) {
      return {};
    }
    console.log(resp.data);
    return resp.data;
  };
  //保存
  const onFinish = async (values: any) => {
    console.log(values);
    const resp = await saveTable8({
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
                props.editable && (doms[0], doms[1]),
                //props.editable && <Button htmlType="button" onClick={handleSubmit} key='submit'>提交</Button>,

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
export default TestCaseForm;
