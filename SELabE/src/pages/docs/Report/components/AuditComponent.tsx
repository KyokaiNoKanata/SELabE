import React, {useState} from 'react';
import {Card} from 'antd';
import TestCaseForm from "@/pages/docs/Report/components/TestCaseForm";
import TestRecordForm from "@/pages/docs/Report/components/TestRecordForm";
import QuestionListForm from "@/pages/docs/Report/components/QuestionListForm";
import TestReport from "@/pages/docs/Report/components/TestReport";
import AuditPage from "@/pages/docs/Report/components/AuditPage";
import TestReportCheckList from "@/pages/docs/Report/components/TestReportCheckList";
//import { useLocation } from 'react-router-dom';
const AuditComponent: React.FC<{
  person: string;
}> = (props) => {
  const [activeTabKey, setActiveTabKey] = useState('测试用例');
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
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
    },
    props.person == 'manager' &&
    {
      key: '测试报告检查表',
      tab: '测试报告检查表',
    },
    {
      key: '审核',
      tab: '审核',
    }
  ];
  const contentList = {
    测试用例:
      <Card>
        <TestCaseForm editable={false}/>
      </Card>,
    测试记录: <Card>
      <TestRecordForm editable={false}/>
    </Card>,
    问题清单: <Card>
      <QuestionListForm editable={false}/>
    </Card>,
    测试报告: <Card>
      <TestReport editable={false}/>
    </Card>,
    测试报告检查表: <Card>
      <TestReportCheckList editable={false}/>
    </Card>,
    审核: <Card>
      <AuditPage person={props.person}/>
    </Card>
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

export default AuditComponent;
