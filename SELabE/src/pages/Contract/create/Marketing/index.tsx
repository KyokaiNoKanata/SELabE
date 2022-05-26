import type {ReactNode} from "react";
import React, { useRef, useState} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";

/**
 * （市场部可见）创建合同
 * 根据委托Id创建合同
 * 显示委托列表，最后一列创建合同
 */
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
      title: '填写合同',
      dataIndex: 'fillContractStaff',
      valueType: 'option',
      hideInTable: !roles.includes('marketing_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;//委托id
        return [
          <Link to={{pathname: '/docs/contract/marketing', query: {id}}}>
            <Button type="primary">填写合同</Button>
          </Link>
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
    //市场部员工
    if (role.includes('super_admin')
      || role.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
      p.state = '150';//市场部填写合同草稿
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
