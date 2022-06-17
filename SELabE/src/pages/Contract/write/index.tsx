import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";
import constant from "../../../../config/constant";

/**
 * 填写合同
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
        let path = "/";
        if(record.state == constant.delegationState.MARKETING_DEPARTMENT_GENERATE_CONTRACT.desc
        || record.state == constant.delegationState.CLIENT_AUDIT_CONTRACT_FAIL.desc) {
          path = constant.docPath.contract.write.MARKETING;
        } else {
          path = constant.docPath.contract.write.CLIENT;
        }
        return (
          <Link to={{pathname: path, state: {id: id, contractId: contractId}}}>
            <Button type="primary">填写合同</Button>
          </Link>
        )
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if(roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
      param.state = '150,200';//市场部填写合同草稿
    }
    else if (roles.includes(constant.roles.CUSTOMER.en)) {
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
