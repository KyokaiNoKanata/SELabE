import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import React, {useRef} from "react";
import {message} from "antd";
import {distributeDelegationMarketing,} from "@/services/ant-design-pro/delegation/api";
import {handleGetUserByRole} from "@/pages/Delegation/distribute/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import DistributeForm from "@/pages/Delegation/components/DistributeForm";
import constant from "../../../../../config/constant";

/**
 * 市场部主管分配委托
 * */
const handleDistributeDelegationMarketing = async (data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) => {
  const resp = await distributeDelegationMarketing(data);
  if (resp.code == 0) {
    message.success('分配成功');
  } else {
    message.error(resp.msg)
  }
}

//市场部分配:市场部主管可见所有待分配的
//20, "等待市场部主管分配市场部人员"
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '市场部分配',
      dataIndex: 'distributeMarket',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        return [
          <DistributeForm
            key={'distributeMarket'}
            request={async () => {
              return await handleGetUserByRole({
                roleCode: constant.roles.MARKET_DEPARTMENT_STAFF.en,
              })
            }}
            onSubmit={async (values) => {
              //console.log(values)
              await handleDistributeDelegationMarketing({
                acceptorId: values.acceptorId,
                id: record.id!,
              })
              actionRef.current?.reload();
              return true;
            }}/>
        ]
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[]) => {
    //市场部主管
    if (roles.includes(constant.roles.MARKET_DEPARTMENT_MANAGER.en)) {
      param.state = '20';
    } else {
      param.state = '-1';
    }
    return param;
  }
  return <DelegationList
    operationColumns={operationColumns}
    actionRef={actionRef}
    queryParams={queryParams}/>
}
