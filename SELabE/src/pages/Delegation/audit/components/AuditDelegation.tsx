import React from "react";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ProColumns} from "@ant-design/pro-table";
//待审核的委托：分市场部、测试部的审核
//只显示分配给当前员工的，且处于待审核状态的委托
//操作栏只有审核操作
//管理员不需要看见
const AuditDelegation: React.FC<{
  operationColumns: ProColumns<API.DelegationItem>[];
  //request: any;
}> = (props) => {
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
      param.state = '40';
    }
    //测试部员工
    else if (roles.includes('test_department_staff')) {
      param.testingDeptStaffId = userId;
      param.state = '50';
    } else {
      //不可见（应当没有这个菜单,假设有，应该什么都看不到）
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={props.operationColumns}/>
  )
}

export default AuditDelegation;
