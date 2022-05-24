import {ReactNode} from "react";
import {API} from "@/services/ant-design-pro/typings";
import {Link} from "umi";
import {Button} from "antd";
import CheckDelegation from "@/pages/Delegation/check/components/CheckDelegation";
import {ProColumns} from "@ant-design/pro-table";
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
        return [
          (record.state == '委托填写中'  || record.state?.includes('委托修改中'))&&
          <Link to={{pathname: '/docs/new-delegation', query: {id}}}>
            <Button type="primary">填写</Button>
          </Link>,
          !(record.state == '委托填写中'  || record.state?.includes('委托修改中')) &&
          <text>委托已填写</text>
        ]
      }
    },
  ];
  return (<CheckDelegation
    operationColumns={columns}>
  </CheckDelegation>)
}
