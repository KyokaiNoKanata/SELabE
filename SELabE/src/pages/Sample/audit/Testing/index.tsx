import AuditSampleList from "@/pages/Sample/components/AuditSampleList";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import {useState} from "react";

export default () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
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
    const user = await currentUser();
    setUser(user.data.user)
    setRoles(user.data.roles);

    //测试部验收
    if (user.data.roles.includes('test_department_staff')) {
      p.testingDeptStaffId = user.data.user.id;
      p.state = '260'//样品等待验收
    } else {
      p.state = '-1';
    }
    const res = await delegationPage(p, options);
    return res.data;
  }
  return (
    <AuditSampleList
      request={request}
      roles={roles}
      user={userInfo}
    />
  )
}
