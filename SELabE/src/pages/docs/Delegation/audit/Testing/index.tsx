import {useState} from 'react';
import {Card} from 'antd';
import StepDocReview14 from "@/pages/docs/Delegation/components/StepDocReview14";
import StepApplyForm2 from "@/pages/docs/Delegation/components/StepApplyForm2";
import FunctionList3 from "@/pages/docs/Delegation/components/FunctionList3";
import TestWorkChecklist12 from "@/pages/docs/Delegation/components/TestWorkChecklist12";


const DocumentReview = () => {
  const [activeTabKey, setActiveTabKey] = useState('委托申请书');
  const list = [
    {
      key: '委托申请书',
      tab: '查看委托申请书',
    },
    {
      key: '委托功能列表',
      tab: '查看委托功能列表',
    },
    {
      key: '软件项目委托测试工作检查表',
      tab: '软件项目委托测试工作检查表',
    },
    {
      key: '评审表',
      tab: '填写评审表',
    }
  ];
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  const contentList = {
    委托申请书:
      <Card>
        <StepApplyForm2 editable={false} isClient={true}/>
      </Card>,
    委托功能列表: <Card><FunctionList3 editable={false} isClient={true}/></Card>,
    软件项目委托测试工作检查表: <Card><TestWorkChecklist12 editable={3}/></Card>,
    评审表: <Card><StepDocReview14 editable={true}/></Card>,
  };
  return (
    <>
      <Card
        style={{width: '100%'}}
        title="审核委托"
        tabList={list}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>

  )
};
export default DocumentReview;
