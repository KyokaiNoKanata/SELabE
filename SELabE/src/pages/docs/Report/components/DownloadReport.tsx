import React from "react";
import {PageHeader} from "antd";
import ProCard from "@ant-design/pro-card";
import {PageContainer} from "@ant-design/pro-layout";
import {downloadPDFByDelegation} from "@/services/ant-design-pro/file/api";
import {useLocation} from "react-router-dom";

const DownloadReport: React.FC = () => {
  const params = useLocation();
  const delegationId: number = !params.state ? -1 : (params.state as any).id;
  return (
    <PageContainer>
      <PageHeader
        className="download"
        title="下载测试报告"
      />
      <ProCard>
        <div>
          <a onClick={async () => {
            await downloadPDFByDelegation(delegationId,"table6");
          }}>下载测试方案</a>
        </div>
        <div>
          <a onClick={async () => {
            await downloadPDFByDelegation(delegationId,"table8");
          }}>下载测试用例</a>
        </div>
        <div>
        <a onClick={async () => {
          await downloadPDFByDelegation(delegationId,"table7");
        }}>下载测试报告</a>
        </div>
        <div>
        <a onClick={async () => {
          await downloadPDFByDelegation(delegationId,"table9");
        }}>下载测试记录</a>
        </div>
        <div>
        <a onClick={async () => {
          await downloadPDFByDelegation(delegationId,"table11");
        }}>下载问题清单</a>
        </div>
      </ProCard>
    </PageContainer>
  );
}
export default DownloadReport;
