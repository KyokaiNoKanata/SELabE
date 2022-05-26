import React, {ReactNode, useRef, useState} from "react";
import {ActionType, ProColumns} from "@ant-design/pro-table";
import {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button, message, Upload} from "antd";
import {Link} from "umi";
import ProForm, {ModalForm} from "@ant-design/pro-form";
import {DownloadOutlined} from "@ant-design/icons";
import {uploadFile} from "@/services/ant-design-pro/file/api";
import {uploadContractFile} from "@/services/ant-design-pro/contract/api";
import {RcFile} from "antd/es/upload";
/**
 * 查看详情 最后一列查看合同
 * todo: 这里有问题，应该看到哪些状态的合同？ 或者应该直接查询合同分页
 */
export default ()=> {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles,setRoles] = useState<string[]>([]);
  const [userInfo,setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const [file,setFile] = useState<RcFile|undefined>(undefined)
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

        return [ record.state == '合同签署中' &&
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
              // 先上传文件，获取url再提交委托
              const formData: FormData = new FormData();
              formData.append('file',file!);
              const resp1 = await uploadFile('contract' + contractId + file?.name, formData);
              //ok
              if(resp1.code!=0) {
                message.error(resp1.msg);
                return false;
              }
              const url = resp1.data;
              const resp2 = await uploadContractFile({
                contractId: contractId,
                url: url,
              });
              if(resp2.code == 0) {
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
                  //formData.append('file',rFile);
                  setFile(rFile)
                  return reject(false);
                });
              }}
            >
              <Button type="primary" icon={<DownloadOutlined />}>
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
    const role = user.data.roles;
    setRoles(role);
    if(role.includes('super_admin')) {

    }
    else if(role.includes('client')) {
      p.creatorId = user.data.user.id;
    } else if(role.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
    }
    else {
      p.state = '-1';
    }
    const res = await delegationPage(p,options);
    return res.data;
  }
  return <DelegationList
    request={request}
    roles={roles}
    user={userInfo}
    operationColumns={operationColumns}
    actionRef={actionRef}
  >
  </DelegationList>
}
