import {useState} from 'react';
import {Card} from 'antd';
import StepApplyForm2 from "@/pages/docs/Delegation/components/StepApplyForm2";
import FunctionList3 from "@/pages/docs/Delegation/components/FunctionList3";
//import { useLocation } from 'react-router-dom';
const delegationList = [
  {
    key: '委托申请书',
    tab: '委托申请书',
  },
  {
    key: '委托功能列表',
    tab: '委托功能列表',
  }
];

/**
 *  委托申请页面，含委托申请书和委托功能列表两个页签
 * @constructor
 */
const TabsCard = () => {
  /* activeTabKey: 激活页签的key */
  const [activeTabKey, setActiveTabKey] = useState('委托申请书');
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  //const params = useLocation() as any;
  //console.log(params);
  //console.log(params.query.id);
  const contentList = {
    委托申请书:
      <Card>
        <StepApplyForm2 editable={true} isClient={false}/>
      </Card>,
    委托功能列表: <Card><FunctionList3 editable={true} isClient={false}/></Card>,
  };

  return (
    <>
      <Card
        style={{width: '100%'}}
        title="填写委托"
        tabList={delegationList}
        onTabChange={key => {
          onTabChange(key);
        }}
      >
        {contentList[activeTabKey]}
      </Card>
    </>
  );
};

export default () => <TabsCard/>;
