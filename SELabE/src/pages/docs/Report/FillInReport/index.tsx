import {useState} from 'react';
import {Card} from 'antd';
import TestCaseForm from "@/pages/docs/Report/components/TestCaseForm";
import TestRecordForm from "@/pages/docs/Report/components/TestRecordForm";
import QuestionListForm from "@/pages/docs/Report/components/QuestionListForm";
import TestReport from "@/pages/docs/Report/components/TestReport";
//import { useLocation } from 'react-router-dom';
const list = [
  {
    key: '测试用例',
    tab: '测试用例',
  },
  {
    key: '测试记录',
    tab: '测试记录',
  },
  {
    key: '问题清单',
    tab: '问题清单',
  },
  {
    key: '测试报告',
    tab: '测试报告',
  }
];


const AuditSolutionForm = () => {
  const [activeTabKey, setActiveTabKey] = useState('测试用例');
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  const contentList = {
    测试用例:
      <Card>
        <TestCaseForm editable={true}/>
      </Card>,
    测试记录: <Card>
      <TestRecordForm editable={true}/>
    </Card>,
    问题清单: <Card>
      <QuestionListForm editable={true}/>
    </Card>,
    测试报告: <Card>
      <TestReport editable={true}/>
    </Card>,
  };

  return (
    <>
      <Card
        style={{width: '100%'}}
        title="测试文档"
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
