/**
 * 客户接收测试文档
 */
import type {ReactNode} from "react";
import {useRef} from "react";
import type API from "@/services/ant-design-pro/typings";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message, Modal} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {receiveReport, sendReport} from "@/services/ant-design-pro/report/api";
import constant from "../../../../config/constant";

const {confirm} = Modal;
export default () => {
  const actionRef = useRef<ActionType>();
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 客户接收测试文档
     *
     */
    {
      title: '客户接收测试文档',
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
                  title: '确认接收吗?',
                  //icon: <ExclamationCircleOutlined/>,
                  content: '',
                  onOk() {
                    receiveReport({
                      reportId: reportId!
                    }).then(resp => {
                      if (resp.code == 0) {
                        message.success('接收成功');
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
            <FormattedMessage id="page.report.send" defaultMessage="接收"/>
          </Button>
        )
      }
    }
  ];

  const queryParams = async (
    param: API.DelegationQueryParams,
    roles: string[],
    userId: number) => {
    //客户接收测试文档
    if (roles.includes(constant.roles.CUSTOMER.en)) {
      param.creatorId = userId;
      param.state = '450'//客户接收测试文档
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

