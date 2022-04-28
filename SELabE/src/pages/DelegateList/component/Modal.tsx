import React, {useState} from 'react';
import {Form, Modal as AntdModal, Button, Input} from 'antd';
import FormBuilder from "@/pages/DelegateList/builder/FormBuilder";
import {useRequest} from "@@/plugin-request/request";

const Modal = ({modalVisible, hideModal}: {modalVisible: boolean; hideModal: () => void ; }) => {
  const [form] = Form.useForm();
  const [formValue,setFormValue] = useState('');
  const request = useRequest({
    url: 'api/testb',
    method: 'post',
    body: JSON.stringify(formValue),
  });

  const layout = {
    lableCol: { span: 8},
    wrapperCol: { span: 16},
  }
  const onFinish = (values: any) => {
    setFormValue(values);
    console.log(values);
    request.run();
  };

  const actionHandler = () => {
    form.submit();
  }

  return(
    <div>
      <AntdModal
        title = "新建委托"
        visible = {modalVisible}
        onCancel={hideModal}
        onOk={()=>{actionHandler();hideModal();}}
      >
        <Form
          form = {form}
          {...layout}
          onFinish={onFinish}
        >
          {FormBuilder()}
          {/*<Button
            onClick={()=> {
              actionHandler();
            }}
          >submit</Button>
          */}
        </Form>

      </AntdModal>
    </div>
  )
}

export default Modal
