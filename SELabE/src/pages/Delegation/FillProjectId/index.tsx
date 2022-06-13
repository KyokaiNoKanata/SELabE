import type API from "@/services/ant-design-pro/typings";
import type {ReactNode} from "react";
import React, {useRef} from "react";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import constant from "../../../../config/constant";
import {Link} from "umi";

export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const operationColumns: ProColumns<API.DelegationItem>[] = [
    {
      title: '填写项目编号',
      dataIndex: 'fillProjectId',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //填写项目编号
        const {id} = record;
        if(record.state == constant.delegationState. WAITING_TESTING_DEPT_MANAGER_FILL_PROJECT_ID.desc) {
          return (
            <Link to={{pathname: constant.docPath.delegation.FILL_PROJECT_ID, state: {id: id}}}>
              <Button type="primary">填写项目编号</Button>
            </Link>
          )
        } else {
          return [];
        }
      },
    }
  ]
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[]) => {
    //测试部主管
    if(roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)) {
      param.state = '235,240';
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
