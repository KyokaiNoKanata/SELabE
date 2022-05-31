import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import {Link} from "umi";
import {Button} from "antd";
import CheckDelegation from "@/pages/Delegation/list/components/CheckDelegation";
import type {ProColumns} from "@ant-design/pro-table";
import constant from "../../../../../config/constant";

export default () => {
  const columns: ProColumns<API.DelegationItem>[] = [
    /** 填写委托 */
    {
      title: '填写委托',
      dataIndex: 'detail',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        if ((record.state == constant.delegationState.DELEGATE_WRITING.desc
          || record.state == constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc
          || record.state == constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc)) {
          return [
            <Link to={{pathname: constant.docPath.delegation.APPLY, state: {id: id}}}>
              <Button type="primary">填写</Button>
            </Link>
          ]
        } else {
          return [
            <text>委托已填写</text>
          ]
        }
      }
    },
  ];
  return (<CheckDelegation
    operationColumns={columns}/>)
}
