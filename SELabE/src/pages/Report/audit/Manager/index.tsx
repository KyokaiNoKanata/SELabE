/**
 * 审核测试报告
 */
import type {ReactNode} from "react";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import type API from "@/services/ant-design-pro/typings";

export default () => {
  /**
   * 审核列
   */
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核测试报告 */
    {
      title: '审核测试报告',
      valueType: 'option',
      //hideInTable: !roles.includes('test_department_manager'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/report/audit/manager', state: {id: id}}}>
            <Button type="primary">审核测试报告</Button>
          </Link>,
        ];
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[]) => {
    //市场部 发送报告
    if (roles.includes('test_department_manager')) {
      param.state = '360'//测试部主管审核
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={auditColumns}
    />
  )
}

