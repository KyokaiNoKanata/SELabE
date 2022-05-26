import React, {ReactNode, useRef, useState} from "react";
import {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import {ActionType, ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button, message, Upload} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {downloadFile, uploadFile} from "@/services/ant-design-pro/file/api";
import {uploadContractFile} from "@/services/ant-design-pro/contract/api";
import {DownloadOutlined} from "@ant-design/icons";
import {
  auditSampleFail,
  auditSampleSuccess,
  createSample,
  getSampleById,
  submitSample,
  updateSample
} from "@/services/ant-design-pro/sample/api";
import {RcFile} from "antd/es/upload";
import {render} from "react-dom";
//用户提交样品
const Samples: React.FC
  = () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles,setRoles] = useState<string[]>([]);
  const [userInfo,setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const [modalVisit, setModalVisit] = useState(false);
  const [sampleId,setSampleId] = useState<number>(-1);
  //通过
  const onAccept = async () => {
    const resp = await auditSampleSuccess({
      sampleId: sampleId,
      remark: 'success todo',// todo
    })
    if(resp.code != 0) {
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
    const resp = await auditSampleFail({
      sampleId: sampleId,
      remark: 'fail todo'// todo
    })
    if(resp.code != 0) {
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
    getSampleById(sampleId!).
    then(resp => {
      if(resp.code!=0) {
        message.error(resp.msg);
        return;
      }
      const url: string|undefined = resp.data.url;
      if(url) {
        // 下载文件 todo 这种写法不太好但是可行的
        const a = document.createElement("a");
        a.href = url;
        a.click();
      }
      else {
        message.warning('没有对应的在线样品文件');
      }
    })
  }
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核样品 */
    {
      title: '审核样品',
      dataIndex: 'auditSampleMarketing',
      valueType: 'option',
      hideInTable: !roles.includes('marketing_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record; //合同id
        //求一下样品url

        return [ record.state == '测试部/市场部验收样品中' &&
        <Button type="primary"
                onClick={()=> {
                  setSampleId(record.sampleId!);
                  setModalVisit(true);
                }}
        >审核样品</Button>,
          <ModalForm
            title="审核"
            /*trigger={
              <Button type="primary">审核样品</Button>
            }*/
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
              render: (props) => {
                return (
                  <div style={
                    {textAlign:"right",
                      margin:20,
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
                      icon={<DownloadOutlined />}
                      onClick={onDownload}>
                下载在线样品
              </Button>
            </ProForm.Group>
          </ModalForm>
        ]
      }
    }
  ];
  const request = async (
    params: {//传入的参数名固定叫 current 和 pageSize
      pageSize?: number;
      current?: number;
    },
    options?: Record<string, any>
  ) => {
    const p: API.PageParams = params;
    p.pageNo = p.current;
    const user = await currentUser();
    setUser(user.data.user)
    //const role = user.data.roles;
    setRoles(user.data.roles);

    //市场部验收
    if(user.data.roles.includes('marketing_department_staff')){
      p.marketDeptStaffId = user.data.user.id;
      p.state = '260'//样品等待验收
    } else {
      p.state = '-1';
    }
    const res = await delegationPage(p,options);
    return res.data;
  }
  return (
    <DelegationList
      request={request}
      roles={roles}
      user={userInfo}
      operationColumns={auditColumns}
    >
    </DelegationList>
  )
}

export default Samples;
