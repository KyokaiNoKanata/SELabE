import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
//用户提交样品
const AuditSampleList: React.FC<{
  /*request: any;
  roles: string[];//权限集合
  user: any;//当前用户信息*/
  queryParams: (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number,
  ) => Promise<API.DelegationQueryParams>,
}>
  = (props) => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const formRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();


  const [modalVisit, setModalVisit] = useState(false);

  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核样品 */
    {
      title: '审核样品',
      dataIndex: 'auditSample',
      valueType: 'option',
      //hideInTable: !(props.roles.includes('marketing_department_staff')
      //  || props.roles.includes('test_department_staff')),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //求一下样品url
        const {sampleId} = record;
        return [record.state == '测试部/市场部验收样品中' &&

        <Link to={{pathname: './sample-detail', query: {sampleId}}}>
        <Button type="primary">
          审核样品</Button>
        </Link>

        ]
      }
    }
  ];
  return (
    <DelegationList
      queryParams={props.queryParams}
      operationColumns={auditColumns}
      actionRef={actionRef}
    />
  )
}

export default AuditSampleList;
