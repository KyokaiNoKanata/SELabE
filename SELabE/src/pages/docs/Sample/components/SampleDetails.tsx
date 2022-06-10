import React, {useRef, useState} from "react";
import ProForm, {ProFormTextArea} from "@ant-design/pro-form";
import {Button, message, Modal} from "antd";
import {auditSampleFail, auditSampleSuccess, getSampleById} from "@/services/ant-design-pro/sample/api";
import type {ActionType} from "@ant-design/pro-table";
import ProCard from "@ant-design/pro-card";
import {DownloadOutlined} from "@ant-design/icons";
import {useLocation} from "umi";
import moment from "moment";
const {confirm} = Modal;

const SampleDetails: React.FC<{audit: boolean}> = (props) => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const formRef: any = useRef<ActionType>();
  const params = useLocation();
  const sampleId = !params.state ? -1 : (params.state as any).sampleId;
  const [creatTime, setCreateTime] = useState<string>();
  const [Sid, setSid] = useState<number>();
  const [inforamtion, setInforamtion] = useState<string>();
  //const [modifyRemark, setModifyRemark] = useState<string>();
  const [processType, setProcessType] = useState<string>();
  //const [remark, setRemark] = useState<string>();
  //const [state, setState] = useState<number>();
  const [type, setType] = useState<string>();
  //const [verifyId, setVerifyId] = useState<number>();
  const request = async () => {
    if (!sampleId) {
      return {};
    }
    const currentState = (await getSampleById(sampleId)).data;
    console.log("state:" + currentState);
    if (currentState == undefined) {
      return {};
    }
    return currentState;
  };
  request().then(
    result => {
      setCreateTime(result.createTime);
      setSid(result.id);
      setInforamtion(result.information);
      // setVerifyId(result.verifyId);
      //setModifyRemark(result.modifyRemark);
      setProcessType(result.processType);
      //setRemark(result.remark);
      //setState(result.state);
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
        // 下载文件
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
    confirm({
      title: '确认通过吗?',
      //icon: <ExclamationCircleOutlined/>,
      content: '',
      onOk() {
        auditSampleSuccess({
          sampleId: sampleId,
          remark: remark,
        }).then(resp => {
          if(resp.code == 0) {
            message.success('样品已通过');
          } else {
            message.error(resp.msg);
          }
        })
      },
      onCancel() {

      },
    });
    actionRef.current?.reload();
    return true;
  }
//不通过
  const onReject = async () => {
    const remark = formRef.current?.getFieldFormatValue!(['remark']);
    confirm({
      title: '确认拒绝吗?',
      //icon: <ExclamationCircleOutlined/>,
      content: '',
      onOk() {
        auditSampleFail({
          sampleId: sampleId,
          remark: remark,
        }).then(resp => {
          if(resp.code == 0) {
            message.success('样品已拒绝');
          } else {
            message.error(resp.msg);
          }
        })
      },
      onCancel() {

      },
    });
    actionRef.current?.reload();
    return true
  }
  /*const currentState = () => {
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
  }*/
  return (
    <ProForm
      title="审核"
      /*trigger={
        <Button type="primary">审核样品</Button>
      }*/
      formRef={formRef}
      submitter={{
        //todo
        render: () => {
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
                <ProFormTextArea name='remark' label='审核意见' hidden={!props.audit}/>
                <ProForm.Group>
                  <Button type="primary" danger key="submit" onClick={onReject} hidden={!props.audit}>
                    不通过
                  </Button>
                  <Button type="primary" key="submit" onClick={onAccept} hidden={!props.audit}>
                    通过
                  </Button>
                </ProForm.Group>
              </ProCard>
            </div>
          );
        },
      }}/>
  );


}
export default SampleDetails;
