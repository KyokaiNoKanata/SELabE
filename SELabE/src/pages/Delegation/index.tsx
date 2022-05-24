import DelegationList from "@/pages/Delegation/components/DelegationList";
import {useState} from "react";
import {delegationPage, getProcessList} from "@/services/ant-design-pro/delegation/api";
import {currentUser} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";

//获取状态变更时间
const getOperateTime = async (delegationId: number) => {
  const process = await getProcessList({
    id: delegationId,
  });
  const operateTime = process.data[process.data.length-1].operateTime;
  console.log(operateTime);
  return operateTime;
}
const Delegation: React.FC = () => {
  const [roles,setRoles] = useState<[string]>([]);
  const [userInfo,setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const request= async (
      params: {//传入的参数名固定叫 current 和 pageSize
        pageSize?: number;
        current?: number;
      },
      options?: Record<string, any>
    ) => {
    const p: API.PageParams = params;
    p.pageNo = p.current;
    console.log(p);

    const user = await currentUser();
    setUser(user.data.user)
    const role = user.data.roles;
    setRoles(role);
    //console.log(user.data.roles)
    //设置当前用户可见的委托
    //super_admin/marketing_department_manger/test_department_manager:可以看到全部
    //防止一个用户有多种role带来的问题
    if(role.includes('super_admin')
      || role.includes('marketing_department_manger')
      || role.includes('test_department_manager')) {
    } else {
      if(user.data.roles.includes('marketing_department_staff')) {
        p.marketDeptStaffId = user.data.user.id;
        //p.state = '40';
      }
      //测试部员工
      else if(user.data.roles.includes('testing_department_staff')) {
        p.testingDeptStaffId = user.data.user.id;
        //p.state = '50';
      }
      //客户
      else if(user.data.roles.includes('client')) {
        p.creatorId = user.data.user.id;
      }
    }
    const res = await delegationPage(p,options);
    //状态变更时间
    for(let i = 0; i < res.data.list.length; i++) {
      res.data.list[i].operateTime = await getOperateTime(res.data.list[i].id);
    }

    return {
      data:res.data.list,
      total: res.data.total, //分页固定属性
      result: true,
    }}
  return (
    <DelegationList
      request={request}
      roles={roles}
      user={userInfo}>
    </DelegationList>
  )
}
export default Delegation;
