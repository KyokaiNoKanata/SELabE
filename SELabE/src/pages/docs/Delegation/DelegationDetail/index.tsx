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
/**
 * 委托详情页，用户可查看整个委托流程的进展,委托状态的详细信息,在特定委托状态下可以跳转到相应的文档进行编辑,通过”查看我的文档“可以浏览委托相关的各个文档
 */
const DelegationDetail: React.FC = () => {
  //”我的文档“弹窗的可视状态
  const [modalVisible, setModalVisible] = useState(false);
  //委托的状态
  const [delegationState, setDelegationState] = useState<string>();
  //委托名称
  const [delegationName, setDelegationName] = useState<string>();
  //委托发起时间
  const [launchTime, setLaunchTime] = useState<string>();
  //委托最新修改时间
  const [operateTime, setOperateTime] = useState<string>();
  //市场部审核委托的意见
  const [marketRemark, setMarketRemark] = useState<string>();
  //测试部审核委托的意见
  const [testingRemark, setTestingRemark] = useState<string>();
  //负责审核的市场部人员ID
  const [marketDeptStaffId, setMarketDeptStaffId] = useState<string>();
  //负责审核的测试部人员ID
  const [testingDeptStaffId, setTestingDeptStaffId] = useState<string>();
  //负责审核的市场部人员名称
  const [marketDeptStaffName, setMarketDeptStaffName] = useState<string>();
  //负责审核的测试部人员名称
  const [testingDeptStaffName, setTestingDeptStaffName] = useState<string>();
  //报价单意见
  const [offerRemark, setOfferRemark] = useState<string>();
  const params = useLocation();
  const delegationId = !params.state ? -1 : (params.state as any).id;//ok
  //根据委托状态跳转到相应文档编辑页面的跳转路径
  let tran_pathName = "";
  //当前委托在步骤条上的状态 {error: 状态不通过; process: 状态进行中; finish: 状态已完成}
  let currentStatus = "";

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
  /**
   * 获取市场部人员的信息
   * @return: 市场部人员的信息
   */
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

  /**
   * 获取测试部人员的信息
   * @return: 测试部人员的信息
   */
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
  /**
   * 对委托相关变量进行设置
   */
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
  /**
   * 获取委托的最新状态更新时间
   */
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

  /**
   * 根据委托状态,设置委托在步骤条上显示的结果currentStatus（进行中/不通过/已完成）,设置跳转编辑文档路径
   * @return: 在步骤条上的当前步骤计数,从0开始
   */
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
        currentStatus = "finish";
        return 17
      }

      default:
        return 0;
    }
  }
  /**
   * 根据步骤条当前计数，设置相应委托状态下，步骤的详情描述
   * @param state: 委托状态
   * @param stepIndex: 步骤条当前计数
   */
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
    }
    return (
      <Link to={{pathname: tran_pathName, state: {id: delegationId}}}>
        {delegationState} (点击跳转)
      </Link>
    )
  }
  /**
   * 设置路径,跳转到相应的文档编辑页面
   */
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

  /**
   * 流程进度的步骤条及其他委托详细信息显示
   */
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
