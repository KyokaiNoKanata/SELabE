import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import type API from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Button} from "antd";
import {Link} from "umi";
import constant from "../../../../config/constant";

/**
 * 查看详情 最后一列查看合同
 * todo: 这里有问题，应该看到哪些状态的合同？ 或者应该直接查询合同分页
 */
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();

  const operationColumns: ProColumns<API.DelegationItem>[] = [
    //todo
    {
      title: '合同详情',
      dataIndex: 'ContractDetail',
      valueType: 'option',
      hideInTable: true,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {contractId} = record;//合同id
        return [
          <Link to={{pathname: '/docs/contract/detail', state: {contractId: contractId}}}>
            <Button type="primary">查看详情 todo</Button>
          </Link>
        ]
      },
    },
  ]
  /**
   * todo:
   * 1、状态限定
   * 2、可能要重写成合同列表，不然有些奇怪
   * 3、上传合同和查看合同感觉应该分开
   * 4、合同详情（是否必要？就是委托详情?)
   */
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    param.state = '150,160,170,180,190,200,210,220,230';//todo
    if (roles.includes(constant.roles.SUPER_ADMIN.en)) {

    } else if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
    } else if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
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
