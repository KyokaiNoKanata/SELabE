import React, {useState} from 'react';
import {Button } from 'antd';
import {ModalForm } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import DocumentReviewForm from "@/pages/tester/documention/documentReview";
export type SubmitFormType = {
  onSubmitTable14: (values: any) => Promise<void>;
}
const SubmitForm: React.FC<SubmitFormType>= (props) => {
  //const intl = useIntl();
  const [table14Visit, setTable14Visit] = useState(false)
  return (
    <>
      <ProCard title="填写表单" tooltip="点击填写对应表单" style={{ maxWidth: 300,marginTop: 16 }}>
        <Button type="primary" block style={{margin: 10}}>
          软件项目委托测试申请表
        </Button>
        <Button type="primary" block style={{margin: 10}}>
          委托测试软件功能列表
        </Button>
        <Button type="primary" block style={{margin: 10}}
                onClick={() => {setTable14Visit(true)}}>
          软件项目委托测试保密协议
        </Button>
        <ModalForm
          //key={'submit'}
          //title="修改委托"
          /*trigger={<Button type="primary">修改</Button>}*/
          submitter={{
            searchConfig: {
              submitText: '确认',
              resetText: '取消',
            },
            //render: (_,dom) =>{ return []; },
            submitButtonProps:{
              hidden:true
            },
            resetButtonProps:{
              hidden:true
            },
          }}
          onFinish={async (values) => {
            console.log(values)
            return true;
          }}
          visible={table14Visit}
          onVisibleChange={setTable14Visit}
        >
          <DocumentReviewForm
            /*onSubmit={(values => {
            console.log(values)//ok
            setTable14Visit(false)
          })}*/
            onSubmit={props.onSubmitTable14}
           />
        </ModalForm>
      </ProCard>

    </>

  );
};

export default SubmitForm;
