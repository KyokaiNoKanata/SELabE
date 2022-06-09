import AuditDelegation from "@/pages/Delegation/Audit/components/AuditDelegation";
import type {ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import constant from "../../../../config/constant";

export default () => {
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核委托 */
    {
      title: '审核委托',
      dataIndex: 'auditMarket',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        let path: string = "/";
        if(record.state == constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION.desc) {
          path = constant.docPath.delegation.audit.MARKETING;
        } else {
          path = constant.docPath.delegation.audit.TESTING;
        }
        return [
          <Link to={{pathname: path, state: {id: id}}}>
            <Button type="primary">审核委托</Button>
          </Link>
        ]
      }
    },
  ]
  return (
    <AuditDelegation
      operationColumns={operationColumns}/>
  )
}

