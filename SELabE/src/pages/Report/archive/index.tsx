/**
 * 测试部归档
 */
import type {ReactNode} from "react";
import {useRef} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Modal} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {archiveReport} from "@/services/ant-design-pro/report/api";
import constant from "../../../../config/constant";

const {confirm} = Modal;
export default () => {
  const actionRef = useRef<ActionType>()
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 测试部归档测试报告 *
     * 点完成即可
     */
    {
      title: '归档测试报告',
      valueType: 'option',
      //hideInTable: !roles.includes('test_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {reportId} = record;
        return (
          <Button
            type="primary"
            key="primary"
            onClick={
              () => {
                confirm({
                  title: '确认归档吗?',
                  //icon: <ExclamationCircleOutlined/>,
                  content: '',
                  onOk() {
                    archiveReport({
                      reportId: reportId!
                    }).then(resp => {
                      if (resp.code == 0) {
                        message.success('归档成功');
                        actionRef.current?.reload();
                      } else {
                        message.error(resp.msg);
                      }
                    })
                  },
                  onCancel() {

                  },
                });
              }
            }
          >
            <FormattedMessage id="page.report.archive" defaultMessage="归档"/>
          </Button>
        )
      }
    }
  ];
  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //测试部员工归档
    if (roles.includes(constant.roles.TEST_DEPARTMENT_STAFF.en)) {
      param.testingDeptStaffId = userId;
      param.state = '430'//测试部归档
    } else {
      param.state = '-1';
    }
    return param;
  }
  return (
    <DelegationList
      actionRef={actionRef}
      queryParams={queryParams}
      operationColumns={auditColumns}
    />
  )
}

