/**
 * 测试部填写测试方案入口
 */
import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import constant from "../../../../config/constant";
//用户提交样品
export default () => {
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 填写测试方案 */
    {
      title: '填写测试方案',
      dataIndex: 'fillSolution',
      valueType: 'option',
      //hideInTable: !roles.includes('test_department_staff'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return (
          <Link to={{pathname: constant.docPath.solution.WRITE, state: {id: id}}}>
            <Button type="primary">填写测试方案</Button>
          </Link>
        );
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
      param.state = '300,320'//测试部填写方案
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

