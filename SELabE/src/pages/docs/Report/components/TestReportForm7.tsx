import {Button, Col, message, Modal, PageHeader, Row, Typography} from "antd";
import {useLocation} from "react-router-dom";
import ProForm, {ProFormDatePicker, ProFormDateRangePicker, ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import React, {useState} from "react";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {
  createReport,
  getReport,
  getTable7,
  saveTable7,
  submitReport
} from "@/services/ant-design-pro/report/api";
import type {ProColumns} from "@ant-design/pro-table";
import {EditableProTable} from "@ant-design/pro-table";
import {StepsForm} from "@ant-design/pro-form/es/layouts/StepsForm";
import Form from "@ant-design/pro-form";

const {Title, Paragraph} = Typography;

type DataSourceType = {
  id: number;
  basis?: string;
  children?: DataSourceType[];
}
type Reference = {
  rid: number;
  refer?: string;
  children?: Reference[];
}

type FunctionalType = {
  id: number;
  module?: string;
  require?: string;
  result?: string;
}

type OtherTestingType = {
  id: number;
  features?: string;
  instruction?: string;
  result?: string;
}

type softwareEnviron = {
  id: number;
  type?: string;
  name?: string;
  version?: string;
}
const softwareEnvironData: softwareEnviron[] = [
  {
    id: 1,
    type: "操作系统",
    name: '',
    version: '',
  }
  ,
  {
    id: 2,
    type: "软件",
    name: '',
    version: '',
  }
  ,
  {
    id: 3,
    type: "辅助工具",
    name: '',
    version: '',
  }
  ,
  {
    id: 4,
    type: "开发工具",
    name: '',
    version: '',
  }
  ,
  {
    id: 5,
    type: "被测试样品",
    name: '',
    version: '',
  }
];

const TestReportForm7: React.FC<{ editable: boolean }> = (prop) => {
  const [reportId, setReportId] = useState<number | undefined>(undefined);
  //测试依据列表相关
  const [testBasisKeys, setTestBasisRowKeys] = useState<React.Key[]>(() => []);
  const [testBasisDataSource,setTestBasisDataSource] = useState<DataSourceType[]>([]);
  const [testBasisForm] = Form.useForm();
  //参考资料列表相关
  const [referKeys, setReferRowKeys] = useState<React.Key[]>(() => []);
  const [referDataSource,setReferDataSource] = useState<Reference[]>([]);
  const [referForm] = Form.useForm();
  /**
   * 功能性测试
   */
  const [functionTestKeys, setFunctionTestRowKeys] = useState<React.Key[]>(() => []);
  const [functionTestDataSource,setFunctionTestDataSource] = useState<FunctionalType[]>([]);
  const [functionTestForm] = Form.useForm();
  /**
   * 效率测试
   */
  const [effectKeys,setEffectKeys] = useState<React.Key[]>(() => []);
  const [effectDataSource,setEffectDataSource] = useState<OtherTestingType[]>([]);
  const [effectForm] = Form.useForm();
  /**
   * 可移植性测试
   */
  const [portableKeys,setPortableKeys] = useState<React.Key[]>(() => []);
  const [portableDataSource,setPortableDataSource] = useState<OtherTestingType[]>([]);
  const [portableForm] = Form.useForm();
  /**
   * 易用性测试
   */
  const [usableKeys,setUsableKeys] = useState<React.Key[]>(() => []);
  const [usableDataSource,setUsableDataSource] = useState<OtherTestingType[]>([]);
  const [usableForm] = Form.useForm();
  /**
   * 可靠性测试
   */
  const [reliableKeys,setReliableKeys] = useState<React.Key[]>(() => []);
  const [reliableDataSource,setReliableDateSource] = useState<OtherTestingType[]>([]);
  const [reliableForm] = Form.useForm();
  /**
   * 可维护性测试
   */
  const [maintainableKeys,setMaintainableKeys] = useState<React.Key[]>(() => []);
  const [maintainableDataSource,setMaintainableDataSource] = useState<OtherTestingType[]>(() => []);
  const [maintainableForm] = Form.useForm();

  const [softwareEnvironKeys, setSoftwareEnvironRowKeys] = useState<React.Key[]>(() =>
    softwareEnvironData.map((item) => item.id)
  );
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
      initialValue: '',
    },
    {
      title: '操作',
      valueType: 'option',
      width: '5%',
      editable: () => prop.editable,
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
            setTestBasisDataSource(testBasisDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
    ,
  ];

  const referenceColumns: ProColumns<Reference>[] = [
    {
      title: '参考资料',
      dataIndex: 'refer',
      editable: () => prop.editable,
      initialValue: '',
    }
    ,
    {
      title: '操作',
      valueType: 'option',
      editable: () => prop.editable,
      width: '5%',
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.rid);
          }}
        >
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => {
            setReferDataSource(referDataSource.filter((item) => item.rid !== record.rid));
          }}
        >
          删除
        </a>,
      ],
    }
    ,
  ];

  const functionalTestColumns: ProColumns<FunctionalType>[] = [
    {
      title: '功能模块',
      dataIndex: 'module',
      editable: () => prop.editable,
      initialValue: '',
    },
    {
      title: '功能要求',
      dataIndex: 'require',
      editable: () => prop.editable,
      initialValue: '',
    },
    {
      title: '测试结果',
      editable: () => prop.editable,
      dataIndex: 'result',
      initialValue: '',
    },
    {
      title: '操作',
      valueType: 'option',
      editable: () => prop.editable,
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
            setFunctionTestDataSource(functionTestDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    },
  ];

  const otherTestColumns: ProColumns<OtherTestingType>[] = [
    {
      title: '测试特性',
      dataIndex: 'module',
      editable: () => prop.editable,
      initialValue: '',
    },
    {
      title: '测试说明',
      dataIndex: 'require',
      editable: () => prop.editable,
      initialValue: '',
    },
    {
      title: '测试结果',
      dataIndex: 'result',
      editable: () => prop.editable,
      initialValue: '',
    },
  ];
  const effectColumns: ProColumns<OtherTestingType>[]
    = otherTestColumns.concat([{
      title: '操作',
      valueType: 'option',
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
          setEffectDataSource(effectDataSource.filter((item) => item.id !== record.id));
        }}
      >
        删除
      </a>,
    ],
  }]);
  const portableColumns: ProColumns<OtherTestingType>[] = otherTestColumns.concat([
    {
      title: '操作',
      valueType: 'option',
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
            setPortableDataSource(portableDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
  ])
  const usableColumns: ProColumns<OtherTestingType>[] = otherTestColumns.concat([
    {
      title: '操作',
      valueType: 'option',
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
            setUsableDataSource(usableDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
  ])
  const reliableColumns: ProColumns<OtherTestingType>[] = otherTestColumns.concat([
    {
      title: '操作',
      valueType: 'option',
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
            setReliableDateSource(reliableDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
  ])
  const maintainableColumns: ProColumns<OtherTestingType>[] = otherTestColumns.concat([
    {
      title: '操作',
      valueType: 'option',
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
            setMaintainableDataSource(maintainableDataSource.filter((item) => item.id !== record.id));
          }}
        >
          删除
        </a>,
      ],
    }
  ])

  const {confirm} = Modal;
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;
  const request = async () => {
    //如果已经有了对应的reportId,填一下
    const delegation = (await getDelegationById(delegationId)).data;
    const rId = delegation.reportId;
    setReportId(rId);
    //console.log('solutionId = ' + sId);
    //如果没有report
    const defaultData = {
      "软件名称_1": delegation.softwareName,
      "版本号_1": delegation.version,
      "委托单位_1": delegation.clientUnit,
      "委托单位": delegation.clientUnit,
      "报告日期_1": new Date(),
      "项目编号": delegation.projectId,
    };
    if (!rId) {
      //创建一下report
      await createReport({
        delegationId: delegationId,
      })
      return defaultData;
    }
    //table7
    const solution = await getReport({reportId: rId!});
    const table7Id = solution.data.table7Id;
    const resp = await getTable7({id: table7Id})
    if (resp.data == null) {
      return defaultData;
    }
    setTestBasisDataSource(resp.data.测试依据);
    setReferDataSource(resp.data.参考资料);
    setFunctionTestDataSource(resp.data.功能性测试);
    setEffectDataSource(resp.data.效率测试);
    setPortableDataSource(resp.data.可移植性测试);
    setUsableDataSource(resp.data.易用性测试);
    setReliableDateSource(resp.data.可靠性测试);
    setMaintainableDataSource(resp.data.可维护性测试);
    return resp.data;
  };
  const onFinish = async (values: any) => {
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
    //console.log("提交")
    confirm({
      title: '确认提交吗?',
      //icon: <ExclamationCircleOutlined/>,
      content: '',
      onOk() {
        submitReport({
          reportId: reportId!
        }).then(resp => {
          if (resp.code == 0) {
            message.success('提交成功');
          } else {
            message.error(resp.msg);
          }
        })
      },
      onCancel() {

      },
    });
    return true;
  }
  const frontPage = () => {
    return (
      <ProCard>
        <ProFormText name="软件名称_1" label="软件名称" width="md"  rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText name="版本号_1" label="版本号" width="md"  rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText name="委托单位_1" label="委托单位" width="md"  rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText name="测试类别_1" label="测试类别" width="md"  rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormDatePicker name="报告日期_1" label="报告日期" width="md"  rules={[{required: true}]}
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
        <ProFormText name="委托单位" label="委托单位" width="md" rules={[{required: true}]} readonly initialValue={' '}/>
        <ProFormText name="项目编号" label="项目编号" width="md" rules={[{required: true}]} readonly initialValue={' '}/>
        <ProFormText name="样品名称" label="样品名称" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText name="版本/型号" label="版本/型号" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormDatePicker name="来样日期" label="来样日期" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText name = "测试类型" label = "测试类型" width = "md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormDateRangePicker name="测试时间" label="测试时间" rules={[{required: true}]}
                                disabled={!prop.editable}/>
        <ProFormTextArea name="样品状态" label="样品状态" rules={[{required: true}]} disabled={!prop.editable}/>
        {/*<ProFormTextArea name="测试依据" label="测试依据" rules={[{required: true}]} disabled={!prop.editable}/>*/}
        <ProFormTextArea name="样品清单" label="样品清单" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormTextArea name="测试结论" label="测试结论" rules={[{required: true}]} disabled={!prop.editable}/>
        <Row>
          <Col span={12}>
            <ProFormText name="主测人" label="主测人" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="主测_日期" label="日期" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="审核人" label="审核人" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="审核_日期" label="日期" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
        </Row>
        <Row>
          <Col span={12}>
            <ProFormText name="批准人" label="批准人" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
          <Col span={12}>
            <ProFormDatePicker name="批准_日期" label="日期" rules={[{required: true}]} disabled={!prop.editable}/>
          </Col>
        </Row>
        <ProFormText label="电话" name="电话" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText label="传真" name="传真" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText label="地址" name="地址" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText label="邮编" name="邮编" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText label="联系人" name="联系人" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
        <ProFormText label="E-mail" name="E-mail" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
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
            <ProFormText label="硬件类别" name="硬件类别" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
            <ProFormText label="硬件名称" name="硬件名称" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
            <ProFormText label="配置" name="配置" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
            <ProFormText label="数量" name="数量" width="md" rules={[{required: true}]} disabled={!prop.editable}/>
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
            <ProFormTextArea label="网络环境" name="网络环境" rules={[{required: true}]} disabled={!prop.editable}/>
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
        value={referDataSource}
        onChange={setReferDataSource}
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
          form: referForm,
          onChange: setReferRowKeys,
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
        value={functionTestDataSource}
        onChange={setFunctionTestDataSource}
        editable={{
          type: 'multiple',
          editableKeys: functionTestKeys,
          onChange: setFunctionTestRowKeys,
          form: functionTestForm,
        }}
      />
    )
  }
  const effectTesting = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={effectColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        value={effectDataSource}
        onChange={setEffectDataSource}
        editable={{
          type: 'multiple',
          form: effectForm,
          editableKeys: effectKeys,
          onChange: setEffectKeys,
        }}
      />
    )
  }
  const portableTesting = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={portableColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        value={portableDataSource}
        onChange={setPortableDataSource}
        editable={{
          type: 'multiple',
          form: portableForm,
          editableKeys: portableKeys,
          onChange: setPortableKeys,
        }}
      />
    )
  }
  const usableTable = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={usableColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        value={usableDataSource}
        onChange={setUsableDataSource}
        editable={{
          type: 'multiple',
          form: usableForm,
          editableKeys: usableKeys,
          onChange: setUsableKeys,
        }}
      />
    )
  }
  const reliableTable = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={reliableColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        value={reliableDataSource}
        onChange={setReliableDateSource}
        editable={{
          type: 'multiple',
          form: reliableForm,
          editableKeys: reliableKeys,
          onChange: setReliableKeys,
        }}
      />
    )
  }
  const maintainableTable = () => {
    return (
      <EditableProTable<OtherTestingType>
        rowKey="id"
        toolBarRender={false}
        columns={maintainableColumns}
        recordCreatorProps={{
          newRecordType: 'dataSource',
          position: 'bottom',
          record: () => ({
            id: Date.now(),
          }),
          hidden: !prop.editable,
        }}
        value={maintainableDataSource}
        onChange={setMaintainableDataSource}
        editable={{
          type: 'multiple',
          form: maintainableForm,
          editableKeys: maintainableKeys,
          onChange: setMaintainableKeys,
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
              initialValue={[]}
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
                onChange={setTestBasisDataSource}
                value={testBasisDataSource}
                editable={{
                  type: 'multiple',
                  editableKeys: testBasisKeys,
                  form: testBasisForm,
                  onChange: setTestBasisRowKeys,
                }}
              />
            </ProForm.Item>
            <ProForm.Item
              label="参考资料列表"
              name="参考资料"
              trigger="onValuesChange"
              initialValue={[]}
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
              initialValue={[]}
            >
              {functionalTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="效率测试"
              name="效率测试"
              trigger="onValuesChange"
              initialValue={[]}
            >
              {effectTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="可移植性测试"
              name="可移植性测试"
              trigger="onValuesChange"
              initialValue={[]}
            >
              {portableTesting()}
            </ProForm.Item>
            <ProForm.Item
              label="易用性测试"
              name="易用性测试"
              trigger="onValuesChange"
              initialValue={[]}
            >
              {usableTable()}
            </ProForm.Item>
            <ProForm.Item
              label="可靠性测试"
              name="可靠性测试"
              trigger="onValuesChange"
              initialValue={[]}
            >
              {reliableTable()}
            </ProForm.Item>
            <ProForm.Item
              label="可维护性测试"
              name="可维护性测试"
              trigger="onValuesChange"
              initialValue={[]}
            >
              {maintainableTable()}
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
