import type {ReactNode} from "react";
import React from "react";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
import constant from "../../../../config/constant";
/**
 * 查看项目
 * @constructor
 */
const ProjectList: React.FC = () => {
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    /** 查看详情 */
    {
      title: '项目详情',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: constant.docPath.project.DETAIL, state: {id: id}}}>
            <Button type="primary">查看项目</Button>
          </Link>
        ]
      }
    }
    ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //这些人能看到全部
    param.state = constant.delegationState.HAS_PROJECT_QUERY;
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
      operationColumns={operationColumns}
      queryParams={queryParams}
      projectsList={true}
    />
  )
}

export default ProjectList;
