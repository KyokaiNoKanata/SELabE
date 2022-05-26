import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import type {ReactNode} from "react";
import React, { useRef, useState} from "react";
import {message} from "antd";
import {delegationPage, distributeDelegationMarketing,} from "@/services/ant-design-pro/delegation/api";
import {handleGetUserByRole} from "@/pages/Delegation/distribute/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import DistributeForm from "@/pages/Delegation/components/DistributeForm";

/**市场部主管分配委托 */
const handleDistributeDelegationMarketing = async (data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) => {
  const resp = await distributeDelegationMarketing(data);
  if (resp.code == 0) {
    message.success('分配成功');
  } else {
    message.error(resp.msg)
  }
}

//市场部分配:市场部主管可见所有待分配的
//20, "等待市场部主管分配市场部人员"
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '市场部分配',
      dataIndex: 'distributeMarket',
      valueType: 'option',
      hideInTable: !roles.includes('marketing_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        return [
          <DistributeForm
            key={'distributeMarket'}
            request={async () => {
              return await handleGetUserByRole({
                roleCode: 'marketing_department_staff',
              })
            }}
            onSubmit={async (values) => {
              //console.log(values)
              await handleDistributeDelegationMarketing({
                acceptorId: values.acceptorId,
                id: record.id!,
              })
              actionRef.current?.reload();
              return true;
            }}/>
        ]
      },
    }
  ]

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
    //主管能看到
    if (role.includes('super_admin')
      || role.includes('marketing_department_manger')) {
      p.state = '20';
    } else {
      p.state = '-1';
    }
    const res = await delegationPage(p, options);
    return res.data;
  }
  return <DelegationList
    request={request}
    roles={roles}
    user={userInfo}
    operationColumns={operationColumns}
    actionRef={actionRef}
   />
}
