import AuditSampleList from "@/pages/Sample/components/AuditSampleList";
import type API from "@/services/ant-design-pro/typings";
import constant from "../../../../config/constant";

export default () => {
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    /**
     * 市场部/测试部 员工审核样品
     */
    if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
      param.state = '260';//样品等待验收
    } else if(roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
      param.state = '260';
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
