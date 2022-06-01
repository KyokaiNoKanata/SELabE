import {useState} from 'react';
import {Card} from 'antd';
import TestCaseForm8 from "@/pages/docs/Report/components/TestCaseForm8";
import TestRecordForm9 from "@/pages/docs/Report/components/TestRecordForm9";
import QuestionListForm11 from "@/pages/docs/Report/components/QuestionListForm11";
import TestReport7 from "@/pages/docs/Report/components/TestReportForm7";
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
        <TestCaseForm8 editable={true}/>
      </Card>,
    测试记录: <Card>
      <TestRecordForm9 editable={true}/>
    </Card>,
    问题清单: <Card>
      <QuestionListForm11 editable={true}/>
    </Card>,
    测试报告: <Card>
      <TestReport7 editable={true}/>
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
