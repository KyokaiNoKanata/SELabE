import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import React, {useRef} from "react";
import {message} from "antd";
import {distributeDelegationTesting,} from "@/services/ant-design-pro/delegation/api";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import DistributeForm from "@/pages/Delegation/components/DistributeForm";
import {handleGetUserByRole} from "@/pages/Delegation/distribute/api";

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
      title: '测试部分配',
      dataIndex: 'distributeTest',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        return [
          <DistributeForm
            key={'distributeMarket'}
            request={async () => {
              return await handleGetUserByRole({
                roleCode: 'test_department_staff',
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
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //测试部主管
    if (roles.includes('test_department_manager')) {
      param.state = '30';
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
