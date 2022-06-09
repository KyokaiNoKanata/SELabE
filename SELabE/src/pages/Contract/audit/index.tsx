import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";
import constant from "../../../../config/constant";

/**
 * 审核合同
 * 根据委托Id填写合同
 * 显示委托列表，最后一列审核合同，跳转到只读页面
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '审核合同',
      dataIndex: 'auditContract',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id, contractId} = record;
        let path: string = "/";
        if(record.state == constant.delegationState.MARKETING_DEPARTMENT_AUDIT_CONTRACT.desc) {
          path = constant.docPath.contract.audit.MARKETING;
        } else {
          path = constant.docPath.contract.audit.CLIENT;
        }
        return [
          <Link to={{pathname: path, state: {id: id, contractId: contractId}}}>
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
    //市场部审核
    if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
      param.state = '180';// 180, "市场部审核客户填写的草稿中"
    } else if(roles.includes(constant.roles.CUSTOMER.en)) {
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
