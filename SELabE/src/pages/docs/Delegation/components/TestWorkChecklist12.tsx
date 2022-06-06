import ProForm, {
  ProFormGroup,
  ProFormDatePicker,
  ProFormText,
  ProFormSelect,
} from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import {PageContainer} from '@ant-design/pro-layout';
import {Button, message, Modal, PageHeader} from 'antd';
import React from "react";
import {useLocation} from "umi";
import {getDelegationById, getTable12, saveTable12} from "@/services/ant-design-pro/delegation/api";
import API from "@/services/ant-design-pro/typings";
import {archiveReport} from "@/services/ant-design-pro/report/api";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
/*
editable
  1  :  1.1 1.2：市场部审核委托
  2  :  1.3:市场部上传合同
  3  :  2.4：测试部审核委托
  4  :  3.5:提交测试方案
  5  :  3.6 3.7 3.8是测试报告审核
  6  :  3.9 归档
 */
const TestWorkChecklist12: React.FC<{
  editable: number,
}> = (prop) => {
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;
  let reportId:number|undefined = undefined;
  //const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const request = async () => {
    const delegation: API.DelegationItem = (await getDelegationById(delegationId)).data;
    const table12Id = delegation.table12Id;
    if (!table12Id) {
      return {
        '软件名称': delegation.softwareName,
        '版本号': delegation.version,
        '申报单位': delegation.clientUnit,
      }
    }
    reportId = (await getDelegationById(delegationId)).data.reportId;
    const resp = await getTable12({
      id: table12Id,
    });
    const {_id, deleted, ...data} = resp.data;
    console.log(data);
    return data;
  }
  /**
   * save table 14
   * @param value
   */
  const onFinish = async (value: any) => {
    console.log(value);
    const resp = await saveTable12({
      delegationId: delegationId,
      data: value,
    });
    if(resp.code == 0) {
      message.success('保存成功');
    } else {
      message.error(resp.msg ? resp.msg: '返回错误');
    }
  };
  return (
    <PageContainer>
      <PageHeader
        className="testworkchecklist"
        title="软件项目委托测试工作检查表"
      />
      <ProForm onFinish={onFinish}
               key={'testworkcheck-list'}
               submitter={{
                 searchConfig: {
                   resetText: '重置',
                   submitText: '保存',
                 },
                 render: (props, doms) => {
                   return [
                     ...doms,
                     prop.editable == 6 &&
                     <Button
                       type="primary"
                       key="primary"
                       onClick={() => {
                           Modal.confirm({
                             title: '确认归档吗?',
                             //icon: <ExclamationCircleOutlined/>,
                             content: '',
                             onOk() {
                               archiveReport({
                                 reportId: reportId!
                               }).then(resp => {
                                 if (resp.code == 0) {
                                   message.success('归档成功');
                                 } else {
                                   message.error(resp.msg);
                                 }
                               })
                             },
                             onCancel() {

                             },
                           });
                         }
                       }
                     >
                       <FormattedMessage id="page.report.archive" defaultMessage="归档"/>
                     </Button>
                   ];
                 },
               }}
        //从后端请求数据显示
               request={request}
      >
        <ProCard bordered>
          <ProFormText name="软件名称" label="软件名称" width={'md'} disabled={true}/>
          <ProFormText name="版本号" label="版本号" width={'md'} disabled={true}/>
          <ProFormText name="申报单位" label="申报单位" width={'md'} disabled={true}/>
          <ProFormText name="主测人" label="主测人" width={'md'} disabled={prop.editable !== 4}/>
          <ProFormGroup>
            <ProFormDatePicker name="起始时间" label='起始时间' disabled={prop.editable !== 4}/>
            <ProFormDatePicker name="预计完成时间" label='预计完成时间' disabled={prop.editable !== 4}/>
            <ProFormDatePicker name="实际完成时间" label='实际完成时间' disabled={prop.editable !== 6}/>
          </ProFormGroup>
        </ProCard>
        <ProCard title={'一、前期指导工作'} bordered direction="column">
          <ProCard title={'1,接受委托单位委托测试申请'} bordered>
            <ProFormSelect
              name='1-1'
              width={'md'}
              label={'1、为委托单位提供详尽的有关软件项目委托测试的相关法律法规、优惠政策、业务办理流程等事项。'}
              disabled={prop.editable !== 1}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='1-2'
              width={'md'}
              label={'2、建议委托单位阅读《软件项目委托测试流程图和工作介绍》，了解申报流程；'}
              disabled={prop.editable !== 1}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='1-3'
              width={'md'}
              label={'3、根据《软件项目委托测试提交材料》，指导委托单位提交申报资料。'}
              disabled={prop.editable !== 1}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'2,填写《软件项目委托测试申请表》、《委托测试软件功能列表》，按《软件项目委托测试提交材料》提交材料；'} bordered>
            <ProFormSelect
              name='2-1'
              width={'md'}
              disabled={prop.editable !== 1}
              label={'1、确保委托方应填内容正确、完备；纸质材料已盖公章；'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='2-2'
              width={'md'}
              disabled={prop.editable !== 1}
              label={'2、明确委托方按《软件项目委托测试提交材料》提交材料。'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'3,签订《软件项目委托测试合同》、《软件项目委托测试保密协议》'} bordered>
            <ProFormSelect
              name='3-1'
              width={'md'}
              disabled={prop.editable !== 2}
              label={'1、合同及保密协议内容、数量符合要求；'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='3-2'
              width={'md'}
              disabled={prop.editable !== 2}
              label={'2、合同编号方式符合要求；'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
        </ProCard>
        <ProCard title={'二、对委托测试软件的可测状态进行评估'} bordered>
          <ProCard title={'4,对委托测试软件的可测状态进行评估'} bordered>
            <ProFormSelect
              name='4'
              width={'md'}
              disabled={prop.editable !== 3}
              label={'实验室在收到委托单位的有关资料后，即成立测试项目小组，该项目小组的任务是消化用户提供的有关资料，对委托软件的可测状态进行评估，若委托软件未达到可测状态，则向委托方提出改进建议，直到委托软件达到可测状态为止。项目小组的任务包括负责编制测试方案，搭建测试环境，执行测试过程，记录测试结果，编制测试报告，提交测试报告，将有关资料归档等。'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
        </ProCard>
        <ProCard title={'三、实施测试'} bordered direction="column">
          <ProCard title={'5,编制测试方案'} bordered>
            <ProFormSelect
              name='5-1'
              disabled={prop.editable !== 4}
              width={'md'}
              label={'1、测试方案必须经实验室质量负责人审核，技术负责人批准方能生效。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='5-2'
              width={'md'}
              disabled={prop.editable !== 4}
              label={'2、委托测试软件介绍：简要介绍委托测试软件的功能特点、应用行业及技术特性等。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='5-3'
              width={'md'}
              disabled={prop.editable !== 4}
              label={'3、软件功能：以委托单位提供的功能列表为依据，以表格形式列出所有功能项目，并对功能列表的各功能项目按照层次关系进行编号，以便于标识。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='5-4'
              width={'md'}
              disabled={prop.editable !== 4}
              label={'4、资源需求：资源需求要列出人员需求和软硬件设备需求。人员需求要列出人员名单、职称及所承担的角色（项目组长或成员）；软硬件设备需求要根据委托测试软件要求的运行环境及实验室的设备情况，列出硬件设备的名称、型号、配置、机身编号、用途，软件的名称、版本号、用途等。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='5-5'
              width={'md'}
              disabled={prop.editable !== 4}
              label={'5、参考文档：列出编制本方案所参考的标准、规范及用户文档等的名称、作者、类型、版本/标识号。'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'6,搭建测试环境'} bordered>
            <ProFormSelect
              name='6-1'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'1、实验室按照委托方提供的委托测试软件运行环境搭建测试环境；'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'7,实施测试'} bordered>
            <ProFormSelect
              name='7-1'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'1、测试过程主要以测试方案为依据，按照用户手册所述的操作方法运行软件，考察软件是否具有用户手册所描述的操作界面，对功能列表的主要功能逐项进行符合性测试并作记录，对未测的次要功能或细节部分，应作出说明。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='7-2'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'2、对文档的测试：要从完整性、正确性、一致性、易理解性、易浏览性和外观质量六个方面，对用户文档进行评审。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='7-3'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'3、对测试过程观察到的结果进行如实记录，对发现的问题整理成问题清单；'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'8,编制测试报告'} bordered>
            <ProFormSelect
              name='8-1'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'1、根据《软件项目委托测试报告编制作业指导书》和测试结果编制测试报告。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='8-2'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'2、检查测试报告，并填写《报告检查表》。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='8-3'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'3、测试报告的编码请参阅《测试报告编码规则》，'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='8-4'
              width={'md'}
              disabled={prop.editable !== 5}
              label={'4、报告审查：在分发报告前，应按实验室质量管理程序对报告进行严格审查。'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'9,评测资料归档'} bordered>
            <ProFormSelect
              name='9-1'
              width={'md'}
              disabled={prop.editable !== 6}
              label={'1、委托测试的软件产品及测试相关文件、原始记录等能够随时复现测试过程所需的材料，也同测试报告一并交由实验室资料室的材料管理员归档，以作为日后对测试结果产生异议时进行复核或仲裁的依据。上述材料由实验室保存三年后，委托方可凭样品接收单取回或由实验室进行销毁。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='9-2'
              width={'md'}
              disabled={prop.editable !== 6}
              label={'2、归档资料同时填写《软件项目委托测试资料清单》，打印《软件委托测试资料标签》并编号号码，贴于档案盒制定位置。'}
              valueEnum={{
                确认: '确认',
              }}/>
            <ProFormSelect
              name='9-3'
              width={'md'}
              disabled={prop.editable !== 6}
              label={'3、该检查表与本次软件委托测试归档资料一同归档，与《软件项目委托测试资料目录》、《软件项目委托测试试资料清单》一起，作为软件委托测试测试工作的检查、资料查询的主要依据。'}
              valueEnum={{
                确认: '确认',
              }}/>
          </ProCard>
          <ProCard title={'10,附件目录'} bordered>
            <div>1、《软件项目委托测试工作流程》</div>
            <div>2、《需提供的书面文档》</div>
            <div>3、《软件项目委托测试报告编制作业指导书》</div>
            <div>4、《报告检查表》</div>
            <div>5、《测试报告编码规则》</div>
            <div>6、《软件委托测试资料清单》</div>
            <div>7、《软件委托测试资料标签》</div>
            <div>8、《软件委托测试资料目录》</div>

          </ProCard>
        </ProCard>

      </ProForm>
    </PageContainer>
  );
};

export default TestWorkChecklist12;
