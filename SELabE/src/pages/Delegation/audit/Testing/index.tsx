import AuditDelegation from "@/pages/Delegation/audit/components/AuditDelegation";
import {ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
import {API} from "@/services/ant-design-pro/typings";
import {ReactNode} from "react";
export default () => {
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    /** 测试部审核委托 */
    {
      title: '测试部审核',
      dataIndex: 'auditTest',
      valueType: 'option',
      hideInTable: false,
      sorter:false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/softDocReview/testing', query: {id}}}>
            <Button type="primary">审核委托</Button>
          </Link>
        ]
      }
    }
    ];
  return (
    <AuditDelegation
      operationColumns={operationColumns}>
    </AuditDelegation>
  )
}
