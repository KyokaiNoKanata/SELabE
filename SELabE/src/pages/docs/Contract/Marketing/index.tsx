import ContractForm from "@/pages/docs/Contract/components/ContractForm";
import {Card} from "antd";
import {useState} from "react";
import CDA from "@/pages/docs/Contract/components/CDA";

const ContractMarket = () => {
  /*return (
    <ContractForm isClient={false}/>
  );*/
  const list = [
    {
      key: 'CDA',
      tab: '保密协议',
    },
    {
      key: 'ContractForm',
      tab: '合同',
    },
  ];
  const [activeTabKey, setActiveTabKey] = useState('CDA');
  const contentList = {
    CDA: <Card>
      <CDA isClient={false}/>
    </Card>,
    ContractForm:
      <Card>
        <ContractForm isClient={false}/>
      </Card>
  };
  const onTabChange = (key: any) => {
    setActiveTabKey(key);
  };
  return (
    <>
      <Card
        style={{width: '100%'}}
        title="填写合同"
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
export default ContractMarket;
