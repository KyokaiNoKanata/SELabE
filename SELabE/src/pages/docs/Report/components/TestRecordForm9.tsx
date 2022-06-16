import {PageContainer} from "@ant-design/pro-layout";
import {message, PageHeader} from "antd";
import ProForm from "@ant-design/pro-form";
import React, {useState} from 'react';
import ProCard from "@ant-design/pro-card";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {createReport, getReport, getTable9, saveTable9} from "@/services/ant-design-pro/report/api";
import Form from "@ant-design/pro-form";

/**
 * 测试记录 table9
 * @param editable 能否编辑
 * @constructor
 */
const TestRecordForm9: React.FC<{ editable: boolean }> = (props) => {
  type DataSourceType = {
    id: number;
    classification?: string;
    tid?: string;
    design?: string;
    statute?: string;
    preconditions?: string;
    process?: string;
    result?: string;
    author?: string;
    reality?: string;
    accord?: string;
    bugid?: string;
    executor?: string;
    confirmor?: string;
    children?: DataSourceType[];
  };
  const [dataSource,setDataSource] = useState<DataSourceType[]>([]);
  const [editForm] = Form.useForm();
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '测试分类',
      editable: () => props.editable,
      dataIndex: 'classification',
      initialValue: '',
    },
    {
      title: 'ID',
      editable: () => props.editable,
      dataIndex: 'tid',
      initialValue: '',
    },
    {
      title: '测试用例设计说明',
      editable: () => props.editable,
      dataIndex: 'design',
      initialValue: '',
    },
    {
      title: '与本测试用例有关的规约说明',
      editable: () => props.editable,
      dataIndex: 'statute',
      initialValue: '',
    },
    {
      title: '前提条件',
      editable: () => props.editable,
      dataIndex: 'preconditions',
      initialValue: '',
    },
    {
      title: '预期的结果',
      editable: () => props.editable,
      dataIndex: 'result',
      initialValue: '',
    },
    {
      title: '测试用例设计者',
      editable: () => props.editable,
      dataIndex: 'author',
      initialValue: '',
    },
    {
      title: '实际结果',
      editable: () => props.editable,
      dataIndex: 'reality',
      initialValue: '',
    },
    {
      title: '是否与预期结果一致',
      editable: () => props.editable,
      dataIndex: 'accord',
      initialValue: '',
    },
    {
      title: '相关的BUG编号',
      editable: () => props.editable,
      dataIndex: 'bugid',
      initialValue: '',
    },
    {
      title: '用例执行者',
      editable: () => props.editable,
      dataIndex: 'executor',
      initialValue: '',
    },
    {
      title: '执行测试时间',
      editable: () => props.editable,
      dataIndex: 'time',
      initialValue: '',
    },
    {
      title: '确认人',
      dataIndex: 'confirmor',
      editable: () => props.editable,
      initialValue: '',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '5%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setDataSource(dataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;

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
    if (!rId) {
      //没有，就先创建一下report
      await createReport({
        delegationId: delegationId,
      })
      return {};
    }
    const solution = await getReport({reportId: rId!});
    const table9Id = solution.data.table9Id;
    const resp = await getTable9({id: table9Id})
    if (resp.data == null) {
      return {};
    }
    setDataSource(resp.data.测试用例);
    return resp.data;
  };
  //保存
  const onFinish = async (values: any) => {
    if(values.测试用例.length == 0) {
      message.warning('测试记录不可以为空');
      return false;
    }
    const resp = await saveTable9({
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
        title="测试记录"
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
              value={dataSource}
              onChange={setDataSource}
              editable={{
                type: 'multiple',
                editableKeys,
                form: editForm,
                onChange: setEditableRowKeys,
              }}
            />
          </ProForm.Item>

        </ProForm>
      </ProCard>
    </PageContainer>
  );
}
export default TestRecordForm9;
