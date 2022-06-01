import {Button, Col, message, PageHeader, Row, Typography} from "antd";
import {useLocation} from "react-router-dom";
import ProForm, {ProFormDatePicker, ProFormDateRangePicker, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import React, {useState} from "react";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {createReport, getReport, getTable7, saveTable7, submitReport} from "@/services/ant-design-pro/report/api";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {StepsForm} from "@ant-design/pro-form/es/layouts/StepsForm";

const {Title, Paragraph} = Typography;


type DataSourceType = {
  id: React.Key; //id在json中是乱码，这个ID其实不能提交？
  basis?: string;
  children?: DataSourceType[];
}
type Reference = {
  rid: React.Key;
  refer?: string;
  children?: Reference[];
}

type FunctionalType = {
  id: React.Key;
  module?: string;
  require?: string;
  result?: string;
}

type OtherTestingType = {
  id: React.Key;
  features?: string;
  instruction?: string;
  result?: string;
}

type softwareEnviron = {
  id: React.Key;
  type?: string;
  name?: string;
  version?: string;
}
const softwareEnvironData: softwareEnviron[] = [
  {
    id: "1",
    type: "操作系统",
    name: '',
    version: '',
  }
  ,
  {
    id: "2",
    type: "软件",
    name: '',
    version: '',
  }
  ,
  {
    id: "3",
    type: "辅助工具",
    name: '',
    version: '',
  }
  ,
  {
    id: "4",
    type: "开发工具",
    name: '',
    version: '',
  }
  ,
  {
    id: "5",
    type: "被测试样品",
    name: '',
    version: '',
  }
];

const TestReportForm7: React.FC<{ editable: boolean }> = (prop) => {
  const softwareEnvironColumns: ProColumns<softwareEnviron>[] = [
    {
      title: '软件类别',
      dataIndex: 'type',
      editable: false,
    }
    ,
    {
      title: '软件名称',
      dataIndex: 'name',
      editable: () => prop.editable,
    }
    ,
    {
      title: '版本',
      dataIndex: 'version',
      editable: () => prop.editable,
    }
    ,
  ];

  const testBasisColumns: ProColumns<DataSourceType>[] = [
    {
      title: '测试依据',
      dataIndex: 'basis',
      editable: () => prop.editable,
    },
    {
      title: '操作',
      valueType: 'option',
      width: '5%',
      editable: () => prop.editable,
    }
    ,
  ];

  const referenceColumns: ProColumns<Reference>[] = [
    {
      title: '参考资料',
      dataIndex: 'refer',
      editable: () => prop.editable,
    }
    ,
    {
      title: '操作',
      valueType: 'option',
      editable: () => prop.editable,
      width: '5%',
    }
    ,
  ];

  const functionalTestColumns: ProColumns<FunctionalType>[] = [
    {
      title: '功能模块',
      dataIndex: 'module',
      editable: () => prop.editable,
    }
    ,
    {
      title: '功能要求',
      dataIndex: 'require',
      editable: () => prop.editable,
    }
    ,
    {
      title: '测试结果',
      editable: () => prop.editable,
      dataIndex: 'result',
    }
    ,
    {
      title: '操作',
      valueType: 'option',
      editable: () => prop.editable,
      width: '5%',
    }
    ,
  ];

  const otherTestColumns: ProColumns<OtherTestingType>[] = [
    {
      title: '测试特性',
      dataIndex: 'module',
      editable: () => prop.editable,
    }
    ,
    {
      title: '测试说明',
      dataIndex: 'require',
      editable: () => prop.editable,
    }
    ,
    {
      title: '测试结果',
      dataIndex: 'result',
      editable: () => prop.editable,
    }
    ,
    {
      title: '操作',
      valueType: 'option',
      width: '5%',
      editable: () => prop.editable,
    }
    ,
  ];
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  const [testBasisKeys, setTestBasisRowKeys] = useState<React.Key[]>(() => []);
  const [referKeys, setReferRowKeys] = useState<React.Key[]>(() => []);
  const [functionTestKeys, setFuntionTestRowKeys] = useState<React.Key[]>(() => []);
  const [OtherTestKeys, setOtherTestRowKeys] = useState<React.Key[]>(() => []);
  const [softwareEnvironKeys, setSoftwareEnvironRowKeys] = useState<React.Key[]>(() =>
    softwareEnvironData.map((item) => item.id)
  );
  const params = useLocation();
  const delegationId: number = (params.state as any).id;
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
    return false;
  };
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
  const frontPage = () => {
    return (
      <ProCard>
        <ProFormText name="软件名称_1" label="软件名称" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="版本号_1" label="版本号" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="委托单位_1" label="委托单位" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="测试类别_1" label="测试类别" width="md" required={true} disabled={!prop.editable}/>
        <ProFormDatePicker name="报告日期_1" label="报告日期" width="md" required={true}
                           disabled={!prop.editable}/>
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
        <ProFormText name="委托单位" label="委托单位" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="项目编号" label="项目编号" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="样品名称" label="样品名称" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText name="版本/型号" label="版本/型号" width="md" required={true} disabled={!prop.editable}/>
        <ProFormDatePicker name="来样日期" label="来样日期" width="md" required={true} disabled={!prop.editable}/>
        <ProFormDateRangePicker name="测试时间" label="测试时间" required={true}
                                disabled={!prop.editable}/>
        <ProFormTextArea name="样品状态" label="样品状态" required={true} disabled={!prop.editable}/>
        <ProFormTextArea name="测试依据" label="测试依据" required={true} disabled={!prop.editable}/>
        <ProFormTextArea name="测试结论" label="测试结论" required={true} disabled={!prop.editable}/>
        <Row>
          <Col span={12}>
            <ProFormText name="主测人" label="主测人" width="md" required={true} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="主测_日期" label="日期" required={true} disabled={!prop.editable}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="审核人" label="审核人" width="md" required={true} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="审核_日期" label="日期" required={true} disabled={!prop.editable}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="批准人" label="批准人" width="md" required={true} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="批准_日期" label="日期" required={true} disabled={!prop.editable}/>
          </Col>
        </Row>
        <ProFormText label="电话" name="电话" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText label="传真" name="传真" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText label="地址" name="地址" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText label="邮编" name="邮编" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText label="联系人" name="联系人" width="md" required={true} disabled={!prop.editable}/>
        <ProFormText label="E-mail" name="E-mail" width="md" required={true} disabled={!prop.editable}/>
        <div>测试单位联系方式</div>
        <div>单位地址: 南京市栖霞区仙林大道163号</div>
        <div>邮政编码: 210023</div>
        <div>电话: 86-25-89683467</div>
        <div>传真: 86-25-89686596</div>
        <div><a href="http://keysoftlab.nju.edu.cn">网址: http://keysoftlab.nju.edu.cn</a></div>
        <div>E-mail: keysoftlab@nju.edu.cn</div>
      </ProCard>
    )
  }

  const testSetting = () => {
    return (
      <ProCard title="测试环境">
        <Row>
          <ProCard title="硬件环境" bordered>
            <div>本次测试中使用到的硬件环境如下:</div>
            <br/>
            <ProFormText label="硬件类别" name="硬件类别" width="md" required={true} disabled={!prop.editable}/>
            <ProFormText label="硬件名称" name="硬件名称" width="md" required={true} disabled={!prop.editable}/>
            <ProFormText label="配置" name="配置" width="md" required={true} disabled={!prop.editable}/>
            <ProFormText label="数量" name="数量" width="md" required={true} disabled={!prop.editable}/>
          </ProCard>
        </Row>
        <Row>
          <ProCard title="软件环境" bordered>
            <div>本次测试中使用到的软件环境如下:</div>
            <br/>
            <ProForm.Item
              label=""
              name="软件环境"
              initialValue={softwareEnvironData}
              trigger="onValuesChange"
            >
              <EditableProTable<softwareEnviron>
                rowKey="id"
                toolBarRender={false}
                columns={softwareEnvironColumns}
                recordCreatorProps={false}
                editable={{
                  type: 'multiple',
                  editableKeys: softwareEnvironKeys,
                  onChange: setSoftwareEnvironRowKeys,
                }}
              />
            </ProForm.Item>
          </ProCard>
        </Row>
        <Row>
          <ProCard title="网络环境" bordered>
            <ProFormTextArea label="网络环境" name="网络环境" required={true} disabled={!prop.editable}/>
          </ProCard>
        </Row>
      </ProCard>
    )
  }

  const referenceTable = () => {
    return (
      <EditableProTable<Reference>
        rowKey="rid"
        toolBarRender={false}
        columns={referenceColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            rid: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        editable={{
          type: 'multiple',
          editableKeys: referKeys,
          onChange: setReferRowKeys,
          actionRender: (row, _, dom) => {
            return [dom.delete];
          },
        }}
      />)
  }

  const functionalTesting = () => {
    return (
      <EditableProTable<FunctionalType>
        rowKey="id"
        toolBarRender={false}
        columns={functionalTestColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        editable={{
          type: 'multiple',
          editableKeys: functionTestKeys,
          onChange: setFuntionTestRowKeys,
          actionRender: (row, _, dom) => {
            return [dom.delete];
          },
        }}
      />
    )
  }

  const otherTesting = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={otherTestColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        editable={{
          type: 'multiple',
          editableKeys: OtherTestKeys,
          onChange: setOtherTestRowKeys,
          actionRender: (row, _, dom) => {
            return [dom.delete];
          },
        }}
      />
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

              if (props.step === 1 || props.step === 2 || props.step === 3 || props.step === 4) {
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
                prop.editable &&
                <Button type="primary" key="goToTree" onClick={() => props.onSubmit?.()} disabled={!prop.editable}>
                  保存
                </Button>,
                prop.editable && <Button htmlType="button" onClick={handleSubmit} key='submit'>提交</Button>,
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
            <Row>
              {reportForm()}
            </Row>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string,
          }>
            name="step3"
            title="第三页"
            stepProps={{
              description: '测试环境'
            }}
            onFinish={
              async () => {
                return true;
              }}
            request={request}
          >
            <Row>
              {testSetting()}
            </Row>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string,
          }>
            name="step4"
            title="第四页"
            stepProps={{
              description: '测试依据和参考资料'
            }}
            onFinish={
              async (values: any) => {
                console.log(values);
                return true;
              }}
            request={request}
          >

            <ProForm.Item
              label="测试依据列表"
              name="测试依据"
              trigger="onValuesChange"
            >
              <EditableProTable<DataSourceType>
                rowKey="id"
                toolBarRender={false}
                columns={testBasisColumns}
                recordCreatorProps={{
                  newRecordType: 'dataSource',
                  position: 'bottom',
                  record: () => ({
                    id: Date.now(),
                  }),
                  hidden: !prop.editable,
                }}
                editable={{
                  type: 'multiple',
                  editableKeys: testBasisKeys,
                  onChange: setTestBasisRowKeys,
                  actionRender: (row, _, dom) => {
                    return [dom.delete];
                  },
                }}
              />
            </ProForm.Item>
            <ProForm.Item
              label="参考资料列表"
              name="参考资料"
              trigger="onValuesChange"
            >
              {referenceTable()}
            </ProForm.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string,
          }>
            name="step5"
            title="第五页"
            stepProps={{
              description: '测试内容'
            }}
            onFinish={
              async (values: any) => {
                console.log(values);
                return true;
              }}
            request={request}
          >
            <ProForm.Item
              label="功能性测试"
              name="功能性测试"
              trigger="onValuesChange"
            >
              {functionalTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="效率测试"
              name="效率测试"
              trigger="onValuesChange"
            >
              {otherTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="可移植性测试"
              name="可移植性测试"
              trigger="onValuesChange"
            >
              {otherTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="易用性测试"
              name="易用性测试"
              trigger="onValuesChange"
            >
              {otherTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="可靠性测试"
              name="可靠性测试"
              trigger="onValuesChange"
            >
              {otherTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="可维护性测试"
              name="可维护性测试"
              trigger="onValuesChange"
            >
              {otherTesting()}
            </ProForm.Item>
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string,
          }>
            name="step6"
            title="第六页"
            stepProps={{
              description: '测试执行记录'
            }}
            onFinish={
              async (values: any) => {
                console.log(values);
                return true;
              }}
            request={request}
          >
            <ProCard>
              <ProFormTextArea
                label="测试执行记录"
                name="测试执行记录"
                required={true}
                disabled={!prop.editable}
              />
            </ProCard>
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  )
}
export default TestReportForm7;
