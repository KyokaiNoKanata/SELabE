import type {
  ProFormInstance} from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  StepsForm,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {Button, message, PageHeader,} from 'antd';
import {PageContainer} from '@ant-design/pro-layout';
import {useLocation} from "umi";
import {
  getDelegationById,
  getTable14,
  saveTable14,
  testingAuditFail,
  testingAuditSuccess,
} from '@/services/ant-design-pro/delegation/api';
import React, {useRef, useState} from "react";
import type { ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";

type ReviewItemType = {
  id: number;
  type?: string;
  name?: string;
  desc?: string;
  result?: string;
  explain?: string;
}

const StepDocReview14: React.FC<{editable: boolean}> = (props) => {
  const reviewColumns: ProColumns<ReviewItemType>[] = [
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
      editable: () => props.editable,
    },
    {
      title: '评审结果说明',
      dataIndex: 'explain',
      editable: () => props.editable,
    },
  ]
  const reviewData: ReviewItemType[] = [
    {
      id: 11,
      type: '1',
      name: '可用性',
      desc: '产品说明对于用户和潜在需方是可用的',
      result: '',
      explain: '',
    },
    {
      id: 21,
      type: '2',
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
      type: '3',
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
      type: '4',
      name: '功能性陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的功能进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 51,
      type: '5',
      name: '可靠性陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的可靠性进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 61,
      type: '6',
      name: '易用性陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的易用性进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 71,
      type: '7',
      name: '效率陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的效率进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 81,
      type: '8',
      name: '维护性陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的维护性进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 91,
      type: '9',
      name: '可移植性陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的可移植性进行陈述',
      result: '',
      explain: '',
    },
    {
      id: 101,
      type: '10',
      name: '使用质量陈述',
      desc: '根据GB/T 25000.51-2010规范对软件的使用质量进行陈述',
      result: '',
      explain: '',
    },
  ]
  const documentReviewData: ReviewItemType[] = [
    {
      id: 1001,
      type: '1',
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
      type: '2',
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
      type: '3',
      name: '一致性',
      desc: '文档集中的各文档不相互矛盾, 与产品说明也不矛盾',
      result: '',
      explain: '',
    },
    {
      id: 1041,
      type: '4',
      name: '易理解性',
      desc: '使用用户可理解的术语和文体',
      result: '',
      explain: '',
    },
    {
      id: 1042,
      type: '',
      name: '',
      desc: '文档集为用户使用该软件提供必要的信息',
      result: '',
      explain: '',
    },
    {
      id: 1051,
      type: '5',
      name: '易学性',
      desc: '为如何使用该软件提供了足够的信息',
      result: '',
      explain: '',
    },
    {
      id: 1061,
      type: '6',
      name: '可操作性',
      desc: '电子文档可打印',
      result: '',
      explain: '',
    },
    {
      id: 1062,
      type: '',
      name: '',
      desc: '有目次(主题词列表)和索引',
      result: '',
      explain: '',
    },
    {
      id: 1063,
      type: '',
      name: '',
      desc: '不常用术语缩略语有定义',
      result: '',
      explain: '',
    },
  ]
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>(() =>
    reviewData.map((item) => item.id)
  );
  const [documentEditableKeys, setDocumentEditableRowKeys] = useState<React.Key[]>(() =>
    documentReviewData.map((item) => item.id)
  );
  const params = useLocation();
  /**
   * 委托编号
   */
  const delegationId = !params.state ? -1 : (params.state as any).id;
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  /**
   * 获取table14内容
   */
  const request = async () => {
    const delegation = (await getDelegationById(delegationId)).data;
    const table14Id = delegation.table14Id;
    if (table14Id == undefined) {
      return {
        '软件名称': delegation.softwareName,
        '版本号': delegation.version,
        '委托单位': delegation.clientUnit,
      }
    }
    const resp = await getTable14({
      id: String(table14Id),
    });
    const {_id, deleted, ...data} = resp.data;//剔除后端自带的字段，不然提交会有问题
    //const obj = JSON.parse(resp.data);
    return data;
  }
  /**
   * 保存table14
   * @param value json 对象
   */
  const onSave = async (value: any) => {
    const data = value;
    //const data: object = formRef.current?.getFieldFormatValue!();//
    //console.log(formRef.current)
    //console.log(data);
    const id: number = parseInt(delegationId);
    //console.log(id)
    saveTable14({
      delegationId: id,
      data: data,
    }).then(res => {
      if (res.code == 0) {
        message.success('保存成功');
      } else {
        message.error(res.msg);
      }
    });
    return false;//
  }
  /**
   * 不通过
   * @param data
   */
  const handleAuditFailTesting = async (data: {
    id: number,//委托编号
    remark: string,//审核意见
  }) => {
    const res = await testingAuditFail({
      id: data.id,
      remark: data.remark,
    });
    if (res.data == true) {
      message.success('提交成功');
    } else {
      message.error(res.msg)
    }
  }
  /**
   * 通过
   * @param data
   */
  const handleAuditSuccessTesting = async (data: {
    id: number,
    remark: string,
  }) => {
    const res = await testingAuditSuccess({
      id: data.id,
      remark: data.remark,
    });
    console.log(res)
    if (res.code == 0) {
      message.success('提交成功');
    } else {
      message.error(res.msg)
    }
  }
  /**
   * 提交审核意见
   */
  const onSubmit = async () => {
    //onSave(values)
    const id: number = parseInt(delegationId);
    const pass = formRef.current?.getFieldFormatValue!(['是否通过']);
    const remark = formRef.current?.getFieldFormatValue!(['审核意见']);
    //通过
    if (pass == '通过') {
      await handleAuditSuccessTesting({
        id: id,
        remark: remark
      });
    }
    //不通过
    else if (pass == '不通过') {
      await handleAuditFailTesting({
        id: id,
        remark: remark
      });
    } else {
      message.warning('请选择是否通过')
    }
    return false;
  }


  return (
    <PageContainer content="">
      <PageHeader
        className="软件文档评审表"
        title="软件文档评审表"
      />
      <ProCard>
        <StepsForm
          formRef={formRef}
          onFinish={onSave}
          submitter={{
            render: (submitterProps) => {
              if (submitterProps.step === 0) {
                return (
                  <div style={
                    {
                      textAlign: "center",
                      margin: 20,
                    }
                  }><Button type="primary" onClick={() => submitterProps.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>
                  </div>
                );
              } else if (submitterProps.step === 1) {
                return (
                  <div style={
                    {
                      textAlign: "center",
                      margin: 20,
                    }
                  }>
                    <Button onClick={() => submitterProps.onPre?.()}>
                      {'<'} 上一步
                    </Button>,
                    <Button type="primary" onClick={() => submitterProps.onSubmit?.()}>
                      下一步 {'>'}
                    </Button></div>
                );
              } else if (submitterProps.step === 2) {
                return (
                  <div style={
                    {
                      textAlign: "center",
                      margin: 20,
                    }
                  }>
                    <Button onClick={() => submitterProps.onPre?.()}>
                      {'<'} 上一步
                    </Button>,
                    <Button type="primary" onClick={() => submitterProps.onSubmit?.()}>
                      下一步 {'>'}
                    </Button>,
                  </div>
                );
              } else return (
                <div style={
                  {
                    textAlign: "right",
                    margin: 20,
                  }
                }>
                  <ProForm.Group>
                    <Button onClick={() => submitterProps.onPre?.()}>
                      {'<'} 上一步
                    </Button>
                    <Button type="primary" key="submit" onClick={() => submitterProps.onSubmit?.()}>
                      保存
                    </Button>
                    <Button type="primary" key="submit" onClick={() => onSubmit()}>
                      提交
                    </Button>
                  </ProForm.Group>
                </div>
              );
            },
          }}
          stepsProps={{
            direction: 'horizontal'
          }}

        >
          <StepsForm.StepForm
            name="step1"
            title="第一页"
            stepProps={{
              description: '基本信息',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第一页结束')
              //await waitTime(1000);
              return true;
            }}
            request={request}
          >
            <PageHeader
              title={'软件文档评审表'}
            />
            <ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="软件名称"
                  label="软件名称"
                  tooltip=""
                  placeholder="请输入名称"
                  disabled={true}
                  rules={[{required: true, message: '这是必填项'}]}
                />
                <ProFormText width="md"
                             name="版本号"
                             label="版本号"
                             placeholder="请输入版本号"
                             disabled={true}
                             rules={[{required: true, message: '这是必填项'}]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="xl"
                  name="委托单位"
                  label="委托单位"
                  tooltip=""
                  placeholder="请输入委托单位"
                  disabled={true}
                  rules={[{required: true, message: '这是必填项'}]}
                />
              </ProForm.Group>
              <ProForm.Group>
                <ProFormText
                  width="md"
                  name="评审人"
                  label="评审人"
                  tooltip=""
                  placeholder="请输入评审人"
                  rules={[{required: true, message: '这是必填项'}]}
                  disabled={!props.editable}
                />

                <ProFormDatePicker
                  name='time'
                  label="评审完成时间"
                  rules={[{required: true, message: '这是必填项'}]}
                  disabled={!props.editable}
                />
              </ProForm.Group>
            </ProForm.Group>
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="step2"
            title="第二页"
            stepProps={{
              description: '一、软件说明部分评审',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第二页结束')
              return true;
            }}
            request={request}
          >
            <ProForm.Group>
              <PageHeader
                className="一、软件说明部分评审"
                title="一、软件说明部分评审"
              />
              <ProForm.Item
                label=""
                name="softwareReviewData"
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
                      id: 0
                    })
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

          </StepsForm.StepForm>

          <StepsForm.StepForm
            name="step3"
            title="第三页"
            stepProps={{
              description: '软件文档集评审',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第三页结束')
              return true;
            }}
            request={request}
          >
            <ProForm.Group>
              <PageHeader
                className="二、软件文档集评审"
                title="二、软件文档集评审"
              />
              <ProForm.Item
                label=""
                name="软件文档集评审"
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
                      id: 0,
                    }),
                  }}
                  editable={{
                    type: 'multiple',
                    editableKeys: documentEditableKeys,
                    onChange: setDocumentEditableRowKeys,
                    actionRender: (row, _, dom) => {
                      return [dom.delete];
                    },
                  }}
                  onReset={() => {
                  }}
                />
              </ProForm.Item>
              <ProForm.Group
                style={{textAlign: "right"}}
              >
                <ProFormText
                  width="md"
                  name="检查人"
                  label="检查人"
                  tooltip=""
                  placeholder="请输入检查人"
                  rules={[{required: true, message: '这是必填项'}]}
                  disabled={!props.editable}
                />
              </ProForm.Group>
            </ProForm.Group>
          </StepsForm.StepForm>
          <StepsForm.StepForm
            name="step4"
            title="第四页"
            stepProps={{
              description: '审核意见',
            }}
            request={request}
          >
            <ProForm.Group>
              <PageHeader
                className="review"
                title=""
              />
              <ProFormSelect
                showSearch
                width="md"
                label="是否通过"
                name="是否通过"
                placeholder={'选择是否通过'}
                valueEnum={{
                  '通过': '通过',
                  '不通过': '不通过',
                }}
                required
                disabled={!props.editable}
              />
              <ProFormText
                width="md"
                name="审核意见"
                label="审核意见"
                placeholder="请输入审核意见"
                initialValue={''}
                disabled={!props.editable}
              />
            </ProForm.Group>
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  );
};

export default StepDocReview14;
