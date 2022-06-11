/**
 * 审核测试报告
 */
import type {ReactNode} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import {Button} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {Link} from "umi";
import constant from "../../../../config/constant";
import {useState} from "react";

export default () => {
  /**
   * 角色列表
   */
  const [currentRoles,setRoles] = useState<string[]>([]);
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 审核测试报告 */
    {
      title: '审核测试报告',
      valueType: 'option',
      hideInTable: false,
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        //测试部主管审核
        let path = "";
        if(record.state == constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT.desc
        && currentRoles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)) {
          path = constant.docPath.report.audit.MANAGER;
        }
        //用户审核
        else if(record.state == constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_SUCCESS.desc
        && currentRoles.includes(constant.roles.CUSTOMER.en)) {
          path = constant.docPath.report.audit.CLIENT;
        }
        //授权签字人审核
        else if(record.state == constant.delegationState.CLIENT_AUDIT_TEST_REPORT_SUCCESS.desc
        && currentRoles.includes(constant.roles.SIGNATORY.en)) {
          path = constant.docPath.report.audit.SIGNATORY;
        } else {
          return [];
        }
        const {id} = record;
        return [
          <Link to={{pathname: path, state: {id: id}}}>
            <Button type="primary">审核测试报告</Button>
          </Link>,
        ];
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    setRoles(roles);
    param.state = constant.delegationState.REPORT_WAITING_AUDIT;
    if(roles.includes(constant.roles.TEST_DEPARTMENT_MANAGER.en)
    || roles.includes(constant.roles.SIGNATORY.en)
    || roles.includes(constant.roles.SUPER_ADMIN.en)) {
    }
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
      operationColumns={auditColumns}
      projectsList={true}
    />
  )
}

