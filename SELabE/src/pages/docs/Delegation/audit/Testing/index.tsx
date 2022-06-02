import {useState} from 'react';
import {Card} from 'antd';
import StepDocReview14 from "@/pages/docs/Delegation/components/StepDocReview14";
import StepApplyForm2 from "@/pages/docs/Delegation/components/StepApplyForm2";
import FunctionList3 from "@/pages/docs/Delegation/components/FunctionList3";


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
    评审表: <Card><StepDocReview14/></Card>,
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
