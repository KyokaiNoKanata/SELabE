import React, {useRef, useState} from "react";
import ProForm, {ProFormText, ProFormTextArea} from "@ant-design/pro-form";
import {Button, message} from "antd";
import {auditSampleFail, auditSampleSuccess, getSampleById} from "@/services/ant-design-pro/sample/api";
import {ActionType} from "@ant-design/pro-table";
import ProCard from "@ant-design/pro-card";
import {DownloadOutlined} from "@ant-design/icons";
import {useLocation} from "umi";
import moment from "moment";


const SampleDetails: React.FC = () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const formRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const params = useLocation();
  const sampleId = (params as any).query.sampleId;
  const [creatTime, setCreateTime] = useState<string>();
  const [Sid, setSid] = useState<number>();
  const [inforamtion, setInforamtion] = useState<string>();
  const [modifyRemark, setModifyRemark] = useState<string>();
  const [processType, setProcessType] = useState<string>();
  //const [remark, setRemark] = useState<string>();
  const [state, setState] = useState<number>();
  const [type, setType] = useState<string>();
  //const [verifyId, setVerifyId] = useState<number>();
  const request = async () => {
    if (!sampleId) {
      return {};
    }
    const state = (await getSampleById(sampleId)).data;
    console.log("state:" + state);
    if (state == undefined) {
      return {};
    }
    return state;
  };
  request().then(
    result => {
      setCreateTime(result.createTime);
      setSid(result.id);
      setInforamtion(result.information);
     // setVerifyId(result.verifyId);
      setModifyRemark(result.modifyRemark);
      setProcessType(result.processType);
      //setRemark(result.remark);
      setState(result.state);
      setType(result.type);
    }
  );
  const onDownload = () => {
    console.log(sampleId);
    //根据sampleId获得sampleURL
    getSampleById(sampleId!).then(resp => {
      if (resp.code != 0) {
        message.error(resp.msg);
        return;
      }
      const url: string | undefined = resp.data.url;
      if (url) {
        // 下载文件 todo 这种写法不太好但是可行的
        const a = document.createElement("a");
        a.href = url;
        a.click();
      } else {
        message.warning('没有对应的在线样品文件');
      }
    })
  }
  const onAccept = async () => {

    const remark = formRef.current?.getFieldFormatValue!(['remark']);
    //console.log(remark);
    const resp = await auditSampleSuccess({
      sampleId: sampleId,
      remark: remark,// todo
    })
    if (resp.code != 0) {
      message.error(resp.msg);
      return false;
    }
    message.success('提交成功');
    actionRef.current?.reload();
    return true;
  }
//不通过
  const onReject = async () => {
    const remark = formRef.current?.getFieldFormatValue!(['remark']);
    //console.log(remark);
    const resp = await auditSampleFail({
      sampleId: sampleId,
      remark: remark// todo
    })
    if (resp.code != 0) {
      message.error(resp.msg);
      return false;
    }
    message.success('提交成功');
    actionRef.current?.reload();
    return true
  }
  const currentState = () => {
    switch (state) {
      case 0: {
        return "未发送";
      }
      case 1: {
        return "已发送";
      }
      case 2: {
        return "已审核";
      }
      case 3: {
        return "待修改";
      }
      case 4: {
        return "已修改";
      }
      case 5: {
        return "已处理";
      }
      default:
        return "";
    }
  }
  return (
    <ProForm
      title="审核"
      /*trigger={
        <Button type="primary">审核样品</Button>
      }*/
      formRef={formRef}
      submitter={{
        //todo
        render: (submitterProps) => {
          return (
            <div style={
              {
                margin: 20,
              }
            }>
              <ProCard bordered>
                <div><strong>时间</strong>: {moment(parseInt(String(creatTime))).format("YYYY-MM-DD HH:mm:ss")}</div>
              </ProCard>
              <ProCard bordered>
                <div><strong>样品编号</strong>:{Sid}</div>
              </ProCard>
              <ProCard bordered>
                <div><strong>样品信息</strong>:{inforamtion}</div>
              </ProCard>
              <ProCard bordered>
                <div><strong>处理方式</strong>:{processType}</div>
              </ProCard>
              <ProCard bordered>
                <div><strong>状态</strong>:{currentState()}</div>
              </ProCard>
              <ProCard bordered>
                <div><strong>上传方式</strong>:{type}</div>
              </ProCard>
              <ProCard bordered>
                <ProForm.Group>
                  <Button type="primary"
                          icon={<DownloadOutlined/>}
                          onClick={onDownload}>
                    下载在线样品
                  </Button>
                </ProForm.Group>
                <br/>
                <ProFormTextArea name='remark' label='审核意见'/>
                <ProForm.Group>
                  <Button type="primary" key="submit" onClick={onReject}>
                    不通过
                  </Button>
                  <Button type="primary" key="submit" onClick={onAccept}>
                    通过
                  </Button>
                </ProForm.Group>
              </ProCard>
            </div>
          );
        },
      }}>


    </ProForm>
  );


}
export default SampleDetails;
