import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Upload} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import ProForm, {ModalForm, ProFormText} from "@ant-design/pro-form";
import {uploadFile} from "@/services/ant-design-pro/file/api";
import {DownloadOutlined} from "@ant-design/icons";
import {createSample, submitSample, updateSample} from "@/services/ant-design-pro/sample/api";
import type {RcFile} from "antd/es/upload";
//用户提交样品
const Samples: React.FC
  = () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const [file, setFile] = useState<RcFile | undefined>(undefined)
  const submitSampleColumns: ProColumns<API.DelegationItem>[] = [
    /** 提交样品 */
    {
      title: '提交样品',
      dataIndex: 'submitSample',
      valueType: 'option',
      hideInTable: !roles.includes('client'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record; //合同id
        let {sampleId} = record;   //样品id，可能没有
        return [(record.state == '用户上传样品中' || record.state == '样品验收不通过，用户重新修改') &&
        <ModalForm
          title="上传"
          trigger={
            <Button type="primary">上传样品</Button>
          }
          autoFocusFirstInput
          modalProps={{
            //onCancel: () => console.log('cancel'),
          }}
          onFinish={async (values) => {
            // 上传样品：没有样品先创建样品
            if (!sampleId) {
              //创建样品
              const createResp = await createSample({
                delegationId: record.id!
              });
              if (createResp.code != 0) {
                message.error(createResp.msg);
                return;
              } else {
                sampleId = createResp.data;
                message.success('创建样品成功')
              }
              actionRef.current?.reload();
            }
            //保存样品
            //如果是在线提交，需要上传文件
            let url: string = '';
            if (file) {
              const formData: FormData = new FormData();
              formData.append('file', file!);
              const resp1 = await uploadFile('sample' + contractId + file?.name, formData);
              if (resp1.code != 0) {
                message.error(resp1.msg);
                return true;
              }
              url = resp1.data;
            }
            const resp2 = await updateSample({
              id: sampleId!,
              information: values.information,
              processType: values.processType,
              type: values.type,
              url: url,
            });
            if (resp2.code == 0) {
              //message.success('保存成功');
            } else {
              message.error(resp2.msg);
              return false;
            }
            actionRef.current?.reload();
            //
            //顺便提交样品
            //todo:这里写得不对，第一次不能及时更新
            sampleId = record.sampleId!;
            if (!sampleId) {
              message.error('没有样品');//不应该发生
              return false;
            }
            const resp = await submitSample({
              id: sampleId,
            });
            if (resp.code == 0) {
              message.success('提交成功');
              actionRef.current?.reload();
            } else {
              message.error(resp.msg);
            }
            return true;
          }}
        >
          <ProForm.Group>
            <Upload
              beforeUpload={(rFile) => {
                return new Promise(async (resolve, reject) => {
                  setFile(rFile)
                  return reject(false);
                });
              }}
            >
              <Button type="primary" icon={<DownloadOutlined/>}>
                上传
              </Button>
            </Upload>
          </ProForm.Group>
          <br/>
          <ProFormText name='information' label='样品信息' width='md'/>
          <ProFormText name='processType' label='处理方式' width='md'/>
          <ProFormText name='type' label='样品上传方式，如果在线上传则填写为线上，其余需说明方式的具体信息' width='md'/>
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

    //客户
    if (user.data.roles.includes('client')) {
      p.creatorId = user.data.user.id;
      p.state = '250,280'//用户上传样品
    } else {
      p.state = '-1';
    }
    const res = await delegationPage(p, options);
    return res.data;
  }
  return (
    <DelegationList
      request={request}
      roles={roles}
      user={userInfo}
      operationColumns={submitSampleColumns}
      actionRef={actionRef}
    />
  )
}

export default Samples;
