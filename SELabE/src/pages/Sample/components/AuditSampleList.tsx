import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import ProForm, {ModalForm, ProFormText} from "@ant-design/pro-form";
import {DownloadOutlined} from "@ant-design/icons";
import {auditSampleFail, auditSampleSuccess, getSampleById,} from "@/services/ant-design-pro/sample/api";
//用户提交样品
const AuditSampleList: React.FC<{
  /*request: any;
  roles: string[];//权限集合
  user: any;//当前用户信息*/
  queryParams: (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number,
  ) => Promise<API.DelegationQueryParams>,
}>
  = (props) => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const formRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();


  const [modalVisit, setModalVisit] = useState(false);
  const [sampleId, setSampleId] = useState<number>(-1);
  //通过
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
    setModalVisit(false);
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
    setModalVisit(false);
    return true
  }
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
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核样品 */
    {
      title: '审核样品',
      dataIndex: 'auditSample',
      valueType: 'option',
      //hideInTable: !(props.roles.includes('marketing_department_staff')
      //  || props.roles.includes('test_department_staff')),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //求一下样品url

        return [record.state == '测试部/市场部验收样品中' &&
        <Button type="primary"
                onClick={() => {
                  setSampleId(record.sampleId!);
                  setModalVisit(true);
                }}
        >审核样品</Button>,
          <ModalForm
            title="审核"
            /*trigger={
              <Button type="primary">审核样品</Button>
            }*/
            formRef={formRef}
            visible={modalVisit}
            onVisibleChange={setModalVisit}
            autoFocusFirstInput
            modalProps={{
              //onCancel: () => console.log('cancel'),
              //onOk: onAccept,
              //onCancel: onReject,
            }}
            submitter={{
              //todo
              render: (submitterProps) => {
                return (
                  <div style={
                    {
                      textAlign: "right",
                      margin: 20,
                    }
                  }>
                    <ProForm.Group>
                      <Button type="primary" key="submit" onClick={onReject}>
                        不通过
                      </Button>
                      <Button type="primary" key="submit" onClick={onAccept}>
                        通过
                      </Button>
                    </ProForm.Group>
                  </div>
                );
              },
            }}
          >
            <ProForm.Group>
              <Button type="primary"
                      icon={<DownloadOutlined/>}
                      onClick={onDownload}>
                下载在线样品
              </Button>
            </ProForm.Group>
            <br/>
            <ProFormText name='remark' label='审核意见'/>
          </ModalForm>
        ]
      }
    }
  ];
  return (
    <DelegationList
      queryParams={props.queryParams}
      operationColumns={auditColumns}
      actionRef={actionRef}
    />
  )
}

export default AuditSampleList;
