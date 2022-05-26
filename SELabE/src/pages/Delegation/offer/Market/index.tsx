/**
 * 市场部 生成报价
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
      title: '市场部生成报价',
      dataIndex: 'offerMarket',
      valueType: 'option',
      hideInTable: !roles.includes('marketing_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [<Link to={{pathname: '/docs/quotation/marketing', query: {id}}}>
          <Button type="primary">生成报价</Button>
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
    type RespType = {
      code: number,
      data: {
        list: API.DelegationItem[],
        total: number,
      }
      msg: string
    }
    //市场部员工
    //多个条件，好像需要多次请求。写得不太好
    if (role.includes('super_admin')
      || role.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
      p.state = '110';//and 130
      const res1: RespType = await delegationPage(p, options);
      p.state = '130';
      const res2: RespType = await delegationPage(p, options);
      const res: RespType = {
        msg: res2.msg,
        code: res2.code,
        data: {
          list: res1.data.list.concat(res2.data.list),
          total: res1.data.total + res2.data.total,
        }
      };
      return res.data;
    } else {
      p.state = '-1';
      return (await delegationPage(p, options)).data;
    }
  }
  return <DelegationList
    request={request}
    roles={roles}
    user={userInfo}
    operationColumns={operationColumns}
    actionRef={actionRef}
   />
}
