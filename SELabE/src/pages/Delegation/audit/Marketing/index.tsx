import AuditDelegation from "@/pages/Delegation/audit/components/AuditDelegation";
import type {ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";

export default () => {
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    /** 市场部审核委托 */
    {
      title: '市场部审核',
      dataIndex: 'auditMarket',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/softDocReview/marketing', state: {id: id}}}>
            <Button type="primary">审核委托</Button>
          </Link>
        ]
      }
    },
  ]
  return (
    <AuditDelegation
      operationColumns={operationColumns} />
  )
}

