import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";

/**
 * （市场部可见）创建合同
 * 根据委托Id创建合同
 * 显示委托列表，最后一列创建合同
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '填写合同',
      dataIndex: 'fillContractStaff',
      valueType: 'option',
      //hideInTable: !roles.includes('marketing_department_staff'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id, contractId} = record
        return [
          <Link to={{pathname: '/docs/contract/marketing', state: {id: id, contractId: contractId}}}>
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
    if (roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
      param.state = '150,200';//市场部填写合同草稿
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
