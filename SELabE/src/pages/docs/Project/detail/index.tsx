//TODO
import {useLocation} from "umi";
import {PageContainer} from "@ant-design/pro-layout";

export default () => {
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;
  console.log(delegationId);
  return (<PageContainer>
      项目详情
    </PageContainer>
  )
}
