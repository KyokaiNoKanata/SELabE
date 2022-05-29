//todo:table7 测试报告
import {Button, Col, message, PageHeader, Row, Typography} from "antd";
import {useLocation} from "react-router-dom";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import {ProFormDatePicker, ProFormDateRangePicker, ProFormText, ProFormTextArea, StepsForm} from "@ant-design/pro-form";
import React, {useState} from "react";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {createReport, getReport, getTable7, saveTable7} from "@/services/ant-design-pro/report/api";

const {Title, Paragraph} = Typography;

//TODO
const TestReport: React.FC<{ editable: boolean }> = () => {
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const params = useLocation();
  const delegationId: number = (params as any).query.id;
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
    //table7
    const solution = await getReport({reportId: rId!});
    const table7Id = solution.data.table7Id;
    const resp = await getTable7({id: table7Id})
    if (resp.data == null) {
      return {};
    }
    console.log(resp.data);
    return resp.data;
  };
  const onFinish = async (values: any) => {
    console.log(values);
    const resp = await saveTable7({
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

  const frontPage = () => {
    return (
      <ProCard>
        <ProFormText name="软件名称_1" label="软件名称" width="md"/>
        <ProFormText name="版本号_1" label="版本号" width="md"/>
        <ProFormText name="委托单位_1" label="委托单位" width="md"/>
        <ProFormText name="测试类别_1" label="测试类别" width="md"/>
        <ProFormDatePicker name="报告日期_1" label="报告日期" width="md"></ProFormDatePicker>
      </ProCard>
    )
  }

  const statement = () => {
    return (
      <Typography>
        <Title>声明</Title>
        <Paragraph>
          <ol>
            <li>
              本测试报告仅适用于本报告明确指出的委托单位的被测样品及版本。
            </li>
            <li>
              本测试报告是本实验室对所测样品进行科学、客观测试的结果，
              为被测样品提供第三方独立、客观、公正的重要判定依据，也为最终用户选择产品提供参考和帮助。
            </li>
            <li>
              未经本实验室书面批准，不得复制本报告中的内容（全文复制除外），以免误导他人（尤其是用户）对被测样品做出不准确的评价。
            </li>
            <li>
              在任何情况下，若需引用本测试报告中的结果或数据都应保持其本来的意义，
              在使用时务必要保持其完整，不得擅自进行增加、修改、伪造，并应征得本实验室同意。
            </li>
            <li>
              本测试报告不得拷贝或复制作为广告材料使用。
            </li>
            <li>
              当被测样品出现版本更新或其它任何改变时，本测试结果不再适用，
              涉及到的任何技术、模块（或子系统）甚至整个软件都必须按要求进行必要的备案或重新测试，更不能出现将本测试结果应用于低于被测样品版本的情况。
            </li>
            <li>
              本报告无主测人员、审核人员、批准人员（授权签字人）签字无效。
            </li>
            <li>
              本报告无本实验室章、涂改均无效。
            </li>
          </ol>
        </Paragraph>
      </Typography>
    )
  }

  const reportForm = () => {
    return (
      <ProCard>
        <ProFormText name="委托单位" label="委托单位" width="md"/>
        <ProFormText name="项目编号" label="项目编号" width="md"/>
        <ProFormText name="样品名称" label="样品名称" width="md"/>
        <ProFormText name="版本/型号" label="版本/型号" width="md"/>
        <ProFormDatePicker name="来样日期" label="来样日期" width="md"/>
        <ProFormDateRangePicker name="测试时间" label="测试时间"></ProFormDateRangePicker>
        <ProFormTextArea name="样品状态" label="样品状态"/>
        <ProFormTextArea name="测试依据" label="测试依据"/>
        <ProFormTextArea name="测试结论" label="测试结论"/>
        <Row>
          <Col span={12}>
            <ProFormText name="主测人" label="主测人" width="md"/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="主测_日期" label="日期"/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="审核人" label="审核人" width="md"/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="审核_日期" label="日期"/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="批准人" label="批准人" width="md"/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="批准_日期" label="日期"/>
          </Col>
        </Row>
        <ProFormText label = "电话" name = "电话" width = "md"/>
        <ProFormText label = "传真" name = "传真" width = "md"/>
        <ProFormText label = "地址" name = "地址" width = "md"/>
        <ProFormText label = "邮编" name = "邮编" width = "md"/>
        <ProFormText label = "联系人" name = "联系人" width = "md"/>
        <ProFormText label = "E-mail" name = "E-mail" width = "md"/>
        <div>测试单位联系方式</div>
        <div>单位地址：南京市栖霞区仙林大道163号</div>
        <div>邮政编码：210023</div>
      </ProCard>
    )
  }


  return (
    <PageContainer>
      <PageHeader
        className="testReport"
        title="测试报告"
      />
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <Button type="primary" onClick={() => props.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>
                );
              }

              if (props.step === 1) {
                return [
                  <Button key="pre" onClick={() => props.onPre?.()}>
                    {'<'} 上一步
                  </Button>,
                  <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>,
                ];
              }

              return [
                <Button key="gotoTwo" onClick={() => props.onPre?.()}>
                  {'<'} 上一步
                </Button>,
                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()}>
                  保存
                </Button>,
              ];
            },
          }}
          stepsProps={{
            direction: 'vertical',
          }}
          //formRef={formRef}
          onFinish={onFinish}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="step1"
            title="第一页"
            stepProps={{
              description: '测试报告概要',
            }}
            onFinish={async () => {
              return true;
            }}
            request={request}
          >
            <Row>
              <Col span={12}>
                {frontPage()}
              </Col>
              <Col span={12}>
                {statement()}
              </Col>
            </Row>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="step2"
            title="第二页"
            stepProps={{
              description: '测试报告表单',
            }}
            onFinish={async () => {
              return true;
            }}
            request={request}
          >
            {reportForm()}
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>

    </PageContainer>
  )
}
export default TestReport;
