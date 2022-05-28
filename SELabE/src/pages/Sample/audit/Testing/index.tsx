import AuditSampleList from "@/pages/Sample/components/AuditSampleList";
import type {API} from "@/services/ant-design-pro/typings";

export default () => {
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('test_department_staff')) {
      param.testingDeptStaffId = userId;
      param.state = '260'//样品等待验收
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <AuditSampleList
      queryParams={queryParams}
    />
  )
}
