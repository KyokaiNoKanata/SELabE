//todo:table7 测试报告
import {Button, message} from "antd";
import {saveTable7} from "@/services/ant-design-pro/report/api";
import {useLocation} from "react-router-dom";
import {getDelegationById} from "@/services/ant-design-pro/delegation/api";

//TODO
const TestReport: React.FC<{ editable: boolean }> = () => {
  const params = useLocation();
  const delegationId: number = (params as any).query.id;
  return (
    <a><Button onClick={async () => {
      const rId = (await getDelegationById(delegationId)).data.reportId;
      const resp = await saveTable7({
        reportId: rId!,
        data: {
          testKey: 'testValue'
        }
      })
      if (resp.code == 0) {
        message.success('保存成功');
      }
    }}>save table7</Button></a>
  )
}
export default TestReport;