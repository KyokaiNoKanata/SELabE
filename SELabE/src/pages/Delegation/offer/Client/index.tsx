/**
 * 客户 处理报价
 */
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import type {ReactNode} from "react";
import React, { useRef, useState} from "react";
import {Link} from "umi";
import {Button} from "antd";
import {delegationPage,} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";

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
      title: '客户处理报价',
      dataIndex: 'offerMarket',
      valueType: 'option',
      hideInTable: !roles.includes('client'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [<Link to={{pathname: '/docs/quotation/client', query: {id}}}>
          <Button type="primary">处理报价</Button>
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
      || role.includes('client')) {
      p.creatorId = user.data.user.id;
      p.state = '120';
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
