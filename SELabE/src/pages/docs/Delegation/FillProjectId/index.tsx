import {message} from "antd";
import {useLocation} from "react-router-dom";
import {fillProjectId} from "@/services/ant-design-pro/delegation/api";
import ProForm, {ProFormInstance,  ProFormText} from "@ant-design/pro-form";
import React, {useRef} from "react";

export default () => {
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;
  const formRef: React.MutableRefObject<ProFormInstance | undefined> = useRef<ProFormInstance>();
  const onSubmit = async () => {
    const projectId = formRef.current?.getFieldFormatValue!(['projectId']);

    const resp = await fillProjectId({
      id: delegationId,
      projectId: projectId,
    });
    if(resp.code == 0) {
      message.success('分配项目编号成功')
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
          name="projectId"
          label="项目编号"
          placeholder="请输入项目编号"
          initialValue={''}
        />
      </ProForm.Group>
    </ProForm>
  )
}