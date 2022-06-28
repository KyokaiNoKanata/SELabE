import ContractForm4 from "@/pages/docs/Contract/components/ContractForm4";
import {Card, message} from "antd";
import React, {useRef, useState} from "react";
import CDA5 from "@/pages/docs/Contract/components/CDA5";
import type {ProFormInstance} from "@ant-design/pro-form";
import ProForm, {ProFormSelect, ProFormText} from "@ant-design/pro-form";
import {
  acceptContractClient,
  acceptContractStaff,
  rejectContractClient,
  rejectContractStaff
} from "@/services/ant-design-pro/contract/api";
import {useLocation} from "react-router-dom";
import type API from "@/services/ant-design-pro/typings"
import type {CardTabListType} from "antd/lib/card";
import { getDelegationById } from "@/services/ant-design-pro/delegation/api";

const ContractPageComponent: React.FC<{
  editable: number,
  audit?: number,//审核
}> = (props) => {
  let list: CardTabListType[] = [
    {
      key: 'CDA',
      tab: '保密协议',
    },
    {
      key: 'ContractForm',
      tab: '合同',
    },
  ];
  if(props.editable == 0) {
    list = list.concat([
      {
        key: 'Audit',
        tab: '审核',
      }
    ]);
  }
  const [activeTabKey, setActiveTabKey] = useState('CDA');
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const params = useLocation();
  //const contractId = !params.state ? -1 : (params.state as any).contractId;
  const id = !params.state ? -1 : (params.state as any).id;
  const onSubmit = async () => {
    const contractId = (await getDelegationById(id)).data.contractId;
    //审核的话，肯定有合同id了
    const pass = formRef.current?.getFieldFormatValue!(['pass']);
    const remark = formRef.current?.getFieldFormatValue!(['remark']);
    let resp: API.Response = {
      code: -1,
      data: {},
      msg: '请求失败',
    };
    if (pass != 0 && pass != 1) {
      message.warning('请选择是否通过')
      return false;
    }
    //console.log(params)
    if (props.audit == 1) {
      if (pass == 0) {
        resp = await acceptContractClient({
          contractId: contractId
        })
      } else if (pass == 1) {
        resp = await rejectContractClient({
          contractId: contractId,
          reason: remark,
        })
      }
    } else {
      if (pass == 0) {
        resp = await acceptContractStaff({
          contractId: contractId
        })
      } else if (pass == 1) {
        resp = await rejectContractStaff({
          contractId: contractId,
          reason: remark,
        })
      }
    }
    if (resp.code == 0) {
      message.success('操作成功');
    } else {
      message.error(resp.msg)
    }
    return false;
  }
  const contentList = {
    CDA: <Card>
      <CDA5 editable={props.editable}/>
    </Card>,
    ContractForm:
      <Card>
        <ContractForm4 editable={props.editable}/>
      </Card>,
    Audit:
      <Card>
        <ProForm
          submitter={{
            render: (_, dom) =>
              <div style={
                {
                  //textAlign: "center",
                  margin: 20,
                }
              }>
                {dom[0]}
                {dom[1]}
              </div>,
          }}
          formRef={formRef}
          onFinish={onSubmit}>

          <ProForm.Group>
            <ProFormText
              width="md"
              name="remark"
              label="意见"
              placeholder="请输入审核意见"
              initialValue={''}
            />
          </ProForm.Group>
          <ProForm.Group>
            <ProFormSelect
              showSearch
              width="md"
              label="是否通过"
              name="pass"
              placeholder={'选择是否通过'}
              valueEnum={{
                0: '通过',
                1: '不通过',
              }}
              required
            />
          </ProForm.Group>
        </ProForm>
      </Card>,
  };
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  return (
    <>
      <Card
        style={{width: '100%'}}
        title="查看合同"
        tabList={list}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>

  )
}
export default ContractPageComponent;
