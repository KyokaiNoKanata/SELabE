/**
 * 市场部发送报告
 */
import type {ReactNode} from "react";
import {useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import type {ProColumns} from "@ant-design/pro-table";
import {Button, message, Modal} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {FormattedMessage} from "@@/plugin-locale/localeExports";
import {sendReport} from "@/services/ant-design-pro/report/api";

const {confirm} = Modal;
export default () => {
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});

  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 测试部归档测试报告 *
     * 点完成即可
     */
    {
      title: '发送测试报告',
      valueType: 'option',
      hideInTable: !roles.includes('marketing_department_staff'),
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
  const request = async (
    params: {//传入的参数名固定叫 current 和 pageSize
      pageSize?: number;
      current?: number;
    },
    options?: Record<string, any>
  ) => {
    const p: API.PageParams = params;
    p.pageNo = p.current;
    const user = await currentUser();
    setUser(user.data.user)
    //const role = user.data.roles;
    setRoles(user.data.roles);

    //市场部 发送报告
    if (user.data.roles.includes('marketing_department_staff')) {
      p.marketDeptStaffId = user.data.user.id;
      p.state = '440'//市场部发送报告
    } else {
      p.state = '-1';
    }
    const res = await delegationPage(p, options);
    return res.data;
  }
  return (
    <DelegationList
      request={request}
      roles={roles}
      user={userInfo}
      operationColumns={auditColumns}
    />
  )
}

