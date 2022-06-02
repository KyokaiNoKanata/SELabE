import {useState} from 'react';
import {Card} from 'antd';
import SolutionForm6 from "@/pages/docs/Solution/component/SolutionForm6";
import SolutionReviewForm13 from "@/pages/docs/Solution/component/SolutionReviewForm13";
//import { useLocation } from 'react-router-dom';
const list = [
  {
    key: '测试方案',
    tab: '测试方案',
  },
  {
    key: '测试方案评审表',
    tab: '测试方案评审表',
  }
];


const AuditSolutionForm = () => {
  const [activeTabKey, setActiveTabKey] = useState('测试方案');
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  const contentList = {
    测试方案:
      <Card>
        <SolutionForm6 editable={false}/>
      </Card>,
    测试方案评审表: <Card><SolutionReviewForm13 editable={true}/></Card>,
  };

  return (
    <>
      <Card
        style={{width: '100%'}}
        title="评审测试方案"
        tabList={list}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>
  );
};

export default AuditSolutionForm;
