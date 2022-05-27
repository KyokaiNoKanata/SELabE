/**
 * 测试部填写测试方案入口
 */
import type {ReactNode} from "react";
import React, {useRef, useState} from "react";
import type {API} from "@/services/ant-design-pro/typings";
import {currentUser} from "@/services/ant-design-pro/api";
import {delegationPage} from "@/services/ant-design-pro/delegation/api";
import type {ActionType, ProColumns} from "@ant-design/pro-table";
import {Button, message} from "antd";
import DelegationList from "@/pages/Delegation/components/DelegationList";
import {getSampleById} from "@/services/ant-design-pro/sample/api";
import {Link} from "umi";
//用户提交样品
export default () => {
  const actionRef: React.MutableRefObject<ActionType | undefined> = useRef<ActionType>();
  const [roles, setRoles] = useState<string[]>([]);
  const [userInfo, setUser] = useState<{
    avatar?: string,
    nickname?: string,
    id?: string,
  }>({});
  const [modalVisit, setModalVisit] = useState(false);
  const [sampleId, setSampleId] = useState<number>(-1);
  //通过
  const onDownload = () => {
    console.log(sampleId);
    //根据sampleId获得sampleURL
    getSampleById(sampleId!).then(resp => {
      if (resp.code != 0) {
        message.error(resp.msg);
        return;
      }
      const url: string | undefined = resp.data.url;
      if (url) {
        // 下载文件 todo 这种写法不太好但是可行的
        const a = document.createElement("a");
        a.href = url;
        a.click();
      } else {
        message.warning('没有对应的在线样品文件');
      }
    })
  }
  const auditColumns: ProColumns<API.DelegationItem>[] = [
    /** 填写测试方案 */
    {
      title: '填写测试方案',
      dataIndex: 'auditSampleMarketing',
      valueType: 'option',
      hideInTable: !roles.includes('test_department_staff'),
      sorter: false,
      render: (text: ReactNode, record: API.DelegationItem) => {
        const {id} = record;
        return [
          <Link to={{pathname: '/docs/new-solution', query: {id}}}>
            <Button type="primary">填写测试方案</Button>
          </Link>,
        ];
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

    //测试部填写方案
    if (user.data.roles.includes('test_department_staff')) {
      p.testingDeptStaffId = user.data.user.id;
      p.state = '300,320'//测试部填写方案
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

