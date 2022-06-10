/**
 * 查看样品
 */
import type {ReactNode} from "react";
import React, {useRef} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import constant from "../../../../config/constant";
import {Link} from "umi";
//查看样品
const SampleList: React.FC
  = () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const submitSampleColumns: ProColumns<API.DelegationItem>[] = [
    /** 查看样品 */
    {
      title: '查看样品',
      dataIndex: 'readSample',
      valueType: 'option',
      //hideInTable: !roles.includes('client'),
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {sampleId} = record;   //样品id，可能没有
        return (
        <Link to={{pathname: constant.docPath.sample.READ, state: {sampleId: sampleId}}}>
          <Button type="primary">
            查看样品</Button>
        </Link>
        )
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    param.state = constant.delegationState.HAS_SAMPLE;
    if (roles.includes(constant.roles.SUPER_ADMIN.en)
      || roles.includes(constant.roles.MARKET_DEPARTMENT_MANAGER.en)
      || roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)
      || roles.includes(constant.roles.SIGNATORY.en)
      || roles.includes(constant.roles.QUALITY_DEPARTMENT_STAFF.en)
    ) {
    }
    //市场部员工
    else if (roles.includes(constant.roles.MARKET_DEPARTMENT_STAFF.en)) {
      param.marketDeptStaffId = userId;
    }
    //测试部员工
    else if (roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
    }
    //客户
    else if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      queryParams={queryParams}
      operationColumns={submitSampleColumns}
      actionRef={actionRef}
      projectsList={true}
    />
  )
}

export default SampleList;
