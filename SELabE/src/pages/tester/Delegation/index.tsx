import DelegationList from "@/pages/tester/Delegation/components/DelegationList";
import {useState} from "react";
import {delegationPage} from "@/services/ant-design-pro/tester/api";
import {currentUser} from "@/services/ant-design-pro/api";
import {API} from "@/services/ant-design-pro/typings";

const Delegation: React.FC = () => {
  const [roles,setRoles] = useState<[string]>([]);
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
    setRoles(user.data.roles);
    console.log(user.data.roles)
    //TODO:设置当前用户可见的委托
    /*if(!roles.includes('super_admin')) {
      //市场部主管->分配
      if(user.data.roles.includes('marketing_department_manger')) {
        p.state = '20';
      }
      //测试部主管->分配
      else if(user.data.roles.includes('test_department_manager')) {
        p.state = '30'
      }
      //市场部员工
      else if(user.data.roles.includes('marketing_department_staff')) {
        p.marketDeptStaffId = user.data.user.id;
        p.state = '40';
      }
      //测试部员工
      else if(user.data.roles.includes('testing_department_staff')) {
        p.testingDeptStaffId = user.data.user.id;
        p.state = '50'
      }
      //客户
      else if(user.data.roles.includes('client')) {
        p.creatorId = user.data.user.id;
      }
    }*/
    const res = await delegationPage(p,options);
    return {
      data:res.data.list,
      total: res.data.total, //分页固定属性
      result: true,
    }}
  return (
    <DelegationList
      request={request}
      roles={roles}>
    </DelegationList>
  )
}
export default Delegation;
