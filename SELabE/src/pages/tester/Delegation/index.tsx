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
    const res = await delegationPage(p,options);
    const user = await currentUser();
    setRoles(user.data.roles)
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
