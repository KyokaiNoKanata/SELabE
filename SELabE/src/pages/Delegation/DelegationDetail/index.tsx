import React, {useState} from 'react';
import {Row, Steps} from 'antd';
import {getDelegationByIds, getProcessList, getUserByID, getUserList} from "@/services/ant-design-pro/delegation/api";
import {useLocation} from "umi";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import moment from 'moment';

const {Step} = Steps;

const DelegationDetail: React.FC = () => {
  const [delegationState, setDelegationState] = useState<string>();
  const [delegationName, setDelegationName] = useState<string>();
  const [launchTime, setLaunchTime] = useState<string>();
  const [operateTime, setOperateTime] = useState<string>();
  const [marketRemark, setMarketRemark] = useState<string>();
  const [testingRemark, setTestingRemark] = useState<string>();
  const [marketDeptStaffId, setMarketDeptStaffId] = useState<string>();
  const [testingDeptStaffId, setTestingDeptStaffId] = useState<string>();
  const [marketDeptStaffName, setMarketDeptStaffName] = useState<string>();
  const params = useLocation();
  const delegationId = (params as any).query.id;//ok
  //console.log(delegationId);
  const request = async () => {
    if (!delegationId) {
      return {};
    }
    const state = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0];
    //console.log("state:" + state);
    if (state == undefined) {
      return {};
    }
    return state;
  };
  request().then(
    result => {
      setDelegationState(result.state);
      setDelegationName(result.name);
      setLaunchTime(result.launchTime);
      setMarketRemark(result.marketRemark);
      setTestingRemark(result.testingRemark);
      setMarketDeptStaffId(result.marketDeptStaffId);
      setTestingDeptStaffId(result.testingDeptStaffId);
    }
  );


  const getRoleInfo = async () => {
    const userData = (await getUserByID(
      {
        userId: Number(marketDeptStaffId),
      }));
    return userData;
  }

  getRoleInfo().then(
    result => {
      //setMarketDeptStaffName(result.data);
      console.log(result);
    }
  );

  const getUserInfo = async () => {
    const userList = (await getUserList());
    return userList;
  }

  getUserInfo().then(
    result => {
      console.log(result);
    }
  );


  const getStateTime = async () => {
    const process = (await getProcessList(
      {
        id: delegationId,
      }
    ));
    if (process.data.length > 0) {
      return process.data[process.data.length - 1].operateTime;
    }
    return 0;
  }
  getStateTime().then(
    result => {
      setOperateTime(result);
    }
  );


  const currentStep = () => {
    switch (delegationState) {
      case "委托填写中": {
        return 0;
      }
      case "等待市场部主管分配市场部人员": {
        return 1
      }

      case "等待测试部主管分配测试部人员": {
        return 2
      }

      case "市场部审核委托中": {
        return 3
      }

      case "市场部审核委托不通过，委托修改中": {
        return 4
      }

      case "市场部审核委托通过": {
        return 4
      }

      case "测试部审核委托中": {
        return 5
      }

      case "测试部审核委托不通过，委托修改中": {
        return 6
      }

      case "测试部审核委托通过": {
        return 6
      }

      case "委托审核通过": {
        return 7
      }

      case "市场部生成报价中": {
        return 8
      }

      case "客户处理报价中": {
        return 9
      }

      case "客户不接受报价，市场部修改报价": {
        return 10
      }

      case "客户接受报价": {
        return 10
      }

      case "市场部生成合同草稿中": {
        return 11
      }

      case "客户检查合同草稿中": {
        return 12
      }

      case "客户接受市场部合同草稿，填写合同中": {
        return 13
      }

      case "客户不接受市场部合同草稿，市场部修改合同草稿": {
        return 13
      }

      case "市场部审核客户填写的草稿中": {
        return 14
      }

      case "市场部审核合同不通过，客户修改中": {
        return 15
      }

      case "市场部审核合同通过": {
        return 15
      }

      case "合同签署中": {
        return 16
      }

      case "合同签署成功": {
        return 17
      }

      case "客户上传样品中": {
        return 18
      }

      case "测试部/市场部验收样品中": {
        return 19
      }

      case "样品验收不通过，用户重新修改": {
        return 20
      }

      case "样品验收通过": {
        return 20
      }

      case "测试部编写测试方案中": {
        return 21
      }

      case "质量部审核测试方案中": {
        return 22
      }

      case "测试方案审核未通过，测试部修改测试方案中": {
        return 23
      }

      case "测试方案审核通过": {
        return 23
      }

      case "测试部测试进行中，填写测试文档": {
        return 24
      }

      case "测试部测试完成，生成测试报告": {
        return 25
      }

      case "测试部主管审核测试报告中": {
        return 26
      }

      case "测试部主管测试报告审核未通过，测试部修改测试文档中": {
        return 27
      }

      case "测试部主管测试报告审核通过，用户审核中": {
        return 27
      }

      case "用户审核测试报告未通过，测试部修改测试文档中": {
        return 28
      }

      case "用户审核测试报告通过，授权签字人审核测试报告中": {
        return 28
      }

      case "授权签字人测试报告审核未通过， 测试部修改测试文档中": {
        return 29
      }

      case "授权签字人测试报告审核通过": {
        return 29
      }

      case "测试部测试文档归档，处理样品中": {
        return 30
      }

      case "市场部发送测试报告中": {
        return 31
      }

      case "等待客户接收测试报告中": {
        return 32
      }

      case "客户确认接收测试报告": {
        return 33
      }

      case "客户未确认接收，到期自动确认": {
        return 33
      }

      default:
        return 0;
    }
  }
  const currentStatus = () => {
    switch (delegationState) {
      case "委托填写中": {
        return "process";
      }

      case "等待市场部主管分配市场部人员": {
        return "process"
      }

      case "等待测试部主管分配测试部人员": {
        return "process"
      }

      case "市场部审核委托中": {
        return "process"
      }

      case "测试部审核委托中": {
        return "process"
      }

      case "市场部审核委托通过": {
        return "process"
      }

      case "测试部审核委托通过": {
        return "process"
      }

      case "市场部审核委托不通过，委托修改中": {
        return "error"
      }

      case "测试部审核委托不通过，委托修改中": {
        return "error"
      }

      case "委托审核通过": {
        return "process"
      }

      case "市场部生成报价中": {
        return "process"
      }

      case "客户处理报价中": {
        return "process"
      }

      case "客户不接受报价，市场部修改报价": {
        return "error"
      }

      case "客户接受报价": {
        return "process"
      }

      case "市场部生成合同草稿中": {
        return "process"
      }

      case "客户检查合同草稿中": {
        return "process"
      }

      case "客户接受市场部合同草稿，填写合同中": {
        return "process"
      }

      case "客户不接受市场部合同草稿，市场部修改合同草稿": {
        return "error"
      }

      case "市场部审核客户填写的草稿中": {
        return "process"
      }

      case "市场部审核合同不通过，客户修改中": {
        return "error"
      }

      case "市场部审核合同通过": {
        return "process"
      }

      case "合同签署中": {
        return "process"
      }

      case "合同签署成功": {
        return "process"
      }

      case "客户上传样品中": {
        return "process"
      }

      case "测试部/市场部验收样品中": {
        return "process"
      }

      case "样品验收不通过，用户重新修改": {
        return "error"
      }

      case "样品验收通过": {
        return "process"
      }

      case "测试部编写测试方案中": {
        return "process"
      }

      case "质量部审核测试方案中": {
        return "process"
      }

      case "测试方案审核未通过，测试部修改测试方案中": {
        return "error"
      }

      case "测试方案审核通过": {
        return "process"
      }

      case "测试部测试进行中，填写测试文档": {
        return "process"
      }

      case "测试部测试完成，生成测试报告": {
        return "process"
      }

      case "测试部主管审核测试报告中": {
        return "process"
      }

      case "测试部主管测试报告审核未通过，测试部修改测试文档中": {
        return "error"
      }

      case "测试部主管测试报告审核通过，用户审核中": {
        return "process"
      }

      case "用户审核测试报告未通过，测试部修改测试文档中": {
        return "error"
      }

      case "用户审核测试报告通过，授权签字人审核测试报告中": {
        return "process"
      }

      case "授权签字人测试报告审核未通过， 测试部修改测试文档中": {
        return "error"
      }

      case "授权签字人测试报告审核通过": {
        return "process"
      }

      case "测试部测试文档归档，处理样品中": {
        return "process"
      }

      case "市场部发送测试报告中": {
        return "process"
      }

      case "等待客户接收测试报告中": {
        return "process"
      }

      case "客户确认接收测试报告": {
        return "finished"
      }

      case "客户未确认接收，到期自动确认": {
        return "finished"
      }

      default:
        return "error";
    }
  }
  const MarketingAuditMsg = () => {
    if (delegationState === "市场部审核委托不通过，委托修改中") {
      return "审核委托不通过" + " 【审核意见】:" + marketRemark + " 【审核人】:" + marketDeptStaffId;
    } else {
      return "审核委托通过" + " 【审核意见】:" + marketRemark + " 【审核人】:" + marketDeptStaffId;
    }
  }
  const TestingAuditMsg = () => {
    if (delegationState === "测试部审核委托不通过，委托修改中") {
      return "审核委托不通过" + " 【审核意见】:" + testingRemark + " 【审核人】:" + testingDeptStaffId;
    } else {
      return "审核委托通过" + " 【审核意见】:" + testingRemark + " 【审核人】:" + testingDeptStaffId;
    }
  }
  const ClientQuoteMsg = () => {
    if (delegationState === "客户不接受报价，市场部修改报价") {
      return "不接受报价";
    } else {
      return "接受报价";
    }
  }
  const ClientContractMsg = () => {
    if (delegationState === "客户不接受市场部合同草稿，市场部修改合同草稿") {
      return "不接受市场部合同草稿";
    } else {
      return "接受市场部合同草稿";
    }
  }
  const MarketingContractMsg = () => {
    if (delegationState === "市场部审核合同不通过，客户修改中") {
      return "审核合同不通过";
    } else {
      return "审核合同通过";
    }
  }
  const AcceptSampleMsg = () => {
    if (delegationState === "样品验收不通过，用户重新修改") {
      return "样品验收不通过";
    } else {
      return "样品验收通过";
    }
  }
  const QualityTestPlanMsg = () => {
    if (delegationState === "测试方案审核未通过，测试部修改测试方案中") {
      return "测试方案审核未通过";
    } else {
      return "测试方案审核通过";
    }
  }
  const TestingTestReportMsg = () => {
    if (delegationState === "测试部主管测试报告审核未通过，测试部修改测试文档中") {
      return "测试部主管测试报告审核未通过";
    } else {
      return "测试部主管测试报告审核通过";
    }
  }

  const ClientTestReportMsg = () => {
    if (delegationState === "用户审核测试报告未通过，测试部修改测试文档中") {
      return "审核测试报告未通过";
    } else {
      return "审核测试报告通过";
    }
  }
  const AuthorizeTestReportMsg = () => {
    if (delegationState === "授权签字人测试报告审核未通过， 测试部修改测试文档中") {
      return "测试报告审核未通过";
    } else {
      return "测试报告审核通过";
    }
  }


  return (
    <PageContainer>
      <Row>
        <ProCard title="流程进度" bordered>
          <Steps className="normalProcess" current={currentStep()} status={currentStatus()} direction="vertical">
            <Step title="客户" description="委托填写中"/>
            <Step title="市场部" description="等待市场部主管分配市场部人员"/>
            <Step title="测试部" description="等待测试部主管分配测试部人员"/>
            <Step title="市场部" description="审核委托中"/>
            <Step title="市场部" description={MarketingAuditMsg()}/>
            <Step title="测试部" description="审核委托中"/>
            <Step title="测试部" description={TestingAuditMsg()}/>
            <Step title="委托审核通过" description=""/>
            <Step title="市场部" description="市场部生成报价中"/>
            <Step title="客户" description="客户处理报价中"/>
            <Step title="客户" description={ClientQuoteMsg()}/>
            <Step title="市场部" description="生成合同草稿中"/>
            <Step title="客户" description="检查合同草稿中"/>
            <Step title="客户" description={ClientContractMsg()}/>
            <Step title="市场部" description="市场部审核客户填写的草稿中"/>
            <Step title="市场部" description={MarketingContractMsg()}/>
            <Step title="合同签署中"/>
            <Step title="合同签署成功"/>
            <Step title="客户" description="上传样品中"/>
            <Step title="测试部/市场部" description="验收样品中"/>
            <Step title="测试部/市场部" description={AcceptSampleMsg()}/>
            <Step title="测试部" description="编写测试方案中"/>
            <Step title="质量部" description="审核测试方案中"/>
            <Step title="质量部" description={QualityTestPlanMsg()}/>
            <Step title="测试部" description="测试进行中，填写测试文档"/>
            <Step title="测试部" description="测试完成，生成测试报告"/>
            <Step title="测试部" description="测试部主管审核测试报告中"/>
            <Step title="测试部" description={TestingTestReportMsg()}/>
            <Step title="用户" description={ClientTestReportMsg()}/>
            <Step title="授权签字人" description={AuthorizeTestReportMsg()}/>
            <Step title="测试部" description="测试文档归档，处理样品中"/>
            <Step title="市场部" description="发送测试报告中"/>
            <Step title="等待客户接受测试报告中" description=""/>
            <Step title="客户" description="确认接受测试报告"/>
          </Steps>
        </ProCard>
        <ProCard>
          委托ID: {delegationId}
        </ProCard>
        <ProCard>
          软件名: {delegationName}
        </ProCard>
        <ProCard>
          发起时间: {moment(parseInt(String(launchTime))).format("YYYY-MM-DD HH:mm:ss")};
        </ProCard>
        <ProCard>
          状态: {delegationState}
        </ProCard>
        <ProCard>
          状态变更时间: {moment(parseInt(String(operateTime))).format("YYYY-MM-DD HH:mm:ss")}
        </ProCard>
        <ProCard>
          市场部人员: {marketDeptStaffName}
        </ProCard>
      </Row>
    </PageContainer>
  );
};

export default DelegationDetail;
