import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import React, {useRef} from "react";
import {message} from "antd";
import {distributeDelegationMarketing, distributeDelegationTesting,} from "@/services/ant-design-pro/delegation/api";
import {handleGetUserByRole} from "@/pages/Delegation/Distribute/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import DistributeForm from "@/pages/Delegation/components/DistributeForm";
import constant from "../../../../config/constant";

/**
 * 市场部/测试部主管分配委托
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
/**测试主管分配委托 */
const handleDistributeDelegationTesting = async (data: {
  acceptorId: number,//接收委托的工作人员id
  id: number,//委托编号
}) => {
  const resp = await distributeDelegationTesting(data);
  if (resp.code == 0) {
    message.success('分配成功');
  } else {
    message.error(resp.msg)
  }
}
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '分配委托',
      dataIndex: 'distribute',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //市场部分配
        if(record.state == constant.delegationState.WAIT_MARKETING_DEPARTMENT_ASSIGN_STAFF.desc) {
          return [
            <DistributeForm
              key={'distributeMarket'}
              request={async () => {
                const roleCode = constant.roles.MARKET_DEPARTMENT_STAFF.en;
                return await handleGetUserByRole({
                  roleCode: roleCode,
                })
              }}
              onSubmit={async (values) => {
                await handleDistributeDelegationMarketing({
                  acceptorId: values.acceptorId,
                  id: record.id!,
                })
                actionRef.current?.reload();
                return true;
              }}/>
          ]
        }
        //测试部分配
        else {
          return [
            <DistributeForm
              key={'distributeTesting'}
              request={async () => {
                const roleCode = constant.roles.TEST_DEPARTMENT_STAFF.en;
                return await handleGetUserByRole({
                  roleCode: roleCode,
                })
              }}
              onSubmit={async (values) => {
                //console.log(values)
                await handleDistributeDelegationTesting({
                  acceptorId: values.acceptorId,
                  id: record.id!,
                })
                actionRef.current?.reload();
                return true;
              }}/>
          ]
        }
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[]) => {
    if(roles.includes(constant.roles.MARKET_DEPARTMENT_MANAGER.en)
      && roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)) {
      param.state = "20,30";
    }
    else if (roles.includes(constant.roles.MARKET_DEPARTMENT_MANAGER.en)) {
      param.state = '20';
    }
    else if(roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)) {
      param.state = '30';
    }
    else {
      param.state = '-1';
    }
    return param;
  }
  return <DelegationList
    operationColumns={operationColumns}
    actionRef={actionRef}
    queryParams={queryParams}/>
}
