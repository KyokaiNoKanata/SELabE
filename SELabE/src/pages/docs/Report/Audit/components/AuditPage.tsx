import {message} from "antd";
import {acceptReport, rejectReport} from "@/services/ant-design-pro/report/api";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
import type {ProFormInstance} from "@ant-design/pro-form";
import ProForm, { ProFormSelect, ProFormText} from "@ant-design/pro-form";
import React, {useRef} from "react";
import type API from "@/services/ant-design-pro/typings";

/**
 * 审核页面
 * @param props person: 身份
 * @constructor
 */
const AuditPage: React.FC<{
  person: string,
}> = (props) => {
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const onSubmit = async () => {
    const pass = formRef.current?.getFieldFormatValue!(['pass']);
    const remark = formRef.current?.getFieldFormatValue!(['remark']);
    const rId = (await getDelegationById(delegationId)).data.reportId;
    let resp: API.Response|undefined = undefined;
    if(pass == 0) {
      resp = (await acceptReport({
        person: props.person,
        reportId: rId!,
        remark: remark,
      }));
    } else {
      resp = (await rejectReport({
        person: props.person,
        reportId: rId!,
        remark: remark,
      }));
    }
    if(resp.code == 0) {
      message.success('提交审核结果成功');
    } else {
      message.error(resp.msg);
    }
  }
  return (
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
  )
}
export default AuditPage;
