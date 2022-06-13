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

/**
 * 审核测试方案
 */
export default () => {
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核测试方案 */
    {
      title: '审核测试方案',
      dataIndex: 'auditSolution',
      valueType: 'option',
      //hideInTable: !roles.includes('quality_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //const {solutionId} = record;//到这里肯定有测试方案了
        //统一
        const {id} = record;
        return (
          <Link to={{pathname: constant.docPath.solution.AUDIT, state: {id: id}}}>
            <Button type="primary">审核测试方案</Button>
          </Link>
        );
      }
    }
  ];

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[]) => {
    if (roles.includes(constant.roles.QUALITY_DEPARTMENT_STAFF.en)) {
      param.state = '310'//质量部审核方案
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

