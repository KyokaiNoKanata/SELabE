/**
 * 查看测试报告
 */
import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import constant from "../../../../config/constant";


export default () => {
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 查看测试报告 */
    {
      title: '查看测试报告',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: constant.docPath.report.READ_ONLY, state: {id: id}}}>
            <Button type="primary">查看测试报告</Button>
          </Link>,
        ];
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    param.state = constant.delegationState.HAS_REPORT;
    if (roles.includes(constant.roles.SUPER_ADMIN.en)
      || roles.includes(constant.roles.MARKET_DEPARTMENT_MANAGER.en)
      || roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)
      || roles.includes(constant.roles.SIGNATORY.en)
      || roles.includes(constant.roles.QUALITY_DEPARTMENT_STAFF.en)
    ) {
    }
    //市场部员工
    else if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
    }
    //测试部员工
    else if (roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
    }
    //客户
    else if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={auditColumns}
      projectsList={true}
    />
  )
}

