import React, {useState} from 'react';
import {Card} from 'antd';
import TestCaseForm8 from "@/pages/docs/Report/components/TestCaseForm8";
import TestRecordForm9 from "@/pages/docs/Report/components/TestRecordForm9";
import QuestionListForm11 from "@/pages/docs/Report/components/QuestionListForm11";
import TestReport7 from "@/pages/docs/Report/components/TestReportForm7";
import AuditPage from "@/pages/docs/Report/Audit/components/AuditPage";
import TestReportCheckListForm10 from "@/pages/docs/Report/components/TestReportCheckListForm10";
import type {CardTabListType} from "antd/es/card";
//import { useLocation } from 'react-router-dom';
const AuditComponent: React.FC<{
  person: string;
}> = (props) => {
  const [activeTabKey, setActiveTabKey] = useState('测试用例');
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  let list: CardTabListType[] = [
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
  if (props.person == 'manager') {
    list = list.concat([
      {
        key: '测试报告检查表',
        tab: '测试报告检查表',
      },
    ])
  }
  list = list.concat([
    {
      key: '审核',
      tab: '审核',
    }
  ])
  const contentList = {
    测试用例:
      <Card>
        <TestCaseForm8 editable={false}/>
      </Card>,
    测试记录: <Card>
      <TestRecordForm9 editable={false}/>
    </Card>,
    问题清单: <Card>
      <QuestionListForm11 editable={false}/>
    </Card>,
    测试报告: <Card>
      <TestReport7 editable={false}/>
    </Card>,
    测试报告检查表: <Card>
      <TestReportCheckListForm10 editable={false}/>
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
