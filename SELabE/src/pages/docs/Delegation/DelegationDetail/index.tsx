import React, {useState} from 'react';
import {Button, Row, Steps} from 'antd';
import {getDelegationByIds, getProcessList, getUserByID} from "@/services/ant-design-pro/delegation/api";
import {useLocation} from "umi";
import {PageContainer} from "@ant-design/pro-layout";
import ProCard from "@ant-design/pro-card";
import moment from 'moment';
import {Link} from "@umijs/preset-dumi/lib/theme";
import constant from "../../../../../config/constant";
import Modal from "@/pages/Delegation/DelegationDetail/components/Modal";


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
      // @ts-ignore
      setDelegationState(result?.state);
      // @ts-ignore
      setDelegationName(result?.name);
      // @ts-ignore
      setLaunchTime(result?.launchTime);
      // @ts-ignore
      setMarketRemark(result.marketRemark);
      // @ts-ignore
      setTestingRemark(result?.testingRemark);
      // @ts-ignore
      setMarketDeptStaffId(result?.marketDeptStaffId);
      // @ts-ignore
      setTestingDeptStaffId(result?.testingDeptStaffId);
      // @ts-ignore
      setOfferRemark(result?.offerRemark);
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
      // @ts-ignore
      setOperateTime(result);
    }
  );


  const currentStep = () => {
    switch (delegationState) {
      case constant.delegationState.DELEGATE_WRITING.desc: {
        tran_pathName = constant.docPath.delegation.APPLY;
        currentStatus = "process";
        return 0;
      }
      case constant.delegationState.WAIT_MARKETING_DEPARTMENT_ASSIGN_STAFF.desc: {
        currentStatus = "process";
        return 1;
      }

      case constant.delegationState.WAIT_TESTING_DEPARTMENT_ASSIGN_STAFF.desc: {
        currentStatus = "process";
        return 2
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.delegation.audit.MARKETING;
        return 3
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.delegation.APPLY;
        return 4
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_SUCCESS.desc: {
        currentStatus = "process";
        return 4
      }

      case constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.delegation.audit.TESTING;
        return 5
      }

      case constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.delegation.APPLY;
        return 6
      }

      case constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_SUCCESS.desc: {
        currentStatus = "process";
        return 6
      }

      case constant.delegationState.AUDIT_DELEGATION_SUCCESS.desc: {
        currentStatus = "process";
        return 7
      }

      case constant.delegationState.MARKETING_DEPARTMENT_GENERATE_OFFER.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.delegation.offer.WRITE;
        return 8
      }

      case constant.delegationState.CLIENT_DEALING_OFFER.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.delegation.offer.HANDLE;
        return 9
      }

      case constant.delegationState.CLIENT_REJECT_OFFER.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.delegation.offer.WRITE;
        return 10
      }

      case constant.delegationState.CLIENT_ACCEPT_OFFER.desc: {
        currentStatus = "process";
        return 10
      }

      case constant.delegationState.MARKETING_DEPARTMENT_GENERATE_CONTRACT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.contract.write.MARKETING;
        return 11
      }

      case constant.delegationState.CLIENT_AUDIT_CONTRACT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.contract.audit.CLIENT;
        return 12
      }

      case constant.delegationState.CLIENT_WRITING_CONTRACT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.contract.write.CLIENT;
        return 13
      }

      case constant.delegationState.CLIENT_AUDIT_CONTRACT_FAIL.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.contract.write.MARKETING;
        return 13
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_CONTRACT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.contract.audit.MARKETING;
        return 14
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_CONTRACT_FAIL.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.contract.write.CLIENT;
        return 15
      }

      case constant.delegationState.MARKETING_DEPARTMENT_AUDIT_CONTRACT_SUCCESS.desc: {
        currentStatus = "process";
        return 15
      }

      case constant.delegationState.CONTRACT_SIGNING.desc: {
        currentStatus = "process";
        return 16
      }

      case constant.delegationState.CONTRACT_SIGN_SUCCESS.desc: {
        currentStatus = "process";
        return 17
      }

      case constant.delegationState.CLIENT_UPLOAD_SAMPLE_INFO.desc: {
        currentStatus = "process";
        return 18
      }

      case constant.delegationState.CHECKING_SAMPLE.desc: {
        currentStatus = "process";
        return 19
      }

      case constant.delegationState.SAMPLE_CHECK_FAIL_MODIFY_SAMPLE.desc: {
        currentStatus = "error";
        return 20
      }

      case constant.delegationState.SAMPLE_CHECK_SUCCESS.desc: {
        currentStatus = "process";
        return 20
      }

      case constant.delegationState.TESTING_DEPT_WRITING_TEST_SOLUTION.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.solution.WRITE;
        return 21
      }

      case constant.delegationState.QUALITY_DEPT_AUDIT_TEST_SOLUTION.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.solution.AUDIT;
        return 22
      }

      case constant.delegationState.QUALITY_DEPT_AUDIT_TEST_SOLUTION_FAIL.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.solution.WRITE;
        return 23
      }

      case constant.delegationState.QUALITY_DEPT_AUDIT_TEST_SOLUTION_SUCCESS.desc: {
        currentStatus = "process";
        return 23
      }

      case constant.delegationState.TESTING_DEPT_WRITING_TEST_REPORT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.report.WRITE;
        return 24
      }

      case constant.delegationState.TESTING_DEPT_GENERATE_TEST_REPORT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.report.WRITE;
        return 25
      }

      case constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.report.audit.MANAGER;
        return 26
      }

      case constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_FAIL.desc: {
        tran_pathName = constant.docPath.report.WRITE;
        currentStatus = "error";
        return 27
      }

      case constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_SUCCESS.desc: {
        currentStatus = "process";
        tran_pathName = constant.docPath.report.audit.CLIENT;
        return 27
      }

      case constant.delegationState.CLIENT_AUDIT_TEST_REPORT_FAIL.desc: {
        tran_pathName = constant.docPath.report.WRITE;
        currentStatus = "process";
        return 28
      }

      case constant.delegationState.CLIENT_AUDIT_TEST_REPORT_SUCCESS.desc: {
        tran_pathName = constant.docPath.report.audit.SIGNATORY;
        currentStatus = "process";
        return 28
      }

      case constant.delegationState.SIGNATORY_AUDIT_TEST_REPORT_FAIL.desc: {
        currentStatus = "error";
        tran_pathName = constant.docPath.report.WRITE;
        return 29
      }

      case constant.delegationState.SIGNATORY_AUDIT_TEST_REPORT_SUCCESS.desc: {
        currentStatus = "process";
        return 29
      }

      case constant.delegationState.TESTING_DEPT_ARCHIVE_TEST_REPORT_AND_PROCESS_SAMPLE.desc: {
        currentStatus = "process";
        return 30
      }

      case constant.delegationState.MARKETING_DEPT_SEND_TEST_REPORT.desc: {
        currentStatus = "process";
        return 31
      }

      case constant.delegationState.WAIT_FOR_CLIENT_RECEIVE_TEST_REPORT.desc: {
        currentStatus = "process";
        return 32
      }

      case constant.delegationState.CLIENT_CONFIRM_RECEIVE_TEST_REPORT.desc: {
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
        if (state != constant.delegationState.DELEGATE_WRITING.desc) {
          return "委托填写中"
        } else break;
      }
      case 3: {
        if (state != constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION.desc) {
          return "审核委托中"
        } else break;
      }
      case 4: {
        if (state === constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc){
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
        if (state != constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION.desc) {
          return "审核委托中"
        } else break;
      }
      case 6: {
        if (state === constant.delegationState.TESTING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc){
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
        if (state != constant.delegationState.MARKETING_DEPARTMENT_GENERATE_OFFER.desc) {
          return "生成报价中"
        } else break;
      }
      case 9: {
        if (state != constant.delegationState.CLIENT_DEALING_OFFER.desc) {
          return "处理报价中"
        } else break;
      }
      case 10: {
        if (state === constant.delegationState.CLIENT_REJECT_OFFER.desc){
          break;
        }
        else{
          return "接受报价" + " 【报价单意见】:" + offerRemark;
        }
      }
      case 11: {
        if (state != constant.delegationState.MARKETING_DEPARTMENT_GENERATE_CONTRACT.desc) {
          return "生成合同草稿中"
        } else break;
      }
      case 12: {
        if (state != constant.delegationState.CLIENT_AUDIT_CONTRACT.desc) {
          return "检查合同草稿中";
        } else break;
      }
      case 13: {
        if (state === constant.delegationState.CLIENT_AUDIT_CONTRACT_FAIL.desc) {
          break;
        } else if (state === constant.delegationState.CLIENT_WRITING_CONTRACT.desc) {
          break;
        } else {
          return "接受市场部合同草稿，填写合同中";
        }
      }
      case 14: {
        if (state != constant.delegationState.MARKETING_DEPARTMENT_AUDIT_CONTRACT.desc) {
          return "审核客户填写的草稿中";
        } else break;
      }
      case 15: {
        if (state === constant.delegationState.MARKETING_DEPARTMENT_AUDIT_DELEGATION_FAIL.desc){
          break;
        }
        else{
          return "审核合同通过";
        }
      }
      case 20: {
        if (state === constant.delegationState.SAMPLE_CHECK_FAIL_MODIFY_SAMPLE.desc){
          break;
        }
        else{
          return "样品验收通过";
        }
      }
      case 21: {
        if (state != constant.delegationState.TESTING_DEPT_WRITING_TEST_SOLUTION.desc) {
          return "编写测试方案中";
        } else break;
      }
      case 22: {
        if (state != constant.delegationState.QUALITY_DEPT_AUDIT_TEST_SOLUTION.desc) {
          return "审核测试方案中";
        } else break;
      }
      case 23: {
        if (state === constant.delegationState.QUALITY_DEPT_AUDIT_TEST_SOLUTION_FAIL.desc){
          break;
        }
        else {
          return "测试方案审核通过"
        }
      }
      case 24: {
        if (state != constant.delegationState.TESTING_DEPT_WRITING_TEST_REPORT.desc){
          return "测试进行中，填写测试文档";
        }
        else {
          break;
        }
      }
      case 25: {
        if (state != constant.delegationState.TESTING_DEPT_GENERATE_TEST_REPORT.desc) {
          return "测试完成，生成测试报告";
        } else break;
      }
      case 26: {
        if (state != constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT.desc) {
          return "测试部主管审核测试报告中";
        } else break;
      }
      case 27: {
        if (state === constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_FAIL.desc){
          break;
        }
        else if(state === constant.delegationState.TESTING_DEPT_MANAGER_AUDIT_TEST_REPORT_SUCCESS.desc){
          break;
        }
        else {
          return "测试部主管测试报告审核通过";
        }
      }
      case 28: {
        if (state === constant.delegationState.CLIENT_AUDIT_TEST_REPORT_FAIL.desc){
          break;
        }
        else if(state === constant.delegationState.CLIENT_AUDIT_TEST_REPORT_SUCCESS.desc){
          break;
        }
        else {
          return "审核测试报告通过";
        }
      }
      case 29: {
        if (state === constant.delegationState.SIGNATORY_AUDIT_TEST_REPORT_FAIL.desc){
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

  // @ts-ignore
  return (
    <PageContainer>
      <Row>
        <ProCard title="流程进度" bordered>
          <Steps className="normalProcess" current={currentStep()} status={currentStatus as any} direction="vertical">
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
            id = {delegationId}
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
