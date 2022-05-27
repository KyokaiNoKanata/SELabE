/**
 * 测试部填写测试方案入口
 */
import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
//用户提交样品
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 填写测试方案 */
    {
      title: '审核测试方案',
      dataIndex: 'auditSolution',
      valueType: 'option',
      hideInTable: !roles.includes('quality_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //const {solutionId} = record;//到这里肯定有测试方案了
        //统一
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/solution/audit-solution', query: {id}}}>
            <Button type="primary">审核测试方案</Button>
          </Link>,
        ];
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
    //质量部
    if (user.data.roles.includes('quality_department_staff')) {
      p.state = '310'//质量部审核方案
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
      operationColumns={auditColumns}
    />
  )
}

