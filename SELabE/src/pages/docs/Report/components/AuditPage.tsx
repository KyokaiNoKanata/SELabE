import {Button, message} from "antd";
import {acceptReport} from "@/services/ant-design-pro/report/api";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";
//审核页面
const AuditPage: React.FC<{
  person: string,
}> = (props) => {
  const params = useLocation();
  const delegationId: number = (params as any).query.id;
  return (
    <a><Button onClick={async () => {
      const rId = (await getDelegationById(delegationId)).data.reportId;
      const resp = await acceptReport({
        person: props.person,
        reportId: rId!,
        remark: 'remark',//todo
      })
      if (resp.code == 0) {
        message.success('审核通过');
      } else {
        message.error(resp.msg);
      }
    }}>审核通过</Button></a>
  )
}
export default AuditPage;
