import { useRef } from 'react';
import type { ProFormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormDateRangePicker,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import Text from 'antd/es/typography/Text';
import {
  getSolution,
  getSolutionTable,
  saveSolution,
} from '@/services/ant-design-pro/solution/api';
import { message } from 'antd';
import { useLocation } from 'react-router-dom';

export default () => {
  const params = useLocation();
  const solutionId: number = parseInt((params as any).query.id);
  const formRef = useRef<ProFormInstance>();
  const request = async () => {
    const solution = await getSolution({ id: solutionId });
    const id: string = solution.data.table6Id;
    const resp = await getSolutionTable({ id: id });
    if (resp.data == null) {
      return {};
    }
    return resp.data;
  };
  return (
    <ProCard>
      <StepsForm<{
        name: string;
      }>
        onFinish={async (values) => {
          console.log(solutionId, values);
          saveSolution({ solutionId: solutionId, data: values }).then((res) => {
            if (res.code == 0) {
              message.success('保存成功');
            } else {
              message.error(res.msg);
            }
          });
        }}
        formRef={formRef}
        formProps={{
          validateMessages: {
            required: '此项为必填项',
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
            name="label"
            label="1.1 标识"
            width="lg"
            placeholder="请输入标识"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="systemOverview"
            label="1.2 系统概述"
            width="lg"
            placeholder="请输入系统概述"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="documentOverview"
            label="1.3 文档概述"
            width="lg"
            placeholder="请输入文档概述"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="baseLine"
            label="基线"
            width="lg"
            placeholder="请输入基线"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="quotedFile"
          title="引用文件"
          request={request}
        >
          <ProFormTextArea
            name="quotedFile"
            label="引用文件"
            width="lg"
            placeholder="请输入引用文件"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          checkbox: string;
        }>
          name="testEnvironment"
          title="软件测试环境"
          request={request}
        >
          <ProFormTextArea
            name="hardwareEnvironment"
            label="3.1 硬件"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="softwareEnvironment"
            label="3.2 软件"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="otherEnvironment"
            label="3.3 其他"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="participantOrganization"
            label="3.4 参与组织"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="participant"
            label="3.5 人员"
            width="lg"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="plan"
          title="计划"
          request={request}
        >
          <Text>
            本章描述了计划测试的总范围并且描述了本测试计划适用的每个测试，包括对相关文档的审查。
          </Text>
          <ProFormTextArea
            name="overallDesign"
            label="4.1 总体设计"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="testLayer"
            label="4.1.1 测试级别"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="testType"
            label="4.1.2 测试类别"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="generalTestCondition"
            label="4.1.3 一般测试条件"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="plannedTests"
            label="4.2 计划执行的测试"
            width="lg"
            rules={[{ required: true }]}
          />
          <ProFormTextArea
            name="testCases"
            label="4.3 测试用例"
            width="lg"
            rules={[{ required: true }]}
          />
        </StepsForm.StepForm>
        <StepsForm.StepForm<{
          name: string;
        }>
          name="testSchedule"
          title="测试进度表"
          request={request}
        >
          <Text>
            此项目主要分为：业务测试和文档审查两部分的工作。两部分的工作可以并行完成。测试方为完成本方案所述的测试所需时间大约为XX个工作日，如测试需求产生变更会导致测试时间的变化。
          </Text>
          <br />
          <ProForm.Group title="制定测试计划">
            <ProFormText
              name="workQuantity1"
              width="md"
              label="工作量"
              rules={[{ required: true }]}
            />
            <ProFormDateRangePicker name="time1" label="起止时间" rules={[{ required: true }]} />
          </ProForm.Group>
          <ProForm.Group title="设计测试">
            <ProFormText
              name="workQuantity2"
              width="md"
              label="工作量"
              rules={[{ required: true }]}
            />
            <ProFormDateRangePicker name="time2" label="起止时间" rules={[{ required: true }]} />
          </ProForm.Group>
          <ProForm.Group title="执行测试">
            <ProFormText
              name="workQuantity3"
              width="md"
              label="工作量"
              rules={[{ required: true }]}
            />
            <ProFormDateRangePicker name="time3" label="起止时间" rules={[{ required: true }]} />
          </ProForm.Group>
          <ProForm.Group title="评估测试">
            <ProFormText
              name="workQuantity4"
              width="md"
              label="工作量"
              rules={[{ required: true }]}
            />
            <ProFormDateRangePicker name="time4" label="起止时间" rules={[{ required: true }]} />
          </ProForm.Group>
        </StepsForm.StepForm>
      </StepsForm>
    </ProCard>
  );
};
