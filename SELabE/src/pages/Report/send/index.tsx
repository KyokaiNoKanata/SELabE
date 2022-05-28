/**
 * 市场部发送报告
 */
import type {ReactNode} from "react";
import {useRef} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import type {ProColumns} from "@ant-design/pro-table";
import type {ActionType} from "@ant-design/pro-table";
import {Button, message, Modal} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {sendReport} from "@/services/ant-design-pro/report/api";

const {confirm} = Modal;
export default () => {
  const actionRef = useRef<ActionType>();
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 测试部归档测试报告 *
     * 点完成即可
     */
    {
      title: '发送测试报告',
      valueType: 'option',
      //hideInTable: !roles.includes('marketing_department_staff'),
      hideInTable: false,
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
                  title: '确认发送吗?',
                  //icon: <ExclamationCircleOutlined/>,
                  content: '',
                  onOk() {
                    sendReport({
                      reportId: reportId!
                    }).then(resp => {
                      if (resp.code == 0) {
                        message.success('发送成功');
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
            <FormattedMessage id="page.report.send" defaultMessage="发送"/>
          </Button>
        )
      }
    }
  ];

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //市场部 发送报告
    if (roles.includes('super_admin')
      || roles.includes('marketing_department_staff')) {
      param.marketDeptStaffId = userId;
      param.state = '440'//市场部发送报告
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

