import type {ReactNode} from "react";
import React from "react";
import type {API} from "@/services/ant-design-pro/typings";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Link} from "umi";
import {Button} from "antd";
//查看委托列表
//只显示自己可以查看的委托
//操作栏只有查看详情
//主管可以看到所有委托
//员工可以看到分配给自己的委托
//客户可以看到自己发起的委托
//可以在这个页面新增委托
const CheckDelegation: React.FC<{
  operationColumns: ProColumns<API.DelegationItem>[],
  actionRef?: React.MutableRefObject<ActionType | undefined>,
}>
  = (props) => {
  const checkDetailColumns: ProColumns<API.DelegationItem>[] = [
    /** 查看详情 */
    {
      title: '查看详情',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/delegation/detail', query: {id}}}>
            <Button type="primary">查看详情</Button>
          </Link>
        ]
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //这些人能看到全部
    if (roles.includes('super_admin')
      || roles.includes('marketing_department_manger')
      || roles.includes('test_department_manager')
      || roles.includes('signatory')
      || roles.includes('quality_department_staff')
    ) {
    }
    //市场部员工
    else if (roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
    }
    //测试部员工
    else if (roles.includes('test_department_staff')) {
      param.testingDeptStaffId = userId;
    }
    //客户
    else if (roles.includes('client')) {
      param.creatorId = userId;
    } else {
      param.state = '-1';
    }
    return param;
  }

  return (
    <DelegationList
      operationColumns={props.operationColumns.concat(checkDetailColumns)}
      actionRef={props.actionRef}
      queryParams={queryParams}/>
  )
}

export default CheckDelegation;
