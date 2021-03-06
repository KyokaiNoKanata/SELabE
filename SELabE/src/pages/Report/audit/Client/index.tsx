/**
 * 审核测试报告
 */
import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import constant from "../../../../../config/constant";

export default () => {
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核测试报告 */
    {
      title: '审核测试报告',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return (
          <Link to={{pathname: constant.docPath.report.audit.CLIENT, state: {id: id}}}>
            <Button type="primary">审核测试报告</Button>
          </Link>
        );
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //用户审核
    if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
      param.state = '380'//用户审核
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

