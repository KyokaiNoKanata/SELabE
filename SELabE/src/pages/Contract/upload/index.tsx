import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button, message, Upload} from "antd";
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {DownloadOutlined} from "@ant-design/icons";
import {uploadFile} from "@/services/ant-design-pro/file/api";
import {uploadContractFile} from "@/services/ant-design-pro/contract/api";
import type {RcFile} from "antd/es/upload";
import constant from "../../../../config/constant";

/**
 * 上传合同
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [file, setFile] = useState<RcFile | undefined>(undefined)
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
    const resp = await uploadFile(path, formData);
    if (resp.code != 0) {
      message.error(resp.msg);
      return "";
    }
    return resp.data;
  }
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '上传合同',
      dataIndex: 'uploadContract',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record;//合同id
        if (record.state == '合同签署中') {
          return [
            <ModalForm
              title="上传"
              trigger={
                <Button type="primary">上传合同</Button>
              }
              autoFocusFirstInput
              modalProps={{
                //onCancel: () => console.log('cancel'),
              }}
              onFinish={async () => {
                const url = await handleUploadFile(file, 'contract' + contractId + file?.name);
                const resp2 = await uploadContractFile({
                  contractId: contractId,
                  url: url,
                });
                if (resp2.code == 0) {
                  message.success('上传合同成功');
                } else {
                  message.error(resp2.msg);
                }
                if (actionRef.current) {
                  actionRef.current.reload();
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
            </ModalForm>
          ]
        } else {
          return []//加个下载按钮?
        }
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    param.state = String(constant.delegationState.CONTRACT_SIGNING.code);
    if (roles.includes(constant.roles.SUPER_ADMIN.en)) {

    } else if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
    } else {
      param.state = '-1';
    }
    return param;
  }
  return <DelegationList
    queryParams={queryParams}
    operationColumns={operationColumns}
    actionRef={actionRef}
  />
}
