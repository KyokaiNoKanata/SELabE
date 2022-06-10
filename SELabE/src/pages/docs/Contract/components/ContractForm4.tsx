import {PageContainer} from '@ant-design/pro-layout';
import ProForm, {ProFormDatePicker, ProFormText, StepsForm,} from '@ant-design/pro-form';

import {Button, Form, Input, message, Typography} from "antd";
import ProCard from "@ant-design/pro-card";
import {useLocation} from "umi";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import {
  createContract,
  getContractById,
  getTable4,
  saveTable4,
  submitContractClient,
  submitContractStaff
} from "@/services/ant-design-pro/contract/api";
import React, {useState} from "react";
import type API from "@/services/ant-design-pro/typings";

const {Title, Paragraph, Text,} = Typography;

/**
 * 软件委托测试合同
 * @param prop editable: 1、甲方（客户） 2、乙方（市场部） 0、只读
 * @constructor
 */
const ContractForm4: React.FC<{
  editable: number,
}> = (prop) => {
  const params = useLocation();
  /**
   * 委托ID
   */
  const delegationId = !params.state ? -1 : (params.state as any).id;
  /**
   * 合同ID
   */
  const [contractId,setContractId] = useState<number|undefined>(undefined);
  /**
   * 获取填写的表单内容
   * 没有合同先创建合同
   * @return 表单内容或默认内容
   */
  const request = async () => {
    if(delegationId == -1) {
      return {}
    }
    const delegation: API.DelegationItem = (await getDelegationById(delegationId)).data;
    let _contractId = delegation.contractId;
    if(!_contractId) {
      //先创建合同
      const resp1 = await createContract({
        delegationId: delegationId,
      })
      if (resp1.code != 0) {
        message.error(resp1.msg);
      } else {
        _contractId = resp1.data;//合同编号
      }
    }
    setContractId(_contractId);
    const table4Id = (await getContractById({id: _contractId!})).data.table4Id;
    if (!table4Id) {
      return {
        '软件名称': delegation.softwareName,
        '项目名称': delegation.softwareName,
        '委托单位': delegation.clientUnit,
        '委托方(甲方)': delegation.clientUnit,
        '委托方(乙方)': '南京大学计算机软件新技术国家重点实验室',
      };
    }
    const resp = await getTable4({
      id: table4Id,
    });

    const data = resp.data;
    //const {_id, deleted, ...data} = resp.data;
    //console.log(data);
    return data;
  }
  /**
   * 保存合同表
   * @param value 表单内容
   */
  const onSave = async (value: any) => {
    const resp = await saveTable4({
      contractId: contractId,
      data: value,
    })
    if (resp.code == 0) {
      message.success('保存成功')
    } else {
      message.error(resp.msg);
    }
  }
  /**
   * 提交合同
   */
  const onSubmit = async () => {
    if (!contractId) {
      message.warning('请先保存');
    } else {
      let resp: API.Response;
      if (prop.editable == 1) {
        resp = await submitContractClient({
          contractId: contractId,
        })
      } else {
        resp = await submitContractStaff({
          contractId: contractId,
        });
      }
      if (resp.code == 0) {
        message.success('提交合同成功');
      } else {
        message.error(resp.msg);
      }
    }
  }
  /**
   * 合同表单详情
   */
  const information = () => {
    return (
      <ProCard>
        <StepsForm<{
          name: string;
        }>
          submitter={{
            render: (props) => {
              if (props.step === 0) {
                return (
                  <div style={
                    {
                      textAlign: "center",
                      margin: 20,
                    }
                  }><Button type="primary" onClick={() => props.onSubmit?.()}>
                    下一步 {'>'}
                  </Button>
                  </div>
                );
              } else return [
                <div style={
                  {
                    textAlign: "right",
                    margin: 20,
                  }
                }>
                  <ProForm.Group>
                    <Button onClick={() => props.onPre?.()}>
                      {'<'} 上一步
                    </Button>
                    <Button hidden={prop.editable == 0} type="primary" key="save" onClick={() => props.onSubmit?.()}>
                      保存
                    </Button>
                    <Button hidden={prop.editable == 0} type="primary" key="submit" onClick={() => onSubmit()}>
                      提交
                    </Button>
                  </ProForm.Group>
                </div>
              ];
            },
          }}
          stepsProps={{
            direction: "horizontal",
          }}
          //formRef={formRef}
          onFinish={onSave}
        >
          <StepsForm.StepForm<{
            name: string;
          }>
            name="step1"
            title="第一页"
            stepProps={{
              description: '合同第一页',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第一页结束')
              //await waitTime(1000);
              return true;
            }}
            request={request}
          >
            <Form.Item label="项目名称:" name='项目名称' style={{width: '50%'}} initialValue={''}>
              <Input disabled={prop.editable != 2}/>
            </Form.Item>
            <Form.Item label="委托方(甲方):" name="委托方(甲方)" style={{width: '50%'}} initialValue={''}>
              <Input disabled={prop.editable != 1}/>
            </Form.Item>
            <Form.Item label="委托方(乙方):" name="委托方(乙方)" style={{width: '50%'}} initialValue={''}>
              <Input disabled={prop.editable != 2}/>
            </Form.Item>
            <Form.Item label="签订地点:" name="签订地点" style={{width: '50%'}} initialValue={''}>
              <Input disabled={prop.editable != 2}/>
            </Form.Item>
            <ProFormDatePicker disabled={prop.editable != 2} label="签订日期" name="签订日期" initialValue={new Date().toDateString()}
                               style={{width: '50%'}}/>
            {/* eslint-disable-next-line @typescript-eslint/no-use-before-define */}
            {explanation()}
          </StepsForm.StepForm>
          <StepsForm.StepForm<{
            checkbox: string;
          }>
            name="step2"
            title="第二步"
            stepProps={{
              description: '签章',
            }}
            onFinish={async () => {
              //console.log(formRef.current?.getFieldsValue());
              //console.log('第三页结束')
              return true;
            }}
            request={request}
          >
            <Title level={3}>十二、签章</Title>
            <ProCard title="委托方" bordered>
              <ProFormText name='委托方单位全称' label='单位全称' addonAfter='(签章)' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormText name='委托方授权代表' label='授权代表' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormDatePicker name='委托方签章日期' label='签章日期' disabled={prop.editable != 1} initialValue={new Date().toDateString()}/>
              <ProFormText name='委托方联系人' label='联系人' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormText name='委托方通讯地址' label='通讯地址' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormText name='委托方电话' label='电话' disabled={prop.editable != 1} initialValue={''}/>

              <ProFormText name='委托方开户银行' label='开户银行' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormText name='委托方账号' label='账号' disabled={prop.editable != 1} initialValue={''}/>
              <ProFormText name='委托方邮编' label='邮编' disabled={prop.editable != 1} initialValue={''}/>
              <div>传真:62661627</div>
            </ProCard>
            <ProCard title="受托方" bordered>
              <div>单位全称:南京大学计算机软件新技术国家重点实验室(签章)</div>
              <br/>
              <ProFormText name='受托方授权代表' label='授权代表' disabled={prop.editable != 2} initialValue={''}/>
              <ProFormDatePicker name='受托方签章日期' label='签章日期' disabled={prop.editable != 2} initialValue={new Date().toDateString()}/>
              <ProFormText name='受托方联系人' label='联系人' disabled={prop.editable != 2} initialValue={''}/>
              <ProFormText name='受托方通讯地址' label='通讯地址' disabled={prop.editable != 2} initialValue={''}/>
              <ProFormText name='受托方电话' label='电话' disabled={prop.editable != 2} initialValue={''}/>
              <ProFormText name='受托方传真' label='传真' disabled={prop.editable != 2} initialValue={''}/>
              <ProFormText name='受托方邮编' label='邮编' disabled={prop.editable != 2} initialValue={''}/>
              <div>开户银行:中国工商银行股份有限公司南京汉口路分理处</div>
              <div>户名:南京大学</div>
              <div>账号:4301011309001041656</div>
            </ProCard>
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    );
  }
  /**
   * 合同声明
   */
  const explanation = () => {
    return (
      <Typography>
        <Paragraph>
          <ProFormText name="委托单位" addonBefore=' 本合同由作为委托方的' addonAfter='（以下简称“甲方”) 与作为受托方的'
                       disabled={prop.editable != 1}/>
          <Text strong>南京大学计算机软件新技术国家重点实验室</Text> （以下简称“乙方”）在平等自愿的基础上，
          依据《中华人民共和国合同法》有关规定就项目的执行，经友好协商后订立。
        </Paragraph>
        <Title level={3}>一、任务表述</Title>
        <Paragraph>
          <ProFormText name='软件名称' addonBefore=' 乙方按照国家软件质量测试标准和测试规范，完成对甲方委托的软件（下称受测软件）'
                       disabled={prop.editable != 2}/>
          <ProFormText name='质量特性' addonBefore='的质量特性' addonAfter='进行测试，并出具相应的测试报告'
                       disabled={prop.editable != 2}/>

        </Paragraph>
        <Title level={3}>二、双方的主要义务</Title>
        <ol>
          <li>
            甲方的主要义务:
            <ol>
              <li>
                按照合同约定支付所有费用。
              </li>
              <li>
                按照乙方要求以书面形式出具测试需求，包括测试子特性、测试软硬件环境等。
              </li>
              <li>
                提供符合交付要求的受测软件产品及相关文档，包括软件功能列表、需求分析、设计文档、用户文档至乙方。
              </li>
              <li>
                指派专人配合乙方测试工作，并提供必要的技术培训和技术协助。
              </li>
            </ol>
          </li>
          <li>
            乙方的主要义务:
            <ol>
              <li>设计测试用例，制定和实施产品测试方案。</li>
              <li>在测试过程中，定期知会甲方受测软件在测试过程中出现的问题。</li>
              <li>按期完成甲方委托的软件测试工作。</li>
              <li>出具正式的测试报告。</li>
            </ol>
          </li>
        </ol>
        <Title level={3}>三、履约地点</Title>
        <Paragraph>由甲方将受测软件产品送到乙方实施测试。
          如果由于被测软件本身特点或其它乙方认可的原因，
          需要在甲方所在地进行测试时，甲方应负担乙方现场测试人员的差旅和食宿费用。
        </Paragraph>
        <Title level={3}>四、合同价款</Title>
        <Paragraph>
          <ProFormText name='合同价款' addonBefore='本合同软件测试费用为人民币' addonAfter='元'
                       disabled={prop.editable != 2}/>
        </Paragraph>
        <Title level={3}>五、测试费用支付方式</Title>
        <Paragraph>本合同签定后，十个工作日内甲方合同价款至乙方帐户。</Paragraph>
        <Title level={3}>六、履行的期限</Title>
        <Paragraph>
          <ol>
            <li>
              <ProFormText name='完成天数' addonBefore='本次测试的履行期限为合同生效之日起' addonAfter='个自然日内完成。'
                           disabled={prop.editable != 2}/>
            </li>
            <li>经甲乙双方同意，可对测试进度作适当修改，并以修改后的测试进度作为本合同执行的期限。如受测软件在测试过程中出现的问题，导致继续进行测试会影响整体测试进度，</li>
            <li><ProFormText
              addonBefore="则乙方暂停测试并以书面形式通知甲方进行整改。在整个测试过程中，整改次数限于"
              addonAfter='次，'
              width='md' name="整改次数"
              disabled={prop.editable != 2}/>
              <ProFormText addonBefore='每次不超过' addonAfter='天' name="超过天数"
                           disabled={prop.editable != 2}/>

            </li>
            <li>如因甲方原因，导致测试进度延迟、应由甲方负责,乙方不承担责任。</li>
            <li>如因乙方原因，导致测试进度延迟，则甲方可酌情提出赔偿要求，赔偿金额不超过甲方已付金额的50%。双方经协商一致后另行签订书面协议，作为本合同的补充。</li>
          </ol>
        </Paragraph>
        <Title level={3}>七、资料的保密</Title>
        <Paragraph>
          对于一方向另一方提供使用的秘密信息，另一方负有保密的责任，不得向任何第三方透露。为明确双方的保密义务，双方应签署《软件项目委托测试保密协议》，并保证切实遵守其中条款。
        </Paragraph>
        <Title level={3}>八、风险责任的承担</Title>
        <Paragraph>
          乙方人员在本协议有效期间（包括可能的到甲方出差）发生人身意外或罹患疾病时由乙方负责处理。甲方人员在本协议有效期间（包括可能的到乙方出差）发生人身意外或罹患疾病时由甲方负责处理。
        </Paragraph>
        <Title level={3}>九、验收方法</Title>
        <Paragraph>
          由乙方向甲方提交软件产品鉴定测试报告正本一份，甲方签收鉴定测试报告后，完成验收。
        </Paragraph>
        <Title level={3}>十、争议解决</Title>
        <Paragraph>
          双方因履行本合同所发生的一切争议，应通过友好协商解决；如协商解决不
          成，就提交市级仲裁委员会进行仲裁。裁决对双方当事人具有同等约束力。
        </Paragraph>
        <Title level={3}>十一、其他</Title>
        <Paragraph>
          本合同自双方授权代表签字盖章之日起生效，自受托方的主要义务履行完毕之日起终止。
        </Paragraph>
        <Paragraph>
          本合同未尽事宜由双方协商解决。
        </Paragraph>
        <Paragraph>
          本合同的正本一式肆份，双方各执两份，具有同等法律效力。
        </Paragraph>
      </Typography>
    );
  }
  return (
    <PageContainer title="软件委托测试合同">
      {information()}
    </PageContainer>
  );
}

export default ContractForm4
