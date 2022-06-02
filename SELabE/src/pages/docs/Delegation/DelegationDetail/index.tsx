import React, {useState} from 'react';
import {Button, Row, Steps} from 'antd';
import {getDelegationByIds, getProcessList, getUserByID} from "@/services/ant-design-pro/delegation/api";
import {useLocation} from "umi";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import moment from 'moment';
import {Link} from "@umijs/preset-dumi/lib/theme";
import Modal from './components/Modal'

const {Step} = Steps;

const DelegationDetail: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [delegationState, setDelegationState] = useState<string>();
  const [delegationName, setDelegationName] = useState<string>();
  const [launchTime, setLaunchTime] = useState<string>();
  const [operateTime, setOperateTime] = useState<string>();
  const [marketRemark, setMarketRemark] = useState<string>();
  const [testingRemark, setTestingRemark] = useState<string>();
  const [marketDeptStaffId, setMarketDeptStaffId] = useState<string>();
  const [testingDeptStaffId, setTestingDeptStaffId] = useState<string>();
  const [marketDeptStaffName, setMarketDeptStaffName] = useState<string>();
  const [testingDeptStaffName, setTestingDeptStaffName] = useState<string>();
  const [offerRemark, setOfferRemark] = useState<string>();
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;//ok
  let tran_pathName = "";
  let currentStatus = "";
  //console.log(delegationId);
  const request = async () => {
    if (!delegationId) {
      return {};
    }
    const state = (await getDelegationByIds({
      ids: String(delegationId),
    })).data[0];
    //console.log("state:" + state);
    if (state === undefined) {
      return {};
    }
    return state;
  };

  const getMarketUserInfo = () => {
    if (isNaN(Number(marketDeptStaffId))) {
      return "0";
    } else {
      if (Number(marketDeptStaffId) === 0) {
        setMarketDeptStaffName("暂无");
        return "0";
      }
      const userData = (getUserByID(
        {
          userId: Number(marketDeptStaffId),
        }));
      if (userData != null) {
        userData.then(
          result => {
            setMarketDeptStaffName(result.data.nickname);
          }
        );
        return userData;
      } else return "0";
    }
  }

  const getTestingUserInfo = () => {
    if (isNaN(Number(testingDeptStaffId))) {
      return "0";
    } else {
      if (Number(marketDeptStaffId) === 0) {
        setTestingDeptStaffName("暂无");
        return "0";
      }
      const userData = (getUserByID(
        {
          userId: Number(testingDeptStaffId),
        }
      ));
      if (userData != null) {
        userData.then(
          result => {
            setTestingDeptStaffName(result.data.nickname);
          }
        );
        return userData;
      } else return "0";
    }
  }

  request().then(
    result => {
      setDelegationState(result.state);
      setDelegationName(result.name);
      setLaunchTime(result.launchTime);
      setMarketRemark(result.marketRemark);
      setTestingRemark(result.testingRemark);
      setMarketDeptStaffId(result.marketDeptStaffId);
      setTestingDeptStaffId(result.testingDeptStaffId);
      setOfferRemark(result.offerRemark);
      getMarketUserInfo();
      getTestingUserInfo();
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
        tran_pathName = '/docs/new-delegation';
        currentStatus = "process";
        return 0;
      }
      case "等待市场部主管分配市场部人员": {
        currentStatus = "process";
        return 1;
      }

      case "等待测试部主管分配测试部人员": {
        currentStatus = "process";
        return 2
      }

      case "市场部审核委托中": {
        currentStatus = "process";
        tran_pathName = '/docs/softDocReview/marketing';
        return 3
      }

      case "市场部审核委托不通过，委托修改中": {
        currentStatus = "error";
        tran_pathName = '/docs/new-delegation';
        return 4
      }

      case "市场部审核委托通过": {
        currentStatus = "process";
        return 4
      }

      case "测试部审核委托中": {
        currentStatus = "process";
        tran_pathName = '/docs/softDocReview/testing';
        return 5
      }

      case "测试部审核委托不通过，委托修改中": {
        currentStatus = "error";
        tran_pathName = '/docs/new-delegation';
        return 6
      }

      case "测试部审核委托通过": {
        currentStatus = "process";
        return 6
      }

      case "委托审核通过": {
        currentStatus = "process";
        return 7
      }

      case "市场部生成报价中": {
        currentStatus = "process";
        tran_pathName = '/docs/quotation/marketing';
        return 8
      }

      case "客户处理报价中": {
        currentStatus = "process";
        tran_pathName = '/docs/quotation/client';
        return 9
      }

      case "客户不接受报价，市场部修改报价": {
        currentStatus = "error";
        tran_pathName = '/docs/quotation/marketing';
        return 10
      }

      case "客户接受报价": {
        currentStatus = "process";
        return 10
      }

      case "市场部生成合同草稿中": {
        currentStatus = "process";
        tran_pathName = '/docs/contract/marketing';
        return 11
      }

      case "客户检查合同草稿中": {
        currentStatus = "process";
        tran_pathName = '/docs/contract/audit/client';
        return 12
      }

      case "客户接受市场部合同草稿，填写合同中": {
        currentStatus = "process";
        tran_pathName = '/docs/contract/client';
        return 13
      }

      case "客户不接受市场部合同草稿，市场部修改合同草稿": {
        currentStatus = "error";
        tran_pathName = '/docs/contract/marketing';
        return 13
      }

      case "市场部审核客户填写的草稿中": {
        currentStatus = "process";
        tran_pathName = '/docs/contract/audit/marketing';
        return 14
      }

      case "市场部审核合同不通过，客户修改中": {
        currentStatus = "error";
        tran_pathName = '/docs/contract/client';
        return 15
      }

      case "市场部审核合同通过": {
        currentStatus = "process";
        return 15
      }

      case "合同签署中": {
        currentStatus = "process";
        return 16
      }

      case "合同签署成功": {
        currentStatus = "process";
        return 17
      }

      case "客户上传样品中": {
        currentStatus = "process";
        return 18
      }

      case "测试部/市场部验收样品中": {
        currentStatus = "process";
        return 19
      }

      case "样品验收不通过，用户重新修改": {
        currentStatus = "error";
        return 20
      }

      case "样品验收通过": {
        currentStatus = "process";
        return 20
      }

      case "测试部编写测试方案中": {
        currentStatus = "process";
        tran_pathName = '/docs/new-solution';
        return 21
      }

      case "质量部审核测试方案中": {
        currentStatus = "process";
        tran_pathName = '/docs/solution/audit-solution';
        return 22
      }

      case "测试方案审核未通过，测试部修改测试方案中": {
        currentStatus = "process";
        tran_pathName = '/docs/new-solution';
        return 23
      }

      case "测试方案审核通过": {
        currentStatus = "process";
        return 23
      }

      case "测试部测试进行中，填写测试文档": {
        currentStatus = "process";
        tran_pathName = '/docs/report/fill-in-report';
        return 24
      }

      case "测试部测试完成，生成测试报告": {
        currentStatus = "process";
        tran_pathName = '/docs/report/fill-in-report';
        return 25
      }

      case "测试部主管审核测试报告中": {
        currentStatus = "process";
        tran_pathName = '/docs/report/audit/manager';
        return 26
      }

      case "测试部主管测试报告审核未通过，测试部修改测试文档中": {
        tran_pathName = '/docs/report/fill-in-report';
        currentStatus = "error";
        return 27
      }

      case "测试部主管测试报告审核通过，用户审核中": {
        currentStatus = "process";
        tran_pathName = '/docs/report/audit/client';
        return 27
      }

      case "用户审核测试报告未通过，测试部修改测试文档中": {
        tran_pathName = '/docs/report/fill-in-report';
        currentStatus = "process";
        return 28
      }

      case "用户审核测试报告通过，授权签字人审核测试报告中": {
        tran_pathName = '/docs/report/audit/signatory';
        currentStatus = "process";
        return 28
      }

      case "授权签字人测试报告审核未通过， 测试部修改测试文档中": {
        currentStatus = "error";
        tran_pathName = '/docs/report/fill-in-report';
        return 29
      }

      case "授权签字人测试报告审核通过": {
        currentStatus = "process";
        return 29
      }

      case "测试部测试文档归档，处理样品中": {
        currentStatus = "process";
        return 30
      }

      case "市场部发送测试报告中": {
        currentStatus = "process";
        return 31
      }

      case "等待客户接收测试报告中": {
        currentStatus = "process";
        return 32
      }

      case "客户确认接收测试报告": {
        currentStatus = "finish";
        return 33
      }

      case "客户未确认接收，到期自动确认": {
        currentStatus = "finish";
        return 33
      }

      default:
        return 0;
    }
  }
  const table_jump = (state: string, stepIndex: number) => {
    switch (stepIndex) {
      case 0: {
        if (state != "委托填写中") {
          return "委托填写中"
        } else break;
      }
      case 3: {
        if (state != "市场部审核委托中") {
          return "审核委托中"
        } else break;
      }
      case 4: {
        if (state === "市场部审核委托不通过，委托修改中"){
          return (
            <>
              <div>
                {"审核委托不通过" + " 【审核意见】:" + marketRemark + " 【审核人】:" + marketDeptStaffName}
              </div>
              <Link to={{pathname: tran_pathName, state: {id: delegationId}}}>
                修改委托 (点击跳转)
              </Link>
            </>
          )
        }
        else {
          return "审核委托通过" + " 【审核意见】:" + marketRemark + " 【审核人】:" + marketDeptStaffName;
        }
      }
      case 5: {
        if (state != "测试部审核委托中") {
          return "审核委托中"
        } else break;
      }
      case 6: {
        if (state === "测试部审核委托不通过，委托修改中"){
          return (
            <>
              <div>
                {"审核委托不通过" + " 【审核意见】:" + testingRemark + " 【审核人】:" + testingDeptStaffName}
              </div>
              <Link to={{pathname: tran_pathName, state: {id: delegationId}}}>
                修改委托 (点击跳转)
              </Link>
            </>
          )
        }
        else {
          return "审核委托通过" + " 【审核意见】:" + testingRemark + " 【审核人】:" + testingDeptStaffName;
        }
      }
      case 8: {
        if (state != "市场部生成报价中") {
          return "生成报价中"
        } else break;
      }
      case 9: {
        if (state != "客户处理报价中") {
          return "处理报价中"
        } else break;
      }
      case 10: {
        if (state === "客户不接受报价，市场部修改报价"){
          break;
        }
        else{
          return "接受报价" + " 【报价单意见】:" + offerRemark;
        }
      }
      case 11: {
        if (state != "市场部生成合同草稿中") {
          return "生成合同草稿中"
        } else break;
      }
      case 12: {
        if (state != "客户检查合同草稿中") {
          return "检查合同草稿中";
        } else break;
      }
      case 13: {
        if (state === "客户不接受市场部合同草稿，市场部修改合同草稿") {
          break;
        } else if (state === "客户接受市场部合同草稿，填写合同中") {
          break;
        } else {
          return "接受市场部合同草稿，填写合同中";
        }
      }
      case 14: {
        if (state != "市场部审核客户填写的草稿中") {
          return "审核客户填写的草稿中";
        } else break;
      }
      case 15: {
        if (state === "市场部审核合同不通过，客户修改中"){
          break;
        }
        else{
          return "审核合同通过";
        }
      }
      case 20: {
        if (state === "样品验收不通过，用户重新修改"){
          break;
        }
        else{
          return "样品验收通过";
        }
      }
      case 21: {
        if (state != "测试部编写测试方案中") {
          return "编写测试方案中";
        } else break;
      }
      case 22: {
        if (state != "质量部审核测试方案中") {
          return "审核测试方案中";
        } else break;
      }
      case 23: {
        if (state === "测试方案审核未通过，测试部修改测试方案中"){
          break;
        }
        else {
          return "测试方案审核通过"
        }
      }
      case 24: {
        if (state != "测试部测试进行中，填写测试文档"){
          return "测试进行中，填写测试文档";
        }
        else {
          break;
        }
      }
      case 25: {
        if (state != "测试部测试完成，生成测试报告") {
          return "测试完成，生成测试报告";
        } else break;
      }
      case 26: {
        if (state != "测试部主管审核测试报告中") {
          return "测试部主管审核测试报告中";
        } else break;
      }
      case 27: {
        if (state === "测试部主管测试报告审核未通过，测试部修改测试文档中"){
          break;
        }
        else if(state === "测试部主管测试报告审核通过，用户审核中"){
          break;
        }
        else {
          return "测试部主管测试报告审核通过";
        }
      }
      case 28: {
        if (state === "用户审核测试报告未通过，测试部修改测试文档中"){
          break;
        }
        else if(state === "用户审核测试报告通过，授权签字人审核测试报告中"){
          break;
        }
        else {
          return "审核测试报告通过";
        }
      }
      case 29: {
        if (state === "授权签字人测试报告审核未通过， 测试部修改测试文档中"){
          break;
        }
        else {
          return "测试报告审核通过";
        }
      }
    }
    return (
      <Link to={{pathname: tran_pathName, state: {id: delegationId}}}>
        {delegationState} (点击跳转)
      </Link>
    )
  }

  const tran_path = () => {
    if (tran_pathName === "") {
      return "状态: " + String(delegationState);
    } else {
      return (
        <Link to={{pathname: tran_pathName, state: {id: delegationId}}}>
          状态: {delegationState} (点击跳转)
        </Link>
      )
    }
  }

  return (
    <PageContainer>
      <Row>
        <ProCard title="流程进度" bordered>
          <Steps className="normalProcess" current={currentStep()} status={currentStatus} direction="vertical">
            <Step stepIndex={0} title="客户" description={table_jump(String(delegationState),0)} />
            <Step stepIndex={1} title="市场部" description="等待市场部主管分配市场部人员"/>
            <Step stepIndex={2} title="测试部" description="等待测试部主管分配测试部人员"/>
            <Step stepIndex={3} title="市场部" description={table_jump(String(delegationState),3)}/>
            <Step stepIndex={4} title="市场部" description={table_jump(String(delegationState),4)}/>
            <Step stepIndex={5} title="测试部" description={table_jump(String(delegationState),5)}/>
            <Step stepIndex={6} title="测试部" description={table_jump(String(delegationState),6)}/>
            <Step stepIndex={7} title="委托审核通过" description=""/>
            <Step stepIndex={8} title="市场部" description={table_jump(String(delegationState),8)}/>
            <Step stepIndex={9} title="客户" description={table_jump(String(delegationState),9)}/>
            <Step stepIndex={10} title="客户" description={table_jump(String(delegationState),10)}/>
            <Step stepIndex={11} title="市场部" description={table_jump(String(delegationState),11)}/>
            <Step stepIndex={12} title="客户" description={table_jump(String(delegationState),12)}/>
            <Step stepIndex={13} title="客户" description={table_jump(String(delegationState),13)}/>
            <Step stepIndex={14} title="市场部" description={table_jump(String(delegationState),14)}/>
            <Step stepIndex={15} title="市场部" description={table_jump(String(delegationState),15)}/>
            <Step stepIndex={16} title="合同签署中"/>
            <Step stepIndex={17} title="合同签署成功"/>
            <Step stepIndex={18} title="客户" description="上传样品中"/>
            <Step stepIndex={19} title="测试部/市场部" description="验收样品中"/>
            <Step stepIndex={20} title="测试部/市场部" description={table_jump(String(delegationState),20)}/>
            <Step stepIndex={21} title="测试部" description={table_jump(String(delegationState),21)}/>
            <Step stepIndex={22} title="质量部" description={table_jump(String(delegationState),22)}/>
            <Step stepIndex={23} title="质量部" description={table_jump(String(delegationState),23)}/>
            <Step stepIndex={24} title="测试部" description={table_jump(String(delegationState),24)}/>
            <Step stepIndex={25} title="测试部" description={table_jump(String(delegationState),25)}/>
            <Step stepIndex={26} title="测试部" description={table_jump(String(delegationState),26)}/>
            <Step stepIndex={27} title="测试部" description={table_jump(String(delegationState),27)}/>
            <Step stepIndex={28} title="用户" description={table_jump(String(delegationState),28)}/>
            <Step stepIndex={29} title="授权签字人" description={table_jump(String(delegationState),29)}/>
            <Step stepIndex={30} title="测试部" description="测试文档归档，处理样品中"/>
            <Step stepIndex={31} title="市场部" description="发送测试报告中"/>
            <Step stepIndex={32} title="等待客户接受测试报告中" description=""/>
            <Step stepIndex={33} title="客户" description="确认接受测试报告"/>
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
          {tran_path()}
        </ProCard>
        <ProCard>
          状态变更时间: {moment(parseInt(String(operateTime))).format("YYYY-MM-DD HH:mm:ss")}
        </ProCard>
        <ProCard>
          <Button key = "查看文档" onClick={()=>{
            setModalVisible(true)
          }}>查看我的文档</Button>
          <Modal
            modalVisible = {modalVisible}
            hideModal={()=>{
              setModalVisible(false);
            }}
          />
        </ProCard>
      </Row>
    </PageContainer>
  );
};

export default DelegationDetail;

/*
* state === "委托填写中" 跳转
* state === "市场部生成报价中" but stepIndex != 8 显示 “委托填写中”文本
* */
