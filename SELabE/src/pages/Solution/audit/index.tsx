/**
 * 测试部填写测试方案入口
 */
import type {ReactNode} from "react";
import React, {useRef} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
//用户提交样品
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 填写测试方案 */
    {
      title: '审核测试方案',
      dataIndex: 'auditSolution',
      valueType: 'option',
      //hideInTable: !roles.includes('quality_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //const {solutionId} = record;//到这里肯定有测试方案了
        //统一
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/solution/audit-solution', query: {id}}}>
            <Button type="primary">审核测试方案</Button>
          </Link>,
        ];
      }
    }
  ];

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    if (roles.includes('quality_department_staff')) {
      param.state = '310'//质量部审核方案
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

