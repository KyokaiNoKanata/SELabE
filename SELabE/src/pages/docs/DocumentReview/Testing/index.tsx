import { useState } from 'react';
import {Card} from 'antd';
import StepDocReview from "@/pages/docs/DocumentReview/components/StepDocReview";
import StepApplyPage from "@/pages/docs/NewDelegation/components/StepApplyPage";
import FunctionList from "@/pages/docs/NewDelegation/components/FunctionList";



const DocumentReview = () => {
  const [activeTabKey, setActiveTabKey] = useState('评审表');
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
        {/*todo: make it non-editable (only remove submit button in this edition)*/}
        <StepApplyPage editable={false}/>
      </Card>,
    委托功能列表: <Card><FunctionList editable={false}/></Card>,
    评审表:<Card><StepDocReview></StepDocReview></Card>,
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
