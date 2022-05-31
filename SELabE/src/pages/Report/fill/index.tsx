/**
 * 填写测试文档
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
    /** 填写测试文档 */
    {
      title: '填写测试文档',
      dataIndex: 'fillSolution',
      valueType: 'option',
      //hideInTable: !roles.includes('test_department_staff'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: constant.docPath.report.WRITE, state: {id: id}}}>
            <Button type="primary">填写测试文档</Button>
          </Link>,
        ];
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
      param.state = '340,370,390,410'//测试部填写测试文档
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={auditColumns}
    />
  )
}

