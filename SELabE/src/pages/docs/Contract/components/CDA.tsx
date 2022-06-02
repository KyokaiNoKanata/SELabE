import {PageContainer} from "@ant-design/pro-layout";
import {Card, Col, message, Row, Typography} from "antd";
import React from "react";
import {createContract, getContractById, getTable5, saveTable5} from "@/services/ant-design-pro/contract/api";
import {useLocation} from "umi";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import ProForm, {ProFormDatePicker, ProFormText,} from '@ant-design/pro-form';
import API from "@/services/ant-design-pro/typings"
const {Paragraph} = Typography;
//editable为false则双方都不可以编辑
//todo:好像写反了，但结果正确
const CDA: React.FC<{
  isClient: boolean
  editable: boolean
}> = (props) => {
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;
  let contractId = !params.state ? -1 : (params.state as any).contractId;
  const request = async () => {
    const delegation: API.DelegationItem = (await getDelegationById(delegationId)).data;
    let table5Id = undefined;
    if(contractId) {
       table5Id = (await getContractById({id: contractId})).data.table5Id;
    }
    if ((!contractId) || (!table5Id)) {
      console.log(delegation.softwareName);
      return {
        '软件名称': delegation.softwareName,
        '委托单位': delegation.clientUnit,
      }
    }
    const resp = await getTable5({
      id: table5Id,
    });

    const data = resp.data;
    //const {_id, deleted, ...data} = resp.data;
    //console.log(data);
    return data;
  }
  /**
   * 保存CDA表单
   * @param value 表单内容
   */
  const onSave = async (value: any) => {
    console.log(value);
    if (!contractId) {
      const resp1 = await createContract({
        delegationId: delegationId,
      })
      if (resp1.code != 0) {
        message.error(resp1.msg);
        return;
      } else {
        console.log('创建合同成功');
        contractId = (await getDelegationById(delegationId)).data.contractId;
        if (!contractId) {
          message.error('获取合同id失败，请稍后再试');
        }
      }
    }
    const resp = await saveTable5({
      contractId: contractId,
      data: value,
    });
    if (resp.code == 0) {
      message.success('保存成功')
    } else {
      message.error(resp.msg);
    }
  }

  const explanation = () => {
    return ([
        <ProForm
          onFinish={onSave}
          request={request}
          key={'CDA'}
          submitter={{
            searchConfig: {
              resetText: '重置',
              submitText: '保存',
            },
            render: (submitterProps, doms) => {
              if (!props.editable) {
                return [...doms];
              }
              return []
            }
          }}>
          <Typography>
            <Paragraph>
              <ProFormText disabled={props.editable || !props.isClient} name='委托单位'
                           addonBefore='委托方' addonAfter='（以下简称“甲方”）与南京大学计算机软件新技术国家重点实验室（简称“乙方”）'/>
              <ProFormText disabled={props.editable || props.isClient} name='软件名称'
                           addonBefore='在签订《' addonAfter='软件项目委托测试》委托合同的前提下，为保证双方的合法权利，经协双方达成如下保密协议：'/>
            </Paragraph>
            <Card>
              <Paragraph>
                <ol>
                  <li>
                    甲方不得向第三方透露在合作期间获得和知晓的乙方（包括其分支机构）的商业秘密和其他有关的保密信息。
                    商业秘密包括技术秘密和经营秘密，其中技术秘密包括计算机软件、数据库、技术报告、测试报告、检测报告、实验数据、测试结果、操作手册、技术文档、相关的函电等。
                    经营秘密包括但不限于双方洽谈的情况、签署的任何文件，包括合同、协议、备忘录等文件中所包含的一切信息、定价政策、设备资源、人力资源信息等。
                  </li>
                  <li>
                    乙方负有对甲方委托测试的软件保密的责任，保密内容包括：
                    软件产品代码、软件可执行程序、测试报告、测试结果、操作手册、技术文档、用户手册等。
                  </li>
                  <li>
                    未经对方书面同意，任何一方不得在双方合作目的之外使用或向第三方透露对方的任何商业秘密，不管这些商业秘密是口头的或是书面的，
                    还是以磁盘、胶片或电子邮件等形式存在的。
                  </li>
                  <li>
                    在对方公司内活动时，应尊重对方有关保密的管理规定，听从接待人员的安排和引导。未经允许不得进入对方实验室、办公室内受控的工作环境，
                    与对方技术人员进行的交流，仅限于合作项目有关的内容。
                  </li>
                  <li>
                    如果一方违反上述条款，另一方有权根据违反的程度以及造成的损害采取以下措施:
                    <ol>
                      <li>
                        终止双方的合作；
                      </li>
                      <li>
                        要求赔偿因失密造成的损失。
                      </li>
                      在采取上述措施之前，一方将给予违约的另一方合理的在先通知。
                    </ol>
                  </li>
                  <li>
                    负有保密义务的双方，如果涉密人因本方无法控制的原因(如擅自离职)造成由涉密人有意泄密，其相应的民事和法律责任由当事人承担。
                  </li>
                  <li>
                    与本协议有关的任何争议，双方应通过友好协商解决。如协商不成，任何一方可将此争议提交南京市仲裁委员会进行仲裁。仲裁裁决是终局的，对双方均有约束力。
                  </li>
                  <li>
                    本协议作为委托测试合同的附件，一式两份，双方各执一份，与合同具有同等法律效力。
                  </li>
                </ol>
              </Paragraph>
            </Card>
            <Paragraph/>
            <Paragraph>
              本协议自双方授权代表签字盖章之日起生效，但有效期不限于合同有效期。
            </Paragraph>
          </Typography>
          <Row>
            <Col span={12}>
              <div>甲方:(公章)</div>
              <br/>
              <ProFormText name = "甲方法人代表" label = "法人代表" width = "md"/>
              <ProFormDatePicker name = "甲方_日期" label = "日期"/>
            </Col>
            <Col span={12}>
              <br/>
              <div>乙方:(公章)</div>
              <br/>
              <ProFormText name = "乙方法人代表" label = "法人代表" width = "md"/>
              <ProFormDatePicker name = "乙方_日期" label = "日期"/>
            </Col>
          </Row>
        </ProForm>
      ]
    );
  }

  return (
    <PageContainer title="软件项目委托测试保密协议">
      {explanation()}
    </PageContainer>
  );

}

export default CDA;
