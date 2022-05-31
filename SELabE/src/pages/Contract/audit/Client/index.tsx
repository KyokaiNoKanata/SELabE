import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
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
      title: '检查合同',
      dataIndex: 'auditContractClient',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id, contractId} = record
        return [
          <Link to={{pathname: '/docs/contract/audit/client', state: {id: id, contractId: contractId}}}>
            <Button type="primary">检查合同</Button>
          </Link>
        ]
      },
    }
  ]

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('client')) {
      param.creatorId = userId;
      param.state = '160';
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
