import React, {useState} from "react";
import {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {ProColumns} from "@ant-design/pro-table";
//待审核的委托：分市场部、测试部的审核
//只显示分配给当前员工的，且处于待审核状态的委托
//操作栏只有审核操作
//管理员不需要看见
const AuditDelegation: React.FC<{
  operationColumns: ProColumns<API.DelegationItem>[];
  //request: any;
}> = (props) => {
  //const operation: string[] = ['marketingAudit','testingAudit'];
  const [roles,setRoles] = useState<string[]>([]);
  const [userInfo,setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const request = async (
    params: {//传入的参数名固定叫 current 和 pageSize
      pageSize?: number;
      current?: number;
    },
    options?: Record<string, any>
  ) => {
    const p: API.PageParams = params;
    p.pageNo = p.current;
    //console.log(p);

    const user = await currentUser();
    setUser(user.data.user)
    const role = user.data.roles;
    setRoles(role);
    console.log(role)
    if(user.data.roles.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
      p.state = '40';
    }
      //测试部员工
    else if(user.data.roles.includes('test_department_staff')) {
      p.testingDeptStaffId = user.data.user.id;
      p.state = '50';
    }
    else {
      //不可见（应当没有这个菜单,假设有，应该什么都看不到）
      p.state = '-1';
    }
    const res = await delegationPage(p,options);
    return res.data;
  }
  return (
    <DelegationList
      request={request}
      roles={roles}
      user={userInfo}
      operationColumns={props.operationColumns}>
    </DelegationList>
  )
}

export default AuditDelegation;
