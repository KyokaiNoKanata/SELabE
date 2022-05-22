import React, {useRef, useState} from 'react';
import {Card, message, PageHeader} from 'antd';
import ProForm, {ProFormInstance, ProFormSelect, ProFormText} from '@ant-design/pro-form';
import { useLocation } from 'umi';
import {
  marketingAuditFail,
  marketingAuditSuccess
} from '@/services/ant-design-pro/delegation/api';
import StepApplyPage from "@/pages/docs/NewDelegation/components/StepApplyPage";
import FunctionList from "@/pages/docs/NewDelegation/components/FunctionList";
const DocumentReviewMarketing = () => {
  const [activeTabKey, setActiveTabKey] = useState('委托申请书');
  const list = [
    {
      key: '委托申请书',
      tab: '查看委托申请书',
    },
    {
      key: '委托功能列表',
      tab: '查看委托功能列表',
    },
    {
      key: '评审表',
      tab: '填写评审表',
    }
  ];
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  /** 市场部审批委托() */
  //不通过
  const handleAuditFailMarketing = async (data: {
    id: number,//委托编号
    remark: string,//审核意见
  }) => {
    const res = await marketingAuditFail({
      id: data.id,
      remark: data.remark,
    });
    if(res.data == true) {
      message.success('提交成功');
    } else {
      message.error(res.msg)
    }
  }
  //通过
  const handleAuditSuccessMarketing = async (data: {
    id: number,
    remark: string,
  }) => {
    const res = await marketingAuditSuccess({
      id: data.id,
      remark: data.remark,
    });
    console.log(res)
    if(res.code == 0) {
      message.success('提交成功');
    } else {
      message.error(res.msg)
    }
  }
  const params = useLocation();
  const delegationId = (params as any).query.id;
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const onSubmit = async () => {
    const pass = formRef.current?.getFieldFormatValue!(['pass']);
    const remark = formRef.current?.getFieldFormatValue!(['testingRemark']);
    if(pass == 0) {
      await handleAuditSuccessMarketing({
        id: delegationId,
        remark: remark,
      })
    } else if(pass == 1) {
      await handleAuditFailMarketing({
        id: delegationId,
        remark: remark,
      })
    } else {
      message.warning('请选择是否通过')
    }
    return false;
  }

  const contentList = {
    委托申请书:
      <Card>
        {/*todo: make it non-editable (only remove submit button in this edition)*/}
        <StepApplyPage editable={false}/>
      </Card>,
    委托功能列表: <Card><FunctionList editable={false}/></Card>,
    评审表:<Card>
      <ProForm
        submitter={{
          render: (_,dom) =>
            <div style={
              {textAlign:"center",
                margin:20,
              }
            }>
              {dom[0]}
              {dom[1]}
            </div>,
        }}
        formRef={formRef}
      onFinish={onSubmit}>
      <ProForm.Group>
        <PageHeader
          //className="reviewMarketing"
          title=""
        />
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
        <ProFormText
          width="md"
          name="testingRemark"
          label="审核意见"
          placeholder="请输入审核意见"
          initialValue={''}
        />
      </ProForm.Group>
      </ProForm>
    </Card>,
  };
  return (
    <>
      <Card
        style={{width: '100%'}}
        title="审核委托"
        tabList={list}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>

  )
};
export default DocumentReviewMarketing;
