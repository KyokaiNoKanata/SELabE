import React, {useRef, useState} from 'react';
import type {ProFormInstance} from '@ant-design/pro-form';
import ProForm, {ProFormDateRangePicker, ProFormText, ProFormTextArea, StepsForm,} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import Text from 'antd/es/typography/Text';
import {
  createSolution,
  getSolution,
  getSolutionTable,
  saveSolution,
  submitSolution,
} from '@/services/ant-design-pro/solution/api';
import {Button, message} from 'antd';
import {useLocation} from 'react-router-dom';
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";

/**
 * 测试方案表单 table6
 * @param props.editable: 是否可以贱婢
 * @constructor
 */
const SolutionForm6: React.FC<{
  editable: boolean,//是否可编辑
}> = (props) => {
  //const [solutionId, setSolutionId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;
  const formRef = useRef<ProFormInstance>();
  const [solutionId, setSolutionId] = useState<number|undefined>(undefined);
  //let solutionId: number | undefined = undefined;
  const request = async () => {
    const sid = (await getDelegationById(delegationId)).data.solutionId;
    //注意useState异步更新，不同步
    if (!sid) {
      return {};
    }
    setSolutionId(sid);
    const solution = await getSolution({id: sid!});
    const id: string = solution.data.table6Id;
    const resp = await getSolutionTable({id: id});
    if (resp.data == null) {
      return {};
    }
    return resp.data;
  };
  /**
   * 提交测试方案
   */
  const onSubmit = async () => {
    if (!solutionId) {
      message.warning('请先保存');
      return false;
    }
    const resp = await submitSolution(solutionId);
    if (resp.code != 0 && resp.msg) {
      message.error(resp.msg)
      return false;
    }
    message.success('提交成功,请填写软件项目委托测试工作检查表相关内容');
    return true;
  }
  const onSave = async (values: any) => {
    let sid = solutionId;
    if(!sid) {
      sid = (await createSolution(delegationId)).data;
      setSolutionId(sid);
    }

    const res = await saveSolution({solutionId: sid!, data: values});
    if (res.code == 0) {
      message.success('保存成功');
    } else {
      message.error(res.msg);
    }
  }//需要写评审表
  return (
    <ProCard>
      <StepsForm
        onFinish={onSave}
        formRef={formRef}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
          },
        }}
        submitter={{
          render: (submitterProps) => {
            if (submitterProps.step != 5) {
              return [
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
                  </Button></div>,
              ];
            }
            //最后一页
            //可以保存，提交
            if (props.editable) {
              return ([
                <div style={
                  {
                    textAlign: "right",
                    margin: 20,
                  }
                }>
                  <ProForm.Group>
                    <Button onClick={() => submitterProps.onPre?.()}>
                      {'<'} 上一步
                    </Button>,
                    <Button type="primary" key="submit" onClick={() => submitterProps.onSubmit?.()}>
                      保存
                    </Button>
                    <Button type="primary" key="submit" onClick={onSubmit}>
                      提交
                    </Button>
                  </ProForm.Group>
                </div>
              ]);
            }
            //只读
            else {
              return ([
                <div style={
                  {
                    textAlign: "right",
                    margin: 20,
                  }
                }>
                  <ProForm.Group>
                    <Button onClick={() => submitterProps.onPre?.()}>
                      {'<'} 上一步
                    </Button>,
                  </ProForm.Group>
                </div>
              ]);
            }
          },
        }}
      >
        <StepsForm.StepForm<{
          name: string;
        }>
          name="introduction"
          title="引言"
          request={request}
        >
          <ProFormTextArea
            disabled={!props.editable}
            name="1-1 标识"
            label="1.1 标识"
            width="lg"
            placeholder="请输入标识"
            rules={[{required: true}]}
          />
          <ProFormTextArea
            disabled={!props.editable}
            name="1-2 系统概述"
            label="1.2 系统概述"
            width="lg"
            placeholder="请输入系统概述"
            rules={[{required: true}]}
          />
          <ProFormTextArea
            disabled={!props.editable}
            name="1-3 文档概述"
            label="1.3 文档概述"
            width="lg"
            placeholder="请输入文档概述"
            rules={[{required: true}]}
          />
          <ProFormTextArea
            disabled={!props.editable}
            name="基线"
            label="基线"
            width="lg"
            placeholder="请输入基线"
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="引用文件t"
          title="引用文件"
          request={request}
        >
          <ProFormTextArea
            disabled={!props.editable}
            name="引用文件"
            label="引用文件"
            width="lg"
            placeholder="请输入引用文件"
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="软件测试环境"
          title="软件测试环境"
          request={request}
        >
          <ProFormTextArea
            name="3-1 硬件"
            label="3.1 硬件"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="3-2 软件"
            label="3.2 软件"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="3-3 其他"
            label="3.3 其他"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="3-4 参与组织"
            label="3.4 参与组织"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="3-5 人员"
            label="3.5 人员"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="计划"
          title="计划"
          request={request}
        >
          <Text>
            本章描述了计划测试的总范围并且描述了本测试计划适用的每个测试，包括对相关文档的审查。
          </Text>
          <ProFormTextArea
            name="4-1 总体设计"
            label="4.1 总体设计"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="4-1-1 测试级别"
            label="4.1.1 测试级别"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="4-1-2 测试类别"
            label="4.1.2 测试类别"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="4-1-3 一般测试条件"
            label="4.1.3 一般测试条件"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="4-2 计划执行的测试"
            label="4.2 计划执行的测试"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
          <ProFormTextArea
            name="4-3 测试用例"
            label="4.3 测试用例"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="测试进度表"
          title="测试进度表"
          request={request}
        >
          <Text>
            此项目主要分为：业务测试和文档审查两部分的工作。两部分的工作可以并行完成。测试方为完成本方案所述的测试所需时间大约为XX个工作日，如测试需求产生变更会导致测试时间的变化。
          </Text>
          <br/>
          <ProForm.Group title="制定测试计划">
            <ProFormText
              name="workQuantity1"
              width="md"
              label="工作量"
              disabled={!props.editable}
              rules={[{required: true}]}
            />
            <ProFormDateRangePicker name="time1" label="起止时间" rules={[{required: true}]} disabled={!props.editable}/>
          </ProForm.Group>
          <ProForm.Group title="设计测试">
            <ProFormText
              name="workQuantity2"
              width="md"
              label="工作量"
              disabled={!props.editable}
              rules={[{required: true}]}
            />
            <ProFormDateRangePicker name="time2" label="起止时间" rules={[{required: true}]} disabled={!props.editable}/>
          </ProForm.Group>
          <ProForm.Group title="执行测试">
            <ProFormText
              name="workQuantity3"
              width="md"
              label="工作量"
              disabled={!props.editable}
              rules={[{required: true}]}
            />
            <ProFormDateRangePicker name="time3" label="起止时间" rules={[{required: true}]} disabled={!props.editable}/>
          </ProForm.Group>
          <ProForm.Group title="评估测试">
            <ProFormText
              name="workQuantity4"
              width="md"
              label="工作量"
              disabled={!props.editable}
              rules={[{required: true}]}
            />
            <ProFormDateRangePicker name="time4" label="起止时间" rules={[{required: true}]} disabled={!props.editable}/>
          </ProForm.Group>
        </StepsForm.StepForm>
        <StepsForm.StepForm
          name="需求的可追踪性t"
          title="需求的可追踪性"
          request={request}
        >
          <ProFormTextArea
            name="需求的可追踪性"
            label="需求的可追踪性"
            width="lg"
            disabled={!props.editable}
            rules={[{required: true}]}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
export default SolutionForm6;
