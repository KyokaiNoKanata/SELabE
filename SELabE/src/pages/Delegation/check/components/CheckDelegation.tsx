import type {ReactNode} from "react";
import React, {useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
//查看委托列表
//只显示自己可以查看的委托
//操作栏只有查看详情
//主管可以看到所有委托
//员工可以看到分配给自己的委托
//客户可以看到自己发起的委托
//可以在这个页面新增委托
const CheckDelegation: React.FC<{
  operationColumns: ProColumns<API.DelegationItem>[],
  actionRef?: React.MutableRefObject<ActionType | undefined>,
}>
  = (props) => {
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const checkDetailColumns: ProColumns<API.DelegationItem>[] = [
    /** 查看详情 */
    {
      title: '查看详情',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/delegation/detail', query: {id}}}>
            <Button type="primary">查看详情</Button>
          </Link>
        ]
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
    const p1: API.PageParams = params;
    p1.pageNo = p1.current;
    const {current, ...p} = p1;
    const user = await currentUser();
    setUser(user.data.user)
    setRoles(user.data.roles);
    //这些人能看到全部
    if (user.data.roles.includes('super_admin')
      || user.data.roles.includes('marketing_department_manger')
      || user.data.roles.includes('test_department_manager')
      || user.data.roles.includes('signatory')
      || user.data.roles.includes('quality_department_staff')
    ) {
    }
    //市场部员工
    else if (user.data.roles.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
    }
    //测试部员工
    else if (user.data.roles.includes('test_department_staff')) {
      p.testingDeptStaffId = user.data.user.id;
    }
    //客户
    else if (user.data.roles.includes('client')) {
      p.creatorId = user.data.user.id;
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
      operationColumns={props.operationColumns.concat(checkDetailColumns)}
      actionRef={props.actionRef}/>
  )
}

export default CheckDelegation;
