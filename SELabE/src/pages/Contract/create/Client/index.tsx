import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";

/**
 * （用户可见）创建合同
 * 根据委托Id填写合同
 * 显示委托列表，最后一列填写合同
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '填写合同',
      dataIndex: 'fillContractClient',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id, contractId} = record;
        return [
          <Link to={{pathname: '/docs/contract/client', state: {id: id, contractId: contractId}}}>
            <Button type="primary">填写合同</Button>
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
      param.state = '170,190';// 170, "客户接受市场部合同草稿，填写合同中" 190, "市场部审核合同不通过，客户修改中"
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
