import React, {useRef, useState} from 'react';
import {Button, Input, message, PageHeader} from 'antd';
import type {ProFormInstance} from '@ant-design/pro-form';
import ProForm, {ProFormText} from '@ant-design/pro-form';
import type {ProColumns} from '@ant-design/pro-table';
import {EditableProTable} from '@ant-design/pro-table';
import {
  auditSolutionFail,
  auditSolutionSuccess,
  getSolution,
  getTable13,
  saveTable13
} from "@/services/ant-design-pro/solution/api";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import ProCard from "@ant-design/pro-card";
import {PageContainer} from "@ant-design/pro-layout";

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

const SolutionReviewForm13: React.FC<{
  editable: boolean,
}> = (props) => {
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: '评审内容',
      dataIndex: 'title',
      width: '30%',
      editable: false,
    },
    {
      title: '是否通过',
      editable: () => props.editable,
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
      editable: () => props.editable,
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
      editable: () => props.editable,
      dataIndex: 'advice',
    },
    {
      title: '签字',
      editable: () => props.editable,
      dataIndex: 'signature',
      renderFormItem: (_, {record}) => {
        console.log('----===>', record);
        return <Input addonBefore={(record as any)?.addonBefore}/>;
      },
    },
    {
      title: '日期',
      editable: () => props.editable,
      dataIndex: 'date',
      valueType: "date",
      initialValue: new Date(),
    },
  ];
  const [solutionId, setSolutionId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = (params.state as any).id;
  const formRef = useRef<ProFormInstance>();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    defaultData.map((item) => item.id)
  );
  const [adviceEditable, setAdviceEditableRow] = useState<React.Key[]>(() =>
    adviceData.map((item) => item.id)
  );

  const request = async () => {
    //如果已经有了对应的solutionId,填一下
    //console.log('delegationId = ' + delegationId);
    const sId = (await getDelegationById(delegationId)).data.solutionId;
    //console.log(sId);
    //注意useState异步更新，不同步
    setSolutionId(sId);
    //console.log('solutionId = ' + sId);
    if (!sId) {
      return {};
    }

    const solution = await getSolution({id: sId!});
    const id: number = solution.data.table13Id;
    const resp = await getTable13({id: id!});
    if (resp.data == null) {
      return {};
    }
    return resp.data;
  }
  const onSave = async () => {
    console.log('save');
    const values = formRef.current?.getFieldFormatValue!();
    console.log('values = ' + values);
    const resp = await saveTable13({
      solutionId: solutionId!,
      data: values,
    })
    if (resp.code != 0) {
      message.error(resp.msg);
    } else {
      message.success('保存成功');
    }
    return true;
  }
  const auditFail = async () => {
    const resp = await auditSolutionFail(solutionId!);
    if (resp.code != 0) {
      message.error(resp.msg);
      return false;
    }
    message.success('提交成功');
    return true;
  }
  const auditSuccess = async () => {
    const resp = await auditSolutionSuccess(solutionId!);
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
        className="test-form"
        title="测试方案评审表"
      />
      <ProCard>
        <ProForm
          onFinish={onSave}
          request={request}
          formRef={formRef}
          submitter={{
            render: () => {
              if (props.editable) {
                return ([
                  <div style={
                    {
                      textAlign: "right",
                      margin: 20,
                    }
                  }>
                    <ProForm.Group>
                      <Button type="primary" key="submit" onClick={onSave}>
                        保存
                      </Button>
                      <Button danger type="primary" key="submit" onClick={auditFail}>
                        不通过
                      </Button>
                      <Button type="primary" key="submit" onClick={auditSuccess}>
                        通过
                      </Button>
                    </ProForm.Group>
                  </div>
                ]);
              }
              return [];
            },
          }}
        >
          <ProForm.Group>
            <ProFormText
              width="md"
              name="softName"
              label="软件名称"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
              rules={[{required: true, message: '这是必填项'}]}
              disabled={!props.editable}
            />
            <ProFormText width="md"
                         name="version"
                         label="版本号"
                         placeholder="请输入版本号"
                         rules={[{required: true, message: '这是必填项'}]}
                         disabled={!props.editable}
            />
            <ProForm.Group>
              <ProFormText
                width="md"
                name="contractId"
                label="主合同编号"
                tooltip="最长为 24 位"
                placeholder="请输入编号"
                rules={[{required: true, message: '这是必填项'}]}
                disabled={!props.editable}
              />
              <ProFormText width="md"
                           name="type"
                           label="测试类别"
                           placeholder="请输入类别"
                           rules={[{required: true, message: '这是必填项'}]}
                           disabled={!props.editable}
              />
            </ProForm.Group>
          </ProForm.Group>
          <ProForm.Item
            label=""
            name="result"
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
            name="advice"
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
      </ProCard>
    </PageContainer>
  );
};
export default SolutionReviewForm13;
