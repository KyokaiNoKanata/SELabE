import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type {API} from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";

/**
 * 客户审核合同草稿
 * 根据委托Id填写合同
 * 显示委托列表，最后一列审核合同，跳转到只读页面
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '审核合同',
      dataIndex: 'auditContractStaff',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record;//合同id
        return [
          <Link to={{pathname: '/docs/contract/audit/marketing', query: {contractId}}}>
            <Button type="primary">审核合同</Button>
          </Link>
        ]
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('super_admin')
      || roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
      param.state = '180';// 180, "市场部审核客户填写的草稿中"
    } else {
      param.state = '-1';
    }
    return param;
  }
  return <DelegationList
    queryParams={queryParams}
    operationColumns={operationColumns}
    actionRef={actionRef}
  />
}
