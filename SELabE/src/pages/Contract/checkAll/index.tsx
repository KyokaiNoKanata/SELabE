import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type {API} from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button, message, Upload} from "antd";
import {Link} from "umi";
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {DownloadOutlined} from "@ant-design/icons";
import {uploadFile} from "@/services/ant-design-pro/file/api";
import {uploadContractFile} from "@/services/ant-design-pro/contract/api";
import type {RcFile} from "antd/es/upload";

/**
 * 查看详情 最后一列查看合同
 * todo: 这里有问题，应该看到哪些状态的合同？ 或者应该直接查询合同分页
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
      title: '合同详情',
      dataIndex: 'ContractDetail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record;//合同id
        return [
          <Link to={{pathname: '/docs/contract/detail', query: {contractId}}}>
            <Button type="primary">查看详情 todo</Button>
          </Link>
        ]
      },
    },
    {
      title: '上传合同',
      dataIndex: 'uploadContract',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record;//合同id

        return [record.state == '合同签署中' &&
        <ModalForm
          title="上传"
          trigger={
            <Button type="primary">上传合同</Button>
          }
          autoFocusFirstInput
          modalProps={{
            //onCancel: () => console.log('cancel'),
          }}
          onFinish={async (values) => {
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
      },
    }
  ]
  /**
   * todo:
   * 1、状态限定
   * 2、可能要重写成合同列表，不然有些奇怪
   * 3、上传合同和查看合同感觉应该分开
   *
   */
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('super_admin')) {

    } else if (roles.includes('client')) {
      param.creatorId = userId;
    } else if (roles.includes('marketing_department_staff')) {
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
