import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Upload} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import ProForm, {ModalForm, ProFormText} from "@ant-design/pro-form";
import {uploadFile} from "@/services/ant-design-pro/file/api";
import {DownloadOutlined} from "@ant-design/icons";
import {createSample, getSampleById, submitSample, updateSample} from "@/services/ant-design-pro/sample/api";
import type {RcFile} from "antd/es/upload";
import constant from "../../../../config/constant";
//用户提交样品
const Samples: React.FC
  = () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [file, setFile] = useState<RcFile | undefined>(undefined)
  const handleSubmitSample = async (id: number | undefined) => {
    if (!id) {
      message.error('没有样品');//不应该发生
      return false;
    }
    const resp = await submitSample({
      id: id,
    });
    if (resp.code == 0) {
      message.success('提交成功');
      actionRef.current?.reload();
    } else {
      message.error(resp.msg);
    }
    return true;
  }
  /**
   * 上传文件返回url
   * @param file
   * @path
   */
  const handleUploadFile = async (rcFile: RcFile | undefined, path: string) => {
    if (!rcFile) {
      return "";
    }
    const formData: FormData = new FormData();
    formData.append('file', rcFile!);
    const resp1 = await uploadFile(path, formData);
    if (resp1.code != 0) {
      message.error(resp1.msg);
      return "";
    }
    return resp1.data;
  }
  /**
   * @param delegationId
   * @return sampleId
   */
  const handleCreateSample = async (delegationId: number) => {
    const createResp = await createSample({
      delegationId: delegationId!
    });
    if (createResp.code != 0) {
      message.error(createResp.msg);
      return -1;
    } else {
      message.success('创建样品成功')
    }
    return createResp.data;
  }
  //如果之前提交过，回显,暂时就回显需要填写的数据
  const request = async (sampleId: number | undefined) => {
    if (!sampleId) {
      return {};
    }
    const sample = (await getSampleById(sampleId)).data;
    return {
      information: sample.information,
      processType: sample.processType,
      type: sample.type,
    };
  }
  const submitSampleColumns: ProColumns<API.DelegationItem>[] = [
    /** 提交样品 */
    {
      title: '提交样品',
      dataIndex: 'submitSample',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record; //合同id
        let {sampleId} = record;   //样品id，可能没有
        return [(record.state == constant.delegationState.CLIENT_UPLOAD_SAMPLE_INFO.desc
          || record.state == constant.delegationState.SAMPLE_CHECK_FAIL_MODIFY_SAMPLE.desc) &&
        <ModalForm
          title="上传"
          trigger={
            <Button type="primary">上传样品</Button>
          }
          autoFocusFirstInput
          modalProps={{
            //onCancel: () => console.log('cancel'),
          }}
          request={async () => await request(sampleId)}
          onFinish={async (values: any) => {
            // 上传样品：没有样品先创建样品
            if (!sampleId) {
              sampleId = await handleCreateSample(record.id!);
              //actionRef.current?.reload();
            }
            //保存样品
            //如果是在线提交，需要上传文件
            const url: string = await handleUploadFile(file, 'sample' + contractId + file?.name);
            const resp2 = await updateSample({
              id: sampleId!,
              information: values.information,
              processType: values.processType,
              type: values.type,
              url: url,
            });
            if (resp2.code == 0) {
              //提交样品
              await handleSubmitSample(sampleId)
              return true;
              //message.success('保存成功');
            } else {
              message.error(resp2.msg);
              return false;
            }
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
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
      param.state = '250,280'//用户上传样品
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={submitSampleColumns}
      actionRef={actionRef}
      projectsList={true}
    />
  )
}

export default Samples;
