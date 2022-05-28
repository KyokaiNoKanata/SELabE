/**
 * 市场部 生成报价
 */
import type {API} from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import React, {useRef} from "react";
import {Link} from "umi";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
//市场部分配:市场部主管可见所有待分配的
//20, "等待市场部主管分配市场部人员"
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '市场部生成报价',
      dataIndex: 'offerMarket',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [<Link to={{pathname: '/docs/quotation/marketing', query: {id}}}>
          <Button type="primary">生成报价</Button>
        </Link>
        ]
      },
    }
  ];

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //市场部员工
    if (roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
      param.state = '110,130';
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
