import SolutionForm6 from "@/pages/docs/Solution/component/SolutionForm6";
import {useState} from 'react';
import {Card} from 'antd';
import TestWorkChecklist12 from "@/pages/docs/Delegation/components/TestWorkChecklist12";
export default () => {
  const [activeTabKey, setActiveTabKey] = useState('测试方案');
  const list = [
    {
      key: '测试方案',
      tab: '测试方案',
    },
    {
      key: '软件项目委托测试工作检查表',
      tab: '软件项目委托测试工作检查表',
    },
  ];
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  const contentList = {
    测试方案:
      <Card>
        <SolutionForm6 editable={true}/>
      </Card>,
    软件项目委托测试工作检查表: <Card>
      <TestWorkChecklist12 editable={4}/>
    </Card>,
  };
  return (
    <>
      <Card
        style={{width: '100%'}}
        title="测试方案"
        tabList={list}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>
  )
}


