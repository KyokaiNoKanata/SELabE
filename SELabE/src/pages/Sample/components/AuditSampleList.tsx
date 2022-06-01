import type {ReactNode} from "react";
import React from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import constant from "../../../../config/constant";
//用户提交样品
const AuditSampleList: React.FC<{
  queryParams: (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number,
  ) => Promise<API.DelegationQueryParams>,
}>
  = (props) => {
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核样品 */
    {
      title: '验收样品',
      dataIndex: 'auditSample',
      valueType: 'option',
      //hideInTable: !(props.roles.includes('marketing_department_staff')
      //  || props.roles.includes('test_department_staff')),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {sampleId} = record;
        return [record.state == constant.delegationState.CHECKING_SAMPLE.desc &&
        <Link to={{pathname: constant.docPath.sample.AUDIT, state: {sampleId: sampleId}}}>
          <Button type="primary">
            验收样品</Button>
        </Link>
        ]
      }
    }
  ];
  return (
    <DelegationList
      queryParams={props.queryParams}
      operationColumns={auditColumns}
    />
  )
}

export default AuditSampleList;
