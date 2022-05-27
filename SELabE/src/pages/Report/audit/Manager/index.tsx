/**
 * 填写测试文档
 */
import type {ReactNode} from "react";
import {useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";

export default () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});

  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核测试报告 */
    {
      title: '审核测试报告',
      valueType: 'option',
      hideInTable: !roles.includes('test_department_manager'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/report/audit/manager', query: {id}}}>
            <Button type="primary">审核测试报告</Button>
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

    //测试部主管审核
    if (user.data.roles.includes('test_department_manager')) {
      p.state = '360'//测试部主管审核
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

